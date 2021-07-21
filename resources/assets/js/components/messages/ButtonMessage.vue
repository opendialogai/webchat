<template>
  <div
    ref="message"
    class="od-message-button fade-enter-active"
    :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        inline : this.hasOnlyInline
    }]"
  >
    <div v-if="data.text" class="mt reap od-message-button__text">
      <span v-linkified v-html="$options.filters.sanitize(data.text)"/>
      <template v-if="data.buttons.length && !data.external">
        <div class="od-message-button__inline-buttons">
          <template v-for="(button, idx) in data.buttons">
            <button
              v-if="button.display && button.text && button.type === 'inline'"
              :key="idx"
              @[shouldClear]="_handleClick(button)"
              class="od-message-button__inline-button"
              :class="[button.type, {'download': button.download}]">
              <span>{{ button.text }}</span>
              <span class="od-message-button__button-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="17" viewBox="0 0 13 17">
                  <g fill="var(--od-button-text)">
                    <path d="M2.604 0.375L0 2.771 2.604 2.771z"/>
                    <path d="M3.646.167v3.647H-.001v13.02h12.5L12.5.167H3.646zm6.25 13.541H2.604v-1.042h7.292v1.042zm0-2.604H2.604v-1.041h7.292v1.041zm0-2.604H2.604V7.458h7.292V8.5z"/>
                  </g>
                </svg>
              </span>
            </button>
          </template>
        </div>
      </template>
    </div>

    <template v-if="data.buttons.length && !hasOnlyInline && !data.external">
      <div class="od-message-button__buttons-wrapper reap fade-enter-active">
        <template v-for="(button, idx) in data.buttons">
          <button
            v-if="button.display && button.text && button.type !== 'inline'"
            :key="idx"
            @[shouldClear]="_handleClick(button)"
            class="od-message-button__buttons-wrapper__button fade-enter-active"
            :class="button.type"
          >
            {{ button.text }}
          </button>
        </template>
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
    author: {
      type: String,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    }
  },
  methods: {
    _handleClick(button) {
      if (this.data.animate) {
        this.$refs.message.style.height = null;
      }
      this.onButtonClick(button, this.message);
    }
  },
  computed: {
    shouldClear() {
      return this.data.clear_after_interaction ? '~click' : 'click'
    },
    hasOnlyInline() {
      console.log(this.data.buttons.find(btn => btn.type === 'inline'))
      return this.data.buttons.length && this.data.buttons.find(btn => btn.type === 'inline') && this.data.buttons.filter(btn => btn.type !== 'inline').length <= 0
    }
  },
  mounted() {
    if (this.data.animate) {
      const w = this.$refs.message.offsetWidth + 1 + "px";
      const h = this.$refs.message.offsetHeight + "px";

      const typingIndicator = document.querySelector(".sc-typing-indicator");

      if (typingIndicator) {
        const typingIndicatorRect = typingIndicator.getBoundingClientRect();

        this.$refs.message.style.width = typingIndicatorRect.width + "px";
        this.$refs.message.style.height = typingIndicatorRect.height + "px";
        this.$refs.message.style.opacity = 1;

        setTimeout(() => {
          this.$refs.message.style.width = w;
          this.$refs.message.style.height = h;
        }, 1);
      } else {
        this.$refs.message.style.width = "94px";
        this.$refs.message.style.height = "66px";
        this.$refs.message.style.opacity = 1;

        setTimeout(() => {
          this.$refs.message.style.width = w;
          this.$refs.message.style.height = h;
        }, 500);
      }

      setTimeout(() => {
        this.$root.$emit("scroll-down-message-list");
      }, 450);

      window.addEventListener("resize", () => {
        this.$refs.message.style.width = null;
        this.$refs.message.style.height = null;
      });
    }

    setTimeout(() => {
      this.$root.$emit("scroll-down-message-list");
    }, 900);
  }
};
</script>

<style lang="scss">
.od-message-button {
  transition: width 0.3s linear, height 0.3s linear 0.3s;

  &.animate {
    opacity: 0;
  }

  &.emit {
    .od-message-button__text {
      background-color: var(--od-sent-message-background);
      color: var(--od-sent-message-text);
    }
  }

  .od-message-button__buttons-wrapper {
    animation-duration: 0.3s;
    animation-delay: 0.9s;
    margin-top: -18px;
    margin-bottom: 10px;
  }

  .od-message-button__text {
    animation-duration: 0.3s;
    animation-delay: 0.6s;
    background-color: var(--od-received-message-background);
    color: var(--od-received-message-text);
  }

  .od-message-button__inline-buttons {
    margin-top: 10px;
  }

  .od-message-button__inline-button {
    background-color: var(--od-button-background);
    border: 2px solid var(--od-button-background);
    color: var(--od-button-text);
    margin: 3px 5px 3px 0;
    padding: 14px 20px;
    border-radius: 4px;
    font-size: 14px;
    line-height: 17px;
    cursor: pointer;
    outline: none;
    position: relative;
    transition: 0.4s;

    &.download {
      .od-message-button__button-icon {
        display: inline-block;
      }
    }

    .od-message-button__button-icon {
      display: none;
      margin-left: 16px;
      position: relative;
      top: -2px;
    }
  }

  .od-message-button__buttons-wrapper__button {
    background-color: var(--od-button-background);
    color: var(--od-button-text);
    border: 2px solid var(--od-button-background);
    margin: 3px 5px 3px 0;
    padding: 14px 20px;
    border-radius: 30px;
    font-size: 14px;
    line-height: 17px;
    cursor: pointer;
    outline: none;
    position: relative;
    transition: 0.4s;
  }


  .od-message-button__buttons-wrapper__button:hover {
    background-color: var(--od-button-hover-background);
    color: var(--od-button-text);
    border: 2px solid var(--od-button-hover-background);
  }

  button:focus {
    outline:0;
  }
}

</style>
