/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

import Chat from 'vue-beautiful-chat';
import UUID from 'vue-uuid';
import BootstrapVue from 'bootstrap-vue';
import VueJsCookie from 'vue-js-cookie';
import store from '@/store';


require('@/bootstrap');
window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

window.Vue.component('opendialog-chat', require('@/components/OpenDialogChat.vue').default);

window.Vue.use(Chat);
window.Vue.use(UUID);
window.Vue.use(BootstrapVue);
window.Vue.use(VueJsCookie);

// eslint-disable-next-line no-unused-vars
const { app } = new window.Vue({
  store,
  el: '#app',
});
