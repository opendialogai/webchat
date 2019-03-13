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
    let openDialogSettings = {};

    @foreach(config('webchat') ?? [] as $name => $value)
      @if (is_array($value))
        value = [];
        @foreach ($value as $item)
          value.push("{{$item}}");
        @endforeach
        @if (!empty($value))
          openDialogSettings.{{$name}} = value;
        @endif
      @elseif (is_string($value) && !empty($value))
        openDialogSettings.{{$name}} = "{{$value}}";
      @elseif (!empty($value))
        openDialogSettings.{{$name}} = {{$value}};
      @endif
    @endforeach

    addEventListener('load', () => {
        postMessage(openDialogSettings, '*');
    });
</script>

<link rel="stylesheet" type="text/css" href="/vendor/webchat/css/app.css?{{env("CSS_VERSION", "v1")}}">

<script src="/vendor/webchat/js/app.js?{{env("JS_VERSION", "v1")}}"></script>
</body>

</html>
