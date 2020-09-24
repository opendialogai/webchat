import axios from "axios";
import isSkip from "../../mixins/isSkip";

const moment = require("moment-timezone");

let WebChatMode = function(store, chatService) {
  this.name = "webchat";
  this.dataLayerEventName = 'message_sent_to_chatbot';
  this.$store = store
  this.chatService = chatService
};

WebChatMode.prototype.sendRequest = function(message) {
    if (
      message.type === "chat_open" ||
      message.type === "url_click" ||
      message.type === "trigger" ||
      message.type === "form_response" ||
      message.data.text.length > 0
    ) {
      // Make a copy of the message to send to the backend.
      // This is needed so that the author change will not affect this.messageList.
      const msgCopy = Object.assign({}, message);

      // Set the message author ID.
      msgCopy.author = msgCopy.user_id;

      const webchatMessage = {
        notification: "message",
        user_id: msgCopy.user_id,
        author: msgCopy.author,
        message_id: msgCopy.id,
        content: msgCopy
      };

      // Need to add error handling here
      return axios.post("/incoming/webchat", webchatMessage);
    } else {
      return new Promise((resolve, reject) => resolve(null));
    }
};

function sendMessageReceivedEvent (message) {
  let referrerUrl = '';
  if (window.self !== window.top) {
    referrerUrl = document.referrer.match(/^.+:\/\/[^\/]+/)[0];
  } else {
    referrerUrl = document.location.origin;
  }

  window.parent.postMessage(
    { dataLayerEvent: { event: 'message_received_from_chatbot', message: message.intent } },
    referrerUrl
  )
}

