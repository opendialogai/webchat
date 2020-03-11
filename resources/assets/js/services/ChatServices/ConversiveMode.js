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
    .then(sessionId => this.client.sendMessage(message, sessionId));
};

ConversiveMode.prototype.sendResponseSuccess = function(response, sentMessage, webChatComponent) {
  console.log("Conversive mode response success", response);
};

ConversiveMode.prototype.sendResponseError = function(error, sentMessage, webChatComponent) {
  console.log("Conversive mode response error", error);
};

ConversiveMode.prototype.sendTypingRequest = function(message, webChatComponent) {
  return this.client.getSessionId(webChatComponent.uuid)
    .then((sessionId) => {
      return this.client.sendTypingMessage(message, sessionId);
    });
};

ConversiveMode.prototype.sendTypingResponseSuccess = function(response, webChatComponent) {
  console.log("Conversive mode typing response success", response);
};

ConversiveMode.prototype.sendTypingResponseError = function(error, webChatComponent) {
  console.log("Conversive mode typing response error", error);
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

ConversiveMode.prototype.destroyChat = async function(webChatComponent) {
  clearInterval(this.pollingInterval);
  this.client.logout(await this.client.getSessionId(webChatComponent.uuid));
};

ConversiveMode.prototype.handleNewMessages = function (messages, isFirstRequest, webChatComponent) {
  let incomingTextMessages = messages.filter(message => message.source === 2 && message.type === 1);

  // Filter out any typing messages besides the final one
  messages = messages.slice(0, -1).filter(message => message.type !== 2).concat(messages.slice(-1));

  if (this.typingIndicatorIndex !== null && incomingTextMessages.length > 0) {
    let firstMessage = incomingTextMessages[0];
    this.convertTypingIndicatorToFirstMessage(firstMessage, webChatComponent);
    firstMessage.skip = true;
  }

  if (incomingTextMessages.length > 0) {
    this.setTeamName(incomingTextMessages, webChatComponent);
  }

  messages.forEach((message) => {
    if (message.skip) {
      return;
    }

    let types = {
      1: "text",
      2: "typing",
      8: "leave",
    };
    console.log("[" + btoa(JSON.stringify(messages)).substr(-8) + "] New " + types[message.type] + " message");

    switch (message.type) {
      case 1:
        this.handleNewTextMessage(message, isFirstRequest, webChatComponent);
        break;

      case 2:
        this.handleNewTypingMessage(message, isFirstRequest, webChatComponent);
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

  this.addAuthorMessage(textMessage, webChatComponent);
  this.addMessageToMessageList(textMessage, webChatComponent);
};

ConversiveMode.prototype.handleNewTypingMessage = function(typingMessage, isFirstRequest, webChatComponent) {
  if (typingMessage.source !== 2 || isFirstRequest || this.typingIndicatorIndex !== null) {
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
    data: {
      animate: true,
    }
  };

  let index = webChatComponent.messageList.push(newTypingIndicatorMessage) - 1;
  this.typingIndicatorIndex = index;

  setTimeout(() => {
    let typingIndicatorMessage = webChatComponent.messageList[index];
    if (typingIndicatorMessage.type === "typing") {
      // We should remove this prior to the author message as removing the authorIndex first would alter all indexes after it
      webChatComponent.messageList.splice(index, 1);

      if (authorIndex !== null) {
        webChatComponent.messageList.splice(authorIndex, 1);
      }
      this.typingIndicatorIndex = null;
    }
  }, 5000);
};

ConversiveMode.prototype.handleNewLeaveMessage = function(leaveMessage, isFirstRequest, webChatComponent) {
  if (leaveMessage.source !== 2 || isFirstRequest) {
    return;
  }

  webChatComponent.$emit('setChatMode', {
    mode: 'webchat',
    options: {
      'callback_id': webChatComponent.modeData.options.callback_id
    }
  });
};

ConversiveMode.prototype.addAuthorMessage = function(message, webChatComponent) {
  return webChatComponent.messageList.push(webChatComponent.newAuthorMessage({
    author: message.source === 1 ? "me" : "them",
    data: {
      time: (new Date()).toLocaleTimeString(),
      date: (new Date()).toLocaleDateString(),
    }
  }));
};

ConversiveMode.prototype.convertTypingIndicatorToFirstMessage = function(firstMessage, webChatComponent) {
  let typingIndicatorIndex = this.typingIndicatorIndex;
  this.typingIndicatorIndex = null;

  let typingIndicatorMessage = webChatComponent.messageList[typingIndicatorIndex];
  typingIndicatorMessage.type = "text";
  typingIndicatorMessage.data = {
    text: firstMessage.b,
    time: (new Date()).toLocaleTimeString(),
    date: (new Date()).toLocaleDateString(),
  };
};

ConversiveMode.prototype.addMessageToMessageList = function(textMessage, webChatComponent) {
  webChatComponent.messageList.push({
    author: textMessage.source === 1 ? "me" : "them",
    mode: "custom",
    type: "text",
    data: {
      text: textMessage.b,
      time: (new Date()).toLocaleTimeString(),
      date: (new Date()).toLocaleDateString(),
    }
  });
};

ConversiveMode.prototype.setTeamName = function(textMessages, webChatComponent) {
  let lastMessage = textMessages[textMessages.length-1];
  let updatedModeData = webChatComponent.modeData;
  updatedModeData.options.teamName = lastMessage.n;
  webChatComponent.setChatMode(updatedModeData);
};

export default ConversiveMode;
