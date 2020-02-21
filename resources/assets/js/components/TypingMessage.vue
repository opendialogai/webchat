<template>
  <transition leave-active-class="fadeOut">
    <div
      class="mt mt-typing-indicator sc-typing-indicator"
      :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author === 'them',
    }]"
      :style="messageColors"
    >

      <div class="all-blobs">
        <div class="blob">
          <div class="blob-content"></div>
        </div>
        <div class="blob">
          <div class="blob-content"></div>
        </div>
        <div class="blob">
          <div class="blob-content"></div>
        </div>
      </div>
    </div>
  </transition>
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
  }
};
</script>
<style scoped>
</style>
