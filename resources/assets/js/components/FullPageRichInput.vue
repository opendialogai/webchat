<template>
  <div
    class="mt-fpri"
    :class="{ loader: showLoader, isOpen: isOpen }"
    :style="{
            '--background': colors.messageList.bg,
            '--btn-bg': colors.button.bg,
            '--btn-bg-hover': colors.button.hoverbg,
            '--btn-color': colors.button.text,
            '--btn-color-hover':  colors.button.hoverText,
            '--btn-border-color':colors.button.border,
            '--btn-border-color-hover':colors.button.hoverBorder }"
  >
    <div class="mt-fpri-wrapper">
      <div v-if="message.data.title">
        <div class="mt-fpri__title">{{ message.data.title }}</div>
      </div>
      <div v-if="message.data.subtitle">
        <div class="mt-fpri__subtitle">{{ message.data.subtitle }}</div>
      </div>

      <div v-if="message.data.text">
        <p class="mt-fpri__text" v-linkified>
          <span v-html="message.data.text"></span>
        </p>
      </div>
      <template v-if="message.data.image">
        <div class="mt-fpri__image">
          <template v-if="message.data.image.url">
            <a
              :href="message.data.image.url"
              :target="message.data.image.link_new_tab ? '_blank' : '_parent'"
            >
              <img :src="message.data.image.src" />
            </a>
          </template>
          <template v-else>
            <img :src="message.data.image.src" />
          </template>
        </div>
      </template>

      <template v-if="message.data.buttons.length">
        <div class="mt-fpri__buttons">
          <button
            v-for="(button, idx) in message.data.buttons"
            :key="idx"
            @click="_handleClick(button)"
          >{{button.text}}</button>
        </div>
      </template>
    </div>

    <template v-if="showLoader">
      <div class="fp-loader">
        <img src="./assets/fp-loader.svg" />
      </div>
    </template>
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
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
  },
  data() {
    return {
      showLoader: false
    };
  },
  watch: {
    message() {
      this.showLoader = false;
    },
  },
  methods: {
    _handleClick(button) {
      this.onSubmit(button);

      this.showLoader = true;
    }
  }
};
</script>

<style scoped>
.mt-fpri {
  background-color: var(--background);
  flex: 1;
  text-align: center;
  position: relative;
  overflow-x: hidden;
}
.mt-fpri .mt-fpri-wrapper {
  padding: 20px 0;
}
.mt-fpri.loader {
  overflow-y: hidden;
}

/* Title/Subtitle */

.mt-fpri__title {
  font-family: PlayfairDisplay;
  font-size: 26px;
  font-weight: bold;
  line-height: 1.5;
  text-align: center;
  color: #000000;
  margin-bottom: 20px;
  letter-spacing: 1px;
}
.mt-fpri__subtitle {
  margin: 0 0 20px 0;
}

.mt-fpri__text {
  margin: 0 0 20px 0;
}

/* image */
.mt-fpri__image {
  width: 100%;
  margin-bottom: 10px;
}

/* button */

.mt-fpri__buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.mt-fpri__buttons button {
  margin-bottom: 10px;

  border: 1px solid;
  font-size: 15px;
  line-height: 1.33;

  text-align: center;
  color: #ffffff;

  font-weight: normal;
  cursor: pointer;

  border: none;
  outline: none;
  position: relative;
  transition: 0.4s;
  width: 95%;
  max-width: 325px;
  min-height: 61px;
  border-radius: 34.5px;

  padding: 0 20px;
  @media (min-width: 450px) {
    padding: 0 10px;
  }
}

.mt-fpri__buttons button {
  background-color: var(--btn-bg);
  color: var(--btn-color);
  border: 2px solid var(--btn-border-color);
}

.mt-fpri__buttons button:hover {
  background-color: var(--btn-bg-hover);
  color: var(--btn-color-hover);
  border: 2px solid var(--btn-border-color-hover);
}

/* .sc-message--fp-rich {
  background: #eaeaea;
  border-radius: 6px;
  padding: 0 12px;
  max-width: calc(100% - 40px);
  border: 1px solid blue;
} */
/*
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
} */

.fp-loader {
  position: sticky;
  width: 100%;
  height: 100%;
  text-align: center;
  top: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
}
.fp-loader img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
</style>
