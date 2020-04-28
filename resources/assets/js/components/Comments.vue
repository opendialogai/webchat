<template>
  <div
    :class="[
      isMobile ? 'mobile' : '',
      canCloseChat ? '' : 'no-close',
      useBotAvatar ? 'show-bot-avatar' : '',
      useHumanAvatar ? 'show-human-avatar' : ''
    ]"
  >
    <template v-if="sectionId != '' || commentsApiConfig.commentsSectionIdFieldName == ''">
      <beautiful-chat
        v-if="messageListReady"
        :agent-profile="agentProfile"
        :always-scroll-to-bottom="true"
        :button-text="buttonText"
        :colors="colours"
        :content-editable="messageListReady"
        :close="closeComments"
        :expand="expandChat"
        :header-text="headerText"
        :is-expand="true"
        :is-open="isOpen"
        :message-list="messageList"
        :on-button-click="onButtonClick"
        :on-form-button-click="onFormButtonClick"
        :on-list-button-click="onListButtonClick"
        :on-link-click="onLinkClick"
        :on-message-was-sent="onMessageWasSent"
        :open="openComments"
        :placeholder="placeholder"
        :show-emoji="false"
        :show-expand-button="false"
        :show-file="false"
        :show-messages="showMessages"
        :show-typing-indicator="false"
      />
    </template>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

const moment = require('moment-timezone');

