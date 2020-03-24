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
        :close="toggleChatOpen"
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
        :colors="colours"
        :placeholder="placeholder"
        :confirmation-message="confirmationMessage"
        :initial-text="initialText"
        :mode-data="modeData"
        :fp-form-input-message="fpFormInputMessage"
        :fp-rich-input-message="fpRichInputMessage"
        :cta-text="ctaText"
        @vbc-user-input-focus="userInputFocus"
        @vbc-user-input-blur="userInputBlur"
        @vbc-user-typing="userTyping"
        @setChatMode="setChatMode"
      />
      <div class="close-chat">
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
    colours: {
      type: Object,
      required: true
    },
    conversiveUrl: String,
    conversiveSiteCode: String,
    hideDatetimeMessage: Boolean,
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
    userUuid: {
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
      showLongTextInput: false,
      showFullPageFormInput: false,
      showFullPageRichInput: false,
      showMessages: true,
      showTypingIndicator: false,
      users: [],
      userName: "",
      chatbotAvatar: this.chatbotAvatarPath,
      uuid: this.userUuid,
      chatMode: "webchat"
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
    modeData(newValue, oldValue) {
      if (newValue.mode !== oldValue.mode) {
        if (oldValue.mode === "custom") {
          this.destroyCustomMode();
        } else if (oldValue.mode === "webchat") {
          this.destroyWebchatMode();
        }
      }

      chatService.setModeData(newValue);

      if (oldValue.mode === "custom" && newValue.mode === "webchat") {
        // Convert the Hand-to-Human message to a text message
        let filteredMessageList = this.messageList.filter(
          message =>
            message.mode === "webchat" && message.type === "hand-to-human"
        );
        let handToHumanMessage =
          filteredMessageList[filteredMessageList.length - 1];

        if (handToHumanMessage) {
          handToHumanMessage.type = "text";
          handToHumanMessage.data.text = handToHumanMessage.data.elements.text;
        }

        this.sendMessage({
          type: "trigger",
          author: "me",
          callback_id: newValue.options.callback_id,
          data: {}
        });
      }

      if (newValue.mode === "custom") {
        if (oldValue.mode !== "custom") {
          this.setupCustomMode();
        }
      } else if (newValue.mode === "webchat") {
        this.setupWebchatMode();
      }
    }
  },
  created() {
    this.referrerUrl = document.referrer.match(/^.+:\/\/[^\/]+/)[0];

    this.id = `webchat-${this.$uuid.v4()}`;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has("mobile")) {
      if (urlParams.get("mobile")) {
        this.isMobile = true;
        this.showExpandButton = false;
      }
    }

    this.initChat();
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
      if (this.userTimezone !== "utc") {
        const date = moment
          .tz(
            `${message.data.date} ${message.data.time}`,
            "ddd D MMM hh:mm A",
            "utc"
          )
          .tz(this.userTimezone);

        /* eslint-disable no-param-reassign */
        message.data.date = date.format("ddd D MMM");
        message.data.time = date.format("hh:mm A");
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
        .format("hh:mm A");

      newMsg.user_id = this.user.email ? this.user.email : this.uuid;
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
        window.parent.postMessage(
          { dataLayerEvent: "message_sent_to_chatbot" },
          this.referrerUrl
        );
      }
      if (newMsg.type === "button_response") {
        window.parent.postMessage(
          { dataLayerEvent: {user_clicked_button_in_chatbot: newMsg.data.text} },
          this.referrerUrl
        );
      }

      chatService.sendRequest(newMsg, this).then(
        response => chatService.sendResponseSuccess(response, newMsg, this),
        () => chatService.sendResponseError(null, newMsg, this)
      );
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
        user_id: this.uuid, // UUID of the webchat end user.
        author: this.uuid, // UUID of the webchat end user.
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
      if (msg.data.external) {
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      if (button.phone_number) {
        const telephone = `tel:${button.phone_number}`;

        this.onLinkClick(telephone);
        window.open(telephone);
        return;
      }

      if (button.tab_switch) {
        this.$emit("switchToCommentsTab");
        return;
      }

      if (button.link) {
        this.onLinkClick(button.link);

        if (button.link_new_tab) {
          window.open(button.link, "_blank");
        } else {
          window.open(button.link, "_parent");
        }
        return;
      }

      if (!this.isExpand) {
        this.$emit("expandChat");
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
    onListButtonClick(callback) {
      this.sendMessage({
        type: "webchat_list_response",
        author: "me",
        callback_id: callback,
        data: {}
      });
    },
    onLinkClick(url) {
      window.parent.postMessage(
          { dataLayerEvent: {url_clicked: url} },
          this.referrerUrl
      );
      this.sendMessage({
        type: "url_click",
        author: this.uuid,
        data: {
          url
        }
      });
    },
    onFormButtonClick(data, msg) {
      window.parent.postMessage(
          { dataLayerEvent: {form_submitted: msg.data.callback_id} },
          this.referrerUrl
      );
      this.messageList[this.messageList.indexOf(msg)].type = "text";
      const responseData = {};
      responseData.text = "Form submitted";

      msg.data.elements.forEach(element => {
        responseData[element.name] = data[element.name].value;
      });

      this.sendMessage({
        type: "form_response",
        author: "me",
        callback_id: msg.data.callback_id,
        data: responseData
      });
    },
    onFormCancelClick(msg) {
      window.parent.postMessage(
        { dataLayerEvent: {form_cancelled: msg.data.callback_id} },
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
      this.sendMessage({
        type: "trigger",
        author: "me",
        callback_id: this.restartButtonCallback,
        data: {}
      });
    },
    expandChat() {
      this.$emit("expandChat");
    },
    toggleChatOpen() {
      this.ctaText = [];

      if (this.isOpen) {
        this.closeChatButtonReverseAnimate = true;
          window.parent.postMessage(
            { dataLayerEvent: "chat_closed" },
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
            { dataLayerEvent: "chat_opened" },
            this.referrerUrl
          );
      }
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

      this.sendChatOpenMessage();
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

      const userId = this.user && this.user.email ? this.user.email : this.uuid;

      const ignoreTypes = "chat_open,trigger,cta";

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

            // Convert to the right message type for display
            if (currentMessage.type === "hand-to-human") {
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
    setChatMode(data) {
      this.$emit("setChatMode", data);
    },
    destroyCustomMode() {
      chatService.destroyChat(this);

      let modeDataInSession = this.getModeDataInSession();
      modeDataInSession.modeInstance++;
      this.setChatMode(modeDataInSession);
    },
    destroyWebchatMode() {
      chatService.destroyChat(this);
    },
    async setupCustomMode() {
      this.contentEditable = true;
      this.chatbotAvatar = "/vendor/webchat/images/agent.svg";

      await chatService.initialiseChat(this);
    },
    async setupWebchatMode() {
      this.contentEditable = false;
      this.chatbotAvatar = this.chatbotAvatarPath;

      await chatService.initialiseChat(this);
    },
    userTyping(text) {
      chatService
        .sendTypingRequest(text, this)
        .then(response => chatService.sendTypingResponseSuccess(response, this))
        .catch(() => chatService.sendTypingResponseError(null, this));
    }
  }
};
</script>

<style scoped>
/* var inherited from OpenDialogChat component???? */
/* .loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - var(--header-height));
} */

.web-chat {
  height: 100vh;
}
</style>
