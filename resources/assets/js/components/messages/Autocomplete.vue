<template>
  <div class="od-autocomplete" :class="{'od-autocomplete--expanded': results.length > -1}">
    <div class="od-autocomplete__search-container">
      <input 
        v-model="searchTerm" 
        type="text" 
        :placeholder="data.title" 
        class="od-autocomplete__search"
        @keyup.enter.prevent="_handleClick()"
        @keydown.tab="results.length ? selectFirst() : false" 
        @keyup="search()">
      <span class="od-autocomplete__search-term">
        {{searchTerm}}
        <span @click="_handleClick(results[0].name)">
          {{searchTermRemainder}}
        </span>
      </span>
      <button v-show="results.length" class="od-autocomplete__submit" @click.prevent="_handleClick()">{{data.submit_text}}</button>
    </div>
    <div class="od-autocomplete__results">
      <p>{{data.title}}</p>
      <ul class="od-autocomplete__results-list">
        <li @click="_handleClick(result.name)" v-for="(result, i) in results" :key="i">{{result.name}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    message: {
        type: Object,
        required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
        searchTerm: 'my',
        results: [
  {
    "name": "Mymedo-pen"
  },
  {
    "name": "Mymedacol"
  },
  {
    "name": "Mymedafix"
  },
  {
    "name": "Mymedamol"
  },
  {
    "name": "Mymediril"
  },
  {
    "name": "Mymedivir"
  },
  {
    "name": "Mymedocol"
  },
  {
    "name": "Mymedaject"
  },
  {
    "name": "Mymedatabs"
  },
  {
    "name": "Mymedixine"
  }
]
    };
  },
  methods: {
    _handleClick(term) {
      if ((!this.searchTerm || this.searchTerm === '') && !term) {
        return false
      }

      this.message.data.callback_value = term ? term : this.searchTerm

      this.onButtonClick(false, this.message.data)
    },
    selectFirst() {
      this.searchTerm = this.results[0].name
    },
    async search() {
      this.results = await this.$store.dispatch('fetchAutocomplete', this.endpoint);
    }
  },
  computed: {
    searchTermRemainder() {
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
    }
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
}
</style>
