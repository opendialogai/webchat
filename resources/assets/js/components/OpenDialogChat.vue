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
      v-show="ready && commentsEnabled && !isMinimized"
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
          v-if="sectionOptions.length"
          v-model="sectionId"
          :options="sectionOptions"
          class="comment-section-selector"
          @change="updateSectionSelection"
        />
      </div>

      <Comments
        v-if="ready && apiReady && sectionId"
        :key="commentsKey"
        :agent-profile="agentProfile"
        :callback-map="callbackMap"
        :colours="colours"
        :comments-api-config="comments"
        :is-expand="isExpand"
        :is-mobile="isMobile"
        :message-delay="messageDelay"
        :new-message-icon="newMessageIcon"
        :parent-url="parentUrl"
        :section-id="sectionId"
        :show-expand-button="false"
        :use-avatars="useAvatars"
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
        :chatbot-avatar-path="chatbotAvatarPath"
        :chatbot-name="chatbotName"
        :colours="colours"
        :is-expand="isExpand"
        :is-mobile="isMobile"
        :chat-is-open="isOpen"
        :show-history="showHistory"
        :number-of-messages="numberOfMessages"
        :message-delay="messageDelay"
        :new-message-icon="newMessageIcon"
        :parent-url="parentUrl"
        :show-expand-button="false"
        :use-avatars="useAvatars"
        :user="user"
        :user-info="userInfo"
        :user-timezone="userTimezone"
        :user-uuid="userUuid"
        :user-external-id="userExternalId"
        @expandChat="expandChat"
        @toggleChatOpen="toggleChatOpen"
        @newMessage="newWebChatMessage"
        @switchToCommentsTab="switchToCommentsTab"
      />
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapState } from 'vuex';

