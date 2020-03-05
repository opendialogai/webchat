<template>
  <div class="message-list" ref="scrollList" :style="{'--messageList-bkg': colors.messageList.bg}">
    <Message
      v-for="(message, idx) in messages"
      :message="message"
      :read="message.read"
      :chatImageUrl="chatImageUrl"
      :key="message.id"
      :colors="colors"
      :onButtonClick="onButtonClick"
      :onLinkClick="onLinkClick"
      :onListButtonClick="onListButtonClick"
      :onFormButtonClick="onFormButtonClick"
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
    }
  },
  methods: {
    _scrollDown() {
      if (this.$refs.scrollList) {
        if (
          this.$refs.scrollList.scrollHeight >
          this.$refs.scrollList.offsetHeight
        ) {
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
        }
      }
    },
    shouldScrollToBottom() {
      return (
        this.alwaysScrollToBottom ||
        this.$refs.scrollList.scrollTop >
          this.$refs.scrollList.scrollHeight - 300
      );
    }
  },
  mounted() {
    this._scrollDown();
    this.$root.$on("scroll-down-message-list", () => {
      this._scrollDown();
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
