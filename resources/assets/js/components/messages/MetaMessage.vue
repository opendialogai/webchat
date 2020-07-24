<template>
</template>

<script>
  export default {
    name: "MetaMessage",
    props: {
      author: {
        type: String,
        required: true
      },
      type: {
        type: String,
        required: true
      },
      data: {
        type: Object,
        required: true
      },
    }
  }
</script>

<style lang="scss">

</style>
