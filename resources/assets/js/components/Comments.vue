<template>
  <div :class="[ isMobile ? 'mobile' : '', canCloseChat ? '' : 'no-close' ]">
    <template>
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
    },
    showExpandButton: Boolean,
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
      commentDateMapping: '',
      comments: [],
      commentTextMapping: '',
      confirmationMessage: null,
      headerText: '',
      initialText: null,
      maxInputCharacters: 0,
      messageList: [],
      messageListReady: false,
      participants: {},
      placeholder: 'Type a message',
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
    if (this.sectionId) {
      filter = {
        [this.sectionMapping]: this.sectionId,
      };
      action = 'comments/loadWhere';
      getter = 'comments/where';
    } else {
      action = 'comments/loadAll';
      getter = 'comments/all';
    }

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
          const avatarName = this.participants[this.userExternalId].name
            .split(' ').map(n => n[0]).join('').toUpperCase();

          const authorMsg = {
            type: 'author',
            author: 'me',
            data: {
              author: 'me',
              authorId: this.userExternalId,
              text: this.participants[this.userExternalId].name,
              avatar: `<span class="avatar">${avatarName}</span>`,
            },
          };
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
      // Fetch info for the current user.
      this.$set(this.participants, this.userExternalId, { name: '' });

      this.$store.dispatch('authors/loadById', { id: this.userExternalId }).then(() => {
        const author = this.$store.getters['authors/byId']({ id: this.userExternalId });
        this.participants[this.userExternalId].name = author.attributes[this.authorNameMapping];
      }).then(() => {
        this.comments.forEach((comment, cmntIdx) => {
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

          // Get the author name and add it to participants if we haven't already.
          if (!this.participants[authorId]) {
            this.$set(this.participants, authorId, { name: '' });

            this.$store.dispatch('authors/loadById', { id: authorId }).then(() => {
              const author = this.$store.getters['authors/byId']({ id: authorId });
              this.participants[authorId].name = author.attributes[this.authorNameMapping];

              // Update name for any author messages that have already been created.
              this.messageList.forEach((msg, msgIdx) => {
                if (msg.type === 'author' && msg.data.authorId === authorId) {
                  const newMsg = msg;
                  newMsg.data.text = author.attributes[this.authorNameMapping];

                  const avatarName = newMsg.data.text
                    .split(' ').map(n => n[0]).join('').toUpperCase();
                  newMsg.data.avatar = `<span class="avatar">${avatarName}</span>`;

                  this.$set(this.messageList, msgIdx, newMsg);
                }
              });
            });
          }

          if (cmntIdx === 0 || (message.author !== this.comments[cmntIdx - 1]
            .relationships[this.authorMapping].data.id
          )) {
            const avatarName = this.participants[authorId].name
              .split(' ').map(n => n[0]).join('').toUpperCase();

            const authorMsg = {
              type: 'author',
              data: {
                authorId,
                text: this.participants[authorId].name,
                avatar: `<span class="avatar">${avatarName}</span>`,
              },
            };
            if (comment.relationships[this.authorMapping].data.id === this.userExternalId) {
              authorMsg.author = 'me';
              authorMsg.data.author = 'me';
            }
            this.messageList.push(authorMsg);
          }
          this.messageList.push(message);
        });

        this.messageListReady = true;
      });
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
