<template>
  <div
    class="header"
    @click="onClose"
    :style="{background: colors.header.bg, color: colors.header.text}"
  >
    <div class="header-nav">
      <div class="header-nav__team-name">
        <span v-if="teamName" v-html="teamName"></span>
      </div>

      <div class="header-nav__logo">
        <img v-if="imageUrl" :src="imageUrl" alt />
      </div>
      <div v-if="showRestartButton">
        <div @click.stop="onRestartButtonClick" class="header-nav__restart-button">
          <img src="./assets/restart.svg" />
          <span>Restart</span>
        </div>
      </div>
    </div>

    <div class="header__btm-fade"></div>
  </div>
</template>


<script>
export default {
  props: {
    imageUrl: {
      type: String
    },
    teamName: {
      type: String
    },
    onClose: {
      type: Function,
      required: true
    },
    onExpand: {
      type: Function,
      required: true
    },
    onRestartButtonClick: {
      type: Function,
      required: true
    },
    showRestartButton: {
      type: Boolean,
      default: () => false
    },
    showExpandButton: {
      type: Boolean,
      default: true
    },
    colors: {
      type: Object,
      required: true
    }
  }
};
</script>
<style scoped>
</style>
