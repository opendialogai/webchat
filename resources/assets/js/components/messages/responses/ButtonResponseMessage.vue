<template>
  <div
    class="od-button-response mt"
    :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author === 'them',
    }]"
  >
    <div class="button" v-html="data.text"></div>
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
    }
  }
};
</script>

<style lang="scss">
.od-button-response {
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
