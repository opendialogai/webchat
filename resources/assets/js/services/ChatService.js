import store from '../store'
import WebChatMode from "./ChatServices/WebChatMode";
import CustomMode from "./ChatServices/CustomMode";
import authorMessage from '../mixins/authorMessage';
import session from '../mixins/SessionStorageMixin';
import {bus} from '../app'

let ChatService = function() {
  this.modes = {
    webchat: null,
    custom: null,
  };

  this.modeData = {
    mode: "webchat",
    options: {}
  };
  this.previousMode = "webchat";
  this.newAuthorMessage = authorMessage;
  this.session = session;
};

ChatService.prototype.hasMode = function(mode) {
  return mode in this.modes;
};

ChatService.prototype.getModeData = function() {
  return this.modeData;
};

ChatService.prototype.setModeData = function(modeData) {
  this.previousMode = this.modeData.mode !== modeData.mode ? this.modeData.mode : this.previousMode;
  this.modeData = modeData;
  this.getActiveMode().setModeInstance(modeData.modeInstance);
};

ChatService.prototype.getMode = function() {
  return this.modeData.mode;
};

ChatService.prototype.getPreviousMode = function() {
  return this.previousMode;
};

ChatService.prototype.getActiveMode = function() {
  return this.modes[this.getMode()];
};

ChatService.prototype.getPreviousActiveMode = function() {
  return this.modes[this.getPreviousMode()];
};

ChatService.prototype.sendRequest = function(message, webChatComponent) {
  return this.getActiveMode().sendRequest(message, webChatComponent);
};

ChatService.prototype.sendResponseSuccess = function(response, sentMessage, webChatComponent) {
  return this.getActiveMode().sendResponseSuccess(response, sentMessage, webChatComponent);
};

ChatService.prototype.sendResponseError = function(error, sentMessage, webChatComponent) {
  return this.getActiveMode().sendResponseError(error, sentMessage, webChatComponent);
};

ChatService.prototype.sendTypingRequest = function(message, webChatComponent) {
  return this.getActiveMode().sendTypingRequest(message, webChatComponent);
};

ChatService.prototype.sendTypingResponseSuccess = function(response, webChatComponent) {
  return this.getActiveMode().sendTypingResponseSuccess(response, webChatComponent);
};

ChatService.prototype.sendTypingResponseError = function(error, webChatComponent) {
  return this.getActiveMode().sendTypingResponseError(error, webChatComponent);
};

ChatService.prototype.initialiseChat = function(webChatComponent) {
  return this.getActiveMode().initialiseChat(webChatComponent);
};

ChatService.prototype.destroyChat = function(webChatComponent) {
  return this.getActiveMode().destroyChat(webChatComponent);
};

ChatService.prototype.postDestroyChat = function(oldModeData, webChatComponent) {
  return this.getPreviousActiveMode().postDestroyChat(oldModeData, webChatComponent);
};

ChatService.prototype.setModeInstance = function(number) {
  this.getActiveMode().setModeInstance(number);
};

ChatService.prototype.getDataLayerEventName = function() {
  return this.getActiveMode().getDataLayerEventName();
}

ChatService.prototype.modeDataUpdated = async function (newValue, oldValue, webChatComponent) {
  const modeHasChanged = newValue.mode !== oldValue.mode;

  if (modeHasChanged) {
    await this.destroyChat(webChatComponent);
  }

  this.setModeData(newValue);

  if (modeHasChanged) {
    await this.postDestroyChat(oldValue, webChatComponent);
  }

  if (modeHasChanged) {
    await this.initialiseChat(webChatComponent);
  }
};

ChatService.prototype.init = function() {
  this.modes.webchat = new WebChatMode(store, this, bus)
  this.modes.custom = new CustomMode(store, this)
}

export default ChatService;
