import axios from "axios";

let WebChatMode = function() {
  this.name = "webchat";
};

WebChatMode.prototype.sendRequest = function(message) {
    if (
      message.type === "chat_open" ||
      message.type === "url_click" ||
      message.type === "trigger" ||
      message.type === "form_response" ||
      message.type === "webchat_list_response" ||
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

WebChatMode.prototype.sendResponseSuccess = function(response, webChatComponent) {
  if (response === null) {
    return;
  }

  if (response.data instanceof Array) {
    response.data.forEach((message, i) => {
      if (!message) {
        webChatComponent.contentEditable = true;
      } else {
        if (i === 0) {
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

        setTimeout(() => {
          webChatComponent.$emit("newMessage", message);

          /* eslint-disable no-param-reassign */
          message.data.animate = webChatComponent.messageAnimation;

          if (
            i === 0 ||
            !webChatComponent.hideTypingIndicatorOnInternalMessages
          ) {
            const lastMessage = webChatComponent.messageList[
            webChatComponent.messageList.length - 1
              ];
            lastMessage.type = message.type;
            lastMessage.data = message.data;

            if (i === 0 && response.data.length > 1) {
              lastMessage.data.first = true;
            }

            if (i > 0 && i < response.data.length - 1) {
              lastMessage.data.middle = true;
            }

            if (i > 0 && i === response.data.length - 1) {
              lastMessage.data.last = true;
            }

            webChatComponent.$root.$emit("scroll-down-message-list");
            setTimeout(() => {
              webChatComponent.$root.$emit("scroll-down-message-list");
            }, 50);
          } else {
            if (i > 0 && i === response.data.length - 1) {
              /* eslint-disable no-param-reassign */
              message.data.lastInternal = true;
            }

            message.mode = webChatComponent.modeData.mode;
            webChatComponent.messageList.push(message);
          }

          if (message.data) {
            webChatComponent.contentEditable = !message.data.disable_text;
          }

          if (!webChatComponent.hideTypingIndicatorOnInternalMessages) {
            if (i < response.data.length - 1) {
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
                });
              });
            }
          }
        }, (i + 1) * webChatComponent.messageDelay);

        window.parent.postMessage(
          { dataLayerEvent: "message_received_from_chatbot" },
          "*"
        );
      }
    });
  } else if (response.data) {
    const message = response.data;

    if (newMsg.type === "chat_open") {
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

        setTimeout(() => {
          const lastMessage = webChatComponent.messageList[
          webChatComponent.messageList.length - 1
            ];

          webChatComponent.$emit("newMessage", message);

          message.data.animate = webChatComponent.messageAnimation;

          lastMessage.type = message.type;
          lastMessage.data = message.data;

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
          data: {
            animate: webChatComponent.messageAnimation
          }
        });
      }
      setTimeout(() => {
        // Only add a message to the list if it is a message object
        if (typeof message === "object" && message !== null) {
          const lastMessage = webChatComponent.messageList[
          webChatComponent.messageList.length - 1
            ];

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

      window.parent.postMessage(
        { dataLayerEvent: "message_received_from_chatbot" },
        "*"
      );
    }
  }
};

WebChatMode.prototype.sendResponseError = function(error, webChatComponent) {
  setTimeout(() => {
    const message = {
      type: "text",
      author: "them",
      data: {
        date: moment()
          .tz("UTC")
          .format("ddd D MMM"),
        time: moment()
          .tz("UTC")
          .format("hh:mm A"),
        text: "We're sorry, that didn't work, please try again"
      }
    };

    const lastMessage = webChatComponent.messageList[webChatComponent.messageList.length - 1];

    if (webChatComponent.useBotName || webChatComponent.useBotAvatar) {
      const authorMsg = webChatComponent.newAuthorMessage(message);
      webChatComponent.messageList.push(authorMsg);
    }

    lastMessage.type = message.type;
    lastMessage.data = message.data;

    webChatComponent.$root.$emit("scroll-down-message-list");
  }, webChatComponent.messageDelay);
};

WebChatMode.prototype.initialiseChat = function(webChatComponent) {
  return new Promise((resolve, reject) => resolve());
};

export default WebChatMode;
