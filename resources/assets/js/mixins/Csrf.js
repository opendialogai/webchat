export default {
  getCSRFToken() {
    return function () {
      var csrfToken = null;
      $.ajax({
        'async': false,
        'type': "GET",
        'url': "/csrf_token",
        'success': function (data) {
          csrfToken = data;
        }
      });
      return csrfToken;
    }();
  }
};
