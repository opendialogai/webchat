<template>
  <div
    :id="id"
    :class="[
      isMobile ? 'mobile' : '',
      canCloseChat ? '' : 'no-close',
      useBotAvatar ? 'show-bot-avatar' : '',
      useHumanAvatar ? 'show-human-avatar' : ''
    ]"
  >
    <template v-if="loading">
      <div class="loading">
        <div class="loading-message">
          Loading chat history
        </div>

        <div class="loading-indicator">
          <span />
          <span />
          <span />
        </div>
      </div>
    </template>
    <template v-else>
      <beautiful-chat
        :agent-profile="agentProfile"
        :close="toggleChatOpen"
        :expand="expandChat"
        :is-open="isOpen"
        :is-expand="isExpand"
        :on-message-was-sent="onMessageWasSent"
        :message-list="messageList"
        :open="openChat"
        :on-button-click="onButtonClick"
        :on-form-button-click="onFormButtonClick"
        :on-list-button-click="onListButtonClick"
        :on-link-click="onLinkClick"
        :content-editable="contentEditable"
        :show-emoji="false"
        :show-file="false"
        :show-expand-button="false"
        :show-typing-indicator="showTypingIndicator"
        :show-long-text-input="showLongTextInput"
        :show-messages="showMessages"
        :max-input-characters="maxInputCharacters"
        :button-text="buttonText"
        :always-scroll-to-bottom="true"
        :colors="colours"
        :placeholder="placeholder"
        :confirmation-message="confirmationMessage"
        :initial-text="initialText"
        @vbc-user-input-focus="userInputFocus"
        @vbc-user-input-blur="userInputBlur"
      />
    </template>
  </div>
</template>

<script>
import axios from 'axios';

const moment = require('moment-timezone');

