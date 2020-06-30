<template>
  <div class="message-list" ref="scrollList" :style="{'--messageList-bkg': colors.messageList.bg}">
    <Message
      v-for="(message, idx) in messages"
      v-show="shouldShowMessage(message)"
      :message="message"
      :read="message.read"
      :chatImageUrl="chatImageUrl"
      :key="message.id"
      :colors="colors"
      :onButtonClick="onButtonClick"
      :onLinkClick="onLinkClick"
      :onListButtonClick="onListButtonClick"
      :onFormButtonClick="onFormButtonClick"
      :mode-data="modeData"
      :isOpen="isOpen"
      @setChatMode="setChatMode"
      :hideMessageTime="hideMessageTime"
    />
    <Message
      v-if="showTypingIndicator"
      :message="{author: 'them', type: 'typing'}"
      :chatImageUrl="chatImageUrl"
      :colors="colors"
      :onLinkClick="onLinkClick"
      :onButtonClick="onButtonClick"
      :onListButtonClick="onListButtonClick"
      :onFormButtonClick="onFormButtonClick"
    />
  </div>
</template>
<script>
import Message from "./Message.vue";
import chatIcon from "./assets/chat-icon.svg";

export default {
  components: {
    Message
  },
  props: {
    messages: {
      type: Array,
      required: true
    },
    chatImageUrl: {
      type: String,
      default: chatIcon
    },
    showTypingIndicator: {
      type: Boolean,
      default: () => false
    },
    hideMessageTime: {
      type: Boolean,
      default: () => false
    },
    colors: {
      type: Object,
      required: true
    },
    alwaysScrollToBottom: {
      type: Boolean,
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
    modeData: {
      type: Object,
      required: true
    },
    isOpen: {
        type: Boolean,
        default: () => false
    },
  },
  methods: {
    _scrollDown(animate = true) {
      if (this.$refs.scrollList) {
        if (
          this.$refs.scrollList.scrollHeight >
          this.$refs.scrollList.offsetHeight
        ) {
          if (animate) {
            const scrollStep =
              (this.$refs.scrollList.scrollHeight -
                this.$refs.scrollList.offsetHeight -
                this.$refs.scrollList.scrollTop) /
              15;

            let i = 0;
            const scrollInterval = setInterval(() => {
              if (this.$refs.scrollList) {
                this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollTop + scrollStep;
              }
              i = i + 1;
              if (i == 15) clearInterval(scrollInterval);
            }, 30);
          } else {
            this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight;
          }
        }
      }
    },
    shouldScrollToBottom() {
      return (
        this.alwaysScrollToBottom ||
        this.$refs.scrollList.scrollTop >
          this.$refs.scrollList.scrollHeight - 300
      );
    },
    setChatMode(mode) {
      this.$emit('setChatMode', mode);
    },
    shouldShowMessage(message) {
      let isModeSame = message.mode === this.modeData.mode;
      let isWebchatMode = message.mode === 'webchat';
      let isCustomMode = message.mode === 'custom';
      let isFromSameInstance = message.modeInstance === this.modeData.modeInstance;
      return (isModeSame && isWebchatMode) || (isModeSame && isCustomMode && isFromSameInstance);
    },
  },
  mounted() {
    this._scrollDown(false);
    this.$root.$on("scroll-down-message-list", (animate = true) => {
      this._scrollDown(animate);
    });
  },
  updated() {
    if (this.shouldScrollToBottom()) this.$nextTick(this._scrollDown());
  }
};
</script>

<style scoped>
.message-list {
    /* background-color: yellow; */
  background-color: var(--messageList-bkg);

}
</style>
