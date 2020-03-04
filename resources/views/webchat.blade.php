<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="initial-scale=1">

    <title>{{ env('APP_NAME') }}</title>

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

<script>
    window.openDialogSettings = {
        url: "{{ env("APP_URL") }}",
        user: {
            first_name: '{!! app('request')->input('first_name') ? app('request')->input('first_name') : (auth()->user() ? auth()->user()->name : '') !!}',
            last_name: '{!! app('request')->input('last_name') ? app('request')->input('last_name') : '' !!}',
            email: '{!! app('request')->input('email') ? app('request')->input('email') : (auth()->user() ? auth()->user()->email : '') !!}',
            external_id: '{!! app('request')->input('external_id') ? app('request')->input('external_id') : (auth()->user() ? auth()->user()->id : '') !!}',
        },
    };
</script>

<script src="/vendor/webchat/js/app.js?{{env("JS_VERSION", "v1")}}"></script>

<script src="/vendor/webchat/js/opendialog-bot-full.js?{{env("JS_VERSION", "v1")}}"></script>

</body>

</html>
