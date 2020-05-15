<template>
  <div v-if="externalButtons.length" class="mt-wrapper">
    <div
      class="mt mt-external-buttons"
      :class="{animate: this.animate, 'fade-enter-active': this.animate}"
      :style="{
            '--background': colors.messageList.bg,

            '--btn-bg': colors.externalButton.bg,
            '--btn-bg-hover': colors.externalButton.hoverbg,

            '--btn-color': colors.externalButton.text,
            '--btn-color-hover':  colors.externalButton.hoverText,

            '--btn-border-color':colors.externalButton.border,
            '--btn-border-color-hover':colors.externalButton.hoverBorder }"
    >
      <template v-for="(externalButton, idx) in externalButtons">
        <button
          v-if="externalButton.display && externalButton.text"
          class="mt-external-buttons__button"
          :class="(buttonClicked == idx) ? 'mt-external-buttons__button--clicked' : ''"
          v-on:click="_handleClick(externalButton, idx)"
          :key="idx"
        >
          <span v-html="externalButton.text"></span>
        </button>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    animate: {
      type: Boolean,
      default: false
    },
    externalButtons: {
      type: Array,
      default: () => []
    },
    colors: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      buttonClicked: -1
    };
  },
  watch: {
    externalButtons() {
      if (this.externalButtons.length == 0) {
        this.buttonClicked = -1;
      }
    }
  },
  methods: {
    _handleClick(externalButton, idx) {
      this.buttonClicked = idx;
      this.$emit("sendExternalButton", externalButton);
    }
  }
};
</script>

<style scoped>
.mt-external-buttons {
  background-color: var(--background);
}

.mt-external-buttons__button {
  background-color: var(--btn-bg);
  color: var(--btn-color);
  border: 2px solid var(--btn-border-color);
}

.mt-external-buttons__button:hover {
  background-color: var(--btn-bg-hover);
  color: var(--btn-color-hover);
  border: 2px solid var(--btn-border-color-hover);
}
</style>
