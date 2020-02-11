<template>
  <transition
    leave-active-class="fadeOut"
  >
    <div class="sc-typing-indicator" :style="messageColors">
      <span :style="{'background-color': messageColors.color}"></span>
      <span :style="{'background-color': messageColors.color}"></span>
      <span :style="{'background-color': messageColors.color}"></span>
    </div>
  </transition>
</template>
<script>
export default {
  props: {
    messageColors: {
      type: Object,
      required: true
    }
  }
}
</script>
<style scoped>
.sc-typing-indicator {
  text-align: center;
  padding: 10px 12px;
  border-radius: 6px;
  animation-duration: 0s;
}

.sc-typing-indicator span {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  margin-right: 3px;
  animation: bob 2s infinite;
}

/* SAFARI GLITCH */
.sc-typing-indicator span:nth-child(1) {
  animation-delay: -1s;
}
.sc-typing-indicator span:nth-child(2) {
  animation-delay: -0.85s;
}
.sc-typing-indicator span:nth-child(3) {
  animation-delay: -0.7s;
}

@keyframes bob {
  10% {
    transform: translateY(-10px);
  }
  50% {
    transform: translateY(0);
  }
}
</style>
