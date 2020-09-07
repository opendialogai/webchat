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
    showLongTextInput: false,
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
    rootComponent: null,
    placeholder: 'Enter your message'
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
    updatePlaceholder(state, payload) {
      log && console.log('updatePlaceholder', payload)
      state.placeholder = payload
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
      log && console.log('sendMessage', payload)
      
      commit('updateFetching', true)

      let newMsg = Object.assign({}, payload);

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
        if (state.settings.general.useHumanName || state.settings.general.useHumanAvatar) {
          const authorMsg = state.rootComponent.newAuthorMessage(newMsg);

          state.rootComponent.messageList.push(authorMsg);
        }

        if (state.showLongTextInput) {
          commit('toggleLongTextInput', false)
        }
        
        state.rootComponent.messageList.push(newMsg);
      }

      if (newMsg.type === "text" && newMsg.data.text.length > 0) {
        let event = chatService.getDataLayerEventName();
        window.parent.postMessage(
          { dataLayerEvent: event },
          state.referrerUrl
        );
      }
      if (newMsg.type === "button_response") {
        const events = ['user_clicked_button_in_chatbot', 'message_sent_to_chatbot']
        events.forEach((eventName) => {
          window.parent.postMessage(
            { dataLayerEvent: { event: eventName, label: newMsg.data.text} },
            state.referrerUrl
          );
        })
      }

      chatService.sendRequest(newMsg, state.rootComponent).then(response => {
        dispatch('constructMessageList', {response: response, sentMsg: newMsg, webChat: state.rootComponent})
      }).catch(err => {
        console.log(err)
        chatService.sendResponseError(null, newMsg, state.rootComponent)
      })
    },
    constructMessageList({commit}, payload) {
      chatService.sendResponseSuccess(payload.response, payload.sentMsg, payload.webChat).then(response => {
        const msgList = response.msgList
        const msg = msgList.filter(msg => msg.type && msg.type !== 'typing' && msg.type !== 'author' && isSkip(msg) !== 'skip').pop()

        commit('updateMessageList', [...msgList])
        commit('updateCurrentMessage', msg)

        if (response.placeholder) {
          commit('updatePlaceholder', response.placeholder)
        }

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
    linkClick({dispatch, state}, payload) {
      window.parent.postMessage(
        { dataLayerEvent: { event: 'url_clicked', url: payload.url, text: payload.text } },
        this.referrerUrl);

      dispatch('sendMessage', {
        type: "url_click",
        author: state.uuid,
        data: {
          url: payload.url
        }
      })
    },
    async buttonClick({dispatch, state}, payload) {
      console.log('buttonClick', payload.button, payload.data)
      const button = payload.button;
      const msg = payload.data;

      if (!button) {
        if (msg.link) {
          window.open(msg.link, "_blank");
        } else {
          dispatch('sendMessage', {
            type: "button_response",
            author: "me",
            callback_id: msg.callback,
            data: {
              text: msg.callback_text ? msg.callback_text : msg.callback_value,
              value: msg.callback_value
            }
          })
        }
        return;
      }

      if (msg.data.external) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (button.phone_number) {
        const telephone = `tel:${button.phone_number}`;

        dispatch('linkClick', {url: telephone, text: button.phone_number})
        window.open(telephone);
        return;
      }

      if (button.tab_switch) {
        state.rootComponent.$emit("switchToCommentsTab");
        return;
      }

      if (button.link) {
        dispatch('linkClick', {url: button.link, text: button.text})

        if (button.link_new_tab) {
          window.open(button.link, "_blank");
        } else {
          window.open(button.link, "_parent");
        }
        return;
      }

      if (button.download) {
        state.rootComponent.download();
        return;
      }

      if (!state.rootComponent.isExpand) {
        state.rootComponent.expandChat();
      }

      if (msg.type === "fp-rich") {
        const index = state.rootComponent.messageList.indexOf(msg);
        state.rootComponent.messageList.splice(index, 1);

        if (state.rootComponent.messageList[index - 1].type === "author") {
          state.rootComponent.messageList.splice(index - 1, 1);
        }
      } else if (msg.data.clear_after_interaction) {
        state.rootComponent.messageList[state.rootComponent.messageList.indexOf(msg)].data.buttons = [];
      }

      dispatch('sendMessage', {
        type: "button_response",
        author: "me",
        callback_id: button.callback_id,
        data: {
          text: button.text,
          value: button.value
        }
      })
    },
    formSubmit({dispatch, state}, payload) {
      const {data, msg} = payload
      window.parent.postMessage(
        { dataLayerEvent: { event: 'form_submitted', form_id: msg.data.callback_id, form_text: msg.data.text }},
        state.referrerUrl
      );
      state.rootComponent.messageList[state.rootComponent.messageList.indexOf(msg)].type = "text";

      const responseData = {};
      const newMessageText = [];

      msg.data.elements.forEach(element => {
        responseData[element.name] = data[element.name].value;

        if (element.display) {
          newMessageText.push(
            `${element.display}: ${data[element.name].value}`
          );
        } else {
          newMessageText.push(data[element.name].value);
        }
      });

      responseData.text = newMessageText.join("\n");

      dispatch('sendMessage', {
        type: "form_response",
        author: "me",
        callback_id: msg.data.callback_id,
        data: responseData
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
