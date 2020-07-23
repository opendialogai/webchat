<template>
  <div v-if="externalButtons.length">
    <div
      class="od-external-button"
      :class="{animate: this.animate, 'fade-enter-active': this.animate}"
    >
      <template v-for="(externalButton, idx) in externalButtons">
        <button
          v-if="externalButton.display && externalButton.text"
          class="od-external-button__button"
          :class="(buttonClicked == idx) ? 'od-external-button__button--clicked' : ''"
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
  text-align: center;
  animation-duration: 1s;

  .od-external-button__button {
    background-color: var(--od-external-button-background);
    color: var(--od-external-button-text);
    border: 2px solid var(--od-external-button-background);
    margin: 10px 3px;
    padding: 10px;
    border-radius: 30px;
    font-size: 15px;
    line-height: 14px;
    cursor: pointer;
    outline: none;
    position: relative;
    transition: .4s;
  }

  .od-external-button__button:hover {
    background-color: var(--od-external-button-hover-background);
    color: var(--od-external-button-text);
    border: 2px solid var(--od-external-button-hover-background);
  }
}
</style>
