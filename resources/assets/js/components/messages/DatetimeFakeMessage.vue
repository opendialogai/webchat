<template>
  <div class="od-message-datetime sc-message--datetime">
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

<style lang="scss">
.od-message-datetime {
  width: 100%;
  font-size: x-small;
  text-align: center;
  color: gray;
  margin-top: 5px;
}
</style>
