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
        :on-full-page-form-input-submit="onFullPageFormInputSubmit"
        :on-full-page-form-input-cancel="onFullPageFormInputCancel"
        :on-full-page-rich-input-submit="onFullPageRichInputSubmit"
        :message-list="messageList"
        :on-button-click="onButtonClick"
        :on-form-button-click="onFormButtonClick"
        :on-list-button-click="onListButtonClick"
        :on-link-click="onLinkClick"
        :on-restart-button-click="onRestartButtonClick"
        :on-download="download"
        :content-editable="contentEditable"
        :show-expand-button="false"
        :show-restart-button="showRestartButton"
        :show-typing-indicator="showTypingIndicator"
        :show-long-text-input="showLongTextInput"
        :show-full-page-form-input="showFullPageFormInput"
        :show-full-page-rich-input="showFullPageRichInput"
        :show-messages="showMessages"
        :max-input-characters="maxInputCharacters"
        :button-text="buttonText"
        :always-scroll-to-bottom="true"
        :placeholder="placeholder"
        :confirmation-message="confirmationMessage"
        :initial-text="initialText"
        :mode-data="modeData"
        :fp-form-input-message="fpFormInputMessage"
        :fp-rich-input-message="fpRichInputMessage"
        :cta-text="ctaText"
        :hide-message-time="hideMessageTime"
        @vbc-user-input-focus="userInputFocus"
        @vbc-user-input-blur="userInputBlur"
        @vbc-user-typing="userTyping"
        @setChatMode="setChatMode"
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
  import chatService from "../services/ChatService";
  import SessionStorageMixin from "../mixins/SessionStorageMixin";

  const moment = require("moment-timezone");

