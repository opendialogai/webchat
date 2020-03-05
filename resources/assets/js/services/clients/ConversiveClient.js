import axios from "axios";
import SessionStorageMixin from "../../mixins/SessionStorageMixin";

let ConversiveClient = function() {
  this.baseUrl = "https://avayatest.conversive.com";
  this.version = 2;
  this.siteCode = "yuk1mj2spx61";
  this.requestedSerialNumber = 0;
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
    v: this.version,
    sc: this.siteCode,
    n: "",
    tc: options.uuid,
    iad: false,
    f: apiFunction,
  };
  let encodedData = Object.keys(data).map((key) => key + "=" + data[key]).join("&");

  return axios.post(this.buildUrl("/CLA_API/FrontendChatAPI.aspx", {
    sbid: this.getServerBindId()
  }), encodedData, {
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    }
  })
    .then((response) => {
      this.requestedSerialNumber++;
      return Promise.resolve(response.data);
    });
};

ConversiveClient.prototype.getSession = function(uuid) {
  return this.makeRequest("getSession", { uuid });
};

ConversiveClient.prototype.sendAutoText = function(uuid, sessionToken) {
  console.log(uuid, sessionToken);
  // return this.makeRequest("sendAutoText", { uuid, sessionToken });
};

export default ConversiveClient;
