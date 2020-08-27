import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import {resourceModule} from '@reststate/vuex';
import camelToKebab from './mixins/camelToKebab';
import hexToRgb from './mixins/hexToRgb';
import isSkip from './mixins/isSkip';
import chatService from "./services/ChatService";
import {uuid} from 'vue-uuid';
import moment from 'moment'

Vue.use(Vuex);

const log = location.hostname === 'localhost'

// Create the store.
const store = new Vuex.Store({
  state: {
    apiReady: false,
    uuid: sessionStorage.uuid || null,
    settings: sessionStorage.openDialogSettings ? JSON.parse(sessionStorage.openDialogSettings) : null,
    user: {
      custom: {}
    },
    userInfo: {},
    referrerUrl: '',
    showLongTextInput: true,
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
    rootComponent: null
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
    updateRootComponent(state, payload) {
      log && console.log('updateRootComponent', payload)
      state.rootComponent = payload
    },
    updateUser(state, payload) {
      log && console.log('updateUser', payload) 
      Object.keys(payload).forEach(key => {
        if (state.user[key] === undefined) state.user[key] = null;
        state.user[key] = payload[key]
      })
    },
    updateUserInfo(state, payload) {
      log && console.log('updateUserInfo', payload) 
      Object.keys(payload).forEach(key => {
        if (state.userInfo[key] === undefined) state.userInfo[key] = null;
        state.userInfo[key] = payload[key]
      })
    },
    updateReferralUrl(state, payload) {
      log && console.log('updateReferralUrl', payload)
      state.referrerUrl = payload
    },
    toggleLongTextInput(state, payload) {
      log && console.log('toggleLongTextInput', payload)
      state.showLongTextInput = payload
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
    sendMessage({dispatch, commit, state}, payload) {
      log && console.log('sendMessage', payload.sentMsg)
      
      commit('updateFetching', true)

      let newMsg = Object.assign({}, payload.sentMsg);

      newMsg.mode = state.rootComponent.modeData.mode;
      newMsg.modeInstance = state.rootComponent.modeData.modeInstance;

      newMsg.data.date = moment()
        .tz("UTC")
        .format("ddd D MMM");
      newMsg.data.time = moment()
        .tz("UTC")
        .format("hh:mm:ss A");

      newMsg.user_id = state.user.email ? state.user.email : state.uuid;
      newMsg.user = state.user;

      if (
        !newMsg.user.name &&
        newMsg.user.first_name &&
        newMsg.user.last_name
      ) {
        newMsg.user.name = `${newMsg.user.first_name} ${newMsg.user.last_name}`;
      }

      // Give the message an id.
      newMsg.id = uuid.v4();

      if (newMsg.type === "chat_open") {
        if (state.userInfo) {
          Object.keys(state.userInfo).forEach(key => {
            newMsg.user[key] = state.userInfo[key];
          });
        }
      }

      if (newMsg.data && newMsg.data.text && newMsg.data.text.length > 0) {
        if (state.rootComponent.useHumanName || state.rootComponent.useHumanAvatar) {
          const authorMsg = state.rootComponent.newAuthorMessage(newMsg);

          state.rootComponent.messageList.push(authorMsg);
        }

        if (state.showLongTextInput) {
          commit('toggleLongTextInput', false)
        }
        
        state.rootComponent.messageList.push(newMsg);
      }

      if (newMsg.type === "text" && newMsg.data.text.length > 0) {
        let event = 'message_sent_to_chatbot';
        if (chatService.getMode() === "custom") {
            event = 'message_sent_to_live_agent';
        }
        window.parent.postMessage(
          { dataLayerEvent: event },
          state.rootComponent.referrerUrl
        );
      }
      if (newMsg.type === "button_response") {
        const events = ['user_clicked_button_in_chatbot', 'message_sent_to_chatbot']
        events.forEach((eventName) => {
          window.parent.postMessage(
            { dataLayerEvent: { event: eventName, label: newMsg.data.text} },
            state.rootComponent.referrerUrl
          );
        })
      }

      chatService.sendRequest(newMsg, payload.webChat).then(response => {
        dispatch('constructMessageList', {response: response, ...payload})
      }).catch(err => {
        console.log(err)
        chatService.sendResponseError(null, newMsg, payload.webChat)
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
    },
    buttonClick({dispatch, state}, payload) {
      console.log('buttonClick', payload.button, payload.data)
      const button = payload.button;
      const msg = payload.data;

      if (!button) {
        if (msg.link) {
          window.open(msg.link, "_blank");
        } else {
          dispatch('sendMessage', {
            sentMsg: {
              type: "button_response",
              author: "me",
              callback_id: msg.callback,
              data: {
                text: msg.callback_text ? msg.callback_text : msg.callback_value,
                value: msg.callback_value
              }
            },
            webChat: state.rootComponent
          })
        }
        return;
      }
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
