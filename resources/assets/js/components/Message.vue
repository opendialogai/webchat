<template>
  <div
    class="mt-wrapper fadeUp-enter-active"
    :class="[
    {
       'mt-wrapper-author': message.type === 'author',
    }]"
  >
    <span v-if="message.author != 'me' && authorName" class="sc-message--name">{{ authorName }}</span>

    <AuthorMessage
      v-else-if="message.type === 'author'"
      :data="message.data"
      :author="message.author"
    />

    <TextMessage
      v-else-if="message.type === 'text' || message.type === 'longtext_response'"
      :data="message.data"
      :author="message.author"
      :type="message.type"
      :onLinkClick="onLinkClick"
    />

    <ListMessage
      v-else-if="message.type === 'list' && message.data.view_type === 'list'"
      :message="message"
      :data="message.data"
      :onButtonClick="onListButtonClick"
    />

    <CarouselListMessage
      v-else-if="message.type === 'list'"
      :message="message"
      :data="message.data"
      :onButtonClick="onButtonClick"
      :onLinkClick="onLinkClick"
      :author="message.author"
    />

    <LongTextMessage
      v-else-if="message.type === 'longtext'"
      :data="message.data"
    />

    <TypingMessage
      v-else-if="message.type === 'typing'"
      :data="message.data"
      :author="message.author"
    />

    <ButtonMessage
      v-else-if="message.type === 'button'"
      :message="message"
      :data="message.data"
      :onButtonClick="onButtonClick"
      :author="message.author"
    />

    <ButtonResponseMessage
      v-else-if="message.type === 'button_response'"
      :data="message.data"
      :author="message.author"
    />

    <FormMessage
      v-else-if="message.type === 'form'"
      :message="message"
      :data="message.data"
      :author="message.author"
      :onFormButtonClick="onFormButtonClick"
    />

    <FormResponseMessage
      v-else-if="message.type === 'form_response'"
      :data="message.data"
      :author="message.author"
    />

    <ImageMessage
      v-else-if="message.type === 'image'"
      :data="message.data"
      :author="message.author"
    />

    <RichMessage
      v-else-if="message.type === 'rich'"
      :message="message"
      :data="message.data"
      :onButtonClick="onButtonClick"
    />

    <FpRichMessage
      v-else-if="message.type === 'fp-rich'"
      :message="message"
      :data="message.data"
      :isOpen="isOpen"
    />

    <HandToSystemMessage
      v-else-if="message.type === 'hand-to-system'"
      :data="message.data"
      :author="message.author"
      :type="message.type"
      :mode-data="modeData"
      @setChatMode="setChatMode"
    />

    <MetaMessage
      v-else-if="message.type === 'meta'"
      :data="message.data"
      :author="message.author"
      :type="message.type"
    />

    <DatetimeFakeMessage v-else-if="message.type === 'datetime'" :message="message" />

    <span
      v-if="!hideMessageTime
        && message.type !== 'datetime'
        && message.type !== 'typing'
        && message.type !== 'author'
        && !message.data.first
        && !message.data.middle"
      class="od-message--time-read"
    >
      <template
        v-if="message.data && message.data.time && !message.data.hidetime"
      >{{ message.data.time }}</template>
      <template v-if="read">- Read</template>
    </span>
  </div>
</template>

