chat.scss<template>
  <div class="sc-message--author" :class="{ animate: this.data.animate }">
    <template v-if="data.author && data.author == 'me'">
      <span>{{data.text}}</span>
      <span v-if="data.avatar" v-html="data.avatar"></span>
      <p v-if="data.meta" class='sc-message--meta'>{{data.meta}}</p>
    </template>
    <template v-else>
      <span v-if="data.avatar" v-html="data.avatar"></span>
      <span>{{data.text}}</span>
      <p v-if="data.meta" class='sc-message--meta'>{{data.meta}}</p>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      required: true
    },
  }
}

</script>

<style scoped>

.sc-message--meta {
  font-size: xx-small;
  margin-bottom: 0px;
  margin-top: 5px;
  opacity: .5;
  text-align: center;
}
</style>
