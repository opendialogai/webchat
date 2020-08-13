/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import 'whatwg-fetch';
import 'url-search-params-polyfill';

import UUID from 'vue-uuid';
import BootstrapVue from 'bootstrap-vue';
import VueJsCookie from 'vue-js-cookie';
import store from '@/store';

import linkify from 'vue-linkify'
import { longClickDirective } from 'vue-long-click'
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'

import Launcher from './components/Launcher.vue'

require('@/bootstrap');
require('vue2-animate/dist/vue2-animate.min.css')
window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

window.Vue.component('opendialog-chat', require('@/components/OpenDialogChat.vue').default);
window.Vue.component('beautiful-chat', Launcher)

window.Vue.use(UUID);
window.Vue.use(BootstrapVue);
window.Vue.use(VueJsCookie);
window.Vue.use(PerfectScrollbar)

window.Vue.prototype.$chat = {
    _setDynamicContainer: function(dynamicContainer) {
        Plugin.dynamicContainer = dynamicContainer
    }
}

window.Vue.directive('linkified', linkify)
window.Vue.directive('longclick', longClickDirective({delay: 10, interval: 100}))

// eslint-disable-next-line no-unused-vars
const { app } = new window.Vue({
  store,
  el: '#app',
});
