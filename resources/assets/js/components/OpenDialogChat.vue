<template>
  <div
    class="opendialog-chat-window"
    :class="[ isMobile ? 'mobile' : '' ]"
    :style="cssProps"
  >
    <b-nav
      ref="opendialogWidgetTabs"
      fill
      pills
    >
      <b-nav-item
        v-if="commentsEnabled"
        :class="{ active: activeTab === 'comments' }"
        class="pr-1"
        @click="activateTab('comments')"
      >
        Comments
      </b-nav-item>
      <b-nav-item
        :class="{ active: activeTab === 'webchat' }"
        class="pr-1"
        @click="activateTab('webchat')"
      >
        WebChat
      </b-nav-item>
    </b-nav>
    <div
      v-show="commentsEnabled && activeTab == 'comments'"
      class="comments-container"
    >
      <div
        ref="opendialogWidgetSectionSelector"
        class="comment-section-selector-wrapper"
      >
        <b-form-select
          v-if="sectionOptions"
          v-model="sectionId"
          :options="sectionOptions"
          class="comment-section-selector"
          @change="updateSectionSelection"
        />
      </div>

      <Comments
        v-if="ready && apiReady"
        :key="commentsKey"
        :agent-profile="agentProfile"
        :callback-map="callbackMap"
        :can-close-chat="canCloseChat"
        :colours="colours"
        :comments-api-config="commentsApiConfig"
        :is-expand="isExpand"
        :is-mobile="isMobile"
        :load-history="loadHistory"
        :message-delay="messageDelay"
        :new-message-icon="newMessageIcon"
        :parent-url="parentUrl"
        :section-id="sectionId"
        :show-expand-button="false"
        :user="user"
        :user-timezone="userTimezone"
        :user-uuid="userUuid"
      />
    </div>
    <div
      v-if="activeTab == 'webchat'"
      class="webchat-container"
    >
      <WebChat
        v-if="ready"
        :agent-profile="agentProfile"
        :callback-map="callbackMap"
        :can-close-chat="canCloseChat"
        :colours="colours"
        :is-expand="isExpand"
        :is-mobile="isMobile"
        :load-history="loadHistory"
        :message-delay="messageDelay"
        :new-message-icon="newMessageIcon"
        :parent-url="parentUrl"
        :show-expand-button="false"
        :user="user"
        :user-timezone="userTimezone"
        :user-uuid="userUuid"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';
import Comments from '@/components/Comments';
import WebChat from '@/components/WebChat';

const { detect } = require('detect-browser');
const jstz = require('jstz');

