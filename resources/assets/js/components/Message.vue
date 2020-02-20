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
      :messageColors="determineMessageColors()"
      :onLinkClick="onLinkClick"
    />

    <CarouselListMessage
      v-if="message.type === 'list' && message.data.view_type"
      :message="message"
      :data="message.data"
      :messageColors="determineMessageColors()"
      :colors="colors"
      :onButtonClick="onButtonClick"
      :onLinkClick="onLinkClick"
    />

    <LongTextMessage
      v-else-if="message.type === 'longtext'"
      :data="message.data"
      :messageColors="determineMessageColors()"
    />

    <TypingMessage
      v-else-if="message.type === 'typing'"
      :data="message.data"
      :messageColors="determineMessageColors()"
    />
    <ButtonMessage
      v-else-if="message.type === 'button'"
      :message="message"
      :data="message.data"
      :messageColors="determineMessageColors()"
      :colors="colors"
      :onButtonClick="onButtonClick"
      :author="message.author"
    />
    <ButtonResponseMessage
      v-else-if="message.type === 'button_response'"
      :data="message.data"
      :messageColors="determineMessageColors()"
      :author="message.author"
    />
    <FormMessage
      v-else-if="message.type === 'form'"
      :message="message"
      :data="message.data"
      :messageColors="determineMessageColors()"
      :colors="colors"
      :onFormButtonClick="onFormButtonClick"
    />
    <FormResponseMessage
      v-else-if="message.type === 'form_response'"
      :data="message.data"
      :messageColors="determineMessageColors()"
    />
    <ImageMessage
      v-else-if="message.type === 'image'"
      :data="message.data"
      :messageColors="determineMessageColors()"
      :author="message.author"
    />
    <ListMessage
      v-else-if="message.type === 'list'"
      :message="message"
      :data="message.data"
      :messageColors="determineMessageColors()"
      :colors="colors"
      :onButtonClick="onListButtonClick"
    />
    <RichMessage
      v-else-if="message.type === 'rich'"
      :message="message"
      :data="message.data"
      :messageColors="determineMessageColors()"
      :colors="colors"
      :onButtonClick="onButtonClick"
      :author="message.author"
    />
    <DatetimeFakeMessage v-else-if="message.type === 'datetime'" :message="message" />

    <span
      v-if="message.type !== 'datetime' && message.type !== 'typing' && message.type !== 'author'"
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
import DatetimeFakeMessage from "./DatetimeFakeMessage.vue";
import CarouselListMessage from "./CarouselListMessage.vue";
import ListMessage from "./ListMessage.vue";
import ImageMessage from "./ImageMessage.vue";
import FormMessage from "./FormMessage.vue";
import FormResponseMessage from "./FormResponseMessage.vue";
import ButtonMessage from "./ButtonMessage.vue";
import ButtonResponseMessage from "./ButtonResponseMessage.vue";
import RichMessage from "./RichMessage.vue";
import TextMessage from "./TextMessage.vue";
import LongTextMessage from "./LongTextMessage.vue";
import TypingMessage from "./TypingMessage.vue";
import AuthorMessage from "./AuthorMessage.vue";
import chatIcon from "./assets/chat-icon.svg";

export default {
  data() {
    return {
      authorName: null
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
    TextMessage,
    LongTextMessage,
    TypingMessage,
    AuthorMessage
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
    read: {
      type: Boolean
    }
  },

  myFn() {},
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
    sentColorsStyle() {
      return {
        color: this.colors.sentMessage.text,
        backgroundColor: this.colors.sentMessage.bg
      };
    },
    receivedColorsStyle() {
      return {
        color: this.colors.receivedMessage.text,
        backgroundColor: this.colors.receivedMessage.bg
      };
    },
    determineMessageColors() {
      return this.message.author === "me"
        ? this.sentColorsStyle()
        : this.receivedColorsStyle();
    }
  }
};
</script>
<style>
</style>
