import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import 'url-search-params-polyfill';
import 'core-js/es/object';
import {uuid} from 'vue-uuid';
import defaultWebchatSettings from './default-webchat-settings';

let query = '';

window.originalOpenDialogSettings = Object.assign({}, window.openDialogSettings);

let listeners = {};

// startsWith polyfill
if (!String.prototype.startsWith) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(String.prototype, 'startsWith', {
    value: (search, pos) => {
      const newPos = !pos || pos < 0 ? 0 : +pos;
      return this.substring(newPos, newPos + search.length) === search;
    },
  });
}

// endsWith polyfill
if (!String.prototype.endsWith) {
  // eslint-disable-next-line no-extend-native
  String.prototype.endsWith = (search, thisLen) => {
    const newThisLen = (thisLen === undefined || thisLen > this.length) ? this.length : thisLen;
    return this.substring(newThisLen - search.length, newThisLen) === search;
  };
}

function addCssToPage(href) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', `${href}?${window.openDialogSettings.css_version}`);
  document.getElementsByTagName('head')[0].appendChild(link);
}
/**
 * Merges window.openDialogSettings with the settings from the database.
 * Anything set in window.openDialogSettings will take preference over anything from the database
 *
 * @param webchatSettings
 */
function mergeSettings(webchatSettings) {
  // eslint-disable-next-line no-restricted-syntax
  for (const [key, value] of Object.entries(webchatSettings)) {
    if (!window.openDialogSettings[key]) {
      window.openDialogSettings[key] = value;
    } else if (typeof value === 'object') {
      // eslint-disable-next-line no-restricted-syntax
      for (const [key2, value2] of Object.entries(value)) {
        if (typeof window.openDialogSettings[key][key2] === 'undefined') {
          window.openDialogSettings[key][key2] = value2;
        }
      }
    }
  }
}

/**
 * Push events to the GA datalayer
 */
function pushToDataLayer (eventData) {
  eventData.scenario_name = 'ACO Bot'
  if (window.dataLayer !== undefined) {
    window.dataLayer.push(eventData)
  }
}

/**
 * Creates the chat window iFrame on the parent page
 *
 * @param url
 * @param div
 * @returns {HTMLIFrameElement}
 */
function openChatWindow(url, div = null) {
  if (div) {
    div.classList.add('opened');
  }

  const ifrm = document.createElement('iframe');
  ifrm.setAttribute('id', 'opendialog-chatwindow');
  ifrm.setAttribute('src', `${url}/web-chat-iframe?${query}`);
  ifrm.setAttribute('scrolling', "no");
  ifrm.setAttribute('allowtransparency', "true");

  // set height on page load
  ifrm.style.backgroundColor= 'transparent';
  ifrm.style.height = '120px';
  ifrm.style.width = '130px';
  window.document.body.appendChild(ifrm);

  listeners.load = () => {
    // Send settings and initial path to the chat widget.
    ifrm.contentWindow.postMessage({
      loadUuid: sessionStorage.uuid,
      loadSettings: window.openDialogSettings,
      newPathname: window.location.pathname,
    }, '*');

    if (window.openDialogSettings.general.chatbotCssPath) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', window.openDialogSettings.general.chatbotCssPath);
      ifrm.contentWindow.document.getElementsByTagName('head')[0].appendChild(link);
    }
  };

  listeners.message = async (event) => {
    if (event.data && typeof event.data.height !== 'undefined') {
      ifrm.style.height = (event.data.height === 'auto') ? '' : event.data.height;

      if (event.data.height === 'auto') {
        document.body.classList.add('chatbot-no-scroll');
      } else {
        document.body.classList.remove('chatbot-no-scroll');
      }
    }

    if (event.data && typeof event.data.width !== 'undefined') {
      ifrm.style.width = (event.data.width === 'auto') ? '' : event.data.width;
    }

    if (event.data && typeof event.data.addClass !== 'undefined') {
      ifrm.classList.add(event.data.addClass);
    }

    if (event.data && typeof event.data.removeClass !== 'undefined') {
      ifrm.classList.remove(event.data.removeClass);
    }

    if (event.data && typeof event.data.dataLayerEvent !== 'undefined') {
      let eventData = { event: event.data.dataLayerEvent };
      if (typeof event.data.dataLayerEvent === 'object') {
        eventData = event.data.dataLayerEvent;
      }
      pushToDataLayer(eventData)
    }
  };

  listeners.mouseUp = () => {
    if (ifrm.contentWindow) {
      ifrm.contentWindow.postMessage({ collapseChat: true }, '*');
    }
  };

  // Listen for back/forward button presses in SPAs.
  listeners.onPopState = (e) => {
    if (e.state !== null) {
      if (hasChatWindow()) {
        ifrm.contentWindow.postMessage({ newPathname: window.location.pathname }, '*');
      }
    }
  };

  // Handle navigation events. SPAs must broadcast this event for
  // the comment section to be updated.
  listeners.comment = () => {
    ifrm.contentWindow.postMessage({ newPathname: window.location.pathname }, '*');
  };

  ifrm.addEventListener('load', listeners.load);
  window.addEventListener('message', listeners.message);
  window.addEventListener('mouseup', listeners.mouseUp);
  window.onpopstate = listeners.onPopState;
  window.addEventListener('openDialogCommentSectionChange', listeners.comment);

  pushToDataLayer({event: 'chat_displayed'});

  return ifrm;
}

