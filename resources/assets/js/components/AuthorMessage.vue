<template>
  <!-- <div class="message-author" :class="{ animate: this.data.animate }"> -->

  <div
    class="mt mt-author"
    :class="[
    { animate: this.data.animate,
      emit : this.author === 'me',
      reap: this.author === 'them',
    }]"
  >
    <!-- emit message - intials -->
    <template v-if="data.author && data.author == 'me'">
      <span>{{data.text}}</span>
      <span v-if="data.avatar" v-html="data.avatar"></span>
      <p v-if="data.meta" class="mt--meta">{{data.meta}}</p>
    </template>

    <!-- reap message - img avatar -->
    <template v-else>
      <span v-if="data.avatar" v-html="data.avatar"></span>
      <span>{{data.text}}</span>
      <p v-if="data.meta" class="mt-meta">{{data.meta}}</p>
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

    author: {
      type: String,
      required: false
    }
  }
};
</script>

<style scoped>
</style>
