<template>
  <div class="od-message-fp-rich mt mt-message-fp-rich sc-message--fp-rich reap" :class="[{
        animate: this.data.animate
    }]">
    <div class="sc-message--fp-rich--title">{{ data.title }}</div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
  }
};
</script>

<style lang="scss">
.od-message-fp-rich {
  &.emit {
    background-color: var(--od-sent-message-background);
    color: var(--od-sent-message-text);
  }

  &.reap {
    background-color: var(--od-received-message-background);
    color: var(--od-received-message-text);
  }
}
</style>
