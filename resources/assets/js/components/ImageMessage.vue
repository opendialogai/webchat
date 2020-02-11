<template>
  <div class="sc-message--image" :style="messageColors">
    <template v-if="data.img_link">
      <a :href="data.img_link" :target="data.link_new_tab ? '_blank' : '_parent'"><img :src="data.img_src" @load="loaded" /></a>
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
    messageColors: {
      type: Object,
      required: true
    }
  },
  methods: {
    loaded() {
      this.$root.$emit('scroll-down-message-list')
    }
  }
}
</script>

<style scoped>
.sc-message--image {
  padding: 10px 12px;
  border-radius: 6px;
  max-width: calc(100% - 40px);
}

.sc-message--image img {
  max-width: 100%;
  float: left;
}

.sc-message--content.sent .sc-message--image {
  color: white;
  background-color: #4e8cff;
}
.sc-message--content.received .sc-message--image {
  color: #263238;
  background-color: #f4f7f9;
}
</style>
