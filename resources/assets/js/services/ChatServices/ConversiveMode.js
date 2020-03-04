import ConversiveClient from "../clients/ConversiveClient";

let ConversiveMode = function() {
  this.name = "custom";
  this.client = new ConversiveClient();
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

ConversiveMode.prototype.initialiseChat = function(webChatComponent) {
  return this.client.getSession()
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
};

export default ConversiveMode;
