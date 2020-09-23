<template>
  <div class="od-autocomplete" :class="{'od-autocomplete--expanded': results.length}">
    <div class="od-autocomplete__search-container">
      <input 
        :value="searchTerm" 
        type="text" 
        :placeholder="data.placeholder" 
        class="od-autocomplete__search"
        :maxlength="textLimit ? textLimit : ''"
        @keyup.enter.prevent="_handleClick()"
        @keydown.tab="results.length ? selectFirst() : false" 
        @keyup="search()"
        @input="searchTerm = $event.target.value"
        @scroll="_scroll"
        autocomplete="off"
        ref="input">
      <div class="od-autocomplete__search-term-wrapper" ref="searchTermWrapper">
        <span class="od-autocomplete__search-term">
          {{searchTerm}}<span @click="_handleClick(results[0].name)">{{searchTermRemainder}}</span>
        </span>
      </div>
      <button v-show="searchTerm.length || results.length" class="od-autocomplete__submit" @click.prevent="_handleClick()">{{data.submit_text}}</button>
      <span v-if="textLimit" class="od-autocomplete__max-chars">{{searchTerm.length}}/{{textLimit}}</span>
    </div>
    <transition name="delayed-fade">
      <div v-show="results.length" class="od-autocomplete__results">
      <p>{{data.title}}</p>
      <perfect-scrollbar class="od-autocomplete__scrollable">
        <ul class="od-autocomplete__results-list">
          <li 
            tabindex="0" 
            @keyup.tab="searchTerm = result.name" 
            @keyup.enter="_handleClick(result.name)" 
            @click="_handleClick(result.name)" 
            v-for="(result, i) in results" 
            :key="i">
              {{result.name}}
            </li>
        </ul>
      </perfect-scrollbar>
    </div>
    </transition>
  </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    message: {
        type: Object,
        required: true
    }
  },
  data() {
    return {
        searchTerm: '',
        results: []
    };
  },
  methods: {
    _handleClick(term) {
      let str = term ? term.trim() : this.searchTerm.trim()
      
      if (!str.length) {
        return false
      }

      const attr = str.replace(/\./g, "\\.")

      this.message.data.callback_value = term ? `${this.message.data.attribute_name}.${term}` : `${this.message.data.attribute_name}.${attr}`
      this.message.data.callback_text = term ? term : str

      this.$store.dispatch('buttonClick', {button: false, data: this.message.data})
      this.searchTerm = ''
      this.results = []
      this.$refs.input.blur();
    },
    selectFirst() {
      this.searchTerm = this.results[0].name
    },
    _scroll() {
      this.$refs.searchTermWrapper.scrollLeft = this.$refs.input.scrollLeft
    },
    async search() {
      this.results = await this.$store.dispatch('fetchAutocomplete', this.endpoint);
    }
  },
  mounted() {
    this.$refs.input.focus();
  },
  computed: {
    searchTermRemainder() {
      if (!this.searchTerm || this.searchTerm === '') {
        return ''
      }

      const l = this.searchTerm.length
      const firstResult = this.results.length ? this.results[0].name.toLowerCase() : null
      
      return firstResult && firstResult.startsWith(this.searchTerm.toLowerCase()) ? this.results[0].name.slice(l) : ''
    },
    endpoint() {
      let str = `${this.data.endpoint_url}?`

      this.data.endpoint_params.forEach((obj, i) => {
        str += `${obj.name}=${obj.value}&`
      });

      str += `${this.data.query_param_name}=${this.searchTerm}`
      
      return str
    },
    ...mapState({
      textLimit: state => state.messageMetaData.textLimit
    })
  }
};
</script>

<style lang="scss">
.od-autocomplete {
  background-color: var(--od-user-input-background);
  min-height: 55px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;

  .od-autocomplete__search {
    caret-color: currentColor;
    color: var(--od-user-input-text);
    display: inline-block;
    height: 100%;
    resize: none;
    outline: none;
    padding: 0;
    margin: 0 0 15px 0;
    font-family: Gotham;
    font-weight: 300;
    font-stretch: normal;
    font-style: normal;
    font-size: 16px;
    line-height: 1.38;
    -webkit-font-smoothing: antialiased;
    display: flex;
    flex: 1;
    width: 100%;
  }

  .od-autocomplete__submit {
    background-color: var(--od-button-background);
    border: none;
    color: var(--od-button-text);
    width: auto;
    height: 50px;
    padding: 2px 20px;
    border-radius: 34.5px;
    transition: 0.4s;
    font-size: 18px;

    &:hover {
        background-color: var(--od-button-hover-background);
    }

    &:active,
    &:focus {
        outline: none;
        border: none;
    }
  }

  .od-autocomplete__max-chars {
    bottom: -16px;
    color: var(--od-user-input-text);
    font-size: 13px;
    position: absolute;
    right: 0;
  }
}
</style>