export default {
  name: 'Comments',
  props: {
    agentProfile: {
      type: Object,
      required: true,
    },
    callbackMap: {
      type: Array,
      required: true,
    },
    canCloseChat: Boolean,
    colours: {
      type: Object,
      required: true,
    },
    commentsApiConfig: {
      type: Object,
      required: true,
    },
    isExpand: Boolean,
    isMobile: Boolean,
    isOpen: Boolean,
    loadHistory: Boolean,
    messageDelay: {
      type: Number,
      required: true,
    },
    newMessageIcon: {
      type: String,
      required: true,
    },
    parentUrl: {
      type: String,
      required: true,
    },
    sectionId: {
      type: String,
      default: '',
      required: true,
    },
    showExpandButton: Boolean,
    useBotAvatar: Boolean,
    useHumanAvatar: Boolean,
    user: {
      type: Object,
      required: true,
    },
    userTimezone: {
      type: String,
      required: true,
    },
    userExternalId: {
      type: String,
      required: true,
    },
    userUuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      authorMapping: '',
      authorNameMapping: '',
      authorType: '',
      buttonText: 'Add Comment',
      chatbotAvatarPath: '',
      commentDateMapping: '',
      comments: [],
      commentTextMapping: '',
      confirmationMessage: null,
      headerText: '',
      initialText: null,
      maxInputCharacters: 0,
      messageList: [],
      messageListReady: false,
      placeholder: 'Type a message',
      sectionMapping: '',
      sectionType: '',
      showLongTextInput: false,
      showMessages: true,
      showTypingIndicator: false,
      users: [],
    };
  },
  created() {
    // Some convenience mappings.
    this.authorMapping = this.commentsApiConfig.commentsAuthorRelationshipName;
    this.authorNameMapping = this.commentsApiConfig.commentsAuthorNameFieldName;
    this.authorType = this.commentsApiConfig.commentsAuthorEntityName;
    this.commentDateMapping = this.commentsApiConfig.commentsCreatedFieldName;
    this.commentTextMapping = this.commentsApiConfig.commentsTextFieldName;
    this.sectionMapping = this.commentsApiConfig.commentsSectionRelationshipName;
    this.sectionType = this.commentsApiConfig.commentsSectionEntityName;
  },
  mounted() {
    let action = '';
    let getter = '';
    let filter = {};

    filter = {
      [this.sectionMapping]: this.sectionId,
      _: Math.random(),
    };
    action = 'comments/loadWhere';
    getter = 'comments/where';


    this.$store.dispatch(action, { filter }).then(() => {
      let comments = [];
      if (window._.isEmpty(filter)) {
        comments = this.$store.getters[getter];
      } else {
        comments = this.$store.getters[getter]({ filter });
      }
      this.comments = comments;
      this.processComments();
    });
  },
  methods: {
    ...mapActions({
      createComment: 'comments/create',
    }),
    closeComments() {},
    dateTimezoneFormat(message) {
      const date = moment(message.data.date).tz(this.userTimezone);

      /* eslint-disable no-param-reassign */
      message.data.date = date.format('ddd D MMM');
      message.data.time = date.format('hh:mm A');
      /* eslint-enable no-param-reassign */
    },
    expandChat() {
      this.$emit('expandChat');
    },
    onButtonClick() {},
    onFormButtonClick() {},
    onListButtonClick() {},
    onLinkClick() {},
    onMessageWasSent(msg) {
      // Format the new comment for JSON:API.
      const commentData = {
        attributes: {
          [this.commentDateMapping]: moment().utc().format(),
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
      };

      if (this.sectionId) {
        commentData.relationships[this.sectionMapping] = {
          data: {
            id: this.sectionId,
            type: this.sectionType,
          },
        };
      }

      // Send the comment to the backend.
      this.$store.dispatch('comments/create', commentData).then(() => {
        const newComment = this.$store.getters['comments/lastCreated'];
        const lastMessage = this.messageList[this.messageList.length - 1];

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
          };

          if (this.useHumanAvatar) {
            const avatarName = newComment.relationships[this.authorMapping].meta.name
              .split(' ').map((n) => n[0]).join('').toUpperCase();

            authorMsg.data.avatar = `<span class="avatar">${avatarName}</span>`;
          }

          this.messageList.push(authorMsg);
        }

        // Add the message to the list.
        const message = {
          type: 'text',
          author: 'me',
          data: {
            date: newComment.attributes[this.commentDateMapping],
            text: newComment.attributes[this.commentTextMapping],
          },
        };
        this.dateTimezoneFormat(message);
        this.messageList.push(message);
      });
    },
    openComments() {},
    processComments() {
      this.comments.forEach((comment) => {
        const authorId = comment.relationships[this.authorMapping].data.id;
        const message = {
          type: 'text',
          author: authorId,
          data: {
            date: comment.attributes[this.commentDateMapping],
            text: comment.attributes[this.commentTextMapping],
          },
        };
        this.dateTimezoneFormat(message);

        if (comment.relationships[this.authorMapping].data.id === this.userExternalId) {
          message.author = 'me';
        }

        const lastMessage = this.messageList[this.messageList.length - 1];

        // Add a new author message if necessary.
        if (!lastMessage || (lastMessage && lastMessage.author !== message.author)) {
          const authorMsg = {
            type: 'author',
            data: {
              authorId,
              text: comment.relationships[this.authorMapping].meta.name,
            },
          };
          if (comment.relationships[this.authorMapping].data.id === this.userExternalId) {
            authorMsg.author = 'me';
            authorMsg.data.author = 'me';
          }

          if (this.useBotAvatar) {
            const avatarName = comment.relationships[this.authorMapping].meta.name
              .split(' ').map((n) => n[0]).join('').toUpperCase();
            authorMsg.data.avatar = `<span class="avatar">${avatarName}</span>`;
          }

          this.messageList.push(authorMsg);
        }
        this.messageList.push(message);
      });

      this.messageListReady = true;
    },
  },
};

</script>

<style scoped>
    .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
    }

    .loading-message {
        font-size: 18px;
        color: #B6B5BA;
        margin-bottom: 17px;
    }

    .mobile .loading-message {
        margin-bottom: 5px;
    }

    .loading-indicator span {
        display: inline-block;
        background-color: #B6B5BA;
        width: 11px;
        height: 11px;
        border-radius: 100%;
        margin-right: 4px;
        animation: bob 2s infinite;
    }

    /* SAFARI GLITCH */
    .loading-indicator span:nth-child(1) {
        animation-delay: -1s;
    }

    .loading-indicator span:nth-child(2) {
        animation-delay: -0.85s;
    }

    .loading-indicator span:nth-child(3) {
        animation-delay: -0.7s;
    }

    @keyframes bob {
        10% {
            transform: translateY(-10px);
            background-color: #9E9DA2;
        }
        50% {
            transform: translateY(0);
            background-color: #B6B5BA;
        }
    }
</style>

<style>
    .comments-container .sc-header {
        display: none !important;
    }
</style>
