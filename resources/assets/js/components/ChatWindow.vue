<template>
  <div class="chat-window" :class="{opened: isOpen, closed: !isOpen, expanded: isExpand, fullscreen: fullScreen}">
    <Header
      v-if="!fullScreen"
      :teamName="agentProfile.teamName"
      :imageUrl="agentProfile.imageUrl"
      :onClose="onClose"
      :onExpand="onExpand"
      :showExpandButton="showExpandButton"
      :showRestartButton="showRestartButton"
      :onRestartButtonClick="onRestartButtonClick"
      :colors="colors"
    />
    <MessageList
      v-if="showMessages"
      :messages="messages"
      :imageUrl="agentProfile.imageUrl"
      :chatImageUrl="agentProfile.imageUrl"
      :showTypingIndicator="showTypingIndicator"
      :colors="colors"
      :alwaysScrollToBottom="alwaysScrollToBottom"
      :onButtonClick="onButtonClick"
      :onFormButtonClick="onFormButtonClick"
      :onListButtonClick="onListButtonClick"
      :onLinkClick="onLinkClick"
    />
    <template v-if="!showLongTextInput">
      <UserInput
        :contentEditable="contentEditable"
        :showEmoji="showEmoji"
        :onSubmit="onUserInputSubmit"
        :onButtonClick="onButtonClick"
        :externalButtons="externalButtons"
        :lastMessage="lastMessage"
        :showFile="showFile"
        :placeholder="placeholder"
        :colors="colors" />
    </template>
    <template v-else>
      <LongTextUserInput
        :headerText="headerText"
        :maxInputCharacters="maxInputCharacters"
        :buttonText="buttonText"
        :confirmationMessage="confirmationMessage"
        :onSubmit="onUserInputSubmit"
        :placeholder="placeholder"
        :initialText="initialText"
        :colors="colors" />
    </template>
  </div>
</template>

<script>
import Header from './Header.vue'
import MessageList from './MessageList.vue'
import UserInput from './UserInput.vue'
import LongTextUserInput from './LongTextUserInput.vue'

export default {
  components: {
    Header,
    MessageList,
    UserInput,
    LongTextUserInput
  },
  props: {
    contentEditable: {
      type: Boolean,
      default: true
    },
    fullScreen: {
      type: Boolean,
      default: false
    },
    showEmoji: {
      type: Boolean,
      default: false
    },
    showFile: {
      type: Boolean,
      default: false
    },
    showExpandButton: {
      type: Boolean,
      default: true
    },
    agentProfile: {
      type: Object,
      required: true
    },
    onUserInputSubmit: {
      type: Function,
      required: true
    },
    onClose: {
      type: Function,
      required: true
    },
    onExpand: {
      type: Function,
      required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    },
    onFormButtonClick: {
      type: Function,
      required: true
    },
    onListButtonClick: {
      type: Function,
      required: true
    },
    onLinkClick: {
      type: Function,
      required: true
    },
    onRestartButtonClick: {
      type: Function,
      required: true
    },
    messageList: {
      type: Array,
      default: () => []
    },
    isOpen: {
      type: Boolean,
      default: () => false
    },
    isExpand: {
      type: Boolean,
      default: () => false
    },
    placeholder: {
      type: String,
      default: 'Write a reply'
    },
    showRestartButton: {
      type: Boolean,
      default: () => false
    },
    showTypingIndicator: {
      type: Boolean,
      default: () => false
    },
    showLongTextInput: {
      type: Boolean,
      default: () => false
    },
    showMessages: {
      type: Boolean,
      default: () => true
    },
    maxInputCharacters: {
      type: Number,
      default: 0
    },
    headerText: {
      type: String,
      default: ''
    },
    buttonText: {
      type: String,
      default: 'Submit'
    },
    confirmationMessage: {
      type: String,
      default: 'Are you sure you want to submit?'
    },
    colors: {
      type: Object,
      required: true
    },
    alwaysScrollToBottom: {
      type: Boolean,
      required: true
    },
    initialText: {
        type: String,
        default: null
    }
  },
  data() {
    return {}
  },
  computed: {
    messages() {
      let messages = this.messageList

      return messages
    },
    externalButtons() {
      if (this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1]
        if (lastMessage.type === 'button' && lastMessage.data.external) {
          return lastMessage.data.buttons
        }
      }

      return []
    },
    lastMessage() {
      if (this.messages.length == 0) return {}
      return this.messages[this.messages.length - 1]
    }
  }
}
</script>
<style scoped>

</style>