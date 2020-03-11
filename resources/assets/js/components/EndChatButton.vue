<template>
  <div
    class="user-input__button"
  >
    <button v-if="!confirmCloseChat" @click.stop="toggleConfirmCloseChat" class="end-chat-btn">End chat</button>
    <div v-if="confirmCloseChat">
      <span>Are you sure?</span>
      <button @click.stop="closeChat">Yes</button> / <button @click.stop="toggleConfirmCloseChat">No</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "EndChatButton",
    data: function() {
      return {
        confirmCloseChat: false
      }
    },
    methods: {
      toggleConfirmCloseChat() {
        this.confirmCloseChat = !this.confirmCloseChat;
        console.log("toggle");
      },
      closeChat(event) {
        this.confirmCloseChat = false;
        this.$emit("close-chat", event);
      }
    }
  }
</script>
