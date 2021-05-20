<template>
  <div class="od-messagelist" ref="scrollList">
    <Message
      v-for="(message, idx) in messages"
      v-show="shouldShowMessage(message)"
      :message="message"
      :read="message.read"
      :chatImageUrl="chatImageUrl"
      :key="message.id"
      :onButtonClick="onButtonClick"
      :onLinkClick="onLinkClick"
      :onListButtonClick="onListButtonClick"
      :onFormButtonClick="onFormButtonClick"
      :mode-data="modeData"
      :isOpen="isOpen"
      @setChatMode="setChatMode"
      :hideMessageTime="hideMessageTime"
      :ref="'message-' + idx"
    />
    <Message
      v-if="showTypingIndicator"
      :message="{author: 'them', type: 'typing', data: {}, mode: 'webchat'}"
      :mode-data="{}"
      :chatImageUrl="chatImageUrl"
      :onLinkClick="onLinkClick"
      :onButtonClick="onButtonClick"
      :onListButtonClick="onListButtonClick"
      :onFormButtonClick="onFormButtonClick"
    />
  </div>
</template>
<script>
import {mapState} from 'vuex';
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
  computed: {
    ...mapState({
      activeTab: state => state.activeTab,
      firstNewMessage: state => state.firstNewMessage
    })
  },
  watch: {
    firstNewMessage(newIndex) {
      if (this.$store.state.settings.general.scrollToFirstNewMessage) {
        this.scrollToFirstNewMessage(newIndex)
      }
    }
  },
  methods: {
    animateScroll(newHeightToScrollDown, numOfSteps = 15) {
      const scrollStep =
        newHeightToScrollDown /
        numOfSteps;

      let i = 0;
      const scrollInterval = setInterval(() => {
        if (this.$refs.scrollList) {
          this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollTop + scrollStep;
        }
        i = i + 1;
        if (i >= numOfSteps) clearInterval(scrollInterval);
      }, 30);
    },
    _scrollDown(animate = true) {
      if (this.$refs.scrollList) {
        if (
          this.$refs.scrollList.scrollHeight >
          this.$refs.scrollList.offsetHeight
        ) {
          if (animate) {
            const newHeightToScrollDown = this.$refs.scrollList.scrollHeight -
              this.$refs.scrollList.offsetHeight -
              this.$refs.scrollList.scrollTop;

            this.animateScroll(newHeightToScrollDown);
          } else {
            this.$refs.scrollList.scrollTop = this.$refs.scrollList.scrollHeight;
          }
        }
      }
    },
    scrollToFirstNewMessage(messageIndex) {
      if (this.$refs.scrollList) {
        if (
          this.$refs.scrollList.scrollHeight >
          this.$refs.scrollList.offsetHeight
        ) {
          const newHeightToScrollDown = this.$refs['message-' + messageIndex][0].$el.offsetTop - this.$refs.scrollList.scrollTop;
          this.animateScroll(newHeightToScrollDown);
        }
      }
    },
    setChatMode(mode) {
      this.$emit('setChatMode', mode);
    },
    shouldShowMessage(message) {
      if (this.activeTab === 'comments') {
        return true
      }
      let isModeSame = message.mode === this.modeData.mode;
      let isWebchatMode = message.mode === 'webchat';
      let isCustomMode = !isWebchatMode;
      let isFromSameInstance = message.modeInstance === this.modeData.modeInstance;
      return (isModeSame && isWebchatMode) || (isModeSame && isCustomMode && isFromSameInstance);
    },
  },
  mounted() {
    this._scrollDown(false);
    this.$root.$on("scroll-down-message-list", (animate = true) => {
      if (!this.$store.state.settings.general.scrollToFirstNewMessage) {
        this._scrollDown(animate);
      }
    });
  },
  updated() {
    if (!this.$store.state.settings.general.scrollToFirstNewMessage || this.messages.slice(-1)[0].author === 'me') {
      this.$nextTick(this._scrollDown)
    } else if (this.$refs.scrollList.scrollTop === 0) {
      this._scrollDown(false)
    }
  }
};
</script>

<style lang="scss">
@import '../../sass/0-globals/_vars.scss';

.od-messagelist {
  position: relative;
  background-color: var(--od-message-list-background);
  -ms-overflow-style: none;
  flex: 1;
  overflow-y: auto;
  padding: 20px 0 0;

  @media (min-width: $media-med) {
    padding: 40px 0 0;
  }

  &.fadeUp-enter-active {
    animation-duration: 0.5s;
  }
}

.od-messagelist::-webkit-scrollbar {
  display: none;
}
</style>
