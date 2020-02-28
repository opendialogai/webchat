<template>
  <div
    class="mt mt-button-response"
    :style="messageColors"
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
    },
    messageColors: {
      type: Object,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
