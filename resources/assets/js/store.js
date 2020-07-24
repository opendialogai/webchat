import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {resourceModule} from '@reststate/vuex';
import camelToKebab from './mixins/camelToKebab';
import hexToRgb from './mixins/hexToRgb';

Vue.use(Vuex);

const log = location.hostname === 'localhost'

// Create the store.
const store = new Vuex.Store({
  state: {
    apiReady: false,
    uuid: sessionStorage.uuid || null,
    settings: sessionStorage.openDialogSettings ? JSON.parse(sessionStorage.openDialogSettings) : null,
    messageMetaData: {
      teamName: null
    }
  },
  mutations: {
    setApiReady(state, val) {
      log && console.log('setApiReady', val)
      state.apiReady = val;
    },
    setUuid(state, uuid) {
      log && console.log('setUuid', uuid)
      state.uuid = uuid;
    },
    setSettings(state, settings) {
      log && console.log('setSettings', settings)
      state.settings = settings;
    },
    setMessageMetaData(state, data) {
      log && console.log('setMessageMetaData', data)
      state.messageMetaData = data;
    }
  },
  actions: {
    updateSettings({commit}, payload) {
      log && console.log('updateSettings', payload)
      commit('setSettings', payload);
      
      const root = document.querySelector(':root')
      let c = payload.colours ? payload.colours : {}
      const headerRGB = hexToRgb(c.headerBackground)

      c.headerBackgroundGradient = `linear-gradient(180deg, rgba(${headerRGB[0]},${headerRGB[1]},${headerRGB[2]},1) 0%, rgba(${headerRGB[0]},${headerRGB[1]},${headerRGB[2]},0) 100%)`
  

      for (const[key, val] of Object.entries(c)) {
        if (val) {
          let kebab = `--od-${camelToKebab(key)}`
          root.style.setProperty(kebab, val);
        }
      }
      
    }
  },
  getters: {},
});

const commentConfig = {};
const userConfig = {};

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

store.subscribe((mutation, state) => {
  if (mutation.type === 'setSettings') {
    setConfig(state.settings);

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
  }
});

export default store;
