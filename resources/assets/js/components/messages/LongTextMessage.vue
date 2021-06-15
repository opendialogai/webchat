<template>
  <div class="od-message-long-text" v-linkified>
    <span>{{ data.text }}</span>
    <p v-if="data.meta" class='od-message--meta'>{{data.meta}}</p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.od-message-long-text {
  padding: 17px 20px;
  border-radius: 6px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;

  .sent & {
    background-color: var(--od-sent-message-background);
    color: var(--od-sent-message-text);
    max-width: calc(100% - 120px);
    word-wrap: break-word;

    .od-message--meta {
      color: var(--od-sent-message-text);
    }
  }

  .received & {
    background-color: var(--od-received-message-background);
    color: var(--od-received-message-text);
    margin-right: 40px;

    .od-message--meta {
      color: var(--od-received-message-text);
    }
  }
}

</style>
