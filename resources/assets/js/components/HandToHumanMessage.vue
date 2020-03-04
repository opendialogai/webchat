<template>
    <div
      class="mt mt-text"
    >
      <span>[Hand-to-Human]</span>
    </div>
</template>

<script>
  export default {
    name: "HandToHumanMessage",
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
      messageColors: {
        type: Object,
        required: true
      }
    },
    mounted() {
      console.log(this.data);

      console.log("Simulating H2H takeover");
      this.$emit('setChatMode', {
        mode: 'custom'
      });

      // setTimeout(() => {
      //   console.log("Simulating H2H giveback");
      //   this.$emit('setChatMode', {
      //     mode: 'webchat',
      //     options: {
      //       'callback_id': this.data.elements.callback_id
      //     }
      //   });
      // }, 2000);
    }
  }
</script>

<style scoped>

</style>
