<html>

<head>
    @yield('scripts', '')
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @if (env('COOKIE_EXPIRE'))
        <meta name="cookie-expire" content="{{ env('COOKIE_EXPIRE') }}">
    @endif

    @if (env('CUSTOM_CSS_PATH'))
        <link rel="stylesheet" type="text/css" href="{{ env('CUSTOM_CSS_PATH') }}">
    @endif

    <script>
        var appName       = "{{ config('app.name', '') }}"
        var pusherAppKey  = "{{ config('broadcasting.connections.pusher.key', '') }}"
        var pusherCluster = "{{ config('broadcasting.connections.pusher.options.cluster', '') }}"
    </script>
</head>

<body>

<div id="app">
    <opendialog-chat></opendialog-chat>
</div>

<script>
    /**
     * Gets the webchat settings from the database
     * @returns {Promise<any>}
     */
    async function getSettings(url) {
      const response = await fetch(`${url}/webchat-config`);
      const json = await response.json();
      return json;
    }

    getSettings("{{ config('APP_URL', '') }}").then((settings) => {
      postMessage(settings, '*');
    });
</script>

<link rel="stylesheet" type="text/css" href="/vendor/webchat/css/app.css?{{env("CSS_VERSION", "v1")}}">

<script src="/vendor/webchat/js/app.js?{{env("JS_VERSION", "v1")}}"></script>
</body>

</html>