/**
 * Gets the webchat settings from the database
 * @returns {Promise<Response>}
 */
function getSettings(url, userId = '', customSettings = null, callbackId = null, width = null) {
  let configUrlObj = new URLSearchParams();
  configUrlObj.append('url', locationOrSpoof());

  if (userId) {
    configUrlObj.append('user_id', userId);
  } else if (sessionStorage.uuid) {
    configUrlObj.append('user_id', sessionStorage.uuid);
  }

  if (callbackId) {
    configUrlObj.append('callback_id', callbackId);
  }

  if (width) {
    configUrlObj.append('width', width);
  }
  let configUrl = `${url}/webchat-config?${configUrlObj.toString()}`;

  return fetch(configUrl, {
    url: configUrl,
    method: 'POST',
    body: JSON.stringify({
      custom_settings: customSettings,
      tags: getTags(),
    }),
  })
    .then((response) => {
      if (response.status !== 200) {
        return Promise.reject(response.statusText);
      } else {
        return response.json();
      }
    });
}

function locationOrSpoof() {
  if (window.location.pathname.split('/').includes('demo')) {
    return document.getElementById('spoof-url').value;
  }
  return window.location.href;
}

function locationOrSpoofQueryParams() {
  let url = new URL(locationOrSpoof());
  return url.search;
}

function getTags() {
  let tags = {};
  let variables = ['userInfo', 'avayaBot'];

  variables.forEach((variable) => {
    if (typeof window[variable] !== 'undefined') {
      try {
        tags[variable] = JSON.parse(window[variable]);
      } catch (e) {
        tags[variable] = {};
      }
    }
  });

  return tags;
}

async function fetchAttributes() {
  let retVal = false;

  try {
    let response = await fetch(window.openDialogSettings.url + '/api/attributes?url=' + locationOrSpoof(), {
      method: 'GET',
    });

    if (response.status === 200) {
      retVal = await response.json();
    }
  } catch (e) {
    console.error(e);
  }

  return retVal;
}

/**
 * Checks whether the current page matches the validPath if set.
 * Returns true if no validPath parameter is set
 *
 * @returns {boolean}
 */
async function isValidPath() {
  if (typeof window.openDialogSettings.general === 'undefined') {
    return false;
  }
  const { validPath } = window.openDialogSettings.general;

  if (typeof validPath === 'undefined') {
    return false;
  }

  let retVal = false;

  try {
    let response = await fetch(window.openDialogSettings.url + '/validate-paths', {
      method: 'POST',
      body: JSON.stringify({
        current_url: locationOrSpoof(),
        valid_paths: validPath
      })
    });

    if (response.status === 200) {
      retVal = await response.json();
    }
  } catch (e) {
    console.error(e);
  }

  return retVal;
}

