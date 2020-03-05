<template>
  <div>
    <div
      ref="header"
      class="header"
      @click="onClose"
      :style="{background: colors.header.bg, color: colors.header.text}"
      :class="{'header-open': isOpen, 'header-closed': !isOpen}"
    >
      <div class="header-cta" ref="headerCta">
        <div class="header-cta__icon">
          <img src alt />
        </div>

        <div
          v-if="ctaText.length"
          class="header-cta__text"
          ref="headerCtaText"
        >
          <span v-for="text in ctaText">
            {{ text }}
          </span>
        </div>
      </div>

      <div class="header-nav">
        <div class="header-nav__team-name">
          <span v-if="teamName" v-html="teamName"></span>
        </div>

        <div class="header-nav__logo">
          <img v-if="imageUrl" :src="imageUrl" alt />
        </div>

        <div
          v-if="showRestartButton"
          @click.stop="onRestartButtonClick"
          class="header-nav__restart-button"
        >
          <img src="./assets/restart.svg" />
          <span>Restart</span>
        </div>

        <div v-else class="header-nav__restart-button"></div>
      </div>

      <div class="header__btm-fade"></div>
    </div>
  </div>
</template>


<script>
export default {
  mounted() {
    setTimeout(() => {
      this.$refs.headerCta.classList.add('header-cta-expand')
    }, 500);
  },
  props: {
    ctaText: {
      type: Array,
      default: () => []
    },
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
    },
    isOpen: {
      type: Boolean,
      default: () => false
    }
  }
};
</script>

<style scoped>

</style>
