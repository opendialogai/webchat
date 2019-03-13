import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import { resourceModule } from '@reststate/vuex';

Vue.use(Vuex);

// Create the store.
const store = new Vuex.Store({
  state: {
    apiReady: false,
  },
  mutations: {
    setApiReady(state, val) {
      state.apiReady = val;
    },
  },
});

// Listen for our configuration.
window.addEventListener('message', (event) => {
  if (event.data && event.data.commentsEnabled && event.data.commentsApiConfig) {
    const httpClient = axios.create(event.data.commentsApiConfig.axiosConfig);

    // Add the json:api modules.
    store.registerModule('comments', resourceModule({ name: event.data.commentsApiConfig.comment.entityName, httpClient }));
    store.registerModule('authors', resourceModule({ name: event.data.commentsApiConfig.author.entityName, httpClient }));
    if (event.data.commentsApiConfig.section && event.data.commentsApiConfig.section.entityName) {
      store.registerModule('sections', resourceModule({ name: event.data.commentsApiConfig.section.entityName, httpClient }));
    }

    // Tell vue we're ready.
    store.commit('setApiReady', true);
  }
});

export default store;
