<template>
  <div class="od-chat-window-container">
    <ChatWindow
      :onUserInputSubmit="onMessageWasSent"
      :agentProfile="agentProfile"
      :isOpen="isOpen"
      :isExpand="isExpand"
      :onClose="close"
      :onExpand="expand"
      :onRestartButtonClick="onRestartButtonClick"
      :onDownload="onDownload"
      :contentEditable="contentEditable"
      :showExpandButton="showExpandButton"
      :showTypingIndicator="showTypingIndicator"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :showFullPageFormInput="showFullPageFormInput"
      :showFullPageRichInput="showFullPageRichInput"
      :showMessages="showMessages"
      :confirmationMessage="confirmationMessage"
      :initialText="initialText"
      :fullScreen="fullScreen"
      :fpFormInputMessage="fpFormInputMessage"
      :fpRichInputMessage="fpRichInputMessage"
      :ctaText="ctaText"
    />
  </div>
</template>
<script>
import ChatWindow from './ChatWindow.vue'
import session from "../mixins/SessionStorageMixin";

export default {
  props: {
    contentEditable: {
      type: Boolean,
      default: true
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    isOpen: {
      type: Boolean,
      required: true
    },
    isExpand: {
      type: Boolean,
      required: true
    },
    close: {
      type: Function,
      required: true
    },
    expand: {
      type: Function,
      required: true
    },
    showExpandButton: {
      type: Boolean,
      default: true
    },
    agentProfile: {
      type: Object,
      required: true
    },
    onMessageWasSent: {
      type: Function,
      required: true
    },
    ctaText: {
      type: Array,
      default: () => []
    },
    showTypingIndicator: {
      type: Boolean,
      default: () => true
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
    fpFormInputMessage: {
      type: Object,
      default: () => {}
    },
    fpRichInputMessage: {
      type: Object,
      default: () => {}
    },
    confirmationMessage: {
      type: String,
      default: 'Are you sure you want to submit?'
    },
    onRestartButtonClick: {
      type: Function,
      required: true
    },
    onDownload: {
      type: Function,
      required: true
    },
    initialText: {
       type: String,
       default: null
    },
    alwaysScrollToBottom: {
      type: Boolean,
      default: () => false
    }
  },
  data () {
    return {

    }
  },
  components: {
    ChatWindow
  },
  created() {
    if (session.isCustomModeInSession()) {
      this.$store.dispatch('setChatMode', session.getModeDataInSession())
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.od-chat-window-container {
  display: inline;
}
</style>
