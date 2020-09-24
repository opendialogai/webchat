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
      :showExpandButton="showExpandButton"
      :showTypingIndicator="showTypingIndicator"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :fullScreen="fullScreen"
    />
  </div>
</template>
<script>
import ChatWindow from './ChatWindow.vue'
import session from "../mixins/SessionStorageMixin";

export default {
  props: {
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
    showTypingIndicator: {
      type: Boolean,
      default: () => true
    },
    onRestartButtonClick: {
      type: Function,
      required: true
    },
    onDownload: {
      type: Function,
      required: true
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
