const moment = require('moment-timezone');

let CustomMode = function(store, chatService) {
  this.name = "custom";
  this.typingIndicatorMessages = null;
  this.modeInstance = 0;
  this.dataLayerEventName = 'message_sent_to_live_agent';
  this.$store = store;
  this.chatService = chatService
};

CustomMode.prototype.sendRequest = async function(message) {
  return await new Promise((resolve) => {
    this.addTypingMessageToMessageList();

    // Faked custom request response
    setTimeout(() => {
      resolve([
        {
          content: 'Hello there! 👋'
        },
        {
          content: 'What\'s up?'
        }
      ]);
    }, 3000);
  });
};

CustomMode.prototype.sendResponseSuccess = function(response, sentMessage, webChatComponent) {
  this.setTeamName('Custom mode [Instance ' + this.modeInstance + ']');

  if (this.typingIndicatorMessages !== null && response.length > 0) {
    let firstMessage = response[0];
    this.convertTypingIndicatorToFirstMessage(firstMessage);
    firstMessage.skip = true;
  }

  if (response) {
    response.forEach((message) => {
      this.addMessageToMessageList(message);
    });
  }

  return Promise.resolve(this.$store.state.messageList);
};

CustomMode.prototype.sendResponseError = function(error, sentMessage) {
    return Promise.resolve();
};

CustomMode.prototype.sendTypingRequest = function(response) {
    return Promise.resolve();
};

CustomMode.prototype.sendTypingResponseSuccess = function(response) {
    return Promise.resolve();
};

CustomMode.prototype.sendTypingResponseError = function(error) {
    return Promise.resolve();
};

CustomMode.prototype.initialiseChat = async function(webChatComponent) {
  this.$store.commit('toggleContentEditable', true)
  this.setTeamName('Waiting for agent...');
  return Promise.resolve();
};

CustomMode.prototype.destroyChat = async function(t) {
  let modeDataInSession = this.chatService.session.getModeDataInSession();
  modeDataInSession.modeInstance++;

  this.$store.dispatch('setChatMode', modeDataInSession)
  return Promise.resolve();
};

CustomMode.prototype.postDestroyChat = function(oldModeData) {
  // Convert the original hand-to-Human message to a text message
  let filteredMessageList = this.$store.state.messageList.filter(
    message =>
      message.mode === "webchat" && message.type === "hand-to-system"
  );
  let handToSystemMessage = filteredMessageList[filteredMessageList.length - 1];

  if (handToSystemMessage) {
    handToSystemMessage.type = "text";
    handToSystemMessage.data.text = handToSystemMessage.data.elements.text;
  }

  this.$store.dispatch('sendMessage', {
    type: "trigger",
    author: "me",
    callback_id: oldModeData.options.callback_id,
    data: {}
  })

  return Promise.resolve();
};

CustomMode.prototype.addAuthorMessage = function(message) {
  let msg = {
    author: "them",
    data: {
      time: moment().tz("UTC").format("hh:mm:ss A"),
      date: moment().tz("UTC").format("ddd D MMM"),
    }
  }

  this.chatService.newAuthorMessage(msg, this.$store.state.modeData, this.$store.state.settings.general, this.$store.state.userName);
  this.$store.commit('updateMessageList', authorMsg)
  return authorMessage;
};

CustomMode.prototype.convertTypingIndicatorToFirstMessage = function(firstMessage) {
  let typingIndicatorIndices = this.typingIndicatorMessages;
  this.typingIndicatorMessages = null;

  let typingIndicatorMessage = typingIndicatorIndices.typing;
  typingIndicatorMessage.type = "text";
  typingIndicatorMessage.data = {
    text: firstMessage.content,
    time: moment().tz("UTC").format("hh:mm:ss A"),
    date: moment().tz("UTC").format("ddd D MMM"),
  };
};

CustomMode.prototype.addMessageToMessageList = function(textMessage) {
  if (textMessage.skip) {
    return;
  }

  const message = {
    author: "them",
    mode: "custom",
    modeInstance: this.modeInstance,
    type: "text",
    user_id: this.$store.state.uuid,
    data: {
      text: textMessage.content,
      time: moment().tz("UTC").format("hh:mm:ss A"),
      date: moment().tz("UTC").format("ddd D MMM"),
    }
  };

  this.$store.commit('updateMessageList', message)
  let event = "message_received_from_agent";

  window.parent.postMessage(
      { dataLayerEvent: event },
      this.referrerUrl
  );
};

CustomMode.prototype.addTypingMessageToMessageList = function() {
  if (this.typingIndicatorMessages !== null) {
    return;
  }

  let previousMessage = this.$store.state.messageList[this.$store.state.messageList.length-1];

  let authorMessage = null;
  if (previousMessage.mode !== "custom" || previousMessage.author !== "them") {
    authorMessage = this.addAuthorMessage({}) - 1;
  }

  let newTypingIndicatorMessage = {
    author: "them",
    type: "typing",
    mode: "custom",
    modeInstance: this.modeInstance,
    data: {
      animate: true,
    }
  };
  this.$store.commit('updateMessageList', newTypingIndicatorMessage)

  this.typingIndicatorMessages = {
    author: authorMessage,
    typing: newTypingIndicatorMessage
  };
};

CustomMode.prototype.setTeamName = function(teamName) {
  let updatedModeData = this.$store.state.modeData;
  updatedModeData.options.teamName = teamName;

  this.$store.dispatch('setChatMode', updatedModeData)
};

CustomMode.prototype.clearTypingIndicator = function() {
  let typingIndicatorIndices = this.typingIndicatorMessages;
  let typingIndicatorMessage = typingIndicatorIndices.typing;
  if (typingIndicatorMessage.type === "typing") {
    this.$store.commit('spliceMessageList', {start: this.$store.messageList.indexOf(typingIndicatorIndices.typing), count: 1})
    if (typingIndicatorIndices.author !== null) {
      this.$store.commit('spliceMessageList', {start: this.$store.messageList.indexOf(typingIndicatorIndices.author), count: 1})
    }

    this.typingIndicatorMessages = null;
  }
};

CustomMode.prototype.setModeInstance = function(number) {
  this.modeInstance = number;
};

CustomMode.prototype.getDataLayerEventName = function () {
  return this.dataLayerEventName;
};

export default CustomMode;