async function setupWebchat(url, userId, preloadedSettings = null) {
  const urlParams = new URLSearchParams(window.location.search);

  let callbackId = null;
  if (urlParams.has('callback_id')) {
    callbackId = urlParams.get('callback_id');
  }
  if (preloadedSettings === null) {
    try {
      // document.addEventListener('DOMContentLoaded', async function(event) {
      let response = await getSettings(url, userId, window.openDialogSettings, callbackId, window.innerWidth);
      mergeSettings(response);
      // })
    } catch (error) {
      console.error("Call to OpenDialog webchat settings failed:", error);
      console.log("Using default OpenDialog webchat settings");
      mergeSettings(defaultWebchatSettings);
    }
  } else {
    mergeSettings(preloadedSettings);
  }

  const mobileWidth = (window.openDialogSettings.mobileWidth)
    ? window.openDialogSettings.mobileWidth : 480;

  // Set the current url of the parent to pass into the iFrame
  window.openDialogSettings.parentUrl = window.location.pathname;

  if (callbackId) {
    query = `${query}&callback_id=${callbackId}`;
  }

  if (window.innerWidth <= mobileWidth) {
    query = `${query}&mobile=true`;
  }

  if (await isValidPath()) {
    addCssToPage(`${url}/vendor/webchat/css/app-iframe.css`);

    if (window.openDialogSettings.general.pageCssPath) {
      addCssToPage(window.openDialogSettings.general.pageCssPath);
    }

    const attributes = await fetchAttributes();

    if (attributes) {
      if (!window.openDialogSettings.user) {
        window.openDialogSettings.user = {};
      }
      if (!window.openDialogSettings.user.custom) {
        window.openDialogSettings.user.custom = {};
      }

      attributes.forEach((attr) => {
        if (attr.attribute_mapping_type === 'HTML Tag') {
          const mappingName = attr.attribute_mapping_name.split('.');

          if (window[mappingName[0]]) {
            let json = JSON.parse(window[mappingName[0]]);

            for (let x = 1; x < mappingName.length; x++) {
              json = json[mappingName[x]];

              if (json && x === mappingName.length - 1) {
                window.openDialogSettings.user.custom[attr.attribute_canonical_name] = json;
              }
            }
          }
        } else if (attr.attribute_mapping_type === 'URL Parameter') {
          const urlParams = new URLSearchParams(locationOrSpoofQueryParams());

          if (urlParams.has(attr.attribute_mapping_name)) {
            window.openDialogSettings.user.custom[attr.attribute_canonical_name] = urlParams.get(attr.attribute_mapping_name);
          }
        }
      });
    }

    openChatWindow(url);
  } else {
    pushToDataLayer({ event: 'chat_not_displayed' });
  }
}

let hasChatWindow = () => {
  return window.document.getElementById('opendialog-chatwindow') !== null;
};

let removeChatWindow = () => {
  console.log("Removing webchat");

  if (hasChatWindow()) {
    window.document.getElementById('opendialog-chatwindow').removeEventListener('load', listeners.load);
    window.removeEventListener('message', listeners.message);
    window.removeEventListener('mouseup', listeners.mouseUp);
    window.removeEventListener('openDialogCommentSectionChange', listeners.comment);
    window.document.getElementById('opendialog-chatwindow').remove();
  }
};

function addUrlUpdatedListener() {
  window.addEventListener('message', async (event) => {
    // This event listener is attached once and never removed as it will need to track URL changes even when there
    // is no chat window
    if (event.data && typeof event.data.urlUpdated !== 'undefined') {
      if (!(await isValidPath())) {
        // Get new settings
        const urlParams = new URLSearchParams(window.location.search);

        let callbackId = null;
        if (urlParams.has('callback_id')) {
          callbackId = urlParams.get('callback_id');
        }

        let response = await getSettings(
          window.openDialogSettings.url,
          sessionStorage.uuid,
          window.openDialogSettings,
          callbackId,
          window.innerWidth
        );

        if (!response.bot || typeof response.bot.botName === 'undefined' || response.bot.botName === '') {
          console.log("Response did not contain a bot name. Removing chat window.");
          window.openDialogSettings = Object.assign({}, window.originalOpenDialogSettings);
          removeChatWindow();
        } else if (typeof window.openDialogSettings.bot == 'undefined'
          || response.bot.botName !== window.openDialogSettings.bot.botName) {
          console.log("Response's bot name was different to the current bot. Reloading chat window.");
          removeChatWindow();
          window.openDialogSettings = Object.assign({}, window.originalOpenDialogSettings);
          await setupWebchat(window.openDialogSettings.url, sessionStorage.uuid, response);
        }
      } else if (!hasChatWindow()) {
        console.log("Path was valid but there was no chat window. Setting up chat window.");
        await setupWebchat(window.openDialogSettings.url, sessionStorage.uuid);
      } else {
        console.log("Path was valid and the chat window did not need to be reloaded.")
      }
    }
  });
}

if (window.openDialogSettings) {
  document.addEventListener('DOMContentLoaded', async function(event) {
    const {url} = window.openDialogSettings;
    const userId = (window.openDialogSettings.user && window.openDialogSettings.user.email) ?
      window.openDialogSettings.user.email : '';

    if (userId) {
      sessionStorage.uuid = userId;
    } else if (!sessionStorage.uuid) {
      sessionStorage.uuid = uuid.v4();
    }

    addUrlUpdatedListener();

    setupWebchat(url, userId);
  });
}
