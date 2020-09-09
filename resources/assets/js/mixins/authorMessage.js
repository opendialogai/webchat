export default function (message, modeData, settings, userName) {
  const avatarPath = settings.chatbotAvatarPath ? settings.chatbotAvatarPath : ''
  if (message.author === "them") {
    const authorMsg = {
      type: "author",
      author: "them",
      mode: modeData.mode,
      modeInstance: modeData.modeInstance,
      data: {
        author: "them",
        animate: settings.messageAnimation,
        text: settings.useBotName ? settings.chatbotName : "",
        date: message.data.date,
        time: message.data.time
      }
    };

    if (settings.useBotAvatar) {
      authorMsg.data.avatar = `<img class="avatar" src="${avatarPath}" />`;
    }

    return authorMsg;
  }

  const authorMsg = {
    type: "author",
    author: "me",
    mode: modeData.mode,
    modeInstance: modeData.modeInstance,
    data: {
      animate: settings.messageAnimation,
      author: "me",
      text: settings.useHumanName ? userName : "",
      date: message.data.date,
      time: message.data.time
    }
  };

  if (settings.useHumanAvatar) {
    const avatarName = userName
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
    authorMsg.data.avatar = `<span class="avatar">${avatarName}</span>`;
  }

  return authorMsg;
}