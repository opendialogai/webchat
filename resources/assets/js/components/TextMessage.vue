<template>
  <div
    ref="message"
    @click="_handleClick"
    class="mt mt-text"
    :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author === 'them',
        system: this.type === 'system',
        'first-internal-message': this.data && this.data.firstInternal,
        'last-internal-message': this.data && this.data.lastInternal,
    }]"
    :style="messageColors"
    v-linkified:options="{ format: function (value, type) { return '<span>' + value + '</span>'; } }"
  >
    <span class="fade-enter-active" v-html="data.text"></span>
    <p v-if="data.meta" class="sc-message--meta" :style="{color: messageColors.color}">{{data.meta}}</p>
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



</style>