export default {
  name: "WebChat",
  props: {
    agentProfile: {
      type: Object,
      required: true
    },
    callbackMap: {
      type: Array,
      required: true
    },
    canCloseChat: Boolean,
    chatbotAvatarPath: {
      type: String,
      default: ""
    },
    chatbotName: {
      type: String,
      default: ""
    },
    chatIsOpen: Boolean,
    closedIntent: {
      type: String,
      default: ""
    },
    hideDatetimeMessage: Boolean,
    hideMessageTime: Boolean,
    hideTypingIndicatorOnInternalMessages: Boolean,
    isExpand: Boolean,
    isMobile: Boolean,
    messageAnimation: Boolean,
    showHistory: Boolean,
    numberOfMessages: {
      type: Number,
      required: true
    },
    messageDelay: {
      type: Number,
      required: true
    },
    newMessageIcon: {
      type: String,
      required: true
    },
    openIntent: {
      type: String,
      default: ""
    },
    parentUrl: {
      type: String,
      required: true
    },
    restartButtonCallback: {
      type: String,
      default: ""
    },
    showRestartButton: Boolean,
    showExpandButton: Boolean,
    useBotAvatar: Boolean,
    useHumanAvatar: Boolean,
    useBotName: Boolean,
    useHumanName: Boolean,
    user: {
      type: Object,
      required: true
    },
    userInfo: {
      type: Object,
      required: true
    },
    userTimezone: {
      type: String,
      required: true
    },
    userExternalId: {
      type: String,
      required: true
    },
    modeData: {
      type: Object,
      required: true
    }
  },
  mixins: [SessionStorageMixin],
  data() {
    return {
      buttonText: "Submit",
      closeChatButtonReverseAnimate: false,
      confirmationMessage: null,
      contentEditable: false,
      ctaText: [],
      fpFormInputMessage: {},
      fpRichInputMessage: {},
      headerHeight: 0,
      headerText: "",
      id: "",
      initialText: null,
      isOpen: this.chatIsOpen,
      loading: true,
      maxInputCharacters: 0,
      messageList: [],
      placeholder: "Enter your message",
      referrerUrl: '',
      showCloseChatButton: false,
      showLongTextInput: false,
      showFullPageFormInput: false,
      showFullPageRichInput: false,
      showMessages: true,
      showTypingIndicator: false,
      users: [],
      userName: "",
      chatbotAvatar: this.chatbotAvatarPath,
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
      const lastMessage = this.messageList[this.messageList.length - 1];

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
            this.messageList.splice(this.messageList.length - spliceIndex, 0, {
              type: "datetime",
              datetime: lastMessage.data.date
            });
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
      await chatService.modeDataUpdated(newValue, oldValue, this);
    }
  },
  created() {
    if (window.self !== window.top) {
      this.showCloseChatButton = true;
      this.referrerUrl = document.referrer.match(/^.+:\/\/[^\/]+/)[0];
    } else {
      this.referrerUrl = document.location.origin;
    }

    this.id = `webchat-${this.$uuid.v4()}`;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("mobile")) {
      if (urlParams.get("mobile")) {
        this.isMobile = true;
        this.showExpandButton = false;
      }
    }

    this.userName = `${this.user.first_name} ${this.user.last_name}`;
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
      const newMsg = msg;

      newMsg.mode = this.modeData.mode;
      newMsg.modeInstance = this.modeData.modeInstance;

      newMsg.data.date = moment()
        .tz("UTC")
        .format("ddd D MMM");
      newMsg.data.time = moment()
        .tz("UTC")
        .format("hh:mm:ss A");

      newMsg.user_id = this.user.email ? this.user.email : this.$store.state.uuid;
      newMsg.user = this.user;

      if (
        !newMsg.user.name &&
        newMsg.user.first_name &&
        newMsg.user.last_name
      ) {
        newMsg.user.name = `${newMsg.user.first_name} ${newMsg.user.last_name}`;
      }

      // Give the message an id.
      newMsg.id = this.$uuid.v4();

      if (newMsg.type === "chat_open") {
        if (this.userInfo) {
          Object.keys(this.userInfo).forEach(key => {
            newMsg.user[key] = this.userInfo[key];
          });
        }
      }

      if (newMsg.data && newMsg.data.text && newMsg.data.text.length > 0) {
        if (this.useHumanName || this.useHumanAvatar) {
          const authorMsg = this.newAuthorMessage(newMsg);

          this.messageList.push(authorMsg);
        }

        this.buttonText = "Submit";
        this.headerText = "";
        this.maxInputCharacters = 0;
        this.showLongTextInput = false;
        this.messageList.push(newMsg);
      }

      if (newMsg.type === "text" && newMsg.data.text.length > 0) {
        let event = chatService.getDataLayerEventName();
        window.parent.postMessage(
          { dataLayerEvent: event },
          this.referrerUrl
        );
      }
      if (newMsg.type === "button_response") {
        const events = ['user_clicked_button_in_chatbot', 'message_sent_to_chatbot']
        events.forEach((eventName) => {
          window.parent.postMessage(
            { dataLayerEvent: { event: eventName, label: newMsg.data.text} },
            this.referrerUrl
          );
        })
      }

      this.$store.dispatch('sendMessage', {sentMsg: newMsg, webChat: this})
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

      this.sendMessage(msgToSend);
      this.placeholder = "Write a reply";
    },
    openChat() {},
    onFullPageFormInputSubmit(data) {
      const msg = this.messageList[this.messageList.length - 1];
      this.onFormButtonClick(data, msg);
    },
    onFullPageFormInputCancel() {
      const msg = this.messageList[this.messageList.length - 1];
      this.onFormCancelClick(msg);
    },
    onFullPageRichInputSubmit(button) {
      const msg = this.messageList[this.messageList.length - 1];
      this.onButtonClick(button, msg);
    },
    async onButtonClick(button, msg) {
      if (!button) {
        if (msg.link) {
          window.open(msg.link, "_blank");
        } else {
          this.sendMessage({
            type: "button_response",
            author: "me",
            callback_id: msg.callback,
            data: {
              text: msg.callback_text ? msg.callback_text : msg.callback_value,
              value: msg.callback_value
            }
          });
        }
        return;
      }

      if (msg.data.external) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (button.phone_number) {
        const telephone = `tel:${button.phone_number}`;

        this.onLinkClick(telephone, button.phone_number);
        window.open(telephone);
        return;
      }

      if (button.tab_switch) {
        this.$emit("switchToCommentsTab");
        return;
      }

      if (button.link) {
        this.onLinkClick(button.link, button.text);

        if (button.link_new_tab) {
          window.open(button.link, "_blank");
        } else {
          window.open(button.link, "_parent");
        }
        return;
      }

      if (button.download) {
        this.download();
        return;
      }

      if (!this.isExpand) {
        this.expandChat();
      }

      if (msg.type === "fp-rich") {
        const index = this.messageList.indexOf(msg);
        this.messageList.splice(index, 1);

        if (this.messageList[index - 1].type === "author") {
          this.messageList.splice(index - 1, 1);
        }
      } else if (msg.data.clear_after_interaction) {
        this.messageList[this.messageList.indexOf(msg)].data.buttons = [];
      }

      this.sendMessage({
        type: "button_response",
        author: "me",
        callback_id: button.callback_id,
        data: {
          text: button.text,
          value: button.value
        }
      });
    },
    download() {
      window.parent.postMessage(
        { dataLayerEvent: { event: 'download_chat_transcript'} },
        this.referrerUrl
      );
      const userId = this.user && this.user.email ? this.user.email : this.$store.state.uuid;
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
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onListButtonClick(button, msg) {
      this.onButtonClick(button, msg);
    },
    onLinkClick(url, text) {
      window.parent.postMessage(
          { dataLayerEvent: { event: 'url_clicked', url: url, text: text } },
          this.referrerUrl
      );
      this.sendMessage({
        type: "url_click",
        author: this.$store.state.uuid,
        data: {
          url
        }
      });
    },
    onFormButtonClick(data, msg) {
      window.parent.postMessage(
          { dataLayerEvent: { event: 'form_submitted', form_id: msg.data.callback_id, form_text: msg.data.text }},
          this.referrerUrl
      );
      this.messageList[this.messageList.indexOf(msg)].type = "text";

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

      this.sendMessage({
        type: "form_response",
        author: "me",
        callback_id: msg.data.callback_id,
        data: responseData
      });
    },
    onFormCancelClick(msg) {
      window.parent.postMessage(
        { dataLayerEvent: { event: 'form_cancelled', 'callback_id': msg.data.cancel_callback }},
        this.referrerUrl
      );
      this.messageList[this.messageList.indexOf(msg)].type = "text";
      this.sendMessage({
        type: "form_response",
        author: "me",
        callback_id: msg.data.cancel_callback,
        data:{text: msg.data.cancel_text}
      });
    },
    onRestartButtonClick() {
      if (this.canRestart) {
        this.canRestart = false;
        this.sendMessage({
          type: 'trigger',
          author: 'me',
          callback_id: this.restartButtonCallback,
          data: {},
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
          this.isOpen = !this.isOpen;
          this.$emit("toggleChatOpen", this.headerHeight);
        }, 300);
      } else {
        this.isOpen = !this.isOpen;
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

      if (!this.isCustomModeInSession()) {
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

        this.sendMessage(message);
      }
    },
    getChatHistory() {
      this.loading = true;

      const userId = this.user && this.user.email ? this.user.email : this.$store.state.uuid;

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
                this.messageList.push({
                  type: "datetime",
                  datetime: currentMessage.data.date
                });
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
              const authorMsg = this.newAuthorMessage(currentMessage);

              this.messageList.push(authorMsg);
            }

            if (i === messages.length - 1) {
              this.contentEditable = !currentMessage.data.disable_text;

              if (currentMessage.type === "fp-form") {
                this.showFullPageFormInputMessage(currentMessage);
              }

              if (currentMessage.type === "fp-rich") {
                this.showFullPageRichInputMessage(currentMessage);
              }
            }

            currentMessage.mode = this.modeData.mode;
            this.messageList.push(currentMessage);
          });

          this.loading = false;
          this.checkHideChat();
        });
    },
    newAuthorMessage(message) {
      if (message.author === "them") {
        const authorMsg = {
          type: "author",
          author: "them",
          mode: this.modeData.mode,
          modeInstance: this.modeData.modeInstance,
          data: {
            author: "them",
            animate: this.messageAnimation,
            text: this.useBotName ? this.chatbotName : "",
            date: message.data.date,
            time: message.data.time
          }
        };

        if (this.useBotAvatar) {
          authorMsg.data.avatar = `<img class="avatar" src="${this.chatbotAvatar}" />`;
        }

        return authorMsg;
      }

      const authorMsg = {
        type: "author",
        author: "me",
        mode: this.modeData.mode,
        modeInstance: this.modeData.modeInstance,
        data: {
          animate: this.messageAnimation,
          author: "me",
          text: this.useHumanName ? this.userName : "",
          date: message.data.date,
          time: message.data.time
        }
      };

      if (this.useHumanAvatar) {
        const avatarName = this.userName
          .split(" ")
          .map(n => n[0])
          .join("")
          .toUpperCase();
        authorMsg.data.avatar = `<span class="avatar">${avatarName}</span>`;
      }

      return authorMsg;
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

      this.showMessages = false;
      this.showFullPageRichInput = false;
      this.showFullPageFormInput = true;
    },
    showFullPageRichInputMessage(message) {
      this.fpRichInputMessage = message;

      this.showMessages = false;
      this.showFullPageFormInput = false;
      this.showFullPageRichInput = true;
    },
    setChatMode(data) {
      this.$emit("setChatMode", data);
    },
    userTyping(text) {
      chatService
        .sendTypingRequest(text, this)
        .then(response => chatService.sendTypingResponseSuccess(response, this))
        .catch(() => chatService.sendTypingResponseError(null, this));
    },
    updateMessageMetaData(message) {
      this.$store.commit('setMessageMetaData', message.data.elements);
    },
  }
};
</script>

<style lang="scss">
@import '../../sass/0-globals/_animations.scss';

.web-chat {
  height: 100vh;

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
