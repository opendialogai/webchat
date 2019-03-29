<template>
  <div
    :class="[
      'opendialog-chat-window',
      (commentsEnabled ? 'comments-enabled' : 'comments-disabled'),
      (isMobile ? 'mobile' : 'desktop'),
    ]"
    :style="cssProps"
  >
    <div
      v-if="commentsEnabled && !isMinimized"
      class="minimize-button"
      @click="minimizeChat"
    />
    <div
      v-show="commentsEnabled && isMinimized"
      class="minimized-header"
      @click="maximizeChat"
    >
      {{ comments.commentsName ? comments.commentsName : 'Comments' }}
      /
      {{ agentProfile.teamName ? agentProfile.teamName : 'WebChat' }}
    </div>
    <b-nav
      v-show="commentsEnabled && !isMinimized"
      ref="opendialogWidgetTabs"
      fill
      pills
      :style="{visibility: showTabs ? 'visible' : 'hidden'}"
    >
      <b-nav-item
        v-if="commentsEnabled"
        :class="{ active: activeTab === 'comments' }"
        class="pr-1"
        @click="activateTab('comments')"
      >
        {{ comments.commentsName ? comments.commentsName : 'Comments' }}
      </b-nav-item>
      <b-nav-item
        :class="{ active: activeTab === 'webchat' }"
        class="pr-1"
        @click="activateTab('webchat')"
      >
        {{ agentProfile.teamName ? agentProfile.teamName : 'WebChat' }}
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
        :colours="colours"
        :comments-api-config="comments"
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
        :user-external-id="userExternalId"
      />
    </div>
    <div
      v-show="activeTab == 'webchat'"
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
        :chat-is-open="isOpen"
        :load-history="loadHistory"
        :message-delay="messageDelay"
        :new-message-icon="newMessageIcon"
        :parent-url="parentUrl"
        :show-expand-button="false"
        :user="user"
        :user-timezone="userTimezone"
        :user-uuid="userUuid"
        @expandChat="expandChat"
        @toggleChatOpen="toggleChatOpen"
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
      comments: {},
      commentsKey: 0,
      commentsEnabled: false,
      cssProps: {},
      isExpand: false,
      isMinimized: false,
      isMobile: false,
      isOpen: true,
      loadHistory: true,
      messageDelay: 1000,
      newMessageIcon: '',
      parentUrl: '',
      pathInitialised: false,
      sectionFilterPathPattern: '',
      sectionFilterQuery: '',
      sectionId: '',
      sectionOptions: [],
      sectionQueryString: '',
      settingsInitialised: false,
      showExpandButton: true,
      showTabs: false,
      timezoneInitialised: false,
      user: {},
      userTimezone: '',
      userFirstName: '',
      userLastName: '',
      userExternalId: '',
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
    apiReady(apiIsReady) {
      if (apiIsReady && this.pathInitialised && this.commentsEnabled) {
        this.getCommentSections();
      }
    },
    commentsEnabled(commentsAreEnabled) {
      if (commentsAreEnabled && this.pathInitialised && this.apiReady) {
        this.getCommentSections();
      }
    },
    pathInitialised(pathIsInitialised) {
      if (pathIsInitialised && this.apiReady && this.commentsEnabled) {
        this.getCommentSections();
      }
    },
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
    expandChat(forceExpand = false) {
      if (!this.showExpandButton && !forceExpand) {
        return;
      }

      this.isExpand = !this.isExpand;

      if (this.isExpand) {
        window.parent.postMessage({ dataLayerEvent: 'chatbot_maximized' }, '*');
      } else {
        window.parent.postMessage({ dataLayerEvent: 'chatbot_minimized' }, '*');
      }

      if (!this.isOpen) {
        this.toggleChatOpen();
      }

      // Only add the expanded class on non-mobile devices
      if (window.self !== window.top && !this.isMobile) {
        if (!this.isExpand) {
          window.parent.postMessage({ removeClass: 'expanded' }, '*');
          this.$root.$emit('scroll-down-message-list');
        } else {
          window.parent.postMessage({ addClass: 'expanded' }, '*');
          this.$root.$emit('scroll-down-message-list');
        }
      }
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

      // Show the tabs, now that we've got the correct CSS.
      this.showTabs = true;

      return cssVars;
    },
    initSettings() {
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

      // Add event listener for custom open dialog settings.
      const customConfig = {};
      window.addEventListener('message', (event) => {
        if (event.data) {
          // Add config items to our custom config object.
          Object.keys(event.data).forEach((key) => {
            customConfig[key] = event.data[key];
          });
        }
      });

      // Get default settings from the config endpoint.
      this.getWebchatConfig().then((config) => {
        this.setConfig(config);
        return true;
      }).then(() => {
        setTimeout(() => {
          // Over-ride default config with any custom settings.
          this.setConfig(customConfig);

          if (!this.settingsInitialised) {
            this.settingsInitialised = true;
          }
        }, 200);
      });
    },
    getCommentSections() {
      let action = '';
      let getter = '';
      let filter = {};
      if (this.sectionQueryString) {
        filter = {
          [this.sectionFilterQuery]: this.sectionQueryString,
        };
        action = 'sections/loadWhere';
        getter = 'sections/where';
      } else {
        action = 'sections/loadAll';
        getter = 'sections/all';
      }

      this.$store.dispatch(action, { filter }).then(() => {
        let sections = [];
        if (window._.isEmpty(filter)) {
          sections = this.$store.getters[getter];
        } else {
          sections = this.$store.getters[getter]({ filter });
        }

        sections.sort((a, b) => {
          const numberA = a.attributes.number;
          const numberB = b.attributes.number;

          if (numberA > numberB) return 1;
          if (numberA < numberB) return -1;
          return 0;
        }).forEach((section) => {
          this.sectionOptions.push({
            value: section.id,
            text: section.attributes[
              this.comments.commentsSectionNameFieldName
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
    async getWebchatConfig(url = '') {
      let configUrl = url;
      if (configUrl === '') {
        configUrl = `${window.location.origin}/webchat-config`;
      }

      const response = await fetch(configUrl);
      const json = await response.json();
      return json;
    },
    handleHistoryChange(e) {
      if (this.comments.commentsEnabledPathPattern) {
        const matches = e.match(this.comments.commentsEnabledPathPattern);
        if (matches && matches.length > 0) {
          this.commentsEnabled = true;
        } else {
          this.commentsEnabled = false;
        }
      }

      if (this.sectionFilterPathPattern) {
        const matches = e.match(this.sectionFilterPathPattern);
        if (matches && matches.length > 0) {
          // eslint-disable-next-line prefer-destructuring
          this.sectionQueryString = matches[1];
        } else {
          this.sectionQueryString = '';
        }
      }

      // React to changes in the comment section.
      if (this.comments && this.comments.commentsSectionPathPattern) {
        const matches = e.match(this.comments.commentsSectionPathPattern);
        if (matches && matches.length > 1) {
          this.updateSectionSelection(matches[1]);
        }
      }

      this.pathInitialised = true;
    },
    setConfig(config) {
      if (config.parentUrl) {
        this.parentUrl = config.parentUrl;
      }

      if (config.colours) {
        const { colours } = config;

        if (colours.headerBackground) {
          this.colours.header.bg = colours.headerBackground;
        }
        if (colours.headerText) {
          this.colours.header.text = colours.headerText;
        }
        if (colours.launcherBackground) {
          this.colours.launcher.bg = colours.launcherBackground;
        }
        if (colours.messageListBackground) {
          this.colours.messageList.bg = colours.messageListBackground;
        }
        if (colours.sentMessageBackground) {
          this.colours.sentMessage.bg = colours.sentMessageBackground;
        }
        if (colours.sentMessageText) {
          this.colours.sentMessage.text = colours.sentMessageText;
        }
        if (colours.receivedMessageBackground) {
          this.colours.receivedMessage.bg = colours.receivedMessageBackground;
        }
        if (colours.receivedMessageText) {
          this.colours.receivedMessage.text = colours.receivedMessageText;
        }
        if (colours.userInputBackground) {
          this.colours.userInput.bg = colours.userInputBackground;
        }
        if (colours.userInputText) {
          this.colours.userInput.text = colours.userInputText;
        }

        this.cssProps = this.getCssProps();
      }

      if (config.teamName) {
        this.agentProfile.teamName = config.teamName;
      }

      if (config.messageDelay) {
        this.messageDelay = config.messageDelay;
      }

      if (config.user && !window._.isEmpty(config.user)) {
        this.userUuid = config.user.email;

        if (config.user.first_name) {
          this.userFirstName = config.user.first_name;
        }

        if (config.user.last_name) {
          this.userLastName = config.user.last_name;
        }

        if (config.user.external_id) {
          this.userExternalId = config.user.external_id;
        }
      }

      if (config.newMessageIcon) {
        this.newMessageIcon = config.newMessageIcon;
      }

      if (config.callbackMap) {
        this.callbackMap = config.callbackMap;
      }

      if (config.disableCloseChat) {
        this.canCloseChat = false;
      }

      if (config.expandChat) {
        if (!this.isExpand || !this.isOpen) {
          this.expandChat(true);
        }
      }

      if (config.disableExpandChat) {
        this.showExpandButton = false;
      }

      if (config.collapseChat) {
        if (this.isExpand) {
          this.expandChat();
        }
      }

      if (config.comments) {
        if (config.comments.commentsEnabled) {
          this.commentsEnabled = true;
        }

        Object.keys(config.comments).forEach((commentConfigKey) => {
          this.comments[commentConfigKey] = config.comments[commentConfigKey];
        });

        if (this.comments.commentsSectionEntityName) {
          // Set up convenience mappings.
          this.sectionFilterQuery = this.comments.commentsSectionFilterQuery
            ? this.comments.commentSectionFilterQuery : '';
          this.sectionFilterPathPattern = this.comments.commentsSectionFilterPathPattern
            ? this.comments.commentsSectionFilterPathPattern : '';
        }
      }

      if (config.triggerConversation) {
        // FIXME pass this to child component.
        this.sendMessage({
          type: 'trigger',
          author: this.userUuid,
          data: {
            callback_id: config.triggerConversation.callback_id,
          },
        });
      }

      if (config.loadHistory !== undefined) {
        this.loadHistory = config.loadHistory;
        this.loading = config.loadHistory;
      }

      if (config.newPathname !== undefined) {
        this.handleHistoryChange(config.newPathname);
      }
    },
    toggleChatOpen(headerHeight = 0) {
      if (this.canCloseChat) {
        this.isOpen = !this.isOpen;

        if (!this.isOpen) {
          this.$root.$emit('scroll-down-message-list');
        }

        if (window.self !== window.top) {
          if (!this.isOpen) {
            if (headerHeight) {
              window.parent.postMessage({ height: `${headerHeight}px` }, '*');
            } else if (this.commentsEnabled) {
              const height = document.querySelector('.nav').offsetHeight;
              window.parent.postMessage({ height: `${height}px` }, '*');
            }
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
    minimizeChat() {
      this.isMinimized = true;
      window.parent.postMessage({ height: '40px' }, '*');
    },
    maximizeChat() {
      this.isMinimized = false;
      window.parent.postMessage({ height: 'auto' }, '*');
    },
  },
};
</script>

<style>
.nav {
  background-color: var(--header-text-color);
  border-bottom: 1px solid var(--header-background-color);
  color: var(--header-text-color);
}
.nav .nav-item a.nav-link {
  color: var(--header-background-color);
}
.nav .nav-item.active {
  background-color: var(--header-background-color);
}
.nav .nav-item.active a.nav-link {
  color: var(--header-text-color);
}
.comment-section-selector-wrapper {
  border-bottom: 1px solid var(--header-background-color);
}
.comment-section-selector-wrapper .comment-section-selector {
  border: none;
}

.comments-enabled .nav .nav-item {
  width: 40%;
}
.comments-enabled .nav .nav-item.active {
  width: 60%;
}

.sc-chat-window {
  height: calc(100vh - var(--header-height)) !important;
}
.comments-disabled .sc-chat-window {
  height: 100% !important;
}

.minimized-header {
  cursor: pointer;
  padding: 0.5rem 1rem;
  text-align: center;
  background-color: var(--header-background-color);
  color: var(--header-text-color);
}
</style>
