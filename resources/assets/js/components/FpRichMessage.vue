<template>
  <div class="mt mt-message-fp-rich sc-message--fp-rich reap" :style="messageColors"  :class="[{
        animate: this.data.animate,
    }]">
    <div class="sc-message--fp-rich--title">{{ data.title }}</div>
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
    }
  }
};
</script>
