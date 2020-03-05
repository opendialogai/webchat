import axios from "axios";
import SessionStorageMixin from "../../mixins/SessionStorageMixin";

let ConversiveClient = function() {
  this.baseUrl = "https://avayatest.conversive.com";
  this.version = 2;
  this.siteCode = "yuk1mj2spx61";
  this.requestSerialNumber = 0;
  this.serialNumber = 0;
};

ConversiveClient.prototype.getServerBindId = function () {
  let sessionData = SessionStorageMixin.methods.getModeDataInSession();

  if (!sessionData.options.serverBindId) {
    // Generate an integer between 1000 & 9999.
    sessionData.options.serverBindId = Math.floor(Math.random() * 8999) + 1000;
    SessionStorageMixin.methods.setModeDataInSession(sessionData);
  }

  return sessionData.options.serverBindId;
};

ConversiveClient.prototype.buildUrl = function(endpoint, parameters) {
  let keys = Object.keys(parameters);
  let parametersFormatted = "?" + keys.map((key) => key + "=" + parameters[key]).join("&");
  let parameterStr = keys.length ? parametersFormatted : "";

  return this.baseUrl + endpoint + parameterStr;
};

ConversiveClient.prototype.makeRequest = function(apiFunction, options) {
  let data = {
    ...options,
    f: apiFunction,
  };
  let encodedData = Object.keys(data).map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key])).join("&");

  return axios.post(this.buildUrl("/CLA_API/FrontendChatAPI.aspx", {
    sbid: this.getServerBindId()
  }), encodedData, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
    .then((response) => {
      this.requestSerialNumber++;
      return Promise.resolve(response.data);
    });
};

ConversiveClient.prototype.getSessionId = async function(uuid) {
  let modeDataInSession = SessionStorageMixin.methods.getModeDataInSession();

  if (modeDataInSession.options.sessionId) {
    return Promise.resolve(modeDataInSession.options.sessionId);
  } else {
    return this.getSession(uuid).then((response) => {
      let sessionId = response.t;
      modeDataInSession = SessionStorageMixin.methods.getModeDataInSession();
      modeDataInSession.options.sessionId = sessionId;
      SessionStorageMixin.methods.setModeDataInSession(modeDataInSession);
      return sessionId;
    });
  }
};

ConversiveClient.prototype.getSerialNumber = function() {
  return this.serialNumber;
};

ConversiveClient.prototype.setSerialNumber = function(number) {
  this.serialNumber = number;
};

ConversiveClient.prototype.getSession = function(uuid) {
  return this.makeRequest("getSession", {
    v: this.version,
    sc: this.siteCode,
    n: "",
    tc: uuid,
    iad: false,
  });
};

ConversiveClient.prototype.sendAutoText = async function(uuid, sessionToken) {
  return this.makeRequest("sendAutoText", {
    b: "_startup",
    t: await this.getSessionId(),
    rsn: this.requestSerialNumber,
  });
};

ConversiveClient.prototype.getMessagesAfter = async function(sessionToken) {
  return this.makeRequest("getMessagesAfter", {
    t: await this.getSessionId(),
    sn: this.getSerialNumber(),
  })
    .then((response) => {
      let messages = response.m;
      console.log("Received " + messages.length + " messages");
      if (messages.length > 0) {
        let finalMessage = messages[messages.length - 1];
        this.setSerialNumber(finalMessage.sn);
      }

      return messages;
    });
};

export default ConversiveClient;
