import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import 'core-js/es/object';
import {uuid} from 'vue-uuid';
import defaultWebchatSettings from './default-webchat-settings';
import {merge, addCssToPage} from './mixins/bootstrapFunctions';

const dev = location.hostname === 'localhost'

if (!dev) {
    // prompt the user when they attempt to reload/leave the page
    // this is extremely irritating whilst developing so not applicable for localhost!
    window.addEventListener('beforeunload', e => {
        e.preventDefault(); 
        e.returnValue = '';
    });
}

function openChatWindow() {
    document.body.classList.add('chatbot-no-scroll');

    // Send settings to the chat widget.
    window.postMessage({
        openDialogSettings: window.openDialogSettings,
        loadSettings: window.openDialogSettings,
        loadUuid: sessionStorage.uuid ? sessionStorage.uuid : uuid.v4(),
        newPathname: window.location.pathname,
    }, '*');

    if (window.openDialogSettings.general.chatbotCssPath) {
        addCssToPage(window.openDialogSettings.general.chatbotCssPath);
    }

    window.addEventListener('message', (event) => {

        if (event.data && typeof event.data.height !== 'undefined') {
            window.style.height = (event.data.height === 'auto') ? '' : event.data.height;

            if (event.data.height === 'auto') {
                document.body.classList.add('chatbot-no-scroll');
            } else {
                document.body.classList.remove('chatbot-no-scroll');
            }
        }

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
        window.openDialogSettings = merge(window.openDialogSettings, settings);
        window.openDialogSettings = merge(window.openDialogSettings, defaultWebchatSettings);

        if (window.openDialogSettings.general.chatbotFullpageCssPath) {
            addCssToPage(window.openDialogSettings.general.chatbotFullpageCssPath);
        }

        openChatWindow();
    });
}
