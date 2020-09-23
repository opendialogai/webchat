<template>
  <div
    :id="id"
    class="web-chat"
    :class="[
      isMobile ? 'mobile' : '',
      canCloseChat ? '' : 'no-close',
      useBotAvatar ? 'show-bot-avatar' : '',
      useHumanAvatar ? 'show-human-avatar' : ''
    ]"
  >
    <template v-if="loading">
      <div class="loading">
        <div class="loading-message">Loading chat history</div>

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
        :close="onClose"
        :expand="expandChat"
        :is-open="isOpen"
        :is-expand="isExpand"
        :on-message-was-sent="onMessageWasSent"
        :on-restart-button-click="onRestartButtonClick"
        :on-download="download"
        :show-expand-button="false"
        :show-typing-indicator="showTypingIndicator"
        :show-full-page-form-input="showFullPageFormInput"
        :show-full-page-rich-input="showFullPageRichInput"
        :always-scroll-to-bottom="true"
        :fp-form-input-message="fpFormInputMessage"
        :fp-rich-input-message="fpRichInputMessage"
        :cta-text="ctaText"
        @vbc-user-input-focus="userInputFocus"
        @vbc-user-input-blur="userInputBlur"
        @vbc-user-typing="userTyping"
      />
      <div v-if="showCloseChatButton" class="close-chat">
        <div
          class="close-chat__button"
          :class="{
            closeChatButtonAnimate: isOpen,
            closeChatButtonReverseAnimate: closeChatButtonReverseAnimate,
          }"
          @click="toggleChatOpen"
        >
          <img src="/images/close-btn.svg" class="close-chat__img" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import axios from "axios";
import session from "../mixins/SessionStorageMixin";
import newAuthorMessage from '../mixins/authorMessage';
import {mapState} from 'vuex'

  const moment = require("moment-timezone");

