import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import 'url-search-params-polyfill';
import 'core-js/es/object';
import {uuid} from 'vue-uuid';
import defaultWebchatSettings from './default-webchat-settings';

let query = '';

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
    link.setAttribute('href', href);
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

    //if you want a full iframe on page load turn this on
    // document.body.classList.add('chatbot-no-scroll');

  let loadListener = () => {
    // Send settings and initial path to the chat widget.
    ifrm.contentWindow.postMessage({
      loadSettings: true,
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

  let messageListener = (event) => {
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
      if (window.dataLayer !== undefined) {
        window.dataLayer.push({ event: event.data.dataLayerEvent });
      }
    }
  };

  let mouseUpListener = () => {
    if (ifrm.contentWindow) {
      ifrm.contentWindow.postMessage({ collapseChat: true }, '*');
    }
  };

  // Listen for back/forward button presses in SPAs.
  let onPopStateListener = async (e) => {
    console.log(e);
    if (e.state !== null) {
      if (hasChatWindow()) {
        ifrm.contentWindow.postMessage({newPathname: window.location.pathname}, '*');
      }

      if (!isValidPath()) {
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

        if (!response.bot || !response.bot.bot_name || response.bot.bot_name === '') {
          console.log("Response did not contain a bot name. Removing chat window.");
          removeChatWindow();
        } else if (response.bot.bot_name !== sessionStorage.openDialogSettings.bot.bot_name) {
          console.log("Response's bot name was different to the current bot. Reloading chat window.");
          removeChatWindow();
          window.openDialogSettings = response;
          await setupWebchat(window.openDialogSettings.url, sessionStorage.uuid, false);
        }
      } else if (!hasChatWindow()) {
        console.log("Path was valid but there was no chat window. Setting up chat window.");
        await setupWebchat(window.openDialogSettings.url, sessionStorage.uuid);
      }
    }
  };

  // Handle navigation events. SPAs must broadcast this event for
  // the comment section to be updated.
  let commentListener = () => {
    ifrm.contentWindow.postMessage({ newPathname: window.location.pathname }, '*');
  };

  let hasChatWindow = () => {
    return window.document.getElementById('opendialog-chatwindow') !== null;
  };

  let removeChatWindow = () => {
    console.log("Removing webchat");

    ifrm.removeEventListener('load', loadListener);
    window.removeEventListener('message', messageListener);
    window.removeEventListener('mouseup', mouseUpListener);
    window.removeEventListener('openDialogCommentSectionChange', commentListener);

    window.document.getElementById('opendialog-chatwindow').remove();
  };

  ifrm.addEventListener('load', loadListener);
  window.addEventListener('message', messageListener);
  window.addEventListener('mouseup', mouseUpListener);
  window.onpopstate = onPopStateListener;
  window.addEventListener('openDialogCommentSectionChange', commentListener);

  return ifrm;
}

/**
 * Gets the webchat settings from the database
 * @returns {Promise<Response>}
 */
function getSettings(url, userId = '', customSettings = null, callbackId = null, width = null) {
    let configUrlObj = new URLSearchParams();

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
        custom_settings: customSettings
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

function checkValidPath(testPath) {
    const currentUrl = window.location.href;

    if (testPath === '') {
      return false;
    }

    if (testPath === '*') {
      return true;
    }

    let formattedTestPath = testPath.replace(/\*/, '(.*)');
    let regex = new RegExp(formattedTestPath);

    return regex.test(currentUrl);
}

/**
 * Checks whether the current page matches the validPath if set.
 * Returns true if no validPath parameter is set
 *
 * @returns {boolean}
 */
function isValidPath() {
    const { validPath } = window.openDialogSettings.general;

    if (typeof validPath === 'undefined') {
        return false;
    }

    let retVal = false;

    if (Array.isArray(validPath)) {
        validPath.forEach((key) => {
            if (checkValidPath(key)) {
                retVal = true;
            }
        });
    } else {
        retVal = checkValidPath(validPath);
    }

    return retVal;
}

async function setupWebchat(url, userId, callSettings = true) {
  const urlParams = new URLSearchParams(window.location.search);

  let callbackId = null;
  if (urlParams.has('callback_id')) {
    callbackId = urlParams.get('callback_id');
  }

  if (callSettings) {
    try {
      let response = await getSettings(url, userId, window.openDialogSettings, callbackId, window.innerWidth);
      mergeSettings(response);
    } catch (error) {
      console.error("Call to OpenDialog webchat settings failed:", error);
      console.log("Using default OpenDialog webchat settings");
      mergeSettings(defaultWebchatSettings);
    }
  }

  sessionStorage.openDialogSettings = JSON.stringify(window.openDialogSettings);

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

  if (isValidPath()) {
    addCssToPage(`${url}/vendor/webchat/css/app-iframe.css`);

    if (window.openDialogSettings.general.pageCssPath) {
      addCssToPage(window.openDialogSettings.general.pageCssPath);
    }

    openChatWindow(url);
  }
}

if (window.openDialogSettings) {
  const { url } = window.openDialogSettings;
  const userId = (window.openDialogSettings.user && window.openDialogSettings.user.email) ?
        window.openDialogSettings.user.email : '';

  if (userId) {
    sessionStorage.uuid = userId;
  } else {
    sessionStorage.uuid = uuid.v4();
  }

  setupWebchat(url, userId);
}
