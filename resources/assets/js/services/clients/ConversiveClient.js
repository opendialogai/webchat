import axios from "axios";
import SessionStorageMixin from "../../mixins/SessionStorageMixin";

let ConversiveClient = function(baseUrl, siteCode) {
  this.baseUrl = baseUrl;
  this.siteCode = siteCode;
  this.version = 2;
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

ConversiveClient.prototype.buildUrl = function(parameters) {
  let keys = Object.keys(parameters);
  let parametersFormatted = "?" + keys.map((key) => key + "=" + parameters[key]).join("&");
  let parameterStr = keys.length ? parametersFormatted : "";

  return this.baseUrl + parameterStr;
};

ConversiveClient.prototype.makeRequest = function(apiFunction, options) {
  let data = {
    ...options,
    f: apiFunction,
  };
  let encodedData = Object.keys(data).map((key) => this.encodeKeyValuePair(key, data[key])).join("&");

  return axios.post(this.buildUrl({
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

ConversiveClient.prototype.getSessionId = async function(uuid, name = null) {
  let modeDataInSession = SessionStorageMixin.methods.getModeDataInSession();

  if (modeDataInSession.options.sessionId) {
    return Promise.resolve(modeDataInSession.options.sessionId);
  } else {
    return this.getSession(uuid, name).then((response) => {
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

ConversiveClient.prototype.getSession = function(uuid, name = null) {
  let options = {
    v: this.version,
    sc: this.siteCode,
    n: name || "",
    tc: uuid,
    iad: false,
  };

  return this.makeRequest("getSession", options);
};

ConversiveClient.prototype.setEngineData = async function(sessionToken, chatData) {
  let data = this.prepareChatData(chatData);
  let engineData = {};
  data.forEach((item) => engineData[item.n] = item.v);
  engineData = Object.keys(engineData).map((key) => this.encodeKeyValuePair(key, engineData[key])).join("&")

  return this.makeRequest("setEngineData", {
    b: engineData,
    t: sessionToken,
    rsn: this.requestSerialNumber,
  });
};

ConversiveClient.prototype.setEngineDataHistory = async function(sessionToken, chatData) {
  let data = this.prepareChatData(chatData, true);
  let engineData = {
    "dialogflow_history": data[0].v.substr(-1000)
  };
  engineData = Object.keys(engineData).map((key) => encodeURIComponent(key) + "=" + engineData[key]).join("&")

  return this.makeRequest("setEngineData", {
    b: engineData,
    t: sessionToken,
    rsn: this.requestSerialNumber,
  });
};

ConversiveClient.prototype.setChatData = async function(sessionToken, chatData) {
  let data = this.prepareChatData(chatData);

  return this.makeRequest("setChatData", {
    data,
    t: sessionToken,
    rsn: this.requestSerialNumber,
  });
};

ConversiveClient.prototype.sendAutoText = async function(sessionToken, method) {
  return this.makeRequest("sendAutoText", {
    b: method,
    t: sessionToken,
    rsn: this.requestSerialNumber,
  });
};

ConversiveClient.prototype.getMessagesAfter = async function(sessionToken) {
  return this.makeRequest("getMessagesAfter", {
    t: sessionToken,
    sn: this.getSerialNumber(),
  })
    .then((response) => {
      let messages = response.m;
      if (messages.length > 0) {
        let finalMessage = messages[messages.length - 1];
        this.setSerialNumber(finalMessage.sn);
      }

      return messages;
    });
};

ConversiveClient.prototype.sendMessage = function(message, sessionToken) {
  if (message.type !== "text") {
    return Promise.resolve();
  }

  return this.makeRequest("sendTextMessage", {
    b: message.data.text,
    t: sessionToken,
    rsn: this.requestSerialNumber,
  });
};

ConversiveClient.prototype.sendTypingMessage = function(text, sessionToken) {
  return this.makeRequest("sendTypingMessage", {
    b: "=" + text,
    t: sessionToken,
    rsn: this.requestSerialNumber,
  });
};

ConversiveClient.prototype.logout = function(sessionToken) {
  return this.makeRequest("logout", {
    t: sessionToken,
    rsn: this.requestSerialNumber,
  });
};

ConversiveClient.prototype.prepareChatData = function(chatData, historyDataOnly = false) {
  let keys;

  if (historyDataOnly) {
    keys = ['history'];
  } else {
    keys = ['email', 'fullname', 'loc', 'phone', 'company', 'headcount', 'starting_url']
  }

  let data = Object.keys(chatData).filter((key) => {
    return keys.includes(key);
  }).map((key) => {
    return {
      n: key,
      v: chatData[key]
    }
  });


  if (!historyDataOnly) {
    data.push({
      n: 'sitecode',
      v: this.siteCode
    });
  }

  return data;
};

ConversiveClient.prototype.encodeKeyValuePair = function(key, value) {
  if (typeof value === "object") {
    value = JSON.stringify(value);
  } else {
    value = encodeURIComponent(value);
  }

  return encodeURIComponent(key) + "=" + value;
};

export default ConversiveClient;
