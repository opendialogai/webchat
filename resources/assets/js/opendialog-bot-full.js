import 'promise-polyfill/src/polyfill';
import 'whatwg-fetch';
import 'core-js/es/object';
import {uuid} from 'vue-uuid';
import defaultWebchatSettings from './default-webchat-settings';
import {merge, addCssToPage, getSettings, initTimer, setVh} from './mixins/bootstrapFunctions';

const dev = location.hostname === 'localhost'

if (!dev) {
    // prompt the user when they attempt to reload/leave the page
    // this is extremely irritating whilst developing so not applicable for localhost!
    window.addEventListener('beforeunload', showReloadWarning);
}

function showReloadWarning(e) {
    e.preventDefault(); 
    e.returnValue = '';
}

function reloadChatBot() {
    window.removeEventListener('beforeunload', showReloadWarning);
    location.reload()
}

function openChatWindow() {
    document.body.classList.add('chatbot-no-scroll');
    setVh()

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

    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', () => {
            setVh()
        })
    } else {
        window.addEventListener('resize', () => {
            setVh()
        })
    }
}

if (window.openDialogSettings) {
    const { url } = window.openDialogSettings;
    const urlParams = new URLSearchParams(window.location.search);
    const userId = (window.openDialogSettings.user && window.openDialogSettings.user.email) ?
      window.openDialogSettings.user.email : null;

    let callbackId = null;

    if (urlParams.has('callback_id')) {
    callbackId = urlParams.get('callback_id');
    }

    if (userId) {
      sessionStorage.uuid = userId;
    } else if (!sessionStorage.uuid) {
      sessionStorage.uuid = uuid.v4();
    }

    getSettings(url, userId, window.openDialogSettings, callbackId, window.innerWidth).then((settings) => {
        window.openDialogSettings = merge(window.openDialogSettings, settings);
        window.openDialogSettings = merge(window.openDialogSettings, defaultWebchatSettings);

        if (window.openDialogSettings.general.chatbotFullpageCssPath) {
            addCssToPage(window.openDialogSettings.general.chatbotFullpageCssPath);
        }

        if (window.openDialogSettings.sessionDuration) {
            const el = document.querySelector('.opendialog-chat-window')
            initTimer(el, window.openDialogSettings.sessionDuration, reloadChatBot)
        }

        openChatWindow();
    });
}
