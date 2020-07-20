<template>
  <div class="od-user-input">
    <ExternalButtons
      :externalButtons="externalButtons"
      :animate="animateExternalButtons"
      v-on:sendExternalButton="_submitExternalButton"
      :colors="colors"
    />

    <div v-if="file" class="od-file-container">
      <span class="od-icon-file-message">
        <img src="../assets/file.svg" alt="genericFileIcon" height="15" />
      </span>
      {{file.name}}
      <span class="od-delete-file-message" @click="cancelFile()">
        <img src="../assets/close.svg" alt="close icon" height="10" title="Remove the file" />
      </span>
    </div>

    <form
      class="od-user-input__form"
      :class="{active: inputActive, disabled: !contentEditable}"
    >
      <div
        role="button"
        tabindex="0"
        @focus="setInputActive(true)"
        @blur="setInputActive(false)"
        @keydown="handleKey"
        @input="onTextChange($event)"
        :contentEditable="contentEditable"
        :placeholder="placeholderText"
        class="od-user-input__form-text-input"
        ref="userInput"
      ></div>

      <div class="od-user-input__buttons">
        <button
          @click.prevent="_submitText"
          class="od-send-btn"
          :style="{
            '--send-btn-bg': colors.button.bg,
            '--send-btn-hover-bg': colors.button.bg,
          }"
        >{{ sendButtonText }}</button>

        <EndChatButton
          @close-chat="closeChat"
        />
      </div>
    </form>
  </div>
</template>


<script>

import ExternalButtons from "./ExternalButtons.vue";
import EndChatButton from "./EndChatButton";

export default {
  components: {
    EndChatButton,
    ExternalButtons
  },
  props: {
    contentEditable: {
      type: Boolean,
      default: true
    },
    externalButtons: {
      type: Array,
      default: () => []
    },
    animateExternalButtons: {
      type: Boolean,
      default: false
    },
    onSubmit: {
      type: Function,
      required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    },
    placeholder: {
      type: String,
      default: "Enter your message"
    },
    lastMessage: {
      type: Object,
      required: true
    },
    colors: {
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
      file: null,
      inputActive: false,
      textEntered: false,
    };
  },
  computed: {
    placeholderText () {
      if (this.$store.state.settings.bot && this.$store.state.settings.bot.inputPlaceholder) {
        return this.$store.state.settings.bot.inputPlaceholder;
      } else {
        return this.placeholder;
      }
    },
    sendButtonText () {
      if (this.$store.state.settings.bot && this.$store.state.settings.bot.sendButtonText) {
        return this.$store.state.settings.bot.sendButtonText;
      } else {
        return "Send";
      }
    },
  },
  created() {
    this.onTextChange = _.debounce(this.onTextChangeForDebouncing, 500);
  },
  methods: {
    cancelFile() {
      this.file = null;
    },
    setInputActive(onoff) {
      this.inputActive = onoff;

      if (onoff) {
        this.$parent.$parent.$emit("vbc-user-input-focus");
      } else {
        this.$parent.$parent.$emit("vbc-user-input-blur");
      }
    },
    handleKey(event) {
      if (event.keyCode === 13 && !event.shiftKey) {
        this._submitText(event);
        this.$parent.$parent.$emit("vbc-user-not-typing");
        this.textEntered = false;
        event.preventDefault();
      }
    },
    onTextChangeForDebouncing(event) {
      if (event.target.innerHTML === "" || event.target.innerHTML === "<br>") {
        // Input is empty, turn off the typing indicator.
        if (this.textEntered === true) {
          this.$parent.$parent.$emit("vbc-user-not-typing");
          this.textEntered = false;
        }
      } else {
        // Input is not empty, turn on the typing indicator if
        // it's not already.
        this.$parent.$parent.$emit("vbc-user-typing", event.target.innerHTML);
        this.textEntered = true;
      }
    },
    _submitExternalButton(button) {
      this.onButtonClick(button, this.lastMessage);
    },
    _submitText(event) {
      const text = this.$refs.userInput.textContent;
      const file = this.file;
      if (file) {
        if (text && text.length > 0) {
          this.onSubmit({
            author: "me",
            type: "file",
            data: { text, file }
          });
          this.file = null;
          this.$refs.userInput.innerHTML = "";
        } else {
          this.onSubmit({
            author: "me",
            type: "file",
            data: { file }
          });
          this.file = null;
        }
      } else {
        if (text && text.length > 0) {
          this.onSubmit({
            author: "me",
            type: "text",
            data: { text }
          });
          this.$refs.userInput.innerHTML = "";
        }
      }
    },
    _handleFileSubmit(file) {
      this.file = file;
    },
    closeChat(event, messageText = 'End chat') {
      if (this.modeData.mode === 'custom') {
        this.$emit('setChatMode', {
          mode: 'webchat',
          options: {
            'callback_id': this.modeData.options.callback_id
          }
        });
      } else {
        this.$parent.$parent.$parent.sendMessage({
          type: "button_response",
          author: "me",
          callback_id: "intent.app.end_chat",
          data: {
            text: messageText,
            value: ''
          }
        });
      }
    }
  }
};
</script>

<style lang="scss">
.od-user-input {
  background-color: var(--od-message-list-background);

  &__form {
    background-color: var(--od-user-input-background)
  }

  &__form-text-input {
    color: var(od-user-input__form-text-input);
  }
}
</style>
