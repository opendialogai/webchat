import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { resourceModule } from '@reststate/vuex';

Vue.use(Vuex);

// Create the store.
const store = new Vuex.Store({
  state: {
    apiReady: false,
  },
  mutations: {
    setApiReady(state, val) {
      state.apiReady = val;
    },
  },
});

const commentConfig = {};

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
}

// Add event listener for custom open dialog settings.
const customConfig = {};
window.addEventListener('message', (event) => {
  if (event.data) {
    // Add config items to our custom config object.
    Object.keys(event.data).forEach((key) => {
      customConfig[key] = event.data[key];
    });
  }
});

// Get default settings from the config endpoint.
getWebchatConfig().then((config) => {
  setConfig(config);
  return true;
}).then(() => {
  // Over-ride default config with any custom settings.
  setConfig(customConfig);

  if (commentConfig && commentConfig.commentsEnabled && commentConfig.commentsAxiosConfig) {
    const httpClient = axios.create(commentConfig.commentsAxiosConfig);

    // Add the json:api modules.
    store.registerModule('comments', resourceModule({ name: commentConfig.commentsEntityName, httpClient }));
    store.registerModule('authors', resourceModule({ name: commentConfig.commentsAuthorEntityName, httpClient }));
    if (commentConfig.commentsSectionEntityName) {
      store.registerModule('sections', resourceModule({ name: commentConfig.commentsSectionEntityName, httpClient }));
    }

    // Tell vue we're ready.
    store.commit('setApiReady', true);
  }
});

export default store;
