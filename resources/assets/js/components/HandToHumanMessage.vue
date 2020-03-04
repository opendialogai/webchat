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
      },
      modeData: {
        type: Object,
        required: true
      }
    },
    watch: {
      modeData(newValue, oldValue) {
        console.log("H2H: modeData changed from/to ", oldValue, newValue);
      }
    },
    mounted() {
      console.log(this.data);

      console.log("Simulating H2H takeover");
      this.$emit('setChatMode', {
        mode: 'custom',
        options: {
          'callback_id': this.data.elements.callback_id
        }
      });
    }
  }
</script>

<style scoped>

</style>
