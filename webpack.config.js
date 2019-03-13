// This is the webpack builder for the opendialog-bot.js file

const path = require('path');

module.exports = {
    entry: {
      app: './resources/assets/js/app.js',
      'opendialog-bot': './resources/assets/js/opendialog-bot.js',
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: /node_modules/,
                loader: 'eslint-loader',
                test: /\.(js|vue)?$/
            },
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'public/js')
    },
    resolve: {
        alias: {
            /**
             * An alias for the JS imports.
             *
             * Example of usage:
             * require('@/components/ComponentName');
             */
            '@': path.resolve(__dirname, './resources/assets/js'),

            /**
             * An alias for the SASS imports.
             *
             * Example of usage:
             * @import "@sass/_vars";
             */
            'sass': path.resolve(__dirname, './resources/assets/sass'),
        }
    }
};
