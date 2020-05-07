<template>
  <div>
    <button
      v-if="!confirmCloseChat"
      @click.stop="toggleConfirmCloseChat"
      class="end-chat-btn"
      :class="{confirmCloseChatAnimate: !confirmCloseChat}"
    >{{ endChatMessage }}</button>
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
      endChatMessage() {
        if (this.$store.state.settings.bot && this.$store.state.settings.bot.endChatMessage) {
          return this.$store.state.settings.bot.endChatMessage;
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
      },
      closeChat(event) {
        this.confirmCloseChat = false;
        this.$emit("close-chat", event);
      }
    }
  }
</script>
