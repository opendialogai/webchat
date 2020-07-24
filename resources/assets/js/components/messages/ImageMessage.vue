<template>
  <div class="od-message-image mt" :class="[{
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
    }
  },
  methods: {
    loaded() {
      this.$root.$emit("scroll-down-message-list");
    }
  }
};
</script>

<style lang="scss">
.od-message-image {
  display: inline;

  &.emit {
    background-color: var(--od-sent-message-background);
    color: var(--od-sent-message-text);
  }

  &.reap {
    background-color: var(--od-received-message-background);
    color: var(--od-received-message-text);
  }

  img {
    width: 100%;
  }
}
</style>