WebChatMode.prototype.sendResponseSuccess = function(response, sentMessage, webChatComponent) {


  return new Promise((resolve, reject) => {
    if (response.data instanceof Array) {
      let index = 0;
      let totalMessages = response.data.filter(msg => msg !== false).length;
      let typingMessage;
      let clearCtaText = true;

      response.data.forEach((message, i) => {
        const messageIndex = index;

        if (message && message.type === "cta") {
          if (clearCtaText) {
            this.$store.commit('clearCtaText')
            clearCtaText = false;
          }
          if (this.$store.state.ctaText.length === 2) {
            this.$store.commit('spliceCtaText', {start: 0, count: 1})
          }
          this.$store.commit('updateCtaText', message.data.text)

          totalMessages -= 1;
        } else if (message.type === 'meta') {
          this.$store.commit('setMessageMetaData', message.data.elements);

          totalMessages -= 1;
        } else if (!message) {
          this.$store.commit('toggleContentEditable', true)
        } else {
          if (messageIndex === 0) {
            if (
              (this.$store.state.settings.general.useBotName || this.$store.state.settings.general.useBotAvatar) &&
              !message.data.hideavatar
            ) {
              const authorMsg = this.chatService.newAuthorMessage(message, this.$store.state.modeData, this.$store.state.settings.general, this.$store.state.userName);
              this.$store.commit('updateMessageList', authorMsg)
            }

            typingMessage = {
              author: "them",
              type: "typing",
              mode: this.$store.state.modeData.mode,
              data: {
                animate: this.$store.state.settings.general.messageAnimation
              }
            };
            this.$store.commit('updateMessageList', typingMessage)
          }

          setTimeout(() => {
            webChatComponent.$emit("newMessage", message);

            /* eslint-disable no-param-reassign */
            message.data.animate = this.$store.state.settings.general.messageAnimation;

            if (
              messageIndex === 0 ||
              !this.$store.state.settings.general.hideTypingIndicatorOnInternalMessages
            ) {
              typingMessage.type = message.type;
              typingMessage.data = message.data;

              if (messageIndex === 0 && totalMessages > 1) {
                typingMessage.data.first = true;
              }

              if (messageIndex > 0 && messageIndex < totalMessages - 1) {
                typingMessage.data.middle = true;
              }

              if (messageIndex > 0 && messageIndex === totalMessages - 1) {
                typingMessage.data.last = true;
              }

              webChatComponent.$root.$emit("scroll-down-message-list");
              setTimeout(() => {
                webChatComponent.$root.$emit("scroll-down-message-list");
              }, 50);
            } else {
              if (messageIndex > 0 && messageIndex === totalMessages - 1) {
                /* eslint-disable no-param-reassign */
                message.data.lastInternal = true;
              }

              message.mode = this.$store.state.modeData.mode;
              this.$store.commit('updateMessageList', message)
            }

            if (message.data) {
              this.$store.commit('toggleContentEditable', !message.data.disable_text)
            }

            if (message.type === "fp-form") {
              this.$store.dispatch('fpFormMessage', message)
            }

            if (message.type === "fp-rich") {
              this.$store.dispatch('fpRichMessage', message)
            }

            if (message.type !== "fp-form" && message.type !== "fp-rich") {
              this.$store.commit('toggleFPForm', false)
              this.$store.commit('toggleFPRich', false)
              this.$store.commit('toggleShowMessages', true)
            }

            if (!webChatComponent.hideTypingIndicatorOnInternalMessages) {
              if (messageIndex < totalMessages - 1 && isSkip(message) !== 'skip') {
                webChatComponent.$nextTick(() => {
                  webChatComponent.$nextTick(() => {
                    typingMessage = {
                      author: "them",
                      type: "typing",
                      mode: this.$store.state.modeData.mode,
                      data: {
                        animate: this.$store.state.settings.general.messageAnimation
                      }
                    };
                    this.$store.commit('updateMessageList', typingMessage)
                  });
                });
              }
            }

            if (messageIndex >= totalMessages -1) {
              resolve()
            }
          }, (messageIndex + 1) * this.$store.state.settings.general.messageDelay);

          sendMessageReceivedEvent(message);

          index += 1;
        }
      });

    } else if (response.data) {
      const message = response.data;

      if (sentMessage.type === "chat_open") {
        if (message && message.data) {
          let typingMessage;

          if (
            (this.$store.state.settings.general.useBotName || this.$store.state.settings.general.useBotAvatar) &&
            !message.data.hideavatar
          ) {
            const authorMsg = this.chatService.newAuthorMessage(message, this.$store.state.modeData, this.$store.state.settings.general, this.$store.state.userName);
            this.$store.commit('updateMessageList', authorMsg)
          }

          typingMessage = {
            author: "them",
            type: "typing",
            mode: this.$store.state.modeData.mode,
            data: {
              animate: this.$store.state.settings.general.messageAnimation
            }
          };
          this.$store.commit('updateMessageList', typingMessage)

          setTimeout(() => {
            webChatComponent.$emit("newMessage", message);

            message.data.animate = this.$store.state.settings.general.messageAnimation;

            typingMessage.type = message.type;
            typingMessage.data = message.data;

            if (message.type === "fp-form") {
              this.$store.dispatch('fpFormMessage', message)
            }

            if (message.type === "fp-rich") {
              this.$store.dispatch('fpRichMessage', message)
            }

            this.$store.commit('toggleContentEditable', !message.data.disable_text)
            

            resolve()
          }, this.$store.state.settings.general.messageDelay);
        } else {
          // If we don't get data about whether to disable the editor, turn it on
          this.$store.commit('toggleContentEditable', true)
        }
      } else {
        let typingMessage;

        if (message.data) {
          if (
            (this.$store.state.settings.general.useBotName || this.$store.state.settings.general.useBotAvatar) &&
            !message.data.hideavatar
          ) {
            const authorMsg = this.chatService.newAuthorMessage(message, this.$store.state.modeData, this.$store.state.settings.general, this.$store.state.userName);
            this.$store.commit('updateMessageList', authorMsg)
          }

          typingMessage = {
            author: "them",
            type: "typing",
            mode: this.$store.state.modeData.mode,
            data: {
              animate: this.$store.state.settings.general.messageAnimation
            }
          };
          this.$store.commit('updateMessageList', typingMessage)
        }

        setTimeout(() => {
          // Only add a message to the list if it is a message object
          if (typeof message === "object" && message !== null) {
            webChatComponent.$emit("newMessage", message);

            message.data.animate = this.$store.state.settings.general.messageAnimation;

            typingMessage.type = message.type;
            typingMessage.data = message.data;

            webChatComponent.$root.$emit("scroll-down-message-list");
            setTimeout(() => {
              webChatComponent.$root.$emit("scroll-down-message-list");
            }, 50);
          }

          if (message.data) {
            this.$store.commit('toggleContentEditable', !message.data.disable_text)
          }

          if (message.type === "fp-form") {
            this.$store.dispatch('fpFormMessage', message)
          }

          if (message.type === "fp-rich") {
            this.$store.dispatch('fpRichMessage', message)
          }

          if (message.type !== "fp-form" && message.type !== "fp-rich") {
            this.$store.commit('toggleFPForm', false)
            this.$store.commit('toggleFPRich', false)
            this.$store.commit('toggleShowMessages', true)
          }

          if (message.type === "longtext") {

            if (message.data.placeholder) {
              this.$store.commit('updatePlaceholder', response.placeholder)
            }

            this.$store.commit('toggleLongTextInput', {
              buttonText: message.data.submit_text,
              headerText: message.data.text,
              maxChars: message.data.character_limit,
              iniitalText: message.data.initial_text,
              confirmationMessage: message.data.confirmation_text,
              visible: true
            })

            this.$store.commit('toggleShowMessages', false)
          }

          resolve()
        }, this.$store.state.settings.general.messageDelay);
        sendMessageReceivedEvent(message);
      }
    }
  })
};

