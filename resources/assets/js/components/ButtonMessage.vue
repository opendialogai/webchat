<template>
  <div
    ref="message"
    class="mt-message-with-button fade-enter-active"
    :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
    }]"
  >
    <div
      class="mt reap mt-message-with-button__text"
      :style="messageColors"
      v-linkified>
      <span v-html="data.text"></span>
    </div>

    <template v-if="data.buttons.length && !data.external">
      <div
        class="mt-message-with-button__buttons-wrapper reap fade-enter-active"
           :style="{
            '--background': colors.messageList.bg,

            '--btn-bg': colors.messageButton.bg,
            '--btn-bg-hover': colors.messageButton.hoverbg,

            '--btn-color': colors.messageButton.text,
            '--btn-color-hover':  colors.messageButton.hoverText,

            '--btn-border-color':colors.messageButton.border,
            '--btn-border-color-hover':colors.messageButton.hoverBorder }"
      >
        <button
          v-for="(button, idx) in data.buttons"
          :key="idx"
          @click="_handleClick(button)"
          v-html="button.text"
          class="mt-message-with-button__buttons-wrapper__button fade-enter-active"
        ></button>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    author: {
      type: String,
      required: true
    },
    colors: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    }
  },
  methods: {
    _handleClick(button) {
      if (this.data.animate) {
        this.$refs.message.style.height = null;
      }
      this.onButtonClick(button, this.message);
    }
  },
  mounted() {
    if (this.data.animate) {
      const w = this.$refs.message.offsetWidth + 1 + "px";
      const h = this.$refs.message.offsetHeight + "px";

      const typingIndicator = document.querySelector(".sc-typing-indicator");

      if (typingIndicator) {
        const typingIndicatorRect = typingIndicator.getBoundingClientRect();

        this.$refs.message.style.width = typingIndicatorRect.width + "px";
        this.$refs.message.style.height = typingIndicatorRect.height + "px";
        this.$refs.message.style.opacity = 1;

        setTimeout(() => {
          this.$refs.message.style.width = w;
          this.$refs.message.style.height = h;
        }, 1);
      } else {
        this.$refs.message.style.width = "94px";
        this.$refs.message.style.height = "66px";
        this.$refs.message.style.opacity = 1;

        setTimeout(() => {
          this.$refs.message.style.width = w;
          this.$refs.message.style.height = h;
        }, 500);
      }

      setTimeout(() => {
        this.$root.$emit("scroll-down-message-list");
      }, 450);

      window.addEventListener("resize", () => {
        this.$refs.message.style.width = null;
        this.$refs.message.style.height = null;
      });
    }

    setTimeout(() => {
      this.$root.$emit("scroll-down-message-list");
    }, 900);
  }
};
</script>

<style scoped>


.mt-message-with-button__buttons-wrapper__button {
  background-color: var(--btn-bg);
  color: var(--btn-color);
  border: 2px solid var(--btn-border-color);
}


.mt-message-with-button__buttons-wrapper__button:hover {
background-color: var(--btn-bg-hover);
  color: var(--btn-color-hover);
  border: 2px solid var(--btn-border-color-hover);
}



</style>
