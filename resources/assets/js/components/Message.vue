<template>
  <div class="sc-message fadeUp-enter-active" :class="'sc-message-' + message.type">
    <span v-if="message.author != 'me' && authorName" class="sc-message--name">{{ authorName }}</span>
    <div class="sc-message--content" :class="{
        internal: message.data && message.data.internal,
        sent: message.author === 'me',
        received: message.author === 'them',
        author: message.type === 'author',
        system: message.type === 'system',
        'first-internal-message': message.data && message.data.firstInternal,
        'last-internal-message': message.data && message.data.lastInternal,
      }">
      <CarouselListMessage v-if="message.type === 'list' && message.data.view_type" :message="message" :data="message.data" :messageColors="determineMessageColors()" :colors="colors" :onButtonClick="onButtonClick" :onLinkClick="onLinkClick" />
      <TextMessage v-else-if="message.type === 'text' || message.type === 'longtext_response'" :data="message.data" :messageColors="determineMessageColors()" :onLinkClick="onLinkClick" />
      <LongTextMessage v-else-if="message.type === 'longtext'" :data="message.data" :messageColors="determineMessageColors()" />
      <EmojiMessage v-else-if="message.type === 'emoji'" :data="message.data" />
      <FileMessage v-else-if="message.type === 'file'" :data="message.data" :messageColors="determineMessageColors()" />
      <TypingMessage v-else-if="message.type === 'typing'" :messageColors="determineMessageColors()" />
      <AuthorMessage v-else-if="message.type === 'author'" :data="message.data" />
      <SystemMessage v-else-if="message.type === 'system'" :data="message.data" :messageColors="determineMessageColors()" />
      <ButtonMessage v-else-if="message.type === 'button'" :message="message" :data="message.data" :messageColors="determineMessageColors()" :colors="colors" :onButtonClick="onButtonClick" />
      <ButtonResponseMessage v-else-if="message.type === 'button_response'" :data="message.data" :messageColors="determineMessageColors()" />
      <FormMessage v-else-if="message.type === 'form'" :message="message" :data="message.data" :messageColors="determineMessageColors()" :colors="colors" :onFormButtonClick="onFormButtonClick" />
      <FormResponseMessage v-else-if="message.type === 'form_response'" :data="message.data" :messageColors="determineMessageColors()" />
      <ImageMessage v-else-if="message.type === 'image'" :data="message.data" :messageColors="determineMessageColors()" />
      <ListMessage v-else-if="message.type === 'list'" :message="message" :data="message.data" :messageColors="determineMessageColors()" :colors="colors" :onButtonClick="onListButtonClick" />
      <RichMessage v-else-if="message.type === 'rich'" :message="message" :data="message.data" :messageColors="determineMessageColors()" :colors="colors" :onButtonClick="onButtonClick" />
      <DatetimeFakeMessage v-else-if="message.type === 'datetime'" :message="message" />
    </div>
    <span v-if="message.type !== 'datetime' && message.type !== 'typing' && message.type !== 'system' && message.type !== 'author'" class="sc-message--time-read">
      <template v-if="message.data && message.data.time && !message.data.hidetime">{{ message.data.time }}</template>
      <template v-if="read"> - Read</template>
    </span>
  </div>
</template>

<script>
import DatetimeFakeMessage from './DatetimeFakeMessage.vue'
import CarouselListMessage from './CarouselListMessage.vue'
import ListMessage from './ListMessage.vue'
import ImageMessage from './ImageMessage.vue'
import FormMessage from './FormMessage.vue'
import FormResponseMessage from './FormResponseMessage.vue'
import ButtonMessage from './ButtonMessage.vue'
import ButtonResponseMessage from './ButtonResponseMessage.vue'
import RichMessage from './RichMessage.vue'
import TextMessage from './TextMessage.vue'
import LongTextMessage from './LongTextMessage.vue'
import FileMessage from './FileMessage.vue'
import EmojiMessage from './EmojiMessage.vue'
import TypingMessage from './TypingMessage.vue'
import AuthorMessage from './AuthorMessage.vue'
import SystemMessage from './SystemMessage.vue'
import chatIcon from './assets/chat-icon.svg'

export default {
  data() {
    return {
      authorName: null,
    }
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
    FileMessage,
    EmojiMessage,
    TypingMessage,
    AuthorMessage,
    SystemMessage,
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
      type: Boolean,
    }
  },
  created() {
    if (this.message.type == 'chat_open') return;

    if (this.message.user &&
        this.message.user.name &&
        this.message.user.name.length) {
      this.authorName = this.message.user.name;
    }
  },
  methods: {
    sentColorsStyle() {
      return {
        color: this.colors.sentMessage.text,
        backgroundColor: this.colors.sentMessage.bg
      }
    },
    receivedColorsStyle() {
      return {
        color: this.colors.receivedMessage.text,
        backgroundColor: this.colors.receivedMessage.bg
      }
    },
    determineMessageColors() {
      return this.message.author === 'me' ? this.sentColorsStyle() : this.receivedColorsStyle()
    }
  }
}
</script>
<style>
.sc-message {
  width: 300px;
  margin: auto;
  padding-bottom: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
}
.sc-message.fadeUp-enter-active {
  animation-duration: 0s;
}

.sc-chat-window.fullscreen .sc-message {
  width: 100%;
}

.sc-message--content {
  width: 100%;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}

.sc-message--content.sent {
  justify-content: flex-end;
  align-items: flex-end;
}

.sc-message--name {
  font-size: x-small;
  margin-top: -5px;
  color: gray;
  text-align: left;
}

.sc-message--time-read {
  font-size: x-small;
  margin-bottom: -5px;
  color: gray;
}
.sc-message--content.sent + .sc-message--time-read {
  text-align: right;
}

.sc-message--content.system {
  justify-content: center;
}

.sc-message--content.read {
  justify-content: center;
}

.sc-message--content.sent .sc-message--avatar {
  display: none;
}

.sc-message--avatar {
  background-image: url(https://d13yacurqjgara.cloudfront.net/assets/avatar-default-aa2eab7684294781f93bc99ad394a0eb3249c5768c21390163c9f55ea8ef83a4.gif);
  background-repeat: no-repeat;
  background-size: 100%;
  background-position: center;
  min-width: 30px;
  min-height: 30px;
  border-radius: 50%;
  align-self: center;
  margin-right: 15px;
}

.sc-message--meta {
  font-size: xx-small;
  margin-bottom: -10px;
  color: white;
  text-align: center;
}

@media (max-width: 450px) {
  .sc-message {
    width: 80%;
  }
}

.sc-message--author {
  color: white;
  background-color: black;
}

.sc-message--author.sent {
  color: black;
  background-color: white;
  max-width: calc(100% - 120px);
  word-wrap: break-word;
}
</style>