export default {
  name: 'OpenDialogChat',
  components: {
    Comments,
    WebChat,
  },
  data() {
    return {
      activeTab: 'webchat',
      agentProfile: {
        teamName: 'Opendialog Webchat',
        imageUrl: null,
      },
      callbackMap: [],
      canCloseChat: true,
      colours: {
        header: {
          bg: '#4e8cff',
          text: '#ffffff',
        },
        launcher: {
          bg: '#4e8cff',
        },
        messageList: {
          bg: '#ffffff',
        },
        sentMessage: {
          bg: '#4e8cff',
          text: '#ffffff',
        },
        receivedMessage: {
          bg: '#eaeaea',
          text: '#222222',
        },
        userInput: {
          bg: '#f4f7f9',
          text: '#565867',
        },
      },
      commentsApiConfig: {},
      commentsKey: 0,
      commentsEnabled: false,
      commentsEnabledPathPattern: '',
      cssProps: {},
      isExpand: false,
      isMobile: false,
      isOpen: true,
      loadHistory: true,
      messageDelay: 1000,
      newMessageIcon: '',
      parentUrl: '',
      sectionId: '',
      sectionOptions: [],
      settingsInitialised: false,
      showExpandButton: true,
      timezoneInitialised: false,
      user: {},
      userTimezone: '',
      userUuid: '',
    };
  },
  computed: {
    ...mapState(['apiReady']),
    ready() {
      return this.settingsInitialised && this.timezoneInitialised;
    },
  },
  watch: {
    // Refresh comments when the section is changed.
    sectionId(newId, oldId) {
      if (newId !== oldId) {
        this.commentsKey += 1;
      }
    },
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('mobile')) {
      if (urlParams.get('mobile')) {
        this.isMobile = true;
        this.showExpandButton = false;
      }
    }

    this.initSettings();
  },
  methods: {
    activateTab(tabName) {
      this.activeTab = tabName;

      // Timeout is necessary to make the select element available
      // for the height calculation.
      setTimeout(() => { this.cssProps = this.getCssProps(); }, 0);
    },
    getCssProps() {
      const cssVars = {};

      if (this.colours.header && this.colours.header.bg) {
        cssVars['--header-background-color'] = this.colours.header.bg;
      }
      if (this.colours.header && this.colours.header.text) {
        cssVars['--header-text-color'] = this.colours.header.text;
      }

      // Starting height of 2px accounts for the bottom border.
      let headerHeight = 2;
      if (this.$refs.opendialogWidgetTabs) {
        headerHeight += this.$refs.opendialogWidgetTabs.clientHeight;
      }
      if (this.$refs.opendialogWidgetSectionSelector) {
        headerHeight += this.$refs.opendialogWidgetSectionSelector.clientHeight;
      }
      cssVars['--header-height'] = `${headerHeight}px`;

      return cssVars;
    },
    initSettings() {
      const self = this;

      axios.get('https://ipinfo.io/').then(
        (response) => {
          const browserInfo = detect();

          const ipAddress = response.data.ip;
          const { country } = response.data;
          const browserLanguage = navigator.language || navigator.userLanguage;
          const { os } = browserInfo;
          const browser = `${browserInfo.name} ${browserInfo.version}`;
          const timezone = jstz.determine().name();

          this.user = {
            ipAddress,
            country,
            browserLanguage,
            os,
            browser,
            timezone,
          };

          this.userTimezone = timezone;

          this.timezoneInitialised = true;
        },
        () => {
          // This is axios' error handler.
          this.timezoneInitialised = true;
        },
      );

      window.addEventListener('message', (event) => {
        if (event.data) {
          if (event.data.parentUrl) {
            self.parentUrl = event.data.parentUrl;
          }

          if (event.data.colours) {
            const { colours } = event.data;

            if (colours.headerBackground) {
              self.colours.header.bg = colours.headerBackground;
            }
            if (colours.headerText) {
              self.colours.header.text = colours.headerText;
            }
            if (colours.launcherBackground) {
              self.colours.launcher.bg = colours.launcherBackground;
            }
            if (colours.messageListBackground) {
              self.colours.messageList.bg = colours.messageListBackground;
            }
            if (colours.sentMessageBackground) {
              self.colours.sentMessage.bg = colours.sentMessageBackground;
            }
            if (colours.sentMessageText) {
              self.colours.sentMessage.text = colours.sentMessageText;
            }
            if (colours.receivedMessageBackground) {
              self.colours.receivedMessage.bg = colours.receivedMessageBackground;
            }
            if (colours.receivedMessageText) {
              self.colours.receivedMessage.text = colours.receivedMessageText;
            }
            if (colours.userInputBackground) {
              self.colours.userInput.bg = colours.userInputBackground;
            }
            if (colours.userInputText) {
              self.colours.userInput.text = colours.userInputText;
            }

            this.cssProps = this.getCssProps();
          }

          if (event.data.teamName) {
            self.agentProfile.teamName = event.data.teamName;
          }

          if (event.data.messageDelay) {
            self.messageDelay = event.data.messageDelay;
          }

          if (event.data.user && !window._.isEmpty(event.data.user)) {
            self.user = event.data.user;
            self.userUuid = self.user.email;
          }

          if (event.data.newMessageIcon) {
            self.newMessageIcon = event.data.newMessageIcon;
          }

          if (event.data.callbackMap) {
            self.callbackMap = event.data.callbackMap;
          }

          if (event.data.disableCloseChat) {
            self.canCloseChat = false;
          }

          if (event.data.expandChat) {
            if (!self.isExpand || !self.isOpen) {
              self.expandChat(true);
            }
          }

          if (event.data.disableExpandChat) {
            self.showExpandButton = false;
          }

          if (event.data.collapseChat) {
            if (self.isExpand) {
              self.expandChat();
            }
          }

          if (event.data.commentsEnabled) {
            self.commentsEnabled = true;

            if (event.data.commentsEnabledPathPattern) {
              self.commentsEnabledPathPattern = event.data.commentsEnabledPathPattern;
            }

            if (event.data.commentsApiConfig) {
              self.commentsApiConfig = event.data.commentsApiConfig;

              if (this.commentsApiConfig.section
                && this.commentsApiConfig.section.entityName) {
                this.getCommentSections();
              }
            }
          }

          if (event.data.triggerConversation) {
            // FIXME pass this to child component.
            self.sendMessage({
              type: 'trigger',
              author: self.userUuid,
              data: {
                callback_id: event.data.triggerConversation.callback_id,
              },
            });
          }

          if (event.data.loadHistory !== undefined) {
            self.loadHistory = event.data.loadHistory;
            self.loading = event.data.loadHistory;
          }

          if (event.data.newPathname !== undefined) {
            this.handleHistoryChange(event.data.newPathname);
          }

          if (!self.settingsInitialised) {
            self.settingsInitialised = true;
          }
        }
      });
    },
    getCommentSections() {
      this.$store.dispatch('sections/loadAll').then(() => {
        const sections = this.$store.getters['sections/all'];
        sections.forEach((section) => {
          this.sectionOptions.push({
            value: section.id,
            text: section.attributes[
              this.commentsApiConfig.section.fieldMapping.nameField
            ],
          });
        });

        // Default to the first section if one is not selected.
        if (!this.sectionId) {
          this.sectionId = this.sectionOptions[0].value;
        }

        this.cssProps = this.getCssProps();
      });
    },
    handleHistoryChange(e) {
      if (this.commentsEnabledPathPattern) {
        const matches = e.match(this.commentsEnabledPathPattern);
        if (matches && matches.length > 0) {
          this.commentsEnabled = true;
        } else {
          this.commentsEnabled = false;
        }
      }

      // React to changes in the comment section.
      if (this.commentsApiConfig && this.commentsApiConfig.sectionPathPattern) {
        const matches = e.match(this.commentsApiConfig.sectionPathPattern);
        if (matches && matches.length > 1) {
          this.updateSectionSelection(matches[1]);
        }
      }
    },
    toggleChatOpen() {
      if (this.canCloseChat) {
        this.isOpen = !this.isOpen;

        if (window.self !== window.top) {
          if (!this.isOpen) {
            const height = document.querySelector('.opendialog-chat-window').offsetHeight;
            window.parent.postMessage({ height: `${height}px` }, '*');
          } else {
            window.parent.postMessage({ height: 'auto' }, '*');
          }
        }
      }
    },
    updateSectionSelection(sectionId) {
      if (this.sectionId !== sectionId) {
        this.sectionId = sectionId;
      }
    },
  },
};
</script>

<style>
.nav {
  background-color: var(--header-background-color);
  border-bottom: 1px solid var(--header-text-color);
  color: var(--header-text-color);
}
.nav .nav-item a.nav-link {
  color: var(--header-text-color);
}
.nav .nav-item.active {
  background-color: var(--header-text-color);
}
.nav .nav-item.active a.nav-link {
  color: var(--header-background-color);
}
.comment-section-selector-wrapper {
  border-bottom: 1px solid var(--header-text-color);
}
.comment-section-selector-wrapper .comment-section-selector {
  border: none;
}

.sc-chat-window {
  height: calc(100vh - var(--header-height)) !important;
}
</style>
