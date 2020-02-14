chat.scss<template>
  <div class="sc-message--author">
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
.sc-message--author {
  color: #2d2d2d;
  background: none;
  padding: 0;
  border-radius: 6px;
  font-weight: 400;
  font-size: 12px;
  line-height: 1.2;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
}

.sc-message--meta {
  font-size: xx-small;
  margin-bottom: 0px;
  margin-top: 5px;
  opacity: .5;
  text-align: center;
}
</style>
