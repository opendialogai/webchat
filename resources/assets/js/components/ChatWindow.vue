<template>
  <div class="od-chat-window" :class="{opened: isOpen, closed: !isOpen, expanded: isExpand, fullscreen: fullScreen, iframe: iframe}">
    <Header
      v-if="!fullScreen"
      :teamName="agentProfile.teamName"
      :imageUrl="agentProfile.imageUrl"
      :onClose="onClose"
      :onExpand="onExpand"
      :showExpandButton="showExpandButton"
      :showRestartButton="showRestartButton"
      :showDownloadButton="showDownloadButton"
      :onRestartButtonClick="onRestartButtonClick"
      :onDownload="onDownload"
      :isOpen="isOpen"
      :ctaText="ctaText"
      :showFullPageFormInput="showFullPageFormInput"
      :showFullPageRichInput="showFullPageRichInput"
    />
    <ProgressBar v-show="$store.state.messageMetaData.progressPercent !== null" />
    <MessageList
      v-if="showMessages"
      :messages="messages"
      :imageUrl="agentProfile.imageUrl"
      :chatImageUrl="agentProfile.imageUrl"
      :showTypingIndicator="showTypingIndicator"
      :onButtonClick="onButtonClick"
      :onFormButtonClick="onFormButtonClick"
      :onListButtonClick="onListButtonClick"
      :onLinkClick="onLinkClick"
      :mode-data="modeData"
      :isOpen="isOpen"
      @setChatMode="setChatMode"
      :hideMessageTime="hideMessageTime"
    />

    <template v-if="showLongTextInput">
      <LongTextUserInput
        :headerText="headerText"
        :maxInputCharacters="maxInputCharacters"
        :buttonText="buttonText"
        :confirmationMessage="confirmationMessage"
        :onSubmit="onUserInputSubmit"
        :placeholder="placeholder"
        :initialText="initialText" />
    </template>
    <template v-else-if="showFullPageFormInput">
      <FullPageFormInput
        :message="fpFormInputMessage"
        :onSubmit="onFullPageFormInputSubmit"
        :onCancel="onFullPageFormInputCancel"
        :isOpen="isOpen" />
    </template>
    <template v-else-if="showFullPageRichInput">
      <FullPageRichInput
        :message="fpRichInputMessage"
        :onSubmit="onFullPageRichInputSubmit"
        :isOpen="isOpen" />
    </template>
    <template v-else>
      <UserInput
        :contentEditable="contentEditable"
        :showEmoji="showEmoji"
        :onSubmit="onUserInputSubmit"
        :onButtonClick="onButtonClick"
        :externalButtons="externalButtons"
        :animateExternalButtons="animateExternalButtons"
        :lastMessage="lastMessage"
        :showFile="showFile"
        :placeholder="placeholder"
        :mode-data="modeData"
        :showEndChatButton="showEndChatButton"
        @setChatMode="setChatMode" />
    </template>
  </div>
</template>

<script>
import Header from './layout/Header.vue'
import MessageList from './MessageList.vue'
import UserInput from './layout/UserInput.vue'
import FullPageFormInput from './messages/inputs/FullPageFormInput.vue'
import FullPageRichInput from './messages/inputs/FullPageRichInput.vue'
import LongTextUserInput from './messages/inputs/LongTextUserInput.vue'
import ProgressBar from './layout/ProgressBar';

