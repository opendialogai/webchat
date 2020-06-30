import axios from "axios";

const moment = require("moment-timezone");

let WebChatMode = function() {
  this.name = "webchat";
};

WebChatMode.prototype.sendRequest = function(message, webChatComponent) {
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

function sendConversationStartedEvent (agentName) {
  window.parent.postMessage(
    { dataLayerEvent: { event: 'conversation_started_chat_bot', agent_name: agentName } },
    document.referrer.match(/^.+:\/\/[^\/]+/)[0]
  )
}

function sendMessageReceivedEvent (message, webChatComponent) {
  if (typeof webChatComponent.$store.state.messageMetaData.dialogflowId !== 'undefined'
    && (message.intent === 'intent.avaya.agent1StartResponse'
      || message.intent === 'intent.avaya.agent2StartResponse')) {
    sendConversationStartedEvent(webChatComponent.$store.state.messageMetaData.dialogflowId);
  }

  window.parent.postMessage(
    { dataLayerEvent: { event: 'message_received_from_chatbot', message: message.intent } },
    document.referrer.match(/^.+:\/\/[^\/]+/)[0]
  )
}

WebChatMode.prototype.sendResponseSuccess = function(response, sentMessage, webChatComponent) {
  if (response.data instanceof Array) {
    let index = 0;
    let totalMessages = response.data.length;
    let lastMessageIndex = webChatComponent.messageList.length - 1;
    let clearCtaText = true;

    response.data.forEach((message, i) => {
      const messageIndex = index;

      if (message && message.type === "cta") {
        if (clearCtaText) {
          webChatComponent.ctaText = [];
          clearCtaText = false;
        }
        if (webChatComponent.ctaText.length === 2) {
          webChatComponent.ctaText.splice(0, 1);
        }
        webChatComponent.ctaText.push(message.data.text);

        totalMessages -= 1;
      } else if (message.type === 'meta') {
        webChatComponent.updateMessageMetaData(message);

        totalMessages -= 1;
      } else if (!message) {
        webChatComponent.contentEditable = true;
      } else {
        if (messageIndex === 0) {
          if (
            (webChatComponent.useBotName || webChatComponent.useBotAvatar) &&
            !message.data.hideavatar
          ) {
            const authorMsg = webChatComponent.newAuthorMessage(message);

            webChatComponent.messageList.push(authorMsg);
          }

          webChatComponent.messageList.push({
            author: "them",
            type: "typing",
            mode: webChatComponent.modeData.mode,
            data: {
              animate: webChatComponent.messageAnimation
            }
          });
        }

        lastMessageIndex = webChatComponent.messageList.length - 1;

        setTimeout(() => {
          webChatComponent.$emit("newMessage", message);

          /* eslint-disable no-param-reassign */
          message.data.animate = webChatComponent.messageAnimation;

          if (
            messageIndex === 0 ||
            !webChatComponent.hideTypingIndicatorOnInternalMessages
          ) {
            const lastMessage = webChatComponent.messageList[lastMessageIndex];
            lastMessage.type = message.type;
            lastMessage.data = message.data;

            if (messageIndex === 0 && totalMessages > 1) {
              lastMessage.data.first = true;
            }

            if (messageIndex > 0 && messageIndex < totalMessages - 1) {
              lastMessage.data.middle = true;
            }

            if (messageIndex > 0 && messageIndex === totalMessages - 1) {
              lastMessage.data.last = true;
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

            message.mode = webChatComponent.modeData.mode;
            webChatComponent.messageList.push(message);
          }

          if (message.data) {
            webChatComponent.contentEditable = !message.data.disable_text;
          }

          if (message.type === "fp-form") {
            webChatComponent.showFullPageFormInputMessage(message);
          }

          if (message.type === "fp-rich") {
            webChatComponent.showFullPageRichInputMessage(message);
          }

          if (message.type !== "fp-form" && message.type !== "fp-rich") {
            webChatComponent.showFullPageFormInput = false;
            webChatComponent.showFullPageRichInput = false;
            webChatComponent.showMessages = true;
          }

          if (!webChatComponent.hideTypingIndicatorOnInternalMessages) {
            if (messageIndex < totalMessages - 1) {
              webChatComponent.$nextTick(() => {
                webChatComponent.$nextTick(() => {
                  webChatComponent.messageList.push({
                    author: "them",
                    type: "typing",
                    mode: webChatComponent.modeData.mode,
                    data: {
                      animate: webChatComponent.messageAnimation
                    }
                  });

                  lastMessageIndex = webChatComponent.messageList.length - 1;
                });
              });
            }
          }
        }, (messageIndex + 1) * webChatComponent.messageDelay);

        sendMessageReceivedEvent(message, webChatComponent);

        index += 1;
      }
    });
  } else if (response.data) {
    const message = response.data;

    if (sentMessage.type === "chat_open") {
      if (message && message.data) {
        if (
          (webChatComponent.useBotName || webChatComponent.useBotAvatar) &&
          !message.data.hideavatar
        ) {
          const authorMsg = webChatComponent.newAuthorMessage(message);

          webChatComponent.messageList.push(authorMsg);
        }

        webChatComponent.messageList.push({
          author: "them",
          type: "typing",
          mode: webChatComponent.modeData.mode,
          data: {
            animate: webChatComponent.messageAnimation
          }
        });

        const lastMessageIndex = webChatComponent.messageList.length - 1;

        setTimeout(() => {
          const lastMessage = webChatComponent.messageList[lastMessageIndex];

          webChatComponent.$emit("newMessage", message);

          message.data.animate = webChatComponent.messageAnimation;

          lastMessage.type = message.type;
          lastMessage.data = message.data;

          if (message.type === "fp-form") {
            webChatComponent.showFullPageFormInputMessage(message);
          }

          if (message.type === "fp-rich") {
            webChatComponent.showFullPageRichInputMessage(message);
          }

          webChatComponent.contentEditable = !message.data.disable_text;
        }, webChatComponent.messageDelay);
      } else {
        // If we don't get data about whether to disable the editor, turn it on
        webChatComponent.contentEditable = true;
      }
    } else {
      if (message.data) {
        if (
          (webChatComponent.useBotName || webChatComponent.useBotAvatar) &&
          !message.data.hideavatar
        ) {
          const authorMsg = webChatComponent.newAuthorMessage(message);

          webChatComponent.messageList.push(authorMsg);
        }

        webChatComponent.messageList.push({
          author: "them",
          type: "typing",
          mode: webChatComponent.modeData.mode,
          data: {
            animate: webChatComponent.messageAnimation
          }
        });
      }

      const lastMessageIndex = webChatComponent.messageList.length - 1;

      setTimeout(() => {
        // Only add a message to the list if it is a message object
        if (typeof message === "object" && message !== null) {
          const lastMessage = webChatComponent.messageList[lastMessageIndex];

          webChatComponent.$emit("newMessage", message);

          message.data.animate = webChatComponent.messageAnimation;

          lastMessage.type = message.type;
          lastMessage.data = message.data;

          webChatComponent.$root.$emit("scroll-down-message-list");
          setTimeout(() => {
            webChatComponent.$root.$emit("scroll-down-message-list");
          }, 50);
        }

        if (message.data) {
          webChatComponent.contentEditable = !message.data.disable_text;
        }

        if (message.type === "fp-form") {
          webChatComponent.showFullPageFormInputMessage(message);
        }

        if (message.type === "fp-rich") {
          webChatComponent.showFullPageRichInputMessage(message);
        }

        if (message.type !== "fp-form" && message.type !== "fp-rich") {
          webChatComponent.showFullPageFormInput = false;
          webChatComponent.showFullPageRichInput = false;
          webChatComponent.showMessages = true;
        }

        if (message.type === "longtext") {
          if (message.data.character_limit) {
            webChatComponent.maxInputCharacters = message.data.character_limit;
          }

          if (message.data.submit_text) {
            webChatComponent.buttonText = message.data.submit_text;
          }

          if (message.data.text) {
            webChatComponent.headerText = message.data.text;
          }

          if (message.data.placeholder) {
            webChatComponent.placeholder = message.data.placeholder;
          }

          if (message.data.initial_text) {
            webChatComponent.initialText = message.data.initial_text;
          } else {
            webChatComponent.initialText = null;
          }

          if (message.data.confirmation_text) {
            webChatComponent.confirmationMessage = message.data.confirmation_text;
          } else {
            webChatComponent.confirmationMessage = null;
          }

          webChatComponent.showLongTextInput = true;
          webChatComponent.showMessages = false;
        }
      }, webChatComponent.messageDelay);
      sendMessageReceivedEvent(message, webChatComponent);
    }
  }
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

  if (webChatComponent.useBotName || webChatComponent.useBotAvatar) {
    const authorMsg = webChatComponent.newAuthorMessage(message);
    webChatComponent.messageList.push(authorMsg);
  }

  webChatComponent.messageList.push({
    author: "them",
    type: "typing",
    mode: webChatComponent.modeData.mode,
    data: {
      animate: webChatComponent.messageAnimation
    }
  });

  setTimeout(() => {
    const lastMessage = webChatComponent.messageList[webChatComponent.messageList.length - 1];

    lastMessage.type = message.type;
    lastMessage.data = message.data;

    webChatComponent.$root.$emit("scroll-down-message-list");
  }, webChatComponent.messageDelay);
};

WebChatMode.prototype.sendTypingRequest = function(message, webChatComponent) {
  return new Promise((resolve, reject) => resolve());
};

WebChatMode.prototype.sendTypingResponseSuccess = function(response, webChatComponent) {
  return new Promise((resolve, reject) => resolve());
};

WebChatMode.prototype.sendTypingResponseError = function(error, webChatComponent) {
  return new Promise((resolve, reject) => resolve());
};

WebChatMode.prototype.initialiseChat = function(webChatComponent) {
  return new Promise((resolve, reject) => resolve());
};

WebChatMode.prototype.destroyChat = function(webChatComponent) {};

WebChatMode.prototype.setModeInstance = function(number) {
  this.modeInstance = number;
};

export default WebChatMode;
