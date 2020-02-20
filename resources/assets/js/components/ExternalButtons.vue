<template>
  <div v-if="externalButtons.length" class="mt-wrapper">
    <div
      class="mt mt-external-buttons fade-enter-active"
      :style="{ '--background': colors.messageList.bg}"
    >
      <button
        class="mt-external-buttons__button"
        :class="(buttonClicked == idx) ? 'mt-external-buttons__button--clicked' : ''"
        v-for="(externalButton, idx) in externalButtons"
        v-on:click="_handleClick(externalButton, idx)"
        :style="{'--btn-bg': colors.externalButton.bg, '--btn-color': colors.externalButton.text, '--btn-bg-hover': colors.externalButton.hoverbg}"
        :key="idx"
      >
        <span v-html="externalButton.text"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
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
  border: 1px solid var(--btn-bg);
}

.mt-external-buttons__button:hover {
  background-color: var(--btn-bg-hover);
  color: var(--btn-bg);
}
</style>
