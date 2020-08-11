<template>
    <div class="od-autocomplete">
        <input v-model="searchTerm" type="text" class="od-autocomplete__search" @keyup.enter="_handleClick($event)" @keyup="search()">
        <button class="od-autocomplete__submit" @click="_handleClick($event)">{{data.submit_text}}</button>
        <div class="od-autocomplete__results">
            <ul class="od-autocomplete__results-list">
                <li v-for="(result, i) in results" :key="i">{{result.text}}</li>
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
        searchTerm: null,
        results: []
    };
  },
  methods: {
    _handleClick(e) {
        e.preventDefault();
        console.log('handleClick', this.message)
      //this.onButtonClick(this.message)
    },
    search() {
        console.log('search', this.searchTerm)
    }
  }
};
</script>

<style lang="scss">

</style>
