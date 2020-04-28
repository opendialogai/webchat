// This is the webpack builder for the opendialog-bot.js file

const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    module: {
        rules: [
            {
                enforce: 'pre',
                exclude: new RegExp('/node_modules/|/resources/images/'),
                loader: 'eslint-loader',
                test: /\.(js|vue)?$/
            },
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
        ]
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, '.')
    },
    plugins: [
        new CopyWebpackPlugin([
            { from : 'node_modules/@opendialogai/vue-beautiful-chat/src/assets', to: 'images/vendor/vue-beautiful-chat' },
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
