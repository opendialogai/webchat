<template>
  <div class="od-message-list mt reap">
    <div v-if="data.title" class="od-message-list--title">{{ data.title }}</div>
    <div v-for="(item, idx) in data.items" :key="idx">
      <TextMessage
        v-if="item.message_type === 'text'"
        :data="item"
        :author="message.author"
        :type="message.type"
      />
      <ButtonMessage
        v-else-if="item.message_type === 'button'"
        :message="message"
        :data="item"
      />
      <ImageMessage
        v-else-if="item.message_type === 'image'"
        :data="item"
      />
      <RichMessage
        v-else-if="item.message_type === 'rich'"
        :message="message"
        :data="item"
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
    message: {
      type: Object,
      required: true
    }
  }
}
</script>

<style lang="scss">
.od-message-list {
  border-radius: 6px;
  box-shadow: 0 13px 12px 2px rgba(0, 0, 0, 0.14);
  background-color: #ffffff;
  padding: 0;

  > div {
    border-bottom: 1px solid #f1f1f3;
    &:last-child  {
      border: none;
    }
  }

  .od-message-list--title {
    border-bottom: none;
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    padding: 10px;
  }

  .od-message-rich.mt {
    position: relative;
    display: inline-block;
    width: 100%;
    margin: 0;
    max-width: none;
    box-shadow: none;
    border-radius: 0;
    background: none;
    padding: 10px 80px 10px 10px;
    min-height: 73px;

    .od-message-rich--title {
      font-size: 12px;
    }
    .od-message-rich--subtitle {
      display: none;
    }
    .od-message-rich--text {
      font-size: 12px;
      &:before {
        display: none;
      }
    }
    .od-message-rich--image {
      position: absolute;
      top: 12px;
      right: 10px;
      margin: 0;
      height: 53px;
      width: 53px;
    }
    .od-message-rich--buttons {
      margin-left: 0;
      margin-right: 0;
    }
  }
}
</style>
