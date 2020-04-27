import ConversiveClient from "../clients/ConversiveClient";

const moment = require('moment-timezone');

let ConversiveMode = function() {
  this.name = "custom";
  this.client = null;
  this.pollingInterval = null;
  this.typingIndicatorIndices = null;
  this.modeInstance = 0;
};

ConversiveMode.prototype.sendRequest = function(message, webChatComponent) {
  if (this.typingIndicatorIndices) {
    this.clearTypingIndicator(webChatComponent);
  }

  this.client.sendMessageToHistory(message);

  return this.client.getSessionId(webChatComponent.uuid)
    .then(sessionId => this.client.sendMessage(message, sessionId));
};

ConversiveMode.prototype.sendResponseSuccess = function(response, sentMessage, webChatComponent) {
};

ConversiveMode.prototype.sendResponseError = function(error, sentMessage, webChatComponent) {
};

ConversiveMode.prototype.sendTypingRequest = function(message, webChatComponent) {
  return this.client.getSessionId(webChatComponent.uuid)
    .then((sessionId) => {
      return this.client.sendTypingMessage(message, sessionId);
    });
};

ConversiveMode.prototype.sendTypingResponseSuccess = function(response, webChatComponent) {
};

ConversiveMode.prototype.sendTypingResponseError = function(error, webChatComponent) {
};

ConversiveMode.prototype.initialiseChat = async function(webChatComponent) {
  this.client = new ConversiveClient(webChatComponent.conversiveUrl, webChatComponent.conversiveSiteCode);

  let name = webChatComponent.modeData.options.markupData.fullname;
  return this.client.getSessionId(webChatComponent.uuid, name)
    .then((sessionToken) => {
      return this.client.setEngineData(sessionToken, webChatComponent.modeData.options.markupData)
        .then(() => this.client.setEngineDataHistory(sessionToken, webChatComponent.modeData.options.markupData))
        .then(() => this.client.setChatData(sessionToken, webChatComponent.modeData.options.markupData))
        .then(() => this.client.sendAutoText(sessionToken, "_startup"))
        .then(() => {
          this.pollingInterval = setInterval(async () => {
            let isFirstRequest = this.client.serialNumber < 1;
            let messages = await this.client.getMessagesAfter(sessionToken);
            if (messages !== null) {
              this.handleNewMessages(messages, isFirstRequest, webChatComponent);
            } else {
              console.error("Failed to connect to chat agent.")
              this.destroyChat(webChatComponent);
            }
          }, 1000);
        })
        .then(() => this.client.sendAutoText(sessionToken, "_show_bot_history"));
    })
    .catch((error) => {
      console.error("Conversive error", error);
    });
};

ConversiveMode.prototype.destroyChat = async function(webChatComponent) {
  clearInterval(this.pollingInterval);
  this.client.logout(await this.client.getSessionId(webChatComponent.uuid));
  this.client = null;
};

ConversiveMode.prototype.handleNewMessages = function (messages, isFirstRequest, webChatComponent) {
  if (messages.length < 1) {
    return;
  }

  let incomingTextMessages = messages.filter(message => message.source === 2 && message.type === 1);

  // Filter out any typing messages besides the final one
  messages = messages.slice(0, -1).filter(message => message.type !== 2).concat(messages.slice(-1));

  if (this.typingIndicatorIndices !== null && incomingTextMessages.length > 0) {
    let firstMessage = incomingTextMessages[0];
    this.convertTypingIndicatorToFirstMessage(firstMessage, webChatComponent);
    firstMessage.skip = true;
  }

  if (incomingTextMessages.length > 0) {
    let lastMessage = incomingTextMessages[incomingTextMessages.length-1];
    this.setTeamName(lastMessage.n, webChatComponent);
  }

  messages.forEach((message) => {
    if (message.skip) {
      return;
    }

    switch (message.type) {
      case 1:
        this.handleNewTextMessage(message, isFirstRequest, webChatComponent);
        break;

      case 2:
        this.handleNewTypingMessage(message, isFirstRequest, webChatComponent);
        break;

      case 7:
        this.handleNewJoinMessage(message, isFirstRequest, webChatComponent);
        break;

      case 8:
        this.handleNewLeaveMessage(message, isFirstRequest, webChatComponent);
        break;
    }
  });
};

