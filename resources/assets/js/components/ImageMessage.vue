<template>
  <div class="mt mt-image " :style="messageColors" :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author === 'them',
    }]">
    <template v-if="data.img_link">
      <a :href="data.img_link" :target="data.link_new_tab ? '_blank' : '_parent'">
        <img :src="data.img_src" @load="loaded" />
      </a>
    </template>
    <template v-else>
      <img :src="data.img_src" @load="loaded" />
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
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    }
  },
  methods: {
    loaded() {
      this.$root.$emit("scroll-down-message-list");
    }
  }
};
</script>

<style scoped>

</style>
