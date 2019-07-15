import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import 'url-search-params-polyfill';

let query = 'open=true';
let url = '';

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
  for (const [key, value] of Object.entries(webchatSettings)) {
    if (!window.openDialogSettings[key]) {
      window.openDialogSettings[key] = value;
    }
  }
}

/**
 * Creates the chat window iFrame on the parent page
 *
 * @param div
 * @returns {HTMLIFrameElement}
 */
function openChatWindow(div = null) {
  if (div) {
    div.classList.add('opened');
  }

  const ifrm = document.createElement('iframe');
  ifrm.setAttribute('id', 'opendialog-chatwindow');
  ifrm.setAttribute('src', `${url}/web-chat?${query}`);
  window.document.body.appendChild(ifrm);

  document.body.classList.add('chatbot-no-scroll');

  ifrm.addEventListener('load', () => {
    // Send settings and initial path to the chat widget.
    ifrm.contentWindow.postMessage({
      openDialogSettings: window.openDialogSettings,
      newPathname: window.location.pathname
    }, '*');
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
function drawOpenCloseIcons() {
  const div = document.createElement('div');
  div.setAttribute('id', 'opendialog-bot');
  document.body.appendChild(div);

  const openIcon = document.createElement('img');
  openIcon.classList.add('sc-closed-icon');
  openIcon.setAttribute('src', '/images/vendor/webchat/images/logo-no-bg.svg');

  const closeIcon = document.createElement('img');
  closeIcon.classList.add('sc-open-icon');
  closeIcon.setAttribute('src', '/images/vendor/webchat/images/close-icon.png');

  div.addEventListener('click', () => {
    const element = document.getElementById('opendialog-chatwindow');
    if (!element) {
      openChatWindow(div);
    } else {
      element.parentNode.removeChild(element);
      div.classList.remove('opened');
    }
  }, false);

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

/**
 * Checks whether the current page matches the validPath if set.
 * Returns true if no validPath parameter is set
 *
 * @returns {boolean}
 */
function isValidPath() {
  const { validPath } = window.openDialogSettings;

  if (typeof validPath === 'undefined') {
    return true;
  }

  let retVal = false;

  if (Array.isArray(validPath)) {
    validPath.forEach((key) => {
      if (window.location.href.indexOf(key) >= 0) {
        retVal = true;
      }
    });
  } else if (window.location.href.indexOf(validPath) >= 0) {
    retVal = true;
  }

  return retVal;
}

if (window.openDialogSettings) {
  url = window.openDialogSettings.url;

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
      addCssToPage(`${url}/vendor/webchat/css/opendialog-chat-bot.css`);

      if (window.openDialogSettings.hideOpenCloseIcons === 'false' || !window.openDialogSettings.hideOpenCloseIcons) {
        drawOpenCloseIcons();
      }

      if (window.openDialogSettings.customCssPath) {
        addCssToPage(window.openDialogSettings.customCssPath);
      }

      if (urlParams.has('chat_open') && urlParams.get('chat_open') === 'true') {
        openChatWindow();
      } else if (window.innerWidth <= mobileWidth || settings.general.startMinimized) {
        query = `${query}&hide=true`;
        openChatWindow();

        document.body.classList.remove('chatbot-no-scroll');
      } else if (settings.general.open) {
        openChatWindow();
      }
    }
  });
}
