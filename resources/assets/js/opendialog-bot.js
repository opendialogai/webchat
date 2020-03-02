import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import 'url-search-params-polyfill';
import 'core-js/es/object';

let query = 'open=true';

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
  window.document.body.appendChild(ifrm);

  document.body.classList.add('chatbot-no-scroll');

  ifrm.addEventListener('load', () => {
    // Send settings and initial path to the chat widget.
    ifrm.contentWindow.postMessage({
      openDialogSettings: window.openDialogSettings,
      newPathname: window.location.pathname,
    }, '*');

    if (window.openDialogSettings.general.chatbotCssPath) {
      const link = document.createElement('link');
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('type', 'text/css');
      link.setAttribute('href', window.openDialogSettings.general.chatbotCssPath);
      ifrm.contentWindow.document.getElementsByTagName('head')[0].appendChild(link);
    }
  });

  window.addEventListener('message', (event) => {
    if (event.data && typeof event.data.height !== 'undefined') {
      ifrm.style.height = (event.data.height === 'auto') ? '' : event.data.height;

      if (event.data.height === 'auto') {
        document.body.classList.add('chatbot-no-scroll');
      } else {
        document.body.classList.remove('chatbot-no-scroll');
      }
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
  });

  window.addEventListener('mouseup', () => {
    if (ifrm.contentWindow) {
      ifrm.contentWindow.postMessage({ collapseChat: true }, '*');
    }
  });

  // Listen for back/forward button presses in SPAs.
  window.onpopstate = (e) => {
    if (e.state !== null) {
      ifrm.contentWindow.postMessage({ newPathname: window.location.pathname }, '*');
    }
  };

  // Handle navigation events. SPAs must broadcast this event for
  // the comment section to be updated.
  window.addEventListener('openDialogCommentSectionChange', () => {
    ifrm.contentWindow.postMessage({ newPathname: window.location.pathname }, '*');
  });

  return ifrm;
}

/**
 * Draws the open/close icons on screen along with it's listener
 */
function drawOpenCloseIcons(url) {
  const div = document.createElement('div');
  div.setAttribute('id', 'opendialog-bot');
  document.body.appendChild(div);

  const openIcon = document.createElement('img');
  openIcon.classList.add('sc-closed-icon');
  openIcon.setAttribute('src', `${url}/images/vendor/webchat/images/logo-no-bg.svg`);

  const closeIcon = document.createElement('img');
  closeIcon.classList.add('sc-open-icon');
  closeIcon.setAttribute('src', `${url}/images/vendor/webchat/images/close-icon.png`);

  div.addEventListener('click', () => {
    const element = document.getElementById('opendialog-chatwindow');
    if (!element) {
      openChatWindow(url, div);
    } else {
      element.parentNode.removeChild(element);
      div.classList.remove('opened');
      document.body.classList.remove('chatbot-no-scroll');
    }
  }, false);

  if (window.openDialogSettings.colours.iconBackground) {
    div.style.background = window.openDialogSettings.colours.iconBackground;
  }

  if (window.openDialogSettings.colours.iconHoverBackground) {
    const style = document.createElement('style');
    style.innerHTML = `#opendialog-bot:hover { background: ${window.openDialogSettings.colours.iconHoverBackground} !important }`;
    div.appendChild(style);
  }

  div.appendChild(openIcon);
  div.appendChild(closeIcon);
}

/**
 * Gets the webchat settings from the database
 * @returns {Promise<any>}
 */
async function getSettings(url) {
  const response = await fetch(`${url}/webchat-config`);
  const json = await response.json();
  return json;
}

function checkValidPath(testPath) {
  const currentUrl = window.location.href;
  if (testPath.endsWith('$')) {
    return currentUrl.endsWith(testPath.replace('$', ''));
  }
  if (currentUrl.indexOf(testPath) >= 0) {
    return true;
  }

  return false;
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
    return true;
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

if (window.openDialogSettings) {
  const { url } = window.openDialogSettings;

  getSettings(url).then((settings) => {
    mergeSettings(settings);

    const mobileWidth = (window.openDialogSettings.mobileWidth)
      ? window.openDialogSettings.mobileWidth : 480;

    // Set the current url of the parent to pass into the iFrame
    window.openDialogSettings.parentUrl = window.location.pathname;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('callback_id')) {
      query = `${query}&callback_id=${urlParams.get('callback_id')}`;
    }

    if (window.innerWidth <= mobileWidth) {
      query = `${query}&mobile=true`;
    }

    if (isValidPath()) {
      addCssToPage(`${url}/vendor/webchat/css/app-iframe.css`);

      drawOpenCloseIcons(url);
      openChatWindow(url);

      if (window.openDialogSettings.general.pageCssPath) {
        addCssToPage(window.openDialogSettings.general.pageCssPath);
      }
    }
  });
}
