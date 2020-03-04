let ConversiveClient = function() {};

ConversiveClient.prototype.getSession = function() {
  return new Promise((resolve, reject) => {
    resolve("ConversiveClient.getSession");
  });
};

export default ConversiveClient;
