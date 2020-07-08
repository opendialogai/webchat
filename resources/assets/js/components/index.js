require('vue2-animate/dist/vue2-animate.min.css')

import linkify from 'vue-linkify'

import Launcher from './Launcher.vue'

const defaultComponentName = 'beautiful-chat'

const Plugin = {
  install: function(Vue, options) {
    /**
     * Makes sure that plugin can be installed only once
     */
    if (this.installed) {
      return
    }

    this.installed = true
    this.event = new Vue()
    this.dynamicContainer = null
    this.componentName = (options && options.componentName) ? options.componentName : defaultComponentName
    /**
     * Plugin API
     */
    Vue.prototype.$chat = {
      _setDynamicContainer: function(dynamicContainer) {
        Plugin.dynamicContainer = dynamicContainer
      }
    }
    /**
     * Sets custom component name (if provided)
     */
    Vue.component(this.componentName, Launcher)

    Vue.directive('linkified', linkify)
  }
}

export default Plugin
