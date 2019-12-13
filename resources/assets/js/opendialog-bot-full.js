import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import 'core-js/es/object';

function addCssToPage(href) {
  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('type', 'text/css');
  link.setAttribute('href', href);
  document.getElementsByTagName('body')[0].appendChild(link);
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

function openChatWindow() {
  // Send settings to the chat widget.
  window.postMessage({
    openDialogSettings: window.openDialogSettings,
    newPathname: window.location.pathname,
  }, '*');

  if (window.openDialogSettings.general.chatbotCssPath) {
    const link = document.createElement('link');
    link.setAttribute('rel', 'stylesheet');
    link.setAttribute('type', 'text/css');
    link.setAttribute('href', window.openDialogSettings.general.chatbotCssPath);
    window.document.getElementsByTagName('head')[0].appendChild(link);
  }

  window.addEventListener('message', (event) => {
    if (event.data && typeof event.data.addClass !== 'undefined') {
      window.classList.add(event.data.addClass);
    }

    if (event.data && typeof event.data.removeClass !== 'undefined') {
      window.classList.remove(event.data.removeClass);
    }

    if (event.data && typeof event.data.dataLayerEvent !== 'undefined') {
      if (window.dataLayer !== undefined) {
        window.dataLayer.push({ event: event.data.dataLayerEvent });
      }
    }
  });
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

if (window.openDialogSettings) {
  const { url } = window.openDialogSettings;

  getSettings(url).then((settings) => {
    mergeSettings(settings);

    if (window.openDialogSettings.general.chatbotFullpageCssPath) {
      addCssToPage(window.openDialogSettings.general.chatbotFullpageCssPath);
    }

    openChatWindow();
  });
}
