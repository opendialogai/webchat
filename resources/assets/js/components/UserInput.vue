<template>
  <div class="user-input" :style="{backgroundColor: colors.messageList.bg}">
    <ExternalButtons
      :externalButtons="externalButtons"
      :animate="animateExternalButtons"
      v-on:sendExternalButton="_submitExternalButton"
      :colors="colors"
    />

    <div v-if="file" class="file-container">
      <span class="icon-file-message">
        <img src="./assets/file.svg" alt="genericFileIcon" height="15" />
      </span>
      {{file.name}}
      <span class="delete-file-message" @click="cancelFile()">
        <img src="./assets/close.svg" alt="close icon" height="10" title="Remove the file" />
      </span>
    </div>

    <form
      class="user-input__form"
      :class="{active: inputActive, disabled: !contentEditable}"
      :style="{background: colors.userInput.bg}"
    >
      <div
        role="button"
        tabindex="0"
        @focus="setInputActive(true)"
        @blur="setInputActive(false)"
        @keydown="handleKey"
        @input="onTextChange($event)"
        :contentEditable="contentEditable"
        :placeholder="placeholder"
        class="user-input__form-text-input"
        ref="userInput"
        :style="{color: colors.userInput.text}"
      ></div>

      <div class="user-input__buttons">
        <button @click.prevent="_submitText" class="send-btn"></button>

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
    closeChat() {
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
            text: 'End chat',
            value: ''
          }
        });
      }
    }
  }
};
</script>

<style>
</style>
