import WebChatMode from "./ChatServices/WebChatMode";
import ConversiveMode from "./ChatServices/ConversiveMode";

let ChatService = function() {
  this.services = {
    webchat: new WebChatMode(),
    custom: new ConversiveMode(),
  };

  this.modeData = {
    mode: "webchat",
    options: {}
  };
};

ChatService.prototype.getModeData = function() {
  return this.modeData;
};

ChatService.prototype.setModeData = function(modeData) {
  this.modeData = modeData;
};

ChatService.prototype.getMode = function() {
  return this.modeData.mode;
};

ChatService.prototype.getActiveService = function() {
  return this.services[this.getMode()];
};

ChatService.prototype.sendRequest = function(message) {
  return this.getActiveService().sendRequest(message);
};

ChatService.prototype.sendResponseSuccess = function(response, webChatComponent) {
  return this.getActiveService().sendResponseSuccess(response, webChatComponent);
};

ChatService.prototype.sendResponseError = function(error, webChatComponent) {
  return this.getActiveService().sendResponseError(error);
};

export default new ChatService();
