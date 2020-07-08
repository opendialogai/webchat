let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.webpackConfig(require('./webpack.config'));

mix.js('resources/assets/js/app.js', './public/js')
    .js('resources/assets/js/opendialog-bot.js', './public/js')
    .js('resources/assets/js/opendialog-bot-full.js', './public/js')
    .sass('resources/assets/sass/main.scss', './public/css')
    .sass('resources/assets/sass/app-iframe.scss', './public/css')

// Source maps when not in production.
if (!mix.inProduction()) {
    mix.sourceMaps();
}

// Hash and version files in production.
if (mix.inProduction()) {
    mix.setPublicPath(__dirname);
    mix.version();
}