import cssVars from 'css-vars-ponyfill';

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
      chatbotAvatarPath: '',
      chatbotName: 'OD Bot',
      collectUserIp: true,
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
      commentsEnabled: true,
      cssProps: {},
      isExpand: false,
      isMinimized: false,
      isMobile: false,
      isOpen: true,
      showHistory: false,
      numberOfMessages: 10,
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
      useAvatars: false,
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
    settingsInitialised(settingsAreInitialised) {
      if (settingsAreInitialised && this.apiReady && this.pathInitialised && this.commentsEnabled) {
        this.getCommentSections();
      }

      if (this.collectUserIp) {
        this.getUserIp();
      }
    },
    commentsEnabled(commentsAreEnabled) {
      if (commentsAreEnabled && this.pathInitialised && this.apiReady) {
        this.getCommentSections();
      }
    },
    apiReady(apiIsReady) {
      if (apiIsReady && this.pathInitialised && this.commentsEnabled && this.settingsInitialised) {
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
      if (oldId !== '' && newId !== oldId) {
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
    newWebChatMessage() {
      this.activateTab('webchat');
    },
    switchToCommentsTab() {
      if (this.commentsEnabled) {
        this.activateTab('comments');
      }
    },
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
      const cssVariables = {};

      if (this.colours.header && this.colours.header.bg) {
        cssVariables['--header-background-color'] = this.colours.header.bg;
      }
      if (this.colours.header && this.colours.header.text) {
        cssVariables['--header-text-color'] = this.colours.header.text;
      }

      // Starting height of 2px accounts for the bottom border.
      let headerHeight = 2;
      if (this.$refs.opendialogWidgetTabs) {
        headerHeight += this.$refs.opendialogWidgetTabs.clientHeight;
      }
      if (this.$refs.opendialogWidgetSectionSelector) {
        headerHeight += this.$refs.opendialogWidgetSectionSelector.clientHeight;
      }
      if (this.isMinimized) {
        headerHeight = 50;
      }
      cssVariables['--header-height'] = `${headerHeight}px`;

      cssVars({
        onlyLegacy: true,
        variables: cssVariables,
      });

      // Show the tabs, now that we've got the correct CSS.
      this.showTabs = true;

      return cssVariables;
    },
    initSettings() {
      this.userTimezone = jstz.determine().name();
      const browserInfo = detect();
      const ipAddress = 'n/a';
      const { country } = 'n/a';
      const browserLanguage = navigator.language || navigator.userLanguage;
      const { os } = browserInfo;
      const browser = `${browserInfo.name} ${browserInfo.version}`;
      const timezone = jstz.determine().name();

      this.userInfo = {
        ipAddress,
        country,
        browserLanguage,
        os,
        browser,
        timezone,
      };

      this.timezoneInitialised = true;

      // Add event listener for custom open dialog settings.
      window.addEventListener('message', (event) => {
        if (event.data) {
          if (event.data.openDialogSettings) {
            const customConfig = event.data.openDialogSettings;
            customConfig.newPathname = event.data.newPathname;
            this.initialiseSettings(customConfig);
          }

          // Handle path changes.
          if (event.data.newPathname) {
            this.handleHistoryChange(event.data.newPathname);
          }

          if (event.data.customUserSettings) {
            Object.keys(event.data.customUserSettings).forEach((key) => {
              if (this.user.custom === undefined) this.user.custom = {};
              this.user.custom[key] = event.data.customUserSettings[key];
            });
          }
        }
      });
    },
    initialiseSettings(customConfig) {
      // Get default settings from the config endpoint.
      this.getWebchatConfig().then((config) => {
        this.setConfig(config);
        return true;
      }).then(() => {
        // Over-ride default config with any custom settings.
        this.setConfig(customConfig);

        if (!this.settingsInitialised) {
          this.settingsInitialised = true;
        }
      });
    },
    getUserIp() {
      axios.get('https://ipinfo.io/').then(
        (response) => {
          this.userInfo.ipAddress = response.data.ip;
          this.userInfo.country = response.data.country;
        },
      );
    },
    getCommentSections() {
      let action = '';
      let getter = '';
      let filter = {};
      if (this.sectionQueryString) {
        filter = {
          [this.sectionFilterQuery]: this.sectionQueryString,
          enabled: '1',
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

        this.sectionOptions = [];

        sections.sort((a, b) => {
          const numberA = parseInt(a.attributes.number, 10);
          const numberB = parseInt(b.attributes.number, 10);

          if (numberA > numberB) return 1;
          if (numberA < numberB) return -1;
          return 0;
        }).forEach((section) => {
          this.sectionOptions.push({
            value: section[this.comments.commentsSectionIdFieldName],
            text: section.attributes[
              this.comments.commentsSectionNameFieldName
            ],
          });
        });

        // Default to the first section if one is not detected.
        if (this.sectionId === '') {
          this.sectionId = (this.sectionOptions.length > 0) ? this.sectionOptions[0].value : '';
        }

        // Force comments reload.
        if (this.commentsKey > 0) {
          this.commentsKey += 1;
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
          this.activeTab = 'comments';

          setTimeout(() => {
            this.cssProps = this.getCssProps();
          }, 100);
        }
      }

      if (this.commentsEnabled === false) {
        this.activeTab = 'webchat';
      }

      this.pathInitialised = true;
    },
    setConfig(config) {
      if (config.parentUrl) {
        this.parentUrl = config.parentUrl;
      }

      if (config.expandChat) {
        if (!this.isExpand || !this.isOpen) {
          this.expandChat(true);
        }
      }

      if (config.collapseChat) {
        if (this.isExpand) {
          this.expandChat();
        }
      }

      if (config.newMessageIcon) {
        this.newMessageIcon = config.newMessageIcon;
      }

      if (config.general) {
        const { general } = config;

        if (general.teamName) {
          this.agentProfile.teamName = general.teamName;
        }

        if (general.messageDelay) {
          this.messageDelay = general.messageDelay;
        }

        if (general.useAvatars) {
          this.useAvatars = general.useAvatars;
        }

        if (Object.prototype.hasOwnProperty.call(general, 'collectUserIp')) {
          this.collectUserIp = general.collectUserIp;
        }

        if (general.chatbotAvatarPath) {
          this.chatbotAvatarPath = general.chatbotAvatarPath;
        }

        if (general.chatbotName) {
          this.chatbotName = general.chatbotName;
        }

        if (general.callbackMap) {
          this.callbackMap = general.callbackMap;
        }

        if (general.disableCloseChat) {
          this.canCloseChat = false;
        }

        if (config.disableExpandChat) {
          this.showExpandButton = false;
        }
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
      }

      if (config.user && !window._.isEmpty(config.user)) {
        this.user = config.user;

        if (config.user.email) {
          this.userUuid = config.user.email;
        }

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
            ? this.comments.commentsSectionFilterQuery : '';
          this.sectionFilterPathPattern = this.comments.commentsSectionFilterPathPattern
            ? this.comments.commentsSectionFilterPathPattern : '';
        }
      }

      if (config.triggerConversation) {
        // FIXME pass this to child component.
        this.sendMessage({
          type: 'trigger',
          author: this.userUuid,
          callback_id: config.triggerConversation.callback_id,
          data: {},
        });
      }

      if (config.webchatHistory !== undefined) {
        if (config.webchatHistory.showHistory !== undefined) {
          this.showHistory = config.webchatHistory.showHistory;
          this.loading = this.showHistory;
          if (config.webchatHistory.numberOfMessages !== undefined) {
            this.numberOfMessages = config.webchatHistory.numberOfMessages;
          }
        }
      }

      if (config.newPathname !== undefined) {
        this.handleHistoryChange(config.newPathname);
      }

      setTimeout(() => {
        this.cssProps = this.getCssProps();
      }, 1000);
    },
    toggleChatOpen(headerHeight = 0) {
      if (this.canCloseChat) {
        this.isOpen = !this.isOpen;
        this.isMinimized = !this.isOpen;

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
      this.isOpen = false;
      window.parent.postMessage({ height: '50px' }, '*');
    },
    maximizeChat() {
      this.isMinimized = false;
      this.isOpen = true;
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
  font-size: 17px;
}
.nav .nav-item.active {
  background-color: var(--header-background-color);
}
.nav .nav-item.active a.nav-link {
  color: var(--header-text-color);
  font-weight: 600;
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
  padding: 0.75rem 1rem;
  text-align: center;
  background-color: var(--header-background-color);
  color: var(--header-text-color);
}
</style>
