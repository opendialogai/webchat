<template>
  <div class="sc-message--datetime">
    {{ message.datetime }}
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
.sc-message--datetime {
  width: 100%;
  font-size: x-small;
  text-align: center;
  color: gray;
  margin-top: 5px;
}
</style>
