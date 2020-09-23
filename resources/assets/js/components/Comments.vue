<template>
  <div
    class="od-comments"
    :class="[
      isMobile ? 'mobile' : '',
      canCloseChat ? '' : 'no-close',
      useBotAvatar ? 'show-bot-avatar' : '',
      useHumanAvatar ? 'show-human-avatar' : '',
    ]"
  >
    <template
      v-if="
        sectionId != '' || commentsApiConfig.commentsSectionIdFieldName == ''
      "
    >
      <beautiful-chat
        :agent-profile="agentProfile"
        :always-scroll-to-bottom="true"
        :content-editable="messageListReady"
        :close="onClose"
        :expand="expandChat"
        :header-text="headerText"
        :is-expand="true"
        :is-open="isOpen"
        :on-message-was-sent="onMessageWasSent"
        :open="openComments"
        :show-expand-button="false"
        :show-typing-indicator="false"
        :on-full-page-form-input-submit="() => {}"
        :on-full-page-form-input-cancel="() => {}"
        :on-full-page-rich-input-submit="() => {}"
        :on-restart-button-click="() => {}"
        :on-download="() => {}"
      />
      <div v-if="showCloseChatButton" class="close-chat">
        <div
          class="close-chat__button"
          :class="{
            closeChatButtonAnimate: isOpen,
            closeChatButtonReverseAnimate: closeChatButtonReverseAnimate,
          }"
          @click="toggleChatOpen"
        >
          <img src="/images/close-btn.svg" class="close-chat__img" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

const moment = require('moment-timezone')

export default {
  name: 'Comments',
  props: {
    agentProfile: {
      type: Object,
      required: true,
    },
    canCloseChat: Boolean,
    commentsApiConfig: {
      type: Object,
      required: true,
    },
    isExpand: Boolean,
    isMobile: Boolean,
    loadHistory: Boolean,
    sectionId: {
      type: String,
      default: '',
      required: true,
    },
    showExpandButton: Boolean,
    user: {
      type: Object,
      required: true,
    },
    userTimezone: {
      type: String,
      required: true,
    }
  },
  data() {
    return {
      authorMapping: '',
      authorNameMapping: '',
      authorType: '',
      commentDateMapping: '',
      comments: [],
      commentTextMapping: '',
      headerText: '',
      messageListReady: false,
      sectionMapping: '',
      sectionType: '',
      showLongTextInput: false,
      showTypingIndicator: false,
      users: [],
      showCloseChatButton: false,
      closeChatButtonReverseAnimate: false,
      referrerUrl: '',
    }
  },
  created() {
    // Some convenience mappings.
    this.authorMapping = this.commentsApiConfig.commentsAuthorRelationshipName
    this.authorNameMapping = this.commentsApiConfig.commentsAuthorNameFieldName
    this.authorType = this.commentsApiConfig.commentsAuthorEntityName
    this.commentDateMapping = this.commentsApiConfig.commentsCreatedFieldName
    this.commentTextMapping = this.commentsApiConfig.commentsTextFieldName
    this.sectionMapping = this.commentsApiConfig.commentsSectionRelationshipName
    this.sectionType = this.commentsApiConfig.commentsSectionEntityName

    if (window.self !== window.top) {
      this.showCloseChatButton = true
      this.referrerUrl = document.referrer.match(/^.+:\/\/[^\/]+/)[0]
    } else {
      this.referrerUrl = document.location.origin
    }
  },
  mounted() {
    let action = ''
    let getter = ''
    let filter = {}

    filter = {
      [this.sectionMapping]: this.sectionId,
      _: Math.random(),
    }
    action = 'comments/loadWhere'
    getter = 'comments/where'

    this.$store.commit('updatePlaceholder', 'Type a message')

    this.$store.dispatch(action, { filter }).then(() => {
      let comments = []
      if (window._.isEmpty(filter)) {
        comments = this.$store.getters[getter]
      } else {
        comments = this.$store.getters[getter]({ filter })
      }
      this.comments = comments
      this.processComments()
    })
  },
  computed: {
    ...mapState({
      messageList: state => state.commentList,
      useHumanAvatar: state => state.settings.general.useHumanAvatar,
      useBotAvatar: state => state.settings.general.useBotAvatar,
      userExternalId: state => state.user.external_id,
      isOpen: state => state.isOpen
    }),
  },
  methods: {
    ...mapActions({
      createComment: 'comments/create',
    }),
    closeComments() {},
    dateTimezoneFormat(message) {
      const date = moment(message.data.date).tz(this.userTimezone)

      /* eslint-disable no-param-reassign */
      message.data.date = date.format('ddd D MMM')
      message.data.time = date.format('hh:mm A')
      /* eslint-enable no-param-reassign */
    },
    expandChat() {
      this.$emit('expandChat')
    },
    onClose() {
      if (this.showCloseChatButton) {
        if (!this.closeChatButtonReverseAnimate) {
          this.toggleChatOpen()
        }
      }
    },
    toggleChatOpen() {
      this.ctaText = []

      if (this.isOpen) {
        this.closeChatButtonReverseAnimate = true
        window.parent.postMessage(
          { dataLayerEvent: 'chatbot_minimized' },
          this.referrerUrl
        )
        setTimeout(() => {
          this.closeChatButtonReverseAnimate = false
          //this.isOpen = !this.isOpen;
          this.$emit('toggleChatOpen', 0)
        }, 300)
      } else {
        //this.isOpen = !this.isOpen;
        this.$emit('toggleChatOpen', 0)
        window.parent.postMessage(
          { dataLayerEvent: 'chatbot_maximized' },
          this.referrerUrl
        )
      }
    },
    onMessageWasSent(msg) {
      // Format the new comment for JSON:API.
      const commentData = {
        attributes: {
          [this.commentDateMapping]: moment()
            .utc()
            .format(),
          [this.commentTextMapping]: msg.data.text,
        },
        relationships: {
          [this.authorMapping]: {
            data: {
              id: this.userExternalId,
              type: this.authorType,
            },
          },
        },
      }

      if (this.sectionId) {
        commentData.relationships[this.sectionMapping] = {
          data: {
            id: this.sectionId,
            type: this.sectionType,
          },
        }
      }

      // Send the comment to the backend.
      this.$store.dispatch('comments/create', commentData).then(() => {
        const newComment = this.$store.getters['comments/lastCreated']
        const lastMessage = this.messageList[this.messageList.length - 1]

        // Add a new author message if necessary.
        if (!lastMessage || (lastMessage && lastMessage.author !== 'me')) {
          const authorMsg = {
            type: 'author',
            author: 'me',
            data: {
              author: 'me',
              authorId: this.userExternalId,
              text: newComment.relationships[this.authorMapping].meta.name,
            },
          }

          if (this.useHumanAvatar) {
            const avatarName = newComment.relationships[
              this.authorMapping
            ].meta.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()

            authorMsg.data.avatar = `<span class="avatar">${avatarName}</span>`
          }

          this.$store.commit('updateCommentList', authorMsg)
        }

        // Add the message to the list.
        const message = {
          type: 'text',
          author: 'me',
          data: {
            date: newComment.attributes[this.commentDateMapping],
            text: newComment.attributes[this.commentTextMapping],
          },
        }
        this.dateTimezoneFormat(message)
        this.$store.commit('updateCommentList', message)
      })
    },
    openComments() {},
    processComments() {
      this.comments.forEach(comment => {
        const authorId = comment.relationships[this.authorMapping].data.id
        const message = {
          type: 'text',
          author: authorId,
          data: {
            date: comment.attributes[this.commentDateMapping],
            text: comment.attributes[this.commentTextMapping],
          },
        }
        this.dateTimezoneFormat(message)

        if (
          comment.relationships[this.authorMapping].data.id ===
          this.userExternalId
        ) {
          message.author = 'me'
        }

        const lastMessage = this.messageList[this.messageList.length - 1]

        // Add a new author message if necessary.
        if (
          !lastMessage ||
          (lastMessage && lastMessage.author !== message.author)
        ) {
          const authorMsg = {
            type: 'author',
            data: {
              authorId,
              text: comment.relationships[this.authorMapping].meta.name,
            },
          }
          if (
            comment.relationships[this.authorMapping].data.id ===
            this.userExternalId
          ) {
            authorMsg.author = 'me'
            authorMsg.data.author = 'me'
          }

          if (this.useBotAvatar) {
            const avatarName = comment.relationships[
              this.authorMapping
            ].meta.name
              .split(' ')
              .map(n => n[0])
              .join('')
              .toUpperCase()
            authorMsg.data.avatar = `<span class="avatar">${avatarName}</span>`
          }

          this.$store.commit('updateCommentList', authorMsg)
        }
        this.$store.commit('updateCommentList', message)
      })

      this.messageListReady = true
    },
  },
}
</script>

