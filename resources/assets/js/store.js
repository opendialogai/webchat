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
    settings: sessionStorage.openDialogSettings ? JSON.parse(sessionStorage.openDialogSettings) : null,
    messageMetaData: {}
  },
  mutations: {
    setApiReady(state, val) {
      state.apiReady = val;
    },
    setUuid(state, uuid) {
      state.uuid = uuid;
    },
    setSettings(state, settings) {
      state.settings = settings;
    },
    setMessageMetaData(state, data) {
      state.messageMetaData = data;
    },
  },
  actions: {},
  getters: {},
});

const commentConfig = {};
const userConfig = {};

async function getWebchatConfig() {
  return Promise.resolve(store.state.settings);
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

getWebchatConfig().then((config) => {
  setConfig(config);

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
});

export default store;
