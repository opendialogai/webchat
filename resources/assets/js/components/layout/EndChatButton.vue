<template>
  <div>
    <button
      v-if="!confirmCloseChat"
      @click.stop="toggleConfirmCloseChat"
      class="od-end-chat-btn"
      :class="{confirmCloseChatAnimate: !confirmCloseChat}"
    >{{ endChatText }}</button>
    <div
      v-if="confirmCloseChat"
      class="confirmCloseChat"
      :class="{confirmCloseChatAnimate: confirmCloseChat}"
    >
      <span>{{ endChatConfirmationMessage }}</span>
      <div class="confirmCloseChatButtons">
        <button class="end-chat-btn" @click.stop="closeChat">{{ endChatConfirmationPositive }}</button> /
        <button class="end-chat-btn" @click.stop="toggleConfirmCloseChat">{{ endChatConfirmationNegative }}</button>
      </div>
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
    computed: {
      endChatText() {
        if (this.$store.state.settings.bot && this.$store.state.settings.bot.endChatText) {
          return this.$store.state.settings.bot.endChatText;
        } else {
          return "End chat";
        }
      },
      endChatConfirmationMessage() {
        if (this.$store.state.settings.bot && this.$store.state.settings.bot.endChatConfirmationMessage) {
          return this.$store.state.settings.bot.endChatConfirmationMessage;
        } else {
          return "Are you sure?";
        }
      },
      endChatConfirmationPositive() {
        if (this.$store.state.settings.bot && this.$store.state.settings.bot.endChatConfirmationPositive) {
          return this.$store.state.settings.bot.endChatConfirmationPositive;
        } else {
          return "Yes";
        }
      },
      endChatConfirmationNegative() {
        if (this.$store.state.settings.bot && this.$store.state.settings.bot.endChatConfirmationNegative) {
          return this.$store.state.settings.bot.endChatConfirmationNegative;
        } else {
          return "No";
        }
      },
    },
    methods: {
      toggleConfirmCloseChat() {
        this.confirmCloseChat = !this.confirmCloseChat;
        window.parent.postMessage(
          { dataLayerEvent: "end_chat" }
        );
      },
      closeChat(event) {
        this.confirmCloseChat = false;
        this.$emit("close-chat", event, this.endChatText);
        window.parent.postMessage(
          { dataLayerEvent: "confirm_end_chat" }
        );
      }
    }
  }
</script>

<style lang="scss">
.od-end-chat-btn,
.od-end-chat-btn:hover,
.od-end-chat-btn:focus {
  border: none;
  outline: none;
  background: none;
  text-decoration: underline;
}
</style>
