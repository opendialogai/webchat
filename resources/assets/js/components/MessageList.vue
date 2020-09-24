<template>
  <div class="od-messagelist" ref="scrollList">
    <Message
      v-for="(message, idx) in messages"
      v-show="shouldShowMessage(message)"
      :message="message"
      :read="message.read"
      :chatImageUrl="chatImageUrl"
      :key="timestamp(idx)"
      :isOpen="isOpen"
    />
    <Message
      v-if="showTypingIndicator"
      :message="{author: 'them', type: 'typing', data: {}, mode: 'webchat'}"
      :mode-data="{}"
      :chatImageUrl="chatImageUrl"
    />
  </div>
</template>
<script>
import {mapState} from 'vuex'
import Message from "./Message.vue";
import chatIcon from "./assets/chat-icon.svg";
import moment from 'moment'
import {bus} from '../app'

export default {
  components: {
    Message
  },
  props: {
    chatImageUrl: {
      type: String,
      default: chatIcon
    },
    showTypingIndicator: {
      type: Boolean,
      default: () => false
    },
    alwaysScrollToBottom: {
      type: Boolean,
      required: true
    },
    isOpen: {
        type: Boolean,
        default: () => false
    },
  },
  computed: {
    ...mapState({
      messageList: state => state.messageList,
      commentList: state => state.commentList,
      modeData: state => state.modeData,
      activeTab: state => state.activeTab
    }),
    messages() {
      return this.activeTab === 'comments' ? this.commentList : this.messageList
    }
  },
  methods: {
    timestamp(idx) {
      return moment().valueOf() + idx
    },
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
    shouldShowMessage(message) {
      if (this.activeTab === 'comments') {
        return true
      }
      let isModeSame = message.mode === this.modeData.mode;
      let isWebchatMode = message.mode === 'webchat';
      let isCustomMode = !isWebchatMode;
      let isFromSameInstance = message.modeInstance === this.modeData.modeInstance;
      //console.log('same mode: ', isModeSame, 'webchat: ', isWebchatMode, 'same instance: ', isFromSameInstance)
      return (isModeSame && isWebchatMode) || (isModeSame && isCustomMode && isFromSameInstance);
    },
  },
  mounted() {
    this._scrollDown(false);
    bus.$on("scroll-down-message-list", (animate = true) => {
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
