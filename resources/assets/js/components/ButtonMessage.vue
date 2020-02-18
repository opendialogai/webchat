<template>
  <div
    ref="message"
    class="sc-message--button"
    :class="{ animate: this.data.animate }"
    :style="messageColors"
  >
    <div class="sc-message--button--text fade-enter-active" v-linkified>
      <span v-html="data.text"></span>
    </div>

    <template v-if="data.buttons.length && !data.external">
      <div class="sc-message--button--buttons">
        <button v-for="(button, idx) in data.buttons" :key="idx" @click="_handleClick(button)" :style="{backgroundColor: colors.button.bg, color: colors.button.text, '--button-hover': colors.button.hoverbg}" v-html="button.text"></button>
      </div>
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
    colors: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    messageColors: {
      type: Object,
      required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    }
  },
  methods: {
    _handleClick (button) {
      this.onButtonClick(button, this.message)
    }
  },
  mounted () {
    if (this.data.animate) {
      const w = (this.$refs.message.offsetWidth + 1) + 'px'
      const h = this.$refs.message.offsetHeight + 'px'

      const typingIndicator = document.querySelector('.sc-typing-indicator')

      if (typingIndicator) {
        const typingIndicatorRect = typingIndicator.getBoundingClientRect()

        this.$refs.message.style.width = typingIndicatorRect.width + 'px'
        this.$refs.message.style.height = typingIndicatorRect.height + 'px'
        this.$refs.message.style.opacity = 1

        setTimeout(() => {
          this.$refs.message.style.width = w
          this.$refs.message.style.height = h
        }, 1)
      } else {
        this.$refs.message.style.width = '94px'
        this.$refs.message.style.height = '66px'
        this.$refs.message.style.opacity = 1

        setTimeout(() => {
          this.$refs.message.style.width = w
          this.$refs.message.style.height = h
        }, 500)
      }

      setTimeout(() => {
        this.$root.$emit('scroll-down-message-list')
      }, 450)
      setTimeout(() => {
        this.$root.$emit('scroll-down-message-list')
      }, 900)

      window.addEventListener('resize', () => {
        this.$refs.message.style.width = null
        this.$refs.message.style.height = null
      })
    }
  }
}
</script>

<style scoped>
.sc-message--button {
  background: #eaeaea;
  border-radius: 6px;
  padding: 10px 12px;
  max-width: calc(100% - 40px);
}

.sc-message--button .sc-message--button--buttons {
  padding-top: 15px;
}

.sc-message--button button {
  cursor: pointer;
  border-radius: 30px;
  border: none;
  font-size: 14px;
  padding: 12px 17px;
  margin: 0 10px 10px 0;
}

.sc-message--button button:hover {
  background-color: var(--button-hover) !important;
}

.sc-message--button button:last-child {
  margin-right: 0;
}

.sc-message--button .sc-message--button--text {
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  word-wrap: break-word;
  -webkit-font-smoothing: subpixel-antialiased;
  animation-duration: 0s;
}
</style>
