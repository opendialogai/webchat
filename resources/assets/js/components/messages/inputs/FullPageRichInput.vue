<template>
  <div
    class="od-full-page-rich-input"
    :class="{ loader: showLoader, isOpen: isOpen }"
  >
    <div class="od-full-page-rich-wrapper">
      <div v-if="message.data.title">
        <div
          class="od-full-page-rich__title animateStartingState animateDelay1"
          :class="{animateSlideUp: isOpen}"
        >{{ message.data.title }}</div>
      </div>

      <div v-if="message.data.subtitle">
        <div
          class="od-full-page-rich__subtitle animateStartingState animateDelay1"
          :class="{animateSlideUp: isOpen}"
        >{{ message.data.subtitle }}</div>
      </div>

      <div v-if="message.data.text">
        <p
          class="od-full-page-rich__text animateStartingState animateDelay1"
          :class="{animateSlideUp: isOpen}"
        >
          <span>{{ message.data.text }}</span>
        </p>
      </div>
      <template v-if="message.data.image">
        <div class="od-full-page-rich__image animateStartingState" :class="{animateSlideUp: isOpen}">
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
        <div class="od-full-page-rich__buttons">
          <template v-for="(button, idx) in message.data.buttons">
            <button
              v-if="button.display && button.text"
              class="animateStartingState"
              :class="{
                animateSlideUp: isOpen,
                [`button-delay${idx + 1}`]: true,
                downloadButton: button.download,
                [`${button.type}`]: true,
              }"
              :key="idx"
              :myAttr="idx"
              @click="_handleClick(button)"
            >{{button.text}}</button>
          </template>
        </div>
      </template>
    </div>

    <template v-if="showLoader">
      <div class="fp-loader">
        <svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="38px" height="38px" viewBox="0 0 128 128" xml:space="preserve">
          <g>
            <path d="M64 9.75A54.25 54.25 0 0 0 9.75 64H0a64 64 0 0 1 128 0h-9.75A54.25 54.25 0 0 0 64 9.75z" fill="#da291c" fill-opacity="1"/>
            <animateTransform attributeName="transform" type="rotate" from="0 64 64" to="360 64 64" dur="1000ms" repeatCount="indefinite"></animateTransform>
          </g>
        </svg>
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
    isOpen: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      showLoader: false
    };
  },
  watch: {
    message() {
      this.showLoader = false;
    }
  },
  methods: {
    _handleClick(button) {
      if (!this.showLoader) {
        this.onSubmit(button);

        if (!button.download && !button.link) {
          this.showLoader = true;
        }
      }
    }
  }
};
</script>

<style lang="scss">
.od-full-page-rich-input {
  background-color: var(--od-message-list-background);
  flex: 1;
  text-align: center;
  position: relative;
  overflow-x: hidden;
  min-height: 30px;

  .od-full-page-rich.loader {
    overflow-y: hidden;
  }

  .od-full-page-rich-wrapper {
    padding: 20px 0;
  }

  /* Title/Subtitle */

  .od-full-page-rich__title {
    font-family: PlayfairDisplay;
    font-size: 26px;
    font-weight: bold;
    line-height: 1.5;
    text-align: center;
    color: #ffffff;
    margin: 0 10px 20px 10px;
    letter-spacing: 1px;
  }
  .od-full-page-rich__subtitle {
    margin: 0 10px 20px 10px;
    color: #ffffff;
  }

  .od-full-page-rich__text {
    margin: 0 10px 35px 10px;
    line-height: 1.3em;
    color: #ffffff;
  }

  /* image */
  .od-full-page-rich__image {
    width: 100%;
    margin-bottom: 10px;
  }

  /* button */

  .od-full-page-rich__buttons {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .od-full-page-rich__buttons button {
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

  .od-full-page-rich__buttons button {
    background-color: var(--od-button-background);
    color: var(--od-button-text);
    border: 2px solid var(--od-button-background);
  }

  .od-full-page-rich__buttons button:hover {
    background-color: var(--od-button-hover-background);
    color: var(--od-button-text);
    border: 2px solid var(--od-button-hover-background);
  }

  .od-full-page-rich__buttons button.downloadButton {
    background: none !important;
    border: none !important;
    color: #ffffff !important;
    text-decoration: underline;
    font-size: 16px;
    width: auto;
    padding: 0;
    min-height: 0;
    margin-top: 30px;
  }
  .od-full-page-rich__buttons button.downloadButton:before {
    content: "";
    width: 13px;
    height: 19px;
    background: red;
    display: inline-block;
    margin-right: 8px;
    vertical-align: middle;
    background: url("/vendor/webchat/images/download-button.svg");
  }

  /* loader --- loader --- loader ---  */
  @keyframes od-full-page-rich__button-fade-in {
    from {
      transform: translate(0px, 30px);
      opacity: 0;
    }
    to {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }

  .od-full-page-rich__button--animate {
    animation: od-full-page-rich__button-fade-in 1s forwards;
  }

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
  .fp-loader svg {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
  }
  .fp-loader svg path {
    fill: var(--od-button-background)
  }
}
</style>
