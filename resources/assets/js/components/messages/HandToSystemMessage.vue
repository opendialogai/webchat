<template>
  <div v-if="errorMessage" class="od-message-text mt reap animate">
    <span class="fade-enter-active" v-html="errorMessage"></span>
  </div>
</template>

<script>
  import chatService from "../../services/ChatService";

  export default {
    name: "HandToSystemMessage",
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
      modeData: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        errorMessage: ''
      };
    },
    mounted() {
      if (chatService.hasMode(this.data.system)) {
        this.$emit('setChatMode', {
          mode: this.data.system,
          options: {
            callback_id: this.data.elements.callback_id,
            teamName: '',
            markupData: {
              starting_url: (document.referrer || document.location.href || "").split("?")[0],
              ...this.data.elements
            }
          }
        });
      } else {
        this.errorMessage = "The requested chat mode does not exist.";
      }
    }
  }
</script>

<style lang="scss">

</style>
