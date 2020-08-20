import WebChatMode from "./ChatServices/WebChatMode";
import CustomMode from "./ChatServices/CustomMode";

let ChatService = function() {
  this.services = {
    webchat: new WebChatMode(),
    custom: new CustomMode(),
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
  this.getActiveService().setModeInstance(modeData.modeInstance);
};

ChatService.prototype.getMode = function() {
  return this.modeData.mode;
};

ChatService.prototype.getActiveService = function() {
  return this.services[this.getMode()];
};

ChatService.prototype.sendRequest = function(message, webChatComponent) {
  return this.getActiveService().sendRequest(message, webChatComponent);
};

ChatService.prototype.sendResponseSuccess = function(response, sentMessage, webChatComponent) {
  return this.getActiveService().sendResponseSuccess(response, sentMessage, webChatComponent);
};

ChatService.prototype.sendResponseError = function(error, sentMessage, webChatComponent) {
  return this.getActiveService().sendResponseError(error, sentMessage, webChatComponent);
};

ChatService.prototype.sendTypingRequest = function(message, webChatComponent) {
  return this.getActiveService().sendTypingRequest(message, webChatComponent);
};

ChatService.prototype.sendTypingResponseSuccess = function(response, webChatComponent) {
  return this.getActiveService().sendTypingResponseSuccess(response, webChatComponent);
};

ChatService.prototype.sendTypingResponseError = function(error, webChatComponent) {
  return this.getActiveService().sendTypingResponseError(error, webChatComponent);
};

ChatService.prototype.initialiseChat = function(webChatComponent) {
  return this.getActiveService().initialiseChat(webChatComponent);
};

ChatService.prototype.destroyChat = function(webChatComponent) {
  return this.getActiveService().destroyChat(webChatComponent);
};

ChatService.prototype.setModeInstance = function(number) {
  this.getActiveService().setModeInstance(number);
};

ChatService.prototype.getDataLayerEventName = function() {
  return this.getActiveService().getDataLayerEventName();
}

export default new ChatService();
