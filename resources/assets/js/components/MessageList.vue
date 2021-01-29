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
  computed: {
    ...mapState({
      activeTab: state => state.activeTab
    })
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
      this._scrollDown(animate);
    });
  },
  updated() {
    if (this.shouldScrollToBottom()) this.$nextTick(this._scrollDown());
  }
};
</script>

<style lang="scss">
@import '../../sass/0-globals/_vars.scss';

.od-messagelist {
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