export default {
  name: "WebChat",
  props: {
    agentProfile: {
      type: Object,
      required: true
    },
    canCloseChat: Boolean,
    isExpand: Boolean,
    isMobile: Boolean,
    showHistory: Boolean,
    numberOfMessages: {
      type: Number,
      required: true
    },
    showExpandButton: Boolean,
    userTimezone: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      closeChatButtonReverseAnimate: false,
      ctaText: [],
      fpFormInputMessage: {},
      fpRichInputMessage: {},
      headerHeight: 0,
      id: "",
      loading: true,
      showCloseChatButton: false,
      showFullPageFormInput: false,
      showFullPageRichInput: false,
      showTypingIndicator: false,
      users: [],
      chatMode: "webchat",
      canRestart: true,
    };
  },
  watch: {
    ctaText() {
      if (this.ctaText.length) {
        setTimeout(() => {
          this.ctaText = [];
        }, 5500);
      }
    },
    messageList() {
      let spliceIndex = 1;
      let previousMessage = this.messageList[this.messageList.length - 2];
      const lastMessage = !this.currentMessage.data ? this.messageList[this.messageList.length - 1] : this.currentMessage;

      if (previousMessage && previousMessage.type === "author") {
        spliceIndex = 2;
        previousMessage = this.messageList[this.messageList.length - 3];
      }

      if (!this.hideDatetimeMessage) {
        if (!previousMessage || previousMessage.type !== "datetime") {
          if (
            !previousMessage ||
            previousMessage.data.date !== lastMessage.data.date
          ) {
            const payload = {
              start: this.messageList.length - spliceIndex,
              count: 0,
              item: {
                type: "datetime",
                datetime: lastMessage.data.date
              }
            }
            this.$store.commit('spliceMessageList', payload)
          }
        }
      }

      if (this.newMessageIcon && !this.loading && !this.isOpen) {
        this.agentProfile.imageUrl = this.newMessageIcon;
      }

      if (!lastMessage.data.hidetime && !lastMessage.read) {
        this.dateTimezoneFormat(lastMessage);
      }
    },
    loading(isLoading) {
      if (!isLoading) {
        setTimeout(() => {
          const header = document.querySelector(`#${this.id} .header`);
          if (header) {
            this.headerHeight = header.offsetHeight;
          }
        }, 1000);
      }
    },
    async modeData(newValue, oldValue) {
      await this.chatService.modeDataUpdated(newValue, oldValue, this);
    }
  },
  created() {
    this.$store.commit('initChatservice')
    if (window.self !== window.top) {
      this.showCloseChatButton = true;
    }

    this.id = `webchat-${this.$uuid.v4()}`;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("mobile")) {
      if (urlParams.get("mobile")) {
        this.isMobile = true;
        this.showExpandButton = false;
      }
    }

    this.$store.commit('updateRootComponent', this)

    this.$store.commit('setUserName', `${this.user.first_name} ${this.user.last_name}`)
    this.fetchMessages();

    window.addEventListener("message", event => {
      if (event.data) {
        if (
          event.data.triggerConversation &&
          event.data.triggerConversation.callback_id
        ) {
          const data = {};
          if (event.data.triggerConversation.value) {
            data.value = event.data.triggerConversation.value;
          }

          this.sendMessage({
            type: "trigger",
            author: "me",
            callback_id: event.data.triggerConversation.callback_id,
            data
          });
        }

        if (event.data.expandChat) {
          if (!this.isExpand || !this.isOpen) {
            this.expandChat();
          }
        }

        if (event.data.collapseChat) {
          if (this.isExpand && this.isOpen) {
            this.expandChat();
          }
        }
      }
    });
  },
  computed: {
    ...mapState({
      isOpen: state => state.isOpen,
      chatService: state => state.chatService,
      messageList: state => state.messageList,
      currentMessage: state => state.currentMessage,
      referrerUrl: state => state.referrerUrl,
      modeData: state => state.modeData,
      user: state => state.user,
      uuid: state => state.uuid,
      userName: state => state.userName,
      useHumanName: state => state.settings.general.useHumanName,
      useHumanAvatar: state => state.settings.general.useHumanAvatar,
      useBotName: state => state.settings.general.useBotName,
      useBotAvatar: state => state.settings.general.useBotAvatar,
      parentUrl: state => state.settings.parentUrl || '',
      newMessageIcon: state => state.settings.newMessageIcon,
      callbackMap: state => state.settings.general.callbackMap || [],
      restartButtonCallback: state => state.settings.general.restartButtonCallback || '',
      hideDatetimeMessage: state => state.settings.general.hideDatetimeMessage,
      openIntent: state => state.settings.openIntent || ''
    })
  },
  mounted() {
    console.log(this.openIntent)
  },
  methods: {
    dateTimezoneFormat(message) {
      if (this.userTimezone !== "utc") {
        const date = moment
          .tz(
            `${message.data.date} ${message.data.time}`,
            "ddd D MMM hh:mm:ss A",
            "utc"
          )
          .tz(this.userTimezone);

        /* eslint-disable no-param-reassign */
        message.data.date = date.format("ddd D MMM");
        message.data.time = date.format("hh:mm:ss A");
        /* eslint-enable no-param-reassign */
      }
    },
    sendMessage(msg) {
      this.$store.dispatch('sendMessage', msg)
    },
    userInputFocus() {
      if (!this.isExpand && !this.isMobile) {
        this.$emit("expandChat");
      }
    },
    userInputBlur() {},
    sendReadReceipt(newMessage) {
      // Create the message object to send to our endpoint.
      const pusherMsg = {
        notification: "read_receipt", // Is mapped to the broadcast event type.
        user_id: this.$store.state.uuid, // UUID of the webchat end user.
        author: this.$store.state.uuid, // UUID of the webchat end user.
        message_id: newMessage.id // Unique id for this message.
      };

      axios.post("/incoming/webchat", pusherMsg).then(() => {});
    },
    onMessageWasSent(msg) {
      const msgToSend = msg;
      if (
        this.messageList.length &&
        this.messageList[this.messageList.length - 1].type === "longtext"
      ) {
        msgToSend.type = "longtext_response";
        msgToSend.callback_id = this.messageList[
          this.messageList.length - 1
        ].data.callback_id;
      }

      this.$store.dispatch('sendMessage', msgToSend)
      this.$store.commit('updatePlaceholder', 'Write a reply')
    },
    openChat() {},
    download() {
      window.parent.postMessage(
        { dataLayerEvent: { event: 'download_chat_transcript'} },
        this.referrerUrl
      );
      const userId = this.user && this.user.email ? this.user.email : this.uuid;
      axios({
        method: 'get',
        url: `/user/${userId}/history/file`,
        responseType: 'arraybuffer'
      })
      .then(response => {
        this.forceFileDownload(response);
      }).catch(() => console.log('Error occurred downloading chat history'))
    },
    forceFileDownload(response){
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      let fileName = 'Chatbot User History.txt';
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename=(.+)/);
        if (fileNameMatch.length === 2) {
          fileName = fileNameMatch[1].replace(/(^"|"$)/g, '');
        }
      }
      link.setAttribute('download',fileName);
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 1000);
    },
    onRestartButtonClick() {
      if (this.canRestart) {
        this.canRestart = false;
        this.$store.dispatch('sendMessage', {
          type: 'trigger',
          author: 'me',
          callback_id: this.restartButtonCallback,
          data: {}
        }).then(() => {
          setTimeout(() => {
            this.canRestart = true;
          }, 5000);
        });
      }
    },
    expandChat() {
      this.$emit("expandChat");
    },
    onClose() {
      if (this.showCloseChatButton) {
        if (!this.closeChatButtonReverseAnimate) {
          this.toggleChatOpen();
        }
      }
    },
    toggleChatOpen() {
      this.ctaText = [];

      if (this.isOpen) {
        this.closeChatButtonReverseAnimate = true;
          window.parent.postMessage(
            { dataLayerEvent: "chatbot_minimized" },
            this.referrerUrl
          );
        setTimeout(() => {
          this.closeChatButtonReverseAnimate = false;
          this.$emit("toggleChatOpen", this.headerHeight);
        }, 300);
      } else {
        this.$emit("toggleChatOpen", this.headerHeight);
          window.parent.postMessage(
            { dataLayerEvent: "chatbot_maximized" },
            this.referrerUrl
          );
      }
    },
    workoutCallback() {
      // Default
      let callbackId = "WELCOME";
      const urlParams = new URLSearchParams(window.location.search);

      // If the url has a callback id present, use that
      if (urlParams.has("callback_id")) {
          callbackId = urlParams.get("callback_id");
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
      return new RegExp(
        `^${string
          .split(/\*+/)
          .map(this.regExpEscape)
          .join(".*")}$`
      );
    },
    regExpEscape(string) {
      return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&");
    },
    async fetchMessages() {
      if (this.showHistory) {
        await this.getChatHistory();
      } else {
        this.loading = false;
        this.checkHideChat();
      }

      const isOpen = this.isOpen;

      if (!session.isCustomModeInSession()) {
        this.sendChatOpenMessage();
      }
    },
    sendChatOpenMessage() {
      const callback = this.openIntent;

      if (callback) {
        const message = {
          type: "chat_open",
          callback_id: callback,
          data: {
            value: this.parentUrl
          }
        };

        this.$store.dispatch('sendMessage', message)
      }
    },
    getChatHistory() {
      this.loading = true;

      const userId = this.user && this.user.email ? this.user.email : this.uuid;

      const ignoreTypes = "chat_open,trigger,cta,text_external";

      return axios
        .get(
          `/user/${userId}/history?limit=${this.numberOfMessages}&ignore=${ignoreTypes}`
        )
        .then(response => {
          const total = response.data.length;
          response.data.reverse().forEach((message, i, messages) => {
            // Ignore 'url_click' messages.
            if (message.type === "url_click") {
              return;
            }

            // Ignore 'trigger' messages.
            if (message.type === "trigger") {
              return;
            }

            // Ignore 'fp-rich' messages.
            if (message.type === "fp-rich" && (i+1 !== total || this.openIntent)) {
              return;
            }

            // Ignore 'fp-form' messages.
            if (message.type === "fp-form" && (i+1 !== total || this.openIntent)) {
              return;
            }

            const currentMessage = message;

            // Sets the author to 'me' for messages from the current user
            if (currentMessage.author === userId) {
              currentMessage.author = "me";
            } else {
              currentMessage.author = "them";
            }

            // Convert to the right message type for display (hand-to-human included for backwards compatibility)
            if (currentMessage.type === "hand-to-system" || currentMessage.type === "hand-to-human") {
              currentMessage.data.text = currentMessage.data.elements.text;
              currentMessage.type = "text";
            }

            if (
              i === 0 &&
              currentMessage.data &&
              currentMessage.data.internal
            ) {
              delete currentMessage.data.internal;
            }

            if (!this.hideDatetimeMessage) {
              if (
                (i === 0 && currentMessage.data) ||
                this.messageList[this.messageList.length - 1].data.date !==
                  currentMessage.data.date
              ) {
                this.$store.commit('updateMessageList', {
                  type: "datetime",
                  datetime: currentMessage.data.date
                })
              }
            }

            if (i < messages.length - 1) {
              // Convert to the right message type for display
              if (
                currentMessage.type === "button" ||
                currentMessage.type === "long_text" ||
                currentMessage.type === "form"
              ) {
                currentMessage.type = "text";
              }

              this.dateTimezoneFormat(currentMessage);
            }

            if (
              (currentMessage.author === "me" &&
                (this.useHumanName || this.useHumanAvatar)) ||
              (currentMessage.author === "them" &&
                !currentMessage.data.hideavatar &&
                !currentMessage.data.internal &&
                (this.useBotName || this.useBotAvatar))
            ) {
              const authorMsg = newAuthorMessage(currentMessage, this.modeData, this.$store.state.settings.general, this.userName);

              this.$store.commit('updateMessageList', authorMsg)
            }

            if (i === messages.length - 1) {
              this.$store.commit('toggleContentEditable', !currentMessage.data.disable_text)

              if (currentMessage.type === "fp-form") {
                this.showFullPageFormInputMessage(currentMessage);
              }

              if (currentMessage.type === "fp-rich") {
                this.showFullPageRichInputMessage(currentMessage);
              }
            }

            currentMessage.mode = this.modeData.mode;
            this.$store.commit('updateMessageList', currentMessage)
          });

          this.loading = false;
          this.checkHideChat();
        });
    },
    checkHideChat() {
      const urlParams = new URLSearchParams(window.location.search);

      if (urlParams.has("hide")) {
        if (urlParams.get("hide")) {
          this.$nextTick(() => {
            this.$emit("toggleChatOpen");
          });
        }
      }
    },
    showFullPageFormInputMessage(message) {
      this.fpFormInputMessage = message;

      this.$store.commit('toggleShowMessages', false)
      this.showFullPageRichInput = false;
      this.showFullPageFormInput = true;
    },
    showFullPageRichInputMessage(message) {
      this.fpRichInputMessage = message;

      this.$store.commit('toggleShowMessages', false)
      this.showFullPageFormInput = false;
      this.showFullPageRichInput = true;
    },
    userTyping(text) {
      this.chatService
        .sendTypingRequest(text, this)
        .then(response => this.chatService.sendTypingResponseSuccess(response, this))
        .catch(() => this.chatService.sendTypingResponseError(null, this));
    }
  }
};
</script>

