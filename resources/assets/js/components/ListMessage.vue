<template>
  <div class="mt reap sc-message--list">
    <div v-if="data.title" class="sc-message--list--title">{{ data.title }}</div>
    <div v-for="(item, idx) in data.items" :key="idx">
      <TextMessage
        v-if="item.message_type === 'text'"
        :data="item"
        :author="message.author"
        :type="message.type"
        :messageColors="messageColors"
        :onLinkClick="onLinkClick"
      />
      <ButtonMessage
        v-else-if="item.message_type === 'button'"
        :message="message"
        :data="item"
        :messageColors="messageColors"
        :colors="colors"
        :onButtonClick="onButtonClick"
      />
      <ImageMessage
        v-else-if="item.message_type === 'image'"
        :data="item"
        :messageColors="messageColors"
      />
      <RichMessage
        v-else-if="item.message_type === 'rich'"
        :message="message"
        :data="item"
        :messageColors="messageColors"
        :colors="colors"
        :onButtonClick="onButtonClick"
      />
    </div>
  </div>
</template>

<script>
import ImageMessage from "./ImageMessage.vue";
import ButtonMessage from "./ButtonMessage.vue";
import RichMessage from "./RichMessage.vue";
import TextMessage from "./TextMessage.vue";

export default {
  components: {
    ButtonMessage,
    ImageMessage,
    RichMessage,
    TextMessage
  },
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
    _handleClick (callback) {
      this.onButtonClick(callback, this.message)
    }
  }
}
</script>

<style scoped>

</style>