<script>
  import DatetimeFakeMessage from "./messages/DatetimeFakeMessage.vue";
  import CarouselListMessage from "./messages/CarouselListMessage.vue";
  import ListMessage from "./messages/ListMessage.vue";
  import ImageMessage from "./messages/ImageMessage.vue";
  import FormMessage from "./messages/FormMessage.vue";
  import FormResponseMessage from "./messages/responses/FormResponseMessage.vue";
  import FpRichMessage from "./messages/FpRichMessage.vue";
  import ButtonMessage from "./messages/ButtonMessage.vue";
  import ButtonResponseMessage from "./messages/responses/ButtonResponseMessage.vue";
  import RichMessage from "./messages/RichMessage.vue";
  import TextMessage from "./messages/TextMessage.vue";
  import LongTextMessage from "./messages/LongTextMessage.vue";
  import TypingMessage from "./messages/TypingMessage.vue";
  import AuthorMessage from "./messages/AuthorMessage.vue";
  import chatIcon from "./assets/chat-icon.svg";
  import HandToSystemMessage from "./messages/HandToSystemMessage";
  import MetaMessage from "./messages/MetaMessage";
  import Autocomplete from './messages/Autocomplete';

  export default {
  data() {
    return {
      authorName: null,
    };
  },
  components: {
    DatetimeFakeMessage,
    CarouselListMessage,
    ListMessage,
    ImageMessage,
    FormMessage,
    FormResponseMessage,
    ButtonMessage,
    ButtonResponseMessage,
    RichMessage,
    FpRichMessage,
    TextMessage,
    LongTextMessage,
    TypingMessage,
    AuthorMessage,
    HandToSystemMessage,
    MetaMessage,
    Autocomplete
  },
  props: {
    message: {
      type: Object,
      required: true
    },
    chatImageUrl: {
      type: String,
      default: chatIcon
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
    hideMessageTime: {
      type: Boolean,
      default: false
    },
    read: {
      type: Boolean
    },
    modeData: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: () => false
    }
  },
  created() {
    if (this.message.type == "chat_open") return;

    if (
      this.message.user &&
      this.message.user.name &&
      this.message.user.name.length
    ) {
      this.authorName = this.message.user.name;
    }
  },
  methods: {
    setChatMode(mode) {
      this.$emit("setChatMode", mode);
    }
  }
};
</script>
<style lang="scss">
@import '../../sass/0-globals/_vars.scss';

// message type wrapper --- message type wrapper ---

.mt-wrapper {
  margin: 0 auto;
  max-width: 700px;
  width: calc(100% - 50px);
  @media screen and (min-width: 768px) {
    width: 100%;
  }

  &.fadeUp-enter-active {
    animation-duration: 0.5s;
  }

  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 0;
}

// special wrapper for author message (avatar) only
.mt-wrapper-author {
  pointer-events: none;
  z-index: 10;
}

.mt-wrapper.fadeUp-enter-active {
  animation-duration: 0s;
}

// message type --- message type ---message type ---

.mt {
  border-radius: 30px;
  box-shadow: none;
  max-width: 90%;
  max-width: calc(90% - 45px);
  padding: 15px 20px;
  line-height: 1.6;
  font-size: 14px;
  word-break: break-word;
  @media (min-width: $media-sml) {
    font-size: 16px;
  }

  @media (min-width: $media-med) {
    max-width: calc(90% - 60px);
  }
}

// 🧘🏻‍♂️ User Sends Emits 🧘🏻‍♂️
.emit {
  align-self: flex-end;
  border-bottom-right-radius: 0;
}

// 🤖 Robot Receives Reap 🤖
.reap {
  align-self: flex-start;
  border-bottom-left-radius: 0;

  &.first-message {
    border-bottom-left-radius: 0;
    margin-bottom: 8px;
  }

  &.middle-message {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin-bottom: 8px;
  }

  &.last-message {
    border-top-left-radius: 0;
    border-bottom-left-radius: 30px;
  }
}

.mt-meta {
  font-size: xx-small;
  margin-bottom: 0px;
  margin-top: 5px;
  opacity: 0.5;
  text-align: center;
}

.od-message--time-read {
  margin-top: 5px;
  font-size: x-small;
  color: var(--od-received-message-background);
}
.mt.emit + .od-message--time-read {
  text-align: right;
}

/// Style text --- Style text --- Style text ---

.linkified,
.linkified:link,
.linkified:visited,
.linkified:hover,
.linkified:active {
  text-decoration: none;
  font-weight: bold;
  color: inherit;
  border-bottom: dashed 1px currentColor;
  padding-bottom: 3px;
  position: relative;
}
</style>
