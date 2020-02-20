<template>
  <div
    ref="message"
    @click="_handleClick"
    class="sc-message--text"
    :style="messageColors"
    v-linkified:options="{ format: function (value, type) { return '<span>' + value + '</span>'; } }"
  >
    <span class="sc-message--text--content fade-enter-active" v-html="data.text"></span>
    <p v-if="data.meta" class="sc-message--meta" :style="{color: messageColors.color}">{{data.meta}}</p>
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
    },
    onLinkClick: {
      type: Function,
      required: true
    }
  },
  methods: {
    _handleClick(e) {
      if (e.target.tagName === "A") {
        this.onLinkClick(e.target.href);
      }
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
      setTimeout(() => {
        this.$root.$emit("scroll-down-message-list");
      }, 900);

      window.addEventListener("resize", () => {
        this.$refs.message.style.width = null;
        this.$refs.message.style.height = null;
      });
    }
  }
};
</script>

<style scoped>
.sc-message--text {
  padding: 10px 12px;
  border-radius: 6px;
  font-weight: 400;
  font-size: 14px;
  line-height: 1.4;
  white-space: pre-wrap;
  -webkit-font-smoothing: subpixel-antialiased;
}

.sc-message--text .sc-message--text--content {
  animation-duration: 0s;
}

.sc-message--content.sent .sc-message--text {
  color: white;
  background-color: #4e8cff;
  max-width: calc(100% - 120px);
  word-wrap: break-word;
}
.sc-message--content.received .sc-message--text {
  color: #263238;
  background-color: #f4f7f9;
  margin-right: 40px;
  max-width: calc(100% - 40px);
  word-wrap: break-word;
}
</style>
