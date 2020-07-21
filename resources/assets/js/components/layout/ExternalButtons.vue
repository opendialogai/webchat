<template>
  <div v-if="externalButtons.length">
    <div
      class="od-external-button mt-external-buttons"
      :class="{animate: this.animate, 'fade-enter-active': this.animate}"
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

<style lang="scss">
.od-external-button {
  background-color: var(--od-message-list-background);

  .mt-external-buttons__button {
    background-color: var(--od-external-button-background);
    color: var(--od-external-button-text);
    border: 2px solid var(--od-external-button-background);
  }

  .mt-external-buttons__button:hover {
    background-color: var(--od-external-button-hover-background);
    color: var(--od-external-button-text);
    border: 2px solid var(--od-external-button-hover-background);
  }
}
</style>
