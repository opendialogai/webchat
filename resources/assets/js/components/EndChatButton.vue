<template>
  <div>
    <button
      v-if="!confirmCloseChat"
      @click.stop="toggleConfirmCloseChat"
      class="end-chat-btn"
      :class="{confirmCloseChatAnimate: !confirmCloseChat}"
    >End chat</button>
    <div
      v-if="confirmCloseChat"
      class="confirmCloseChat"
      :class="{confirmCloseChatAnimate: confirmCloseChat}"
    >
      <span>Are you sure?</span>
      <button class="end-chat-btn" @click.stop="closeChat">Yes</button> /
      <button class="end-chat-btn" @click.stop="toggleConfirmCloseChat">No</button>
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
      },
      closeChat(event) {
        this.confirmCloseChat = false;
        this.$emit("close-chat", event);
      }
    }
  }
</script>
