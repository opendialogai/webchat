<template>
  <div class="od-user-input">
    <ExternalButtons
      :externalButtons="externalButtons"
      :animate="animateExternalButtons"
      v-on:sendExternalButton="_submitExternalButton"
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
  position: relative;
  width: 100%;

  .od-user-input__form {
    background-color: var(--od-user-input-background);
    min-height: 55px;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 20px;
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
    width: 100%;
    max-width: 700px;
    margin: 0 auto;
  }

  .od-user-input__form.active {
    box-shadow: 0px -5px 20px 0px rgba(150, 165, 190, 0.2);
  }

  .od-user-input__form.disabled {
    pointer-events: none;
    background: #a9a9a9;
  }

  .od-user-input__form-text-input {
    caret-color: currentColor;
    color: var(--od-user-input-text);
    display: inline-block;
    height: 100%;
    resize: none;
    border: none;
    outline: none;
    padding: 0;
    margin: 0 0 15px 0;
    font-family: Gotham;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    font-size: 16px;
    line-height: 1.38;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex: 1;
    width: 100%;
  }

  .od-user-input__form-text-input:empty:before {
    content: attr(placeholder);
    display: block; /* For Firefox */
    filter: contrast(15%);
    outline: none;
    cursor: text;
  }

  .od-user-input__buttons {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0;

    .od-user-input__button {
      border: 1px solid var(--od-button-background);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      outline: none;
      height: 100%;
      width: 100%;
    }

    .od-send-btn {
      background-color: var(--od-button-background);
      border: none;
      color: var(--od-button-text);
      width: auto;
      height: 50px;
      padding: 2px 20px;
      border-radius: 34.5px;
      transition: 0.4s;
      font-size: 18px;

      &:hover {
        background-color: var(--od-button-hover-background);
      }

      &:active,
      &:focus {
        outline: none;
        border: none;
      }
    }
  }
}
</style>