export default {
  components: {
    Header,
    MessageList,
    UserInput,
    FullPageFormInput,
    FullPageRichInput,
    LongTextUserInput,
    ProgressBar
  },
  props: {
    contentEditable: {
      type: Boolean,
      default: true
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    fpFormInputMessage: {
      type: Object,
      default: () => {}
    },
    fpRichInputMessage: {
      type: Object,
      default: () => {}
    },
    showEmoji: {
      type: Boolean,
      default: false
    },
    showFile: {
      type: Boolean,
      default: false
    },
    showExpandButton: {
      type: Boolean,
      default: true
    },
    agentProfile: {
      type: Object,
      required: true
    },
    onUserInputSubmit: {
      type: Function,
      required: true
    },
    onFullPageFormInputSubmit: {
      type: Function,
      required: true
    },
    onFullPageFormInputCancel: {
        type: Function,
        required: true
    },
    onFullPageRichInputSubmit: {
      type: Function,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    },
    onExpand: {
      type: Function,
      required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    },
    onFormButtonClick: {
      type: Function,
      required: true
    },
    onListButtonClick: {
      type: Function,
      required: true
    },
    onLinkClick: {
      type: Function,
      required: true
    },
    onRestartButtonClick: {
      type: Function,
      required: true
    },
    onDownload: {
      type: Function,
      required: true
    },
    ctaText: {
      type: Array,
      default: () => []
    },
    messageList: {
      type: Array,
      default: () => []
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
    isExpand: {
      type: Boolean,
      default: () => false
    },
    placeholder: {
      type: String,
      default: 'Write a reply'
    },
    showRestartButton: {
      type: Boolean,
      default: () => false
    },
    showEndChatButton: {
      type: Boolean,
      default: () => false
    },
    showDownloadButton: {
      type: Boolean,
      default: () => false
    },
    showTypingIndicator: {
      type: Boolean,
      default: () => false
    },
    showLongTextInput: {
      type: Boolean,
      default: () => false
    },
    showFullPageFormInput: {
      type: Boolean,
      default: () => false
    },
    showFullPageRichInput: {
      type: Boolean,
      default: () => false
    },
    showMessages: {
      type: Boolean,
      default: () => true
    },
    hideMessageTime: {
      type: Boolean,
      default: () => false
    },
    maxInputCharacters: {
      type: Number,
      default: 0
    },
    headerText: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'Submit'
    },
    confirmationMessage: {
      type: String,
      default: 'Are you sure you want to submit?'
    },
    initialText: {
      type: String,
      default: null
    },
    modeData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      iframe: false,
      originalTeamName: '',
    };
  },
  created() {
    if (window.self !== window.top) {
      this.iframe = true;
    }

    this.originalTeamName = this.agentProfile.teamName;
  },
  watch: {
    "modeData.mode": function(newValue, oldValue) {
      if (newValue === 'webchat') {
        this.agentProfile.teamName = this.originalTeamName;
      }
    },
    "modeData.options.teamName": function(newValue, oldValue) {
      if (newValue) {
        let messageMetaData = this.$store.state.messageMetaData;
        messageMetaData.teamName = newValue;
        this.$store.commit('setMessageMetaData', messageMetaData);
      }
    },
    "messageMetaTeamName": function(newValue, oldValue) {
      if (typeof newValue !== 'undefined' && newValue !== '') {
        this.agentProfile.teamName = newValue;
      }
    },
  },
  computed: {
    messages() {
      let messages = this.messageList

      return messages
    },
    animateExternalButtons() {
      if (this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1]
        if (lastMessage.type === 'button' && lastMessage.data.external) {
          return lastMessage.data.animate
        }
      }

      return false
    },
    externalButtons() {
      if (this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1]
        if (lastMessage.type === 'button' && lastMessage.data.external) {
          return lastMessage.data.buttons.filter(btn => btn.type !== 'skip')
        }
      }

      return []
    },
    lastMessage() {
      if (this.messages.length == 0) return {}
      return this.messages[this.messages.length - 1]
    },
    messageMetaTeamName() {
      return this.$store.state.messageMetaData.teamName;
    },
  },
  methods: {
    setChatMode(mode) {
      this.$emit('setChatMode', mode);
    },
  },
};
</script>

<style lang="scss">
.od-chat-window::-webkit-scrollbar {
  display: none;
}

.od-chat-window {
  font-family: "Gotham", "Arial";
  transition: 0.3s ease-in-out;
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
  height: 100%;

  &.iframe {
    height: calc(100% - 55px);
    margin: 0 auto;
    border-radius: 10px;

    @media (min-width: 450px) {
      width: 423px;
    }
  }
}

.font-playfair {
  font-family: "Playfair Display";
}

.od-chat-window.iframe {
  &.closed {
    height: auto;
    padding-right: 20px;
    transition: none;
    @media (min-width: 450px) {
      padding-right: 0;
    }
  }

  &.opened {
    box-shadow: 0 3px 10px 3px rgba(0, 0, 0, 0.3);
    margin: 0px auto 0;

    @media (min-width: 767px) {
      margin: 20px auto 0;
    }
  }
}

</style>
