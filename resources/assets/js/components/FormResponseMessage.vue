<template>
  <div class="mt sc-message--form-response" :style="messageColors" :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author === 'them',
    }]">
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
    author: {
      type: String,
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
  /* padding: 10px 12px;
  border-radius: 6px;
  max-width: calc(100% - 40px); */
}
</style>
