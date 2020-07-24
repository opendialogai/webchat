<template>
  <div class="od-long-user-input od-long-user-input--container">
    <div class="od-long-user-input--message">
      <template v-if="showConfirmationMessage">
        <span v-html="confirmationMessage"></span>
      </template>
      <template v-else>
        <span v-html="headerText"></span>
      </template>
    </div>
    <form class="od-long-user-input__input" :class="{active: inputActive}">
      <div
        role="button"
        tabIndex="0"
        @focus="setInputActive(true)"
        @blur="setInputActive(false)"
        @input="userInput"
        @keypress="onKeyPress"
        @paste="onPaste"
        :contentEditable="contentEditable"
        :placeholder="placeholder"
        class="od-long-user-input--text"
        ref="userInput"
      >{{initialText}}</div>
      <div class="od-long-user-input--buttons">
        <template v-if="showConfirmationMessage">
          <div class="od-long-user-input--button center">
            <button @click="submitYes">Yes</button>
            <button @click="submitEdit">Edit</button>
          </div>
        </template>
        <template v-else>
          <template v-if="maxInputCharacters">
            <div class="od-long-user-input--counter">
              {{ charactersCount }} / {{ maxInputCharacters }}
            </div>
          </template>
          <div class="od-long-user-input--button">
            <button @click="submitText" :disabled="!charactersCount">{{ buttonText }}</button>
          </div>
        </template>
      </div>
    </form>
  </div>
</template>


<script>
export default {
  components: {
  },
  props: {
    onSubmit: {
      type: Function,
      required: true
    },
    headerText: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'Submit'
    },
    maxInputCharacters: {
      type: Number,
      default: 0
    },
    placeholder: {
      type: String,
      default: 'Write a reply'
    },
    confirmationMessage: {
      type: String,
      default: 'Are you sure you want to submit?'
    },
    initialText: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      charactersCount: 0,
      inputActive: false,
      showConfirmationMessage: false,
      contentEditable: true
    }
  },
  methods: {
    onKeyPress(event) {
      if (this.maxInputCharacters && this.charactersCount >= this.maxInputCharacters) {
        event.preventDefault()
      }
    },
    onPaste(event) {
      event.preventDefault()

      var text = event.clipboardData.getData('text/plain')

      if (this.maxInputCharacters && (this.charactersCount + text.length) >= this.maxInputCharacters) {
        text = text.substring(0, this.maxInputCharacters - this.charactersCount)
      }

      document.execCommand("insertHTML", false, text)
    },
    userInput() {
      const text = this.$refs.userInput.textContent

      this.charactersCount = (text) ? text.length : 0
    },
    setInputActive (onoff) {
      this.inputActive = onoff
    },
    submitYes(event) {
      event.preventDefault()

      this.showConfirmationMessage = false
      this._submitText()
    },
    submitEdit(event) {
      event.preventDefault()

      this.contentEditable = true
      this.showConfirmationMessage = false
    },
    submitText(event) {
      event.preventDefault()

      this.contentEditable = false
      this.showConfirmationMessage = true
    },
    _submitText() {
      const text = this.$refs.userInput.innerText

      if (text && text.length > 0) {
        this.onSubmit({
          author: 'me',
          type: 'text',
          data: { text }
        })
        this.$refs.userInput.innerHTML = ''
      }
    }
  },
  mounted () {
    if (this.initialText) {
      this.charactersCount = this.initialText.length
    }

    this.$refs.userInput.focus()
  }
}
</script>

<style lang="scss">
.od-long-user-input {
  .od-long-user-input__input {
    background-color: var(--od-user-input-background);
    height: 100%;
    margin: 0px;
    position: relative;
    bottom: 0;
    display: flex;
    background-color: #f4f7f9;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    transition: background-color .2s ease,box-shadow .2s ease;
  }

  &.od-long-user-input--container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .od-long-user-input--message {
    padding: 25px 15px;
    background-color: white;
  }

  .od-long-user-input--text {
    color: var(--od-user-input-text);
    width: 100%;
    max-height: 100%;
    resize: none;
    border: none;
    outline: none;
    border-bottom-left-radius: 10px;
    box-sizing: border-box;
    padding: 18px;
    margin-bottom: 65px;
    font-size: 15px;
    font-weight: 400;
    line-height: 1.33;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #565867;
    -webkit-font-smoothing: antialiased;
    overflow: scroll;
    bottom: 0;
    overflow-x: hidden;
    overflow-y: auto;
  }

  .od-long-user-input--text:empty:before {
    content: attr(placeholder);
    display: block; /* For Firefox */
    /* color: rgba(86, 88, 103, 0.3); */
    filter: contrast(15%);
    outline: none;
  }

  .od-long-user-input--buttons {
    position: absolute;
    right: 0;
    bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .od-long-user-input--counter {
    margin-left: 15px;
  }

  .od-long-user-input--button {
    display: flex;
    margin-left: auto;
  }

  .od-long-user-input--button.center {
    margin-right: auto;
  }
  .od-long-user-input--button.center button:last-child {
    margin-right: 0;
  }

  .od-long-user-input--button button {
    cursor: pointer;
    color: white;
    background-color: #4e8cff;
    border-radius: 15px;
    border: none;
    font-size: 14px;
    padding: 12px 17px;
    margin-right: 15px;
  }

  .od-long-user-input--button button:disabled {
    background-color: #a9a9a9;
  }

  .od-long-user-input.active {
    box-shadow: none;
    background-color: white;
    box-shadow: 0px -5px 20px 0px rgba(150, 165, 190, 0.2);
  }

  .od-long-user-input--button label {
    position: relative;
    height: 24px;
    padding-left: 3px;
    cursor: pointer;
  }

  .od-long-user-input--button label:hover path {
    fill: rgba(86, 88, 103, 1);
  }

  .od-long-user-input--button input {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 99999;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    overflow: hidden;
  }

}
</style>