WebChatMode.prototype.sendResponseError = function(error, sentMessage, webChatComponent) {
  const message = {
    type: "text",
    author: "them",
    data: {
      date: moment()
        .tz("UTC")
        .format("ddd D MMM"),
      time: moment()
        .tz("UTC")
        .format("hh:mm:ss A"),
      text: "We're sorry, that didn't work, please try again"
    }
  };

  if (this.$store.state.settings.general.useBotName || this.$store.state.settings.general.useBotAvatar) {
    const authorMsg = this.chatService.newAuthorMessage(message, this.$store.state.modeData, this.$store.state.settings.general, this.$store.state.userName);
    this.$store.commit('updateMessageList', authorMsg)
  }

  let typingMessage = {
    author: "them",
    type: "typing",
    mode: this.$store.state.modeData.mode,
    data: {
      animate: this.$store.state.settings.general.messageAnimation
    }
  };

  this.$store.commit('updateMessageList', typingMessage)

  setTimeout(() => {
    typingMessage.type = message.type;
    typingMessage.data = message.data;

    webChatComponent.$root.$emit("scroll-down-message-list");
  }, this.$store.state.settings.general.messageDelay);
};

WebChatMode.prototype.sendTypingRequest = function(message) {
  return Promise.resolve();
};

WebChatMode.prototype.sendTypingResponseSuccess = function(response) {
  return Promise.resolve();
};

WebChatMode.prototype.sendTypingResponseError = function(error) {
  return Promise.resolve();
};

WebChatMode.prototype.initialiseChat = function() {
  this.$store.commit('toggleContentEditable', true)
  return Promise.resolve();
};

WebChatMode.prototype.destroyChat = function() {
  return Promise.resolve();
};

WebChatMode.prototype.postDestroyChat = function(oldModeData) {
  return Promise.resolve();
};

WebChatMode.prototype.setModeInstance = function(number) {
  this.modeInstance = number;
  return Promise.resolve();
};

WebChatMode.prototype.getDataLayerEventName = function () {
  return this.dataLayerEventName;
};

export default WebChatMode;
