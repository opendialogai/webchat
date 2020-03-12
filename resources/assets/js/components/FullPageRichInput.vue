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
        <div
          class="mt-fpri__title animateStartingState animateDelay1"
          :class="{animateSlideUp: isOpen}"
        >{{ message.data.title }}</div>
      </div>

      <div v-if="message.data.subtitle">
        <div
          class="mt-fpri__subtitle animateStartingState animateDelay2"
          :class="{animateSlideUp: isOpen}"
        >{{ message.data.subtitle }}</div>
      </div>

      <div v-if="message.data.text">
        <p
          class="mt-fpri__text animateStartingState animateDelay2"
          :class="{animateSlideUp: isOpen}"
          v-linkified
        >
          <span v-html="message.data.text"></span>
        </p>
      </div>
      <template v-if="message.data.image">
        <div class="mt-fpri__image animateStartingState" :class="{animateSlideUp: isOpen}">
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

      <!-- add this class to <button>  when isOpen == true -->
      <!-- class="mtFprButtonAnimate"  -->
      <template v-if="message.data.buttons.length">
        <div class="mt-fpri__buttons">
          <button
            class="animateStartingState animateDelay3"
            :class="{animateSlideUp: isOpen}"
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
  margin-bottom: 17px;
  letter-spacing: 1px;
}
.mt-fpri__subtitle {
  margin: 0 0 20px 0;
}

.mt-fpri__text {
  margin: 0 0 25px 0;
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

/* loader --- loader --- loader ---  */
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