ConversiveMode.prototype.handleNewTextMessage = function(textMessage, isFirstRequest, webChatComponent) {
  if (textMessage.source === 1 && !isFirstRequest || ![1, 2].includes(textMessage.source)) {
    return;
  }

  if (this.typingIndicatorIndices) {
    this.clearTypingIndicator(webChatComponent);
  }

  this.addAuthorMessage(textMessage, webChatComponent);
  this.addMessageToMessageList(textMessage, isFirstRequest, webChatComponent);
};

ConversiveMode.prototype.handleNewTypingMessage = function(typingMessage, isFirstRequest, webChatComponent) {
  if (typingMessage.source !== 2 || isFirstRequest || this.typingIndicatorIndices !== null) {
    return;
  }

  let previousMessage = webChatComponent.messageList[webChatComponent.messageList.length-1];

  let authorIndex = null;
  if (previousMessage.mode !== "custom" || previousMessage.author !== "them") {
    authorIndex = this.addAuthorMessage(typingMessage, webChatComponent) - 1;
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

ConversiveMode.prototype.handleNewJoinMessage = function(joinMessage, isFirstRequest, webChatComponent) {
  if (joinMessage.source !== 2 || !isFirstRequest) {
    return;
  }

  if (joinMessage.n) {
    this.setTeamName(joinMessage.n, webChatComponent);
  }
};

ConversiveMode.prototype.handleNewLeaveMessage = function(leaveMessage, isFirstRequest, webChatComponent) {
  if (leaveMessage.source !== 2 || isFirstRequest) {
    return;
  }

  if (this.typingIndicatorIndices) {
    this.clearTypingIndicator(webChatComponent);
  }

  let authorMessage = {source: 2};
  this.addAuthorMessage(authorMessage, webChatComponent);

  let message = {
    source: 2,
    b: "The agent left the chat.",
  };
  this.addMessageToMessageList(message, isFirstRequest, webChatComponent);
};

ConversiveMode.prototype.addAuthorMessage = function(message, webChatComponent) {
  return webChatComponent.messageList.push(webChatComponent.newAuthorMessage({
    author: message.source === 1 ? "me" : "them",
    data: {
      time: moment().tz("UTC").format("hh:mm A"),
      date: moment().tz("UTC").format("ddd D MMM"),
    }
  }));
};

ConversiveMode.prototype.convertTypingIndicatorToFirstMessage = function(firstMessage, webChatComponent) {
  let typingIndicatorIndices = this.typingIndicatorIndices;
  this.typingIndicatorIndices = null;

  let typingIndicatorMessage = webChatComponent.messageList[typingIndicatorIndices.typing];
  typingIndicatorMessage.type = "text";
  typingIndicatorMessage.data = {
    text: firstMessage.b,
    time: moment().tz("UTC").format("hh:mm A"),
    date: moment().tz("UTC").format("ddd D MMM"),
  };

  this.client.sendMessageToHistory(typingIndicatorMessage, webChatComponent.modeData.options.teamName);
};

ConversiveMode.prototype.addMessageToMessageList = function(textMessage, isFirstRequest, webChatComponent) {
  const message = {
    author: textMessage.source === 1 ? "me" : "them",
    mode: "custom",
    modeInstance: this.modeInstance,
    type: "text",
    user_id: webChatComponent.user.email ? webChatComponent.user.email : webChatComponent.uuid,
    data: {
      text: textMessage.b,
      time: moment().tz("UTC").format("hh:mm A"),
      date: moment().tz("UTC").format("ddd D MMM"),
    }
  };

  if (!isFirstRequest) {
    this.client.sendMessageToHistory(message, webChatComponent.modeData.options.teamName);
  }

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

ConversiveMode.prototype.setTeamName = function(teamName, webChatComponent) {
  let updatedModeData = webChatComponent.modeData;
  updatedModeData.options.teamName = teamName;
  webChatComponent.setChatMode(updatedModeData);
};

ConversiveMode.prototype.clearTypingIndicator = function(webChatComponent) {
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

ConversiveMode.prototype.setModeInstance = function(number) {
  this.modeInstance = number;
};

export default ConversiveMode;
