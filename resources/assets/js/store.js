import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {resourceModule} from '@reststate/vuex';
import camelToKebab from './mixins/camelToKebab';
import hexToRgb from './mixins/hexToRgb';
import isSkip from './mixins/isSkip';
import chatService from "./services/ChatService";

Vue.use(Vuex);

const log = location.hostname === 'localhost'

// Create the store.
const store = new Vuex.Store({
  state: {
    apiReady: false,
    uuid: sessionStorage.uuid || null,
    settings: sessionStorage.openDialogSettings ? JSON.parse(sessionStorage.openDialogSettings) : null,
    messageMetaData: {
      teamName: null,
      progressPercent: null,
      progressText: null,
      textLimit: null
    },
    messageList: [],
    availableInputs: [
      'autocomplete',
      'date-picker',
      'external-button'
    ],
    userInputType: 'default',
    currentMessage: {},
    fetching: false,
    isOpen: false,
    activeTab: 'webchat',
    showCloseChatButton: false
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
    setMessageMetaData(state, payload) {
      log && console.log('setMessageMetaData', payload)
      Object.keys(payload).forEach(key => {
        state.messageMetaData[key] = payload[key]
      })
    },
    updateMessageList(state, payload) {
      log && console.log('updateMessageList', payload)
      state.messageList = payload
    },
    updateInputType(state, payload) {
      log && console.log('updateInputType', payload)
      if (state.availableInputs.includes(payload)) {
        state.userInputType = payload
      } else {
        state.userInputType = 'default'
      }
    },
    updateCurrentMessage(state, payload) {
      log && console.log('updateCurrentMessage', payload)
      state.currentMessage = payload
    },
    updateFetching(state, payload) {
      log && console.log('updateFetching', payload)
      state.fetching = payload
    },
    toggleOpen(state, payload) {
      log && console.log('toggleOpen', payload)
      state.isOpen = payload
    },
    setActiveTab(state, payload) {
      log && console.log('setActiveTab', payload)
      state.activeTab = payload
    },
    setShowCloseChatButton(state, payload) {
      log && console.log('setShowCloseChatButton', payload)
      state.showCloseChatButton = payload
    }
  },
  actions: {
    updateSettings({commit}, payload) {
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

    },
    sendMessage({dispatch, commit}, payload) {
      log && console.log('sendMessage', payload.sentMsg)

      if (payload.sentMsg.type !== 'url_click') {
        commit('updateFetching', true)
      }

      chatService.sendRequest(payload.sentMsg, payload.webChat).then(response => {
        dispatch('constructMessageList', {response: response, ...payload})
      }).catch(err => {
        console.log(err)
        chatService.sendResponseError(null, payload.sentMsg, payload.webChat)
      })
    },
    constructMessageList({commit}, payload) {
      chatService.sendResponseSuccess(payload.response, payload.sentMsg, payload.webChat).then(response => {
        const msg = response.filter(msg => msg.type && msg.type !== 'typing' && msg.type !== 'author' && isSkip(msg) !== 'skip').pop()

        commit('updateMessageList', [...response])
        commit('updateCurrentMessage', msg)
        commit('updateInputType', msg.type === 'button' && msg.data.external ? 'external-button' : msg.type)
        commit('updateFetching', false)
      })
    },
    fetchAutocomplete({}, payload) {
      return new Promise((resolve, reject) => {
        axios.get(payload).then(res => {
          resolve(res.data)
        }).catch(err => {
          console.log(err)
          reject()
        })
      })
    }
  },
  getters: {}
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
