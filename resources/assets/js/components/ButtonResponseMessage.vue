<template>
  <div class="sc-message--button-response" :style="messageColors">
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
    messageColors: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.sc-message--button-response {
  padding: 10px 12px;
  border-radius: 6px;
  max-width: calc(100% - 40px);
}

.sc-message--button-response .button {
  color: #222222;
  background-color: white;
  border-radius: 30px;
  border: none;
  font-size: 14px;
  padding: 12px 17px;
}
</style>
