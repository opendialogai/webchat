<html>

<head>
    @yield('scripts', '')
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @if (env('COOKIE_EXPIRE'))
        <meta name="cookie-expire" content="{{ env('COOKIE_EXPIRE') }}">
    @endif

    <!-- Fonts -->
    <!-- <link rel="stylesheet" type="text/css" href="/vendor/webchat/fonts/fonts.min.css" /> -->
    <link rel="stylesheet" type="text/css" href="/vendor/webchat/fonts/fonts.css" />


</head>

<body>

<div id="app">
    <opendialog-chat></opendialog-chat>
</div>



<link rel="stylesheet" type="text/css" href="/vendor/webchat/css/main.css?{{env("CSS_VERSION", "v1")}}">
<link rel="stylesheet" type="text/css" href="/css/test.css" />
<script src="/vendor/webchat/js/app.js?{{env("JS_VERSION", "v1")}}"></script>

</body>

</html>
