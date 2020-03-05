import ConversiveClient from "../clients/ConversiveClient";

let ConversiveMode = function() {
  this.name = "custom";
  this.client = new ConversiveClient();
  this.pollingInterval = null;
};

ConversiveMode.prototype.sendRequest = function(message) {
  return new Promise((resolve, reject) => {
    console.log("Using Conversive mode");
    resolve();
  });
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
        let messages = await this.client.getMessagesAfter(sessionToken);
        this.handleNewMessages(messages, webChatComponent);
      }, 1000);
    })
    .catch((error) => {
      console.error(error);
    });
};

ConversiveMode.prototype.destroyChat = function(webChatComponent) {
  clearInterval(this.pollingInterval);
};

ConversiveMode.prototype.handleNewMessages = function (messages, webChatComponent) {
  let filteredMessages = messages.filter((message) => message.source === 2 && message.type === 1);

  if (filteredMessages.length > 0) {
    webChatComponent.messageList.push(webChatComponent.newAuthorMessage({
      author: "them",
      data: {
        time: (new Date()).toLocaleTimeString(),
        date: (new Date()).toLocaleDateString(),
      }
    }));
  }

  filteredMessages.forEach((message) => {
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

  if (filteredMessages.length > 0) {
    let lastMessage = filteredMessages[filteredMessages.length-1];

    let updatedModeData = webChatComponent.modeData;
    updatedModeData.options.teamName = lastMessage.n;
    webChatComponent.setChatMode(updatedModeData);
  }
};

export default ConversiveMode;
