// This is the webpack builder for the opendialog-bot.js file

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: ['/node_modules/', '/resources/images/'],
                loader: 'eslint-loader',
                test: /\.(js|vue)?$/
            },
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '.')
    },
    plugins: [
        new CopyWebpackPlugin([
            { from : 'node_modules/vue-beautiful-chat/src/assets', to: 'images/vendor/vue-beautiful-chat'}
        ]),
    ],
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