<style lang="scss">
.od-comments {
  height: calc(var(--initial-vh, 1vh) * 100);

  .close-chat {
    display: flex;
    justify-content: center;
    margin-top: -30px;
    margin-bottom: 10px;
  }

  .close-chat__button {
    position: relative;
    z-index: 1;
    width: 70px;
    height: 70px;
    background-color: #313133;
    border-radius: 45px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    &:hover {
      background-color: #000000;
    }
  }

  .close-chat__img {
    width: 31px;
    height: 30px;
    object-fit: contain;
    transition: transform 0.5s;
  }

  .confirmCloseChat {
    opacity: 0;
    text-align: right;
  }

  .confirmCloseChatButtons {
    display: inline-block;
  }

  .confirmCloseChatAnimate {
    animation: confirmCloseChatAnim 0.6s forwards;
  }

  .closeChatButtonAnimate {
    animation: close-chat-spin 0.5s forwards;
  }

  .closeChatButtonReverseAnimate {
    animation: reverse-close-chat-spin 0.5s forwards;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    /* var inherited from OpenDialogChat component. */
    //   height: calc(100vh - var(--header-height));
  }

  .loading-message {
    font-size: 18px;
    color: #b6b5ba;
    margin-bottom: 17px;
  }

  .mobile .loading-message {
    margin-bottom: 5px;
  }

  .loading-indicator span {
    display: inline-block;
    background-color: #b6b5ba;
    width: 11px;
    height: 11px;
    border-radius: 100%;
    margin-right: 4px;
    animation: bob 2s infinite;
  }
}
</style>