export default {
  name: 'WebChat',
  props: {
    agentProfile: {
      type: Object,
      required: true,
    },
    callbackMap: {
      type: Array,
      required: true,
    },
    canCloseChat: Boolean,
    chatbotAvatarPath: {
      type: String,
      default: '',
    },
    chatbotName: {
      type: String,
      default: '',
    },
    chatIsOpen: Boolean,
    colours: {
      type: Object,
      required: true,
    },
    isExpand: Boolean,
    isMobile: Boolean,
    showHistory: Boolean,
    numberOfMessages: {
      type: Number,
      required: true,
    },
    messageDelay: {
      type: Number,
      required: true,
    },
    newMessageIcon: {
      type: String,
      required: true,
    },
    parentUrl: {
      type: String,
      required: true,
    },
    showExpandButton: Boolean,
    useBotAvatar: Boolean,
    useHumanAvatar: Boolean,
    useBotName: Boolean,
    useHumanName: Boolean,
    user: {
      type: Object,
      required: true,
    },
    userInfo: {
      type: Object,
      required: true,
    },
    userTimezone: {
      type: String,
      required: true,
    },
    userExternalId: {
      type: String,
      required: true,
    },
    userUuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      buttonText: 'Submit',
      confirmationMessage: null,
      contentEditable: false,
      headerHeight: 0,
      headerText: '',
      id: '',
      initialText: null,
      isOpen: this.chatIsOpen,
      loading: true,
      maxInputCharacters: 0,
      messageList: [],
      placeholder: 'Type a message',
      showLongTextInput: false,
      showMessages: true,
      showTypingIndicator: false,
      users: [],
      userName: '',
      uuid: this.userUuid,
    };
  },
  watch: {
    messageList() {
      let spliceIndex = 1;
      let previousMessage = this.messageList[this.messageList.length - 2];
      const lastMessage = this.messageList[this.messageList.length - 1];

      if (previousMessage && previousMessage.type === 'author') {
        spliceIndex = 2;
        previousMessage = this.messageList[this.messageList.length - 3];
      }

      if (!previousMessage || previousMessage.type !== 'datetime') {
        if (!previousMessage || previousMessage.data.date !== lastMessage.data.date) {
          this.messageList.splice(this.messageList.length - spliceIndex, 0, {
            type: 'datetime',
            datetime: lastMessage.data.date,
          });
        }
      }

      if (this.newMessageIcon && !this.loading && !this.isOpen) {
        this.agentProfile.imageUrl = this.newMessageIcon;
      }

      if (!lastMessage.data.hidetime && !lastMessage.read) {
        this.dateTimezoneFormat(lastMessage);
      }
    },
    isOpen(isOpen) {
      if (isOpen) {
        this.agentProfile.imageUrl = null;
      }
    },
    loading(isLoading) {
      if (!isLoading) {
        setTimeout(() => {
          const header = document.querySelector(`#${this.id} .sc-header`);
          if (header) {
            this.headerHeight = header.offsetHeight;
          }
        }, 1000);
      }
    },
  },
  created() {
    this.id = `webchat-${this.$uuid.v4()}`;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('mobile')) {
      if (urlParams.get('mobile')) {
        this.isMobile = true;
        this.showExpandButton = false;
      }
    }

    this.initChat();
    this.userName = `${this.user.first_name} ${this.user.last_name}`;
    this.fetchMessages();

    window.addEventListener('message', (event) => {
      if (event.data) {
        if (event.data.triggerConversation && event.data.triggerConversation.callback_id) {
          const data = {};
          if (event.data.triggerConversation.value) {
            data.value = event.data.triggerConversation.value;
          }

          this.sendMessage({
            type: 'trigger',
            author: 'me',
            callback_id: event.data.triggerConversation.callback_id,
            data,
          });
        }

        if (event.data.expandChat) {
          if (!this.isExpand || !this.isOpen) {
            this.expandChat(true);
          }
        }

        if (event.data.collapseChat) {
          if (this.isExpand) {
            this.expandChat();
          }
        }
      }
    });
  },
  methods: {
    dateTimezoneFormat(message) {
      if (this.userTimezone !== 'utc') {
        const date = moment.tz(`${message.data.date} ${message.data.time}`, 'ddd D MMM hh:mm A', 'utc').tz(this.userTimezone);

        /* eslint-disable no-param-reassign */
        message.data.date = date.format('ddd D MMM');
        message.data.time = date.format('hh:mm A');
        /* eslint-enable no-param-reassign */
      }
    },
    sendMessage(msg) {
      const newMsg = msg;
      newMsg.data.date = moment().tz('UTC').format('ddd D MMM');
      newMsg.data.time = moment().tz('UTC').format('hh:mm A');

      newMsg.user_id = (this.user.email) ? this.user.email : this.uuid;
      newMsg.user = this.user;

      if (!newMsg.user.name && newMsg.user.first_name && newMsg.user.last_name) {
        newMsg.user.name = `${newMsg.user.first_name} ${newMsg.user.last_name}`;
      }

      // Give the message an id.
      newMsg.id = this.$uuid.v4();

      if (newMsg.type === 'chat_open' && this.userInfo) {
        Object.keys(this.userInfo).forEach((key) => {
          newMsg.user[key] = this.userInfo[key];
        });
      }

      if (newMsg.data && newMsg.data.text && newMsg.data.text.length > 0) {
        if (this.useHumanName) {
          const authorMsg = this.newAuthorMessage(newMsg);

          this.messageList.push(authorMsg);
        }

        this.buttonText = 'Submit';
        this.headerText = '';
        this.maxInputCharacters = 0;
        this.showLongTextInput = false;
        this.showMessages = true;
        this.messageList.push(newMsg);
      }

      if (newMsg.type === 'text' && newMsg.data.text.length > 0) {
        window.parent.postMessage({ dataLayerEvent: 'message_sent_to_chatbot' }, '*');
      }
      if (newMsg.type === 'button_response') {
        window.parent.postMessage({ dataLayerEvent: 'user_clicked_button_in_chatbot' }, '*');
      }

      if (newMsg.type === 'chat_open' || newMsg.type === 'url_click' || newMsg.type === 'trigger' || newMsg.type === 'form_response' || newMsg.type === 'webchat_list_response' || newMsg.data.text.length > 0) {
        // Make a copy of the message to send to the backend.
        // This is needed so that the author change will not affect this.messageList.
        const msgCopy = Object.assign({}, newMsg);

        // Set the message author ID.
        msgCopy.author = msgCopy.user_id;
        const webchatMessage = {
          notification: 'message',
          user_id: msgCopy.user_id,
          author: msgCopy.author,
          message_id: msgCopy.id,
          content: msgCopy,
        };

        // Need to add error handling here
        axios.post('/incoming/webchat', webchatMessage).then(
          (response) => {
            if (response.data instanceof Array) {
              response.data.forEach((message, i) => {
                if (!message) {
                  this.contentEditable = true;
                } else {
                  this.showTypingIndicator = true;
                  setTimeout(() => {
                    this.showTypingIndicator = false;

                    if (i === 0) {
                      if (this.useBotName) {
                        const authorMsg = this.newAuthorMessage(message);

                        this.messageList.push(authorMsg);
                      }
                    }

                    this.$emit('newMessage', message);

                    this.messageList.push(message);

                    if (message.data) {
                      this.contentEditable = !message.data.disable_text;
                    }

                    if (i < (response.data.length - 1)) {
                      this.$nextTick(() => {
                        this.$nextTick(() => {
                          this.showTypingIndicator = true;
                        });
                      });
                    }
                  }, (i + 1) * this.messageDelay);

                  window.parent.postMessage({ dataLayerEvent: 'message_received_from_chatbot' }, '*');
                }
              });
            } else if (response.data) {
              if (newMsg.type === 'chat_open') {
                if (response.data && response.data.data) {
                  if (this.useBotName) {
                    const authorMsg = this.newAuthorMessage(response.data);

                    this.messageList.push(authorMsg);
                  }

                  this.$emit('newMessage', response.data);

                  this.messageList.push(response.data);
                  this.contentEditable = !response.data.data.disable_text;
                } else {
                  // If we don't get data about whether to disable the editor, turn it on
                  this.contentEditable = true;
                }
              } else {
                if (response.data.data) {
                  this.showTypingIndicator = true;
                }
                setTimeout(() => {
                  // Only add a message to the list if it is a message object
                  if (typeof response.data === 'object' && response.data !== null) {
                    if (this.useBotName) {
                      const authorMsg = this.newAuthorMessage(response.data);

                      this.messageList.push(authorMsg);
                    }

                    this.$emit('newMessage', response.data);

                    this.messageList.push(response.data);
                  }

                  if (response.data.data) {
                    this.contentEditable = !response.data.data.disable_text;
                  }

                  if (response.data.type === 'longtext') {
                    if (response.data.data.character_limit) {
                      this.maxInputCharacters = response.data.data.character_limit;
                    }

                    if (response.data.data.submit_text) {
                      this.buttonText = response.data.data.submit_text;
                    }

                    if (response.data.data.text) {
                      this.headerText = response.data.data.text;
                    }

                    if (response.data.data.placeholder) {
                      this.placeholder = response.data.data.placeholder;
                    }

                    if (response.data.data.initial_text) {
                      this.initialText = response.data.data.initial_text;
                    } else {
                      this.initialText = null;
                    }

                    if (response.data.data.confirmation_text) {
                      this.confirmationMessage = response.data.data.confirmation_text;
                    } else {
                      this.confirmationMessage = null;
                    }

                    this.showLongTextInput = true;
                    this.showMessages = false;
                  }
                  this.showTypingIndicator = false;
                }, this.messageDelay);

                window.parent.postMessage({ dataLayerEvent: 'message_received_from_chatbot' }, '*');
              }
            }
          },
          // Axios error handler.
          () => {
            setTimeout(() => {
              const message = {
                type: 'text',
                author: 'them',
                data: {
                  date: moment().tz('UTC').format('ddd D MMM'),
                  time: moment().tz('UTC').format('hh:mm A'),
                  text: "We're sorry, that didn't work, please try again",
                },
              };

              if (this.useBotName) {
                const authorMsg = this.newAuthorMessage(message);
                this.messageList.push(authorMsg);
              }

              this.messageList.push(message);

              this.showTypingIndicator = false;
            }, this.messageDelay);
          },
        );
      }
    },
    userInputFocus() {
      if (!this.isExpand && !this.isMobile) {
        this.$emit('expandChat');
      }
    },
    userInputBlur() {
    },
    sendReadReceipt(newMessage) {
      // Create the message object to send to our endpoint.
      const pusherMsg = {
        notification: 'read_receipt', // Is mapped to the broadcast event type.
        user_id: this.uuid, // UUID of the webchat end user.
        author: this.uuid, // UUID of the webchat end user.
        message_id: newMessage.id, // Unique id for this message.
      };

      axios.post('/incoming/webchat', pusherMsg).then(() => {});
    },
    onMessageWasSent(msg) {
      const msgToSend = msg;
      if (this.messageList.length && this.messageList[this.messageList.length - 1].type === 'longtext') {
        msgToSend.type = 'longtext_response';
        msgToSend.callback_id = this.messageList[this.messageList.length - 1].data.callback_id;
      }

      this.sendMessage(msgToSend);
      this.placeholder = 'Write a reply';
    },
    openChat() {
    },
    onButtonClick(button, msg) {
      if (button.tab_switch) {
        this.$emit('switchToCommentsTab');
        return;
      }

      if (button.link) {
        this.onLinkClick(button.link);

        if (button.link_new_tab) {
          window.open(button.link, '_blank');
        } else {
          window.open(button.link, '_parent');
        }
        return;
      }

      if (msg.data.clear_after_interaction) {
        this.messageList[this.messageList.indexOf(msg)].data.buttons = [];
      }

      if (!this.isExpand) {
        this.$emit('expandChat');
      }

      this.messageList[this.messageList.indexOf(msg)].data.buttons = [];

      this.sendMessage({
        type: 'button_response',
        author: 'me',
        callback_id: button.callback_id,
        data: {
          text: button.text,
          value: button.value,
        },
      });
    },
    onListButtonClick(callback) {
      this.sendMessage({
        type: 'webchat_list_response',
        author: 'me',
        callback_id: callback,
        data: {},
      });
    },
    onLinkClick(url) {
      this.sendMessage({
        type: 'url_click',
        author: this.uuid,
        data: {
          url,
        },
      });
    },
    onFormButtonClick(data, msg) {
      this.messageList[this.messageList.indexOf(msg)].type = 'text';

      const responseData = {};
      const newMessageText = [];

      msg.data.elements.forEach((element) => {
        responseData[element.name] = data[element.name].value;

        if (element.display) {
          newMessageText.push(`${element.display}: ${data[element.name].value}`);
        } else {
          newMessageText.push(data[element.name].value);
        }
      });

      responseData.text = newMessageText.join('\n');

      this.sendMessage({
        type: 'form_response',
        author: 'me',
        callback_id: msg.data.callback_id,
        data: responseData,
      });
    },
    expandChat() {
      this.$emit('expandChat');
    },
    toggleChatOpen() {
      this.isOpen = !this.isOpen;
      this.$emit('toggleChatOpen', this.headerHeight);
    },
    workoutCallback() {
      // Default
      let callbackId = 'WELCOME';
      const urlParams = new URLSearchParams(window.location.search);

      // If the url has a callback id present, use that
      if (urlParams.has('callback_id')) {
        callbackId = urlParams.get('callback_id');
      } else {
        // Check if the url matches one in the callback map
        this.callbackMap.forEach((url, idx) => {
          if (this.parentUrl.match(this.wildcardToRegExp(url))) {
            callbackId = this.callbackMap[idx];
          }
        });
      }
      return callbackId;
    },
    wildcardToRegExp(string) {
      return new RegExp(`^${string.split(/\*+/).map(this.regExpEscape).join('.*')}$`);
    },
    regExpEscape(string) {
      return string.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
    },
    async fetchMessages() {
      if (this.showHistory) {
        await this.getChatHistory();
      } else {
        this.loading = false;
        this.checkHideChat();
      }

      const message = {
        type: 'chat_open',
        callback_id: this.workoutCallback(),
        data: {},
      };

      this.sendMessage(message);
    },
    getChatHistory() {
      this.loading = true;

      const userId = (this.user && this.user.email) ? this.user.email : this.uuid;

      const ignoreTypes = 'chat_open,trigger';

      return axios.get(`/user/${userId}/history?limit=${this.numberOfMessages}&ignore=${ignoreTypes}`)
        .then((response) => {
          response.data.reverse().forEach((message, i, messages) => {
            // Ignore 'url_click' messages.
            if (message.type === 'url_click') {
              return;
            }

            // Ignore 'trigger' messages.
            if (message.type === 'trigger') {
              return;
            }

            const currentMessage = message;

            // Sets the author to 'me' for messages from the current user
            if (currentMessage.author === userId) {
              currentMessage.author = 'me';
            } else {
              currentMessage.author = 'them';
            }

            // Convert to the right message type for display
            if (currentMessage.type === 'button' || currentMessage.type === 'long_text' || currentMessage.type === 'form') {
              currentMessage.type = 'text';
            }

            if (i === 0 && currentMessage.data && currentMessage.data.internal) {
              delete currentMessage.data.internal;
            }

            if ((i === 0 && currentMessage.data)
              || this.messageList[this.messageList.length - 1].data.date
              !== currentMessage.data.date) {
              this.messageList.push({
                type: 'datetime',
                datetime: currentMessage.data.date,
              });
            }

            if (i < messages.length - 1) {
              this.dateTimezoneFormat(currentMessage);
            }

            if ((currentMessage.author === 'me' && this.useHumanName)
                || (currentMessage.author === 'them' && !currentMessage.data.internal && this.useBotName)) {
              const authorMsg = this.newAuthorMessage(currentMessage);

              this.messageList.push(authorMsg);
            }

            this.messageList.push(currentMessage);
          });

          this.loading = false;
          this.checkHideChat();
        });
    },
    newAuthorMessage(message) {
      if (message.author === 'them') {
        const authorMsg = {
          type: 'author',
          data: {
            text: this.chatbotName,
            date: message.data.date,
            time: message.data.time,
          },
        };

        if (this.useBotAvatar) {
          authorMsg.data.avatar = `<img class="avatar" src="${this.chatbotAvatarPath}" />`;
        }

        return authorMsg;
      }

      const authorMsg = {
        type: 'author',
        author: 'me',
        data: {
          author: 'me',
          text: this.userName,
          date: message.data.date,
          time: message.data.time,
        },
      };

      if (this.useHumanAvatar) {
        const avatarName = this.userName
          .split(' ').map(n => n[0]).join('').toUpperCase();
        authorMsg.data.avatar = `<span class="avatar">${avatarName}</span>`;
      }

      return authorMsg;
    },
    checkHideChat() {
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.has('hide')) {
        if (urlParams.get('hide')) {
          this.$nextTick(() => {
            this.$emit('toggleChatOpen');
          });
        }
      }
    },
    createUuid() {
      const uuid = this.$uuid.v4();
      this.uuid = uuid;
      sessionStorage.uuid = uuid;
    },
    initChat() {
      // The uuid might have already been set to the user's email address
      if (!this.uuid) {
        if (sessionStorage.uuid) {
          this.uuid = sessionStorage.uuid;
        } else {
          this.createUuid();
        }
      }
    },
  },
};

</script>

<style scoped>
    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        /* var inherited from OpenDialogChat component. */
        height: calc(100vh - var(--header-height));
    }

    .loading-message {
        font-size: 18px;
        color: #B6B5BA;
        margin-bottom: 17px;
    }

    .mobile .loading-message {
        margin-bottom: 5px;
    }

    .loading-indicator span {
        display: inline-block;
        background-color: #B6B5BA;
        width: 11px;
        height: 11px;
        border-radius: 100%;
        margin-right: 4px;
        animation: bob 2s infinite;
    }

    /* SAFARI GLITCH */
    .loading-indicator span:nth-child(1) {
        animation-delay: -1s;
    }

    .loading-indicator span:nth-child(2) {
        animation-delay: -0.85s;
    }

    .loading-indicator span:nth-child(3) {
        animation-delay: -0.7s;
    }

    @keyframes bob {
        10% {
            transform: translateY(-10px);
            background-color: #9E9DA2;
        }
        50% {
            transform: translateY(0);
            background-color: #B6B5BA;
        }
    }
</style>

<style>
    .comments-enabled .sc-header {
        display: none !important;
    }
</style>
