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

    <HandToHumanMessage
      v-else-if="message.type === 'hand-to-human'"
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
      v-if="!hideMessageTime && message.type !== 'datetime' && message.type !== 'typing' && message.type !== 'author'"
      class="sc-message--time-read"
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
  import HandToHumanMessage from "./messages/HandToHumanMessage";
  import MetaMessage from "./messages/MetaMessage";

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
    HandToHumanMessage,
    MetaMessage,
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
    colors: {
      type: Object,
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
    determineMessageColors() {
      /* return this.message.author === "me"
        ? this.sentColorsStyle()
        : this.receivedColorsStyle(); */
        return {}
    },
    setChatMode(mode) {
      this.$emit("setChatMode", mode);
    }
  }
};
</script>
<style>
</style>
