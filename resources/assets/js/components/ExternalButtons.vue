<template>
  <div
    v-if="externalButtons.length"
    class="mt-wrapper sc-external-buttons-row"
    :style="{background: colors.messageList.bg}"
  >
    <div class="mt mt-external-buttons sc-external-buttons-row-wrapper fade-enter-active">
      <button
        class="sc-external-buttons-element"
        :class="(buttonClicked == idx) ? 'sc-external-buttons-element--clicked' : ''"
        v-for="(externalButton, idx) in externalButtons"
        v-on:click="_handleClick(externalButton, idx)"
        :style="{background: colors.receivedMessage.bg, color: colors.externalButton.text, '--button-hover': colors.externalButton.hoverbg}"
        :key="idx"
      >
        <div class="sc-external-buttons-element--top"></div>
        <div class="sc-external-buttons-element--right"></div>
        <div class="sc-external-buttons-element--bottom"></div>
        <div class="sc-external-buttons-element--left"></div>
        <div class="sc-external-buttons-element--background"></div>

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

}
</style>
