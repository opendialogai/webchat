const moment = require('moment-timezone');

let CustomMode = function() {
  this.name = "custom";
  this.typingIndicatorIndices = null;
  this.modeInstance = 0;
};

CustomMode.prototype.sendRequest = async function(message, webChatComponent) {
  return await new Promise((resolve) => {
    this.addTypingMessageToMessageList(webChatComponent);

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
  if (this.typingIndicatorIndices !== null && response.length > 0) {
    let firstMessage = response[0];
    this.convertTypingIndicatorToFirstMessage(firstMessage, webChatComponent);
    firstMessage.skip = true;
  }

  response.forEach((message) => {
    this.addMessageToMessageList(message, webChatComponent);
  });
};

CustomMode.prototype.sendResponseError = function(error, sentMessage, webChatComponent) {
    return new Promise((resolve, reject) => resolve());
};

CustomMode.prototype.sendTypingRequest = function(response, webChatComponent) {
    return new Promise((resolve, reject) => resolve());
};

CustomMode.prototype.sendTypingResponseSuccess = function(response, webChatComponent) {
    return new Promise((resolve, reject) => resolve());
};

CustomMode.prototype.sendTypingResponseError = function(error, webChatComponent) {
    return new Promise((resolve, reject) => resolve());
};

CustomMode.prototype.initialiseChat = async function(webChatComponent) {
  this.setTeamName('Custom mode [Instance ' + this.modeInstance + ']', webChatComponent);
};

CustomMode.prototype.destroyChat = async function(webChatComponent) {
  return new Promise((resolve, reject) => resolve());
};

CustomMode.prototype.addAuthorMessage = function(message, webChatComponent) {
  return webChatComponent.messageList.push(webChatComponent.newAuthorMessage({
    author: "them",
    data: {
      time: moment().tz("UTC").format("hh:mm:ss A"),
      date: moment().tz("UTC").format("ddd D MMM"),
    }
  }));
};

CustomMode.prototype.convertTypingIndicatorToFirstMessage = function(firstMessage, webChatComponent) {
  let typingIndicatorIndices = this.typingIndicatorIndices;
  this.typingIndicatorIndices = null;

  let typingIndicatorMessage = webChatComponent.messageList[typingIndicatorIndices.typing];
  typingIndicatorMessage.type = "text";
  typingIndicatorMessage.data = {
    text: firstMessage.content,
    time: moment().tz("UTC").format("hh:mm:ss A"),
    date: moment().tz("UTC").format("ddd D MMM"),
  };
};

CustomMode.prototype.addMessageToMessageList = function(textMessage, webChatComponent) {
  if (textMessage.skip) {
    return;
  }

  const message = {
    author: "them",
    mode: "custom",
    modeInstance: this.modeInstance,
    type: "text",
    user_id: webChatComponent.$store.state.uuid,
    data: {
      text: textMessage.content,
      time: moment().tz("UTC").format("hh:mm:ss A"),
      date: moment().tz("UTC").format("ddd D MMM"),
    }
  };

  webChatComponent.messageList.push(message);
  let event = "message_sent_to_agent";
  if (textMessage.source === 2) {
      event = "message_received_from_agent";
  }

  window.parent.postMessage(
      { dataLayerEvent: event },
      this.referrerUrl
  );
};

CustomMode.prototype.addTypingMessageToMessageList = function(webChatComponent) {
  if (this.typingIndicatorIndices !== null) {
    return;
  }

  let previousMessage = webChatComponent.messageList[webChatComponent.messageList.length-1];

  let authorIndex = null;
  if (previousMessage.mode !== "custom" || previousMessage.author !== "them") {
    authorIndex = this.addAuthorMessage({}, webChatComponent) - 1;
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

  let index = webChatComponent.messageList.push(newTypingIndicatorMessage) - 1;
  this.typingIndicatorIndices = {
    author: authorIndex,
    typing: index
  };
};

CustomMode.prototype.setTeamName = function(teamName, webChatComponent) {
  let updatedModeData = webChatComponent.modeData;
  updatedModeData.options.teamName = teamName;
  webChatComponent.setChatMode(updatedModeData);
};

CustomMode.prototype.clearTypingIndicator = function(webChatComponent) {
  let typingIndicatorIndices = this.typingIndicatorIndices;
  let typingIndicatorMessage = webChatComponent.messageList[typingIndicatorIndices.typing];
  if (typingIndicatorMessage.type === "typing") {
    // We should remove this prior to the author message as removing the authorIndex first would alter all indexes after it
    webChatComponent.messageList.splice(typingIndicatorIndices.typing, 1);

    if (typingIndicatorIndices.author !== null) {
      webChatComponent.messageList.splice(typingIndicatorIndices.author, 1);
    }

    this.typingIndicatorIndices = null;
  }
};

CustomMode.prototype.setModeInstance = function(number) {
  this.modeInstance = number;
};

export default CustomMode;
