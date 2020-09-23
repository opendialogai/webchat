<template>
  <div
    ref="message"
    @click="_handleClick"
    class="od-message-text mt"
    :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author !== 'me' && this.author !== 'system',
        system: this.type === 'system',
        'first-message': this.data && this.data.first,
        'middle-message': this.data && this.data.middle,
        'last-message': this.data && this.data.last,
    }]"
    v-linkified:options="{ format: function (value, type) { return '<span>' + value + '</span>'; } }"
  >
    <span class="fade-enter-active" v-html="data.text"></span>
      <p v-if="data.meta" class="sc-message--meta" >{{data.meta}}</p>
  </div>
</template>

<script>
export default {
  props: {
    author: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    data: {
      type: Object,
      required: true
    }
  },
  methods: {
    _handleClick(e) {
      if (e.target.tagName === "A") {
        this.$store.dispatch('linkClick', {url: e.target.href, text: e.target.offsetParent.textContent})
      } else if (e.target.offsetParent.tagName === 'A') {
        this.$store.dispatch('linkClick', {url: e.target.offsetParent.href, text: e.target.offsetParent.textContent})
      }
    }
  },

  mounted() {
    if (this.data.animate) {
      const w = this.$refs.message.offsetWidth + 1 + "px";
      const h = this.$refs.message.offsetHeight + "px";

      const typingIndicator = document.querySelector(".mt-typing-indicator");

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

<style lang="scss">
.od-message-text {
  transition: width 0.3s linear, height 0.3s linear;

  &.emit {
    background-color: var(--od-sent-message-background);
    color: var(--od-sent-message-text);
  }

  &.reap {
    background-color: var(--od-received-message-background);
    color: var(--od-received-message-text);
  }

  .linkified {
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }
}

</style>
