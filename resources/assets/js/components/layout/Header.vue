<template>
  <div>
    <div
      ref="header"
      class="od-header"
      @click="onClose"
      
      :class="{'od-header--open': isOpen, 'od-header--closed': !isOpen}"
    >
      <div
        ref="headerCta"
        class="od-header-cta"
        
      >
        <div class="od-header-cta__icon"></div>

        <div v-if="ctaText.length" class="od-header-cta__text" ref="headerCtaText">
          <span v-for="text in ctaText">{{ text }}</span>
        </div>
      </div>

      <div class="od-header-nav">
        <div class="od-header-nav__team-name" v-if="!showFullPageFormInput && !showFullPageRichInput">
          <span v-if="teamName" v-html="teamName"></span>
        </div>

        <div class="od-header-nav__logo">
          <img v-if="imageUrl" :src="imageUrl" alt />
        </div>

        <div
          v-if="showRestartButton"
          @click.stop="onRestartButtonClick"
          class="od-header-nav__restart-button"
        >
          <img src="../assets/restart.svg" />
          <span>Restart</span>
        </div>

        <div v-else class="od-header-nav__restart-button"></div>

        <div
          v-if="!showFullPageFormInput && !showFullPageRichInput"
          class="od-header-nav__download-button" @click.stop="onDownload"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="19" viewBox="0 0 12 19">
            <path fill="#FFF" fill-rule="evenodd" d="M6 14.481l-4.95-4.95 1.414-1.414 2.537 2.537L5 .34h2v10.314l2.536-2.536 1.414 1.414L6 14.481zm6 3.858H0v-2h12v2z"/>
          </svg>
        </div>
      </div>

      <div class="od-header__btm-fade"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      referrerUrl: '',
    };
  },
  watch: {
    ctaText(newVal, oldVal) {
      if (this.ctaText.length) {
        window.parent.postMessage({ width: "auto" }, this.referrerUrl);
        setTimeout(() => {
          this.$refs.headerCta.classList.add("header-cta-expand");
        }, 1000);
      } else {
        this.$refs.headerCta.classList.remove("header-cta-expand");
        if (newVal.length !== oldVal.length && !this.isOpen) {
          window.parent.postMessage({ width: "130px" }, this.referrerUrl);
        }
      }
    },
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
    onDownload: {
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
    isOpen: {
      type: Boolean,
      default: () => false
    },
    showFullPageFormInput: {
      type: Boolean,
      default: true
    },
    showFullPageRichInput: {
      type: Boolean,
      default: true
    },
  },
  created() {
    if (window.self !== window.top) {
      this.referrerUrl = document.referrer.match(/^.+:\/\/[^\/]+/)[0];
    } else {
      this.referrerUrl = document.location.origin;
    }
  },
};
</script>

<style lang="scss">
  .od-header {
    background-color: var(--od-header-background);
    color: var(--od-header-text);

    .od-header-cta {
      background-color: var(--od-header-background);
    }

    .od-header-nav__download-button {
      background-color: var(--od-button-background);
      color: var(--od-button-text);

      &:hover {
        background-color: var(--od-button-hover-background);
      }
    }
  }
</style>
