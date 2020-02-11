<template>
  <div class="sc-message--form-response" :style="messageColors">
    <div class="form-response" v-html="data.text"></div>
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
.sc-message--form-response {
  padding: 10px 12px;
  border-radius: 6px;
  max-width: calc(100% - 40px);
}
</style>
