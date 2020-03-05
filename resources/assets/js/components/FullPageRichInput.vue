<template>
  <div class="sc-full-page-rich-input--container" :style="{backgroundColor: colors.messageList.bg}">
    <div class="sc-full-page-rich-input" :style="{color: colors.receivedMessage.text, backgroundColor: colors.receivedMessage.bg}">
      <div class="sc-message--fp-rich--title">{{ message.data.title }}</div>
      <div class="sc-message--fp-rich--subtitle">{{ message.data.subtitle }}</div>
      <p class="sc-message--fp-rich--text" v-linkified>
        <span v-html="message.data.text"></span>
      </p>

      <template v-if="message.data.image">
        <div class="sc-message--fp-rich--image">
          <template v-if="message.data.image.url">
            <a :href="message.data.image.url" :target="message.data.image.link_new_tab ? '_blank' : '_parent'"><img :src="message.data.image.src" /></a>
          </template>
          <template v-else>
            <img :src="message.data.image.src" />
          </template>
        </div>
      </template>

      <template v-if="message.data.buttons.length">
        <div class="sc-message--fp-rich--buttons">
          <button v-for="(button, idx) in message.data.buttons" :key="idx" @click="_handleClick(button)" :style="{backgroundColor: colors.button.bg, color: colors.button.text, '--button-hover': colors.button.hoverbg}">
            {{button.text}}
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    onSubmit: {
      type: Function,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    colors: {
      type: Object,
      required: true
    }
  },
  methods: {
    _handleClick(button) {
      this.onSubmit(button);
    }
  }
};
</script>

<style scoped>
.sc-full-page-rich-input--container {
  flex: 1;
}

.sc-message--fp-rich {
  background: #eaeaea;
  border-radius: 6px;
  padding: 0 12px;
  max-width: calc(100% - 40px);
}

.sc-message--fp-rich .sc-message--fp-rich--text {
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
  -webkit-font-smoothing: subpixel-antialiased;
}

.sc-message--fp-rich button {
  cursor: pointer;
  border-radius: 30px;
  border: none;
  font-size: 14px;
  padding: 12px 17px;
  margin: 0 10px 10px 0;
}
.sc-message--fp-rich button:hover {
  background-color: var(--button-hover) !important;
}

.sc-message--fp-rich button:last-child {
  margin-right: 0;
}

.sc-message--fp-rich .sc-message--fp-rich--image {
  text-align: center;
  margin-bottom: 10px;
}

.sc-message--fp-rich .sc-message--fp-rich--image img {
  max-width: 100%;
}
</style>
