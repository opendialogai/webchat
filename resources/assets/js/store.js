import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {resourceModule} from '@reststate/vuex';

Vue.use(Vuex);

// Create the store.
const store = new Vuex.Store({
  state: {
    apiReady: false,
    uuid: sessionStorage.uuid || null,
  },
  mutations: {
    setApiReady(state, val) {
      state.apiReady = val;
    },
  },
  actions: {},
  getters: {},
});

const commentConfig = {};
const userConfig = {};

// Helper function - retrieve DB settings from endpoint.
async function getWebchatConfig(url = '') {
  let configUrl = url;
  if (configUrl === '') {
    configUrl = `${window.location.origin}/webchat-config`;
  }

  const response = await fetch(configUrl);
  const json = await response.json();
  return json;
}

function setConfig(config) {
  if (config.comments) {
    Object.keys(config.comments).forEach((commentConfigKey) => {
      commentConfig[commentConfigKey] = config.comments[commentConfigKey];
    });
  }

  if (config.user) {
    Object.keys(config.user).forEach((userConfigKey) => {
      userConfig[userConfigKey] = config.user[userConfigKey];
    });
  }
}

// Add event listener for custom open dialog settings.
const customConfig = {};
window.addEventListener('message', (event) => {
  if (event.data) {
    if (event.data.openDialogSettings) {
      Object.keys(event.data.openDialogSettings).forEach((key) => {
        customConfig[key] = event.data.openDialogSettings[key];
      });
      customConfig.newPathname = event.data.newPathname;
    }
  }
});

// Get default settings from the config endpoint.
getWebchatConfig().then((config) => {
  setConfig(config);
  return true;
}).then(() => {
  setTimeout(() => {
    // Over-ride default config with any custom settings.
    setConfig(customConfig);

    if (commentConfig && commentConfig.commentsEnabled
        && commentConfig.commentsEndpoint && commentConfig.commentsAuthToken) {
      const commentsAxiosConfig = {
        baseURL: commentConfig.commentsEndpoint,
        headers: {
          Authorization: commentConfig.commentsAuthToken,
          'Content-Type': 'application/vnd.api+json',
        },
      };

      if (userConfig.external_id) {
        commentsAxiosConfig.headers['X-Requested-For-OD-User-ID'] = userConfig.external_id;
      }
      const httpClient = axios.create(commentsAxiosConfig);

      // Add the json:api modules.
      store.registerModule('comments', resourceModule({ name: commentConfig.commentsEntityName, httpClient }));
      store.registerModule('authors', resourceModule({ name: commentConfig.commentsAuthorEntityName, httpClient }));
      if (commentConfig.commentsSectionEntityName) {
        store.registerModule('sections', resourceModule({ name: commentConfig.commentsSectionEntityName, httpClient }));
      }

      // Tell vue we're ready.
      store.commit('setApiReady', true);
    }
  }, 200);
});

export default store;
