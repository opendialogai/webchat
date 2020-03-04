let ConversiveMode = function() {
  this.name = "custom";
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

export default ConversiveMode;
