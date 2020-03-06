import ConversiveClient from "../clients/ConversiveClient";

let ConversiveMode = function() {
  this.name = "custom";
  this.client = new ConversiveClient();
  this.pollingInterval = null;
  this.typingIndicatorIndex = null;
};

ConversiveMode.prototype.sendRequest = function(message, webChatComponent) {
  console.log("Sending:", message);

  return this.client.getSessionId(webChatComponent.uuid)
    .then(sessionId => this.client.sendTextMessage(message.data.text, sessionId));
};

ConversiveMode.prototype.sendResponseSuccess = function(response, webChatComponent) {
  console.log("Conversive mode response success", webChatComponent.modeData);
};

ConversiveMode.prototype.sendResponseError = function(error, webChatComponent) {
  console.log("Conversive mode response error", webChatComponent.modeData);
};
ConversiveMode.prototype.initialiseChat = async function(webChatComponent) {
  return this.client.getSessionId(webChatComponent.uuid)
    .then((sessionToken) => {
      return this.client.sendAutoText(sessionToken);
    })
    .then((response) => {
      return this.client.getSessionId(webChatComponent.uuid);
    })
    .then((sessionToken) => {
      this.pollingInterval = setInterval(async () => {
        let isFirstRequest = this.client.serialNumber < 1;
        let messages = await this.client.getMessagesAfter(sessionToken);
        this.handleNewMessages(messages, isFirstRequest, webChatComponent);
      }, 1000);
    })
    .catch((error) => {
      console.error(error);
    });
};

ConversiveMode.prototype.destroyChat = function(webChatComponent) {
  clearInterval(this.pollingInterval);
};

ConversiveMode.prototype.handleNewMessages = function (messages, isFirstRequest, webChatComponent) {
  let incomingTextMessages = messages.filter((message) => message.source === 2 && message.type === 1);
  let incomingTypingMessages = messages.filter((message) => message.source === 2 && message.type === 2);

  if (incomingTextMessages.length > 0) {
    this.handleNewTextMessages(incomingTextMessages, webChatComponent);
  }

  if (incomingTypingMessages.length > 0 && !isFirstRequest) {
    // We only show typing indicators for subsequent requests incase the initial batch contains previous indicators
    this.handleNewTypingMessages(incomingTypingMessages, webChatComponent);
  }
};

ConversiveMode.prototype.handleNewTextMessages = function(textMessages, webChatComponent) {
  if (this.typingIndicatorIndex !== null) {
    this.convertTypingIndicatorToFirstMessage(textMessages, webChatComponent);
    this.addMessagesToMessageList(textMessages.slice(1), webChatComponent);
  } else {
    this.addAuthorMessage(webChatComponent);
    this.addMessagesToMessageList(textMessages, webChatComponent);
  }

  this.setTeamName(textMessages, webChatComponent);
};

ConversiveMode.prototype.handleNewTypingMessages = function(typingMessages, webChatComponent) {
  let previousMessage = webChatComponent.messageList[webChatComponent.messageList.length-1];
  if (previousMessage.mode !== "custom" || previousMessage.author !== "them") {
    this.addAuthorMessage(webChatComponent);
  }

  let newTypingIndicatorMessage = {
    author: "them",
    type: "typing",
    mode: "custom",
    data: {
      animate: true,
    }
  };

  let index = webChatComponent.messageList.push(newTypingIndicatorMessage) - 1;
  this.typingIndicatorIndex = index;

  setTimeout(() => {
    let typingIndicatorMessage = webChatComponent.messageList[index];
    if (typingIndicatorMessage.type === "typing") {
      webChatComponent.messageList.splice(index, 1);
      this.typingIndicatorIndex = null;
    }
  }, 5000);
};

ConversiveMode.prototype.addAuthorMessage = function(webChatComponent) {
  webChatComponent.messageList.push(webChatComponent.newAuthorMessage({
    author: "them",
    data: {
      time: (new Date()).toLocaleTimeString(),
      date: (new Date()).toLocaleDateString(),
    }
  }));
};

ConversiveMode.prototype.convertTypingIndicatorToFirstMessage = function(textMessages, webChatComponent) {
  let typingIndicatorIndex = this.typingIndicatorIndex;
  this.typingIndicatorIndex = null;

  let firstMessage = textMessages[0];
  let typingIndicatorMessage = webChatComponent.messageList[typingIndicatorIndex];
  typingIndicatorMessage.type = "text";
  typingIndicatorMessage.data = {
    text: firstMessage.b,
    time: (new Date()).toLocaleTimeString(),
    date: (new Date()).toLocaleDateString(),
  };
};

ConversiveMode.prototype.addMessagesToMessageList = function(textMessages, webChatComponent) {
  textMessages.forEach((message) => {
    webChatComponent.messageList.push({
      author: "them",
      mode: "custom",
      type: "text",
      data: {
        text: message.b,
        time: (new Date()).toLocaleTimeString(),
        date: (new Date()).toLocaleDateString(),
      }
    });
  });
};

ConversiveMode.prototype.setTeamName = function(textMessages, webChatComponent) {
  let lastMessage = textMessages[textMessages.length-1];
  let updatedModeData = webChatComponent.modeData;
  updatedModeData.options.teamName = lastMessage.n;
  webChatComponent.setChatMode(updatedModeData);
};

export default ConversiveMode;
