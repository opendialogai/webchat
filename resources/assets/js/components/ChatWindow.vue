<template>
  <div class="chat-window sc-chat-window" :class="{opened: isOpen, closed: !isOpen, expanded: isExpand, fullscreen: fullScreen}">
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
      :isOpen="isOpen"
      :ctaText="ctaText"
      :showFullPageFormInput="showFullPageFormInput"
      :showFullPageRichInput="showFullPageRichInput"
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
      :mode-data="modeData"
      @setChatMode="setChatMode"
    />

    <template v-if="showLongTextInput">
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
    <template v-else-if="showFullPageFormInput">
      <FullPageFormInput
        :message="fpFormInputMessage"
        :onSubmit="onFullPageFormInputSubmit"
        :onCancel="onFullPageFormInputCancel"
        :colors="colors" />
    </template>
    <template v-else-if="showFullPageRichInput">
      <FullPageRichInput
        :message="fpRichInputMessage"
        :onSubmit="onFullPageRichInputSubmit"
        :colors="colors" />
    </template>
    <template v-else>
      <UserInput
        :contentEditable="contentEditable"
        :showEmoji="showEmoji"
        :onSubmit="onUserInputSubmit"
        :onButtonClick="onButtonClick"
        :externalButtons="externalButtons"
        :animateExternalButtons="animateExternalButtons"
        :lastMessage="lastMessage"
        :showFile="showFile"
        :placeholder="placeholder"
        :colors="colors"
        :mode-data="modeData"
        @setChatMode="setChatMode"
      />
    </template>
  </div>
</template>

<script>
import Header from './Header.vue'
import MessageList from './MessageList.vue'
import UserInput from './UserInput.vue'
import FullPageFormInput from './FullPageFormInput.vue'
import FullPageRichInput from './FullPageRichInput.vue'
import LongTextUserInput from './LongTextUserInput.vue'

export default {
  components: {
    Header,
    MessageList,
    UserInput,
    FullPageFormInput,
    FullPageRichInput,
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
    fpFormInputMessage: {
      type: Object,
      default: () => {}
    },
    fpRichInputMessage: {
      type: Object,
      default: () => {}
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
    onFullPageFormInputSubmit: {
      type: Function,
      required: true
    },
    onFullPageFormInputCancel: {
        type: Function,
        required: true
    },
    onFullPageRichInputSubmit: {
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
    ctaText: {
      type: Array,
      default: () => []
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
    showFullPageFormInput: {
      type: Boolean,
      default: () => false
    },
    showFullPageRichInput: {
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
    },
    modeData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  watch: {
    "modeData.mode": function(newValue, oldValue) {
      if (newValue.mode !== 'custom') {
        this.agentProfile.teamName = '';
      }
    },
    "modeData.options.teamName": function(newValue, oldValue) {
      if (newValue) {
        this.agentProfile.teamName = 'You are now speaking to ' + newValue;
      }
    }
  },
  computed: {
    messages() {
      let messages = this.messageList

      return messages
    },
    animateExternalButtons() {
      if (this.messages.length > 0) {
        const lastMessage = this.messages[this.messages.length - 1]
        if (lastMessage.type === 'button' && lastMessage.data.external) {
          return lastMessage.data.animate
        }
      }

      return false
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
  },
  methods: {
    setChatMode(mode) {
      this.$emit('setChatMode', mode);
    }
  }
}
</script>
<style scoped>




</style>
