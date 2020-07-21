<template>
  <div class="sc-message--long-text" :style="messageColors" v-linkified>
    <span v-html="data.text"></span>
    <p v-if="data.meta" class='sc-message--meta' :style="{color: messageColors.color}">{{data.meta}}</p>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.sc-message--long-text {
  padding: 17px 20px;
  border-radius: 6px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
  max-width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;
}

.sc-message--content.sent .sc-message--long-text {
  color: white;
  background-color: #4e8cff;
  max-width: calc(100% - 120px);
  word-wrap: break-word;
}
.sc-message--content.received .sc-message--long-text {
  color: #263238;
  background-color: #f4f7f9;
  margin-right: 40px;
}
</style>
