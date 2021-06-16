<template>
  <div v-if="externalButtons.length" class="od-external-buttons">
    <div class="od-external-buttons__arrows">
      <div
        v-show="showLeftArrow"
        class="od-external-buttons__left-arrow"
        ref="leftArrow"
        v-longclick="scrollLeft">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17">
          <path fill="var(--od-button-background)" d="M9.203 7.796L2.21.778C1.803.395 1.18.395.796.778s-.383 1.03 0 1.413l6.3 6.3-6.3 6.299c-.383.407-.383 1.03 0 1.413s1.007.383 1.413 0L9.203 9.21c.383-.406.383-1.03 0-1.413z"/>
        </svg>
      </div>
      <div
        v-show="showRightArrow"
        class="od-external-buttons__right-arrow"
        ref="rightArrow"
        v-longclick="scrollRight">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="17" viewBox="0 0 10 17">
          <path fill="var(--od-button-background)" d="M9.203 7.796L2.21.778C1.803.395 1.18.395.796.778s-.383 1.03 0 1.413l6.3 6.3-6.3 6.299c-.383.407-.383 1.03 0 1.413s1.007.383 1.413 0L9.203 9.21c.383-.406.383-1.03 0-1.413z"/>
        </svg>
      </div>
    </div>
    <div
      class="od-external-buttons__row"
      ref="externalButtonsRow"
      @scroll.passive="onScroll">
      <div class="od-external-buttons__row-wrapper fade-enter-active">
        <div class="od-external-button" :class="{animate: this.animate, 'fade-enter-active': this.animate}">
          <template v-for="(externalButton, idx) in externalButtons">
            <button
              v-if="externalButton.display && externalButton.text"
              class="od-external-button__button"
              :class="(buttonClicked == idx) ? 'od-external-button__button--clicked' : ''"
              @[submitAction]="_handleClick(externalButton, idx)"
              ref="externalButton"
              :key="idx">
              <span>{{ externalButton.text }}</span>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    animate: {
      type: Boolean,
      default: false
    },
    externalButtons: {
      type: Array,
      default: () => []
    },
    shouldClear: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      buttonClicked: -1,
      showLeftArrow: false,
      showRightArrow: false
    };
  },
  watch: {
    externalButtons() {
      if (this.externalButtons.length == 0) {
        this.buttonClicked = -1;
      } else {
        this.showLeftArrow = false
        this.showRightArrow = false

        setTimeout(() => {
          if (this.$refs.externalButtonsRow) {
            if (this.$refs.externalButtonsRow.scrollWidth > (this.$refs.externalButtonsRow.offsetWidth + this.$refs.externalButtonsRow.scrollLeft)) {
              this.showRightArrow = true
            }
          }
        }, 100)
      }
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.onScroll()
    })
  },
  computed: {
    submitAction() {
      return this.shouldClear ? '~click' : 'click'
    }
  },
  methods: {
    onScroll() {
      if (this.$refs.externalButtonsRow) {
        if (this.$refs.externalButtonsRow.scrollLeft > 0) {
          this.showLeftArrow = true
        } else {
          this.$refs.leftArrow.dispatchEvent(new Event('onmouseup'))
          this.showLeftArrow = false
        }

        if (this.$refs.externalButtonsRow.scrollWidth > (this.$refs.externalButtonsRow.offsetWidth + this.$refs.externalButtonsRow.scrollLeft)) {
          this.showRightArrow = true
        } else {
          this.$refs.rightArrow.dispatchEvent(new Event('onmouseup'))
          this.showRightArrow = false
        }
      }
    },
    scrollLeft() {
      const rowScrollLeft = this.$refs.externalButtonsRow.scrollLeft

      let scrollLeft = this.$refs.externalButtonsRow.scrollLeft
      this.$refs.externalButton.forEach((button, i) => {
        const style = window.getComputedStyle(button)
        const marginLeft = parseFloat(style.getPropertyValue('margin-left'))
        const marginRight = parseFloat(style.getPropertyValue('margin-right'))

        if (((button.offsetLeft - marginLeft) < rowScrollLeft) && ((button.offsetLeft + button.offsetWidth + marginRight) >= rowScrollLeft)) {
          scrollLeft = (i > 0) ? button.offsetLeft - marginLeft - 30 : 0
        }
      })

      this.scroll(this.$refs.externalButtonsRow.scrollLeft, scrollLeft)
    },
    scrollRight() {
      const rowScrollRight = this.$refs.externalButtonsRow.offsetWidth + this.$refs.externalButtonsRow.scrollLeft

      let scrollLeft = this.$refs.externalButtonsRow.scrollLeft
      this.$refs.externalButton.forEach((button) => {
        const style = window.getComputedStyle(button)
        const marginLeft = parseFloat(style.getPropertyValue('margin-left'))
        const marginRight = parseFloat(style.getPropertyValue('margin-right'))

        if (((button.offsetLeft - marginLeft) <= rowScrollRight) && ((button.offsetLeft + button.offsetWidth + marginRight) > rowScrollRight)) {
          scrollLeft = button.offsetLeft + button.offsetWidth + marginRight + 30 - this.$refs.externalButtonsRow.offsetWidth
        }
      })

      this.scroll(this.$refs.externalButtonsRow.scrollLeft, scrollLeft)
    },
    scroll(oldScrollLeft, newScrollLeft) {
      const scrollStep = (newScrollLeft - oldScrollLeft) / 15

      let i = 0
      const scrollInterval = setInterval(() => {
        this.$refs.externalButtonsRow.scrollLeft = this.$refs.externalButtonsRow.scrollLeft + scrollStep
        i = i + 1
        if (i == 15) clearInterval(scrollInterval)
      }, 20)
    },
    _handleClick(externalButton, idx) {
      this.buttonClicked = idx;
      this.$emit("sendExternalButton", externalButton);
    }
  }
};
</script>

<style lang="scss">
.od-external-buttons {
  overflow: hidden;
  position: relative;

  .od-external-button {
    background-color: var(--od-message-list-background);
    text-align: center;
    animation-duration: 1s;

    .od-external-button__button {
      background-color: var(--od-external-button-background);
      color: var(--od-external-button-text);
      border: 2px solid var(--od-external-button-hover-background);
      margin: 15px 10px;
      padding: 20px 30px;
      border-radius: 33px;
      font-size: 16px;
      line-height: 26px;
      cursor: pointer;
      outline: none;
      position: relative;
      transition: .4s;

      &:first-child {
        margin-left: 0;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .od-external-button__button:hover {
      background-color: var(--od-external-button-hover-background);
      color: var(--od-external-button-text);
      border: 2px solid var(--od-external-button-hover-background);
    }
  } 

  .od-external-buttons__row {
    height: 120px;
    -ms-overflow-style: none;
    text-align: center;
    padding: 10px;
    overflow-x: scroll;
    overflow-y: hidden;
    scrollbar-width: none;
    white-space: nowrap;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .od-external-buttons__row-wrapper {
    animation-duration: 0s;
  }

  .od-external-buttons__left-arrow,
  .od-external-buttons__right-arrow {
    align-items: center;
    background: var(--od-received-message-background);
    border-radius: 50%;
    display: flex;
    height: 120px;
    padding: 27px;
    position: absolute;
    top: 0;
    cursor: pointer;
    width: 120px;
    z-index: 2;
  }

  .od-external-buttons__left-arrow {
    left: -60px;
    transform: rotate(180deg);
  }

  .od-external-buttons__right-arrow {
    right: -60px;
  }
}
</style>
