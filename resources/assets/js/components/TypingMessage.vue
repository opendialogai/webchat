<template>
  <transition leave-active-class="fadeOut">
    <div
      class="mt mt-typing-indicator"
      :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author === 'them',
    }]"
      :style="messageColors"
    >
      <!-- <div class="all-blobs">
        <div class="blob">
          <div class="blob-content"></div>
        </div>
        <div class="blob">
          <div class="blob-content"></div>
        </div>
        <div class="blob">
          <div class="blob-content"></div>
        </div>
      </div>-->
      <div ref="typewriter" class="typewriter">
        <p>typing...</p>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  methods: {
    ctaText() {
      setTimeout(() => {
        this.$refs.typewriter.classList.add("typewriter");
      }, 1000);
    }
  },

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
.typewriter {
  width: 60px;
  padding-bottom: 15px;
}
.typewriter p {
  overflow: hidden; /* Ensures the content is not revealed until the animation */
  border-right: 0.15em solid #da291c;
  white-space: nowrap; /* Keeps the content on a single line */
  margin: 0 auto; /* Gives that scrolling effect as the typing happens */
  line-height: 1;

  /* animation: typing 1s steps(9, end), blink-caret 0.75s step-end infinite; */
  animation: typing 3s steps(9, end) infinite,
    blink-caret 0.75s step-end infinite;
}

/* The typing effect */
@keyframes typing {
  0% {
    width: 0;
    opacity: 1;
  }

  /* Finish changes by here */
  20% {
    width: 100%;
  }

  90% {
    opacity: 1;
  }

  /* Between 20% and 100%, nothing changes */
  100% {
    width: 100%;
    opacity: 0;
  }
}

/* The typewriter cursor effect */
@keyframes blink-caret {
  from,
  to {
    border-color: transparent;
  }
  50% {
    border-color: #da291c;
  }
}
</style>