<style lang="scss">
@import '../../sass/0-globals/_animations.scss';

.web-chat {
  height: calc(var(--initial-vh, 1vh) * 100);

  .close-chat {
    display: flex;
    justify-content: center;
    margin-top: -30px;
    margin-bottom: 10px;
  }

  .close-chat__button {
    position: relative;
    z-index: 1;
    width: 70px;
    height: 70px;
    background-color: #313133;
    border-radius: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #000000;
    }
  }

  .close-chat__img {
    width: 31px;
    height: 30px;
    object-fit: contain;
    transition: transform 0.5s;
  }

  .confirmCloseChat {
    opacity: 0;
    text-align: right;
  }

  .confirmCloseChatButtons {
    display: inline-block;
  }

  .confirmCloseChatAnimate {
    animation: confirmCloseChatAnim 0.6s forwards;
  }

  .closeChatButtonAnimate {
    animation: close-chat-spin 0.5s forwards;
  }

  .closeChatButtonReverseAnimate {
    animation: reverse-close-chat-spin 0.5s forwards;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* var inherited from OpenDialogChat component. */
  //   height: calc(100vh - var(--header-height));
  }

  .loading-message {
    font-size: 18px;
    color: #b6b5ba;
    margin-bottom: 17px;
  }

  .mobile .loading-message {
    margin-bottom: 5px;
  }

  .loading-indicator span {
    display: inline-block;
    background-color: #b6b5ba;
    width: 11px;
    height: 11px;
    border-radius: 100%;
    margin-right: 4px;
    animation: bob 2s infinite;
  }
}
</style>
