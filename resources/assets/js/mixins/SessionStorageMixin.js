export default {
    getModeDataInSession() {
      return JSON.parse(window.sessionStorage.getItem('opendialog-webchat'));
    },
    setModeDataInSession(data) {
      window.sessionStorage.setItem('opendialog-webchat', JSON.stringify(data));
    },
    isCustomModeInSession() {
      let sessionStorageSettings = this.getModeDataInSession();
      return sessionStorageSettings && sessionStorageSettings.mode !== 'webchat';
    }
}
