<template>
  <div class="od-carousel mt reap" :class="data.view_type">
    <template v-if="data.view_type == 'horizontal'">
      <slider
        direction="horizontal"
        :drag-enable="false"
        ref="slider"
        @slide-change-start="onSlideChangeStart"
      >
        <div v-for="(item, idx) in data.items" :key="idx">
          <TextMessage
            v-if="item.message_type === 'text'"
            :data="item"
            :author="message.author"
            :type="message.type"
            :onLinkClick="onLinkClick"
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
      </slider>

      <div class="od-carousel--arrows">
        <div v-if="showLeftArrow" class="od-carousel--arrow-left" @click="previousPage">
          <img src="/vendor/webchat/images/left.svg" />
        </div>
        <div v-if="showRightArrow" class="od-carousel--arrow-right" @click="nextPage">
          <img src="/vendor/webchat/images/right.svg" />
        </div>
      </div>
    </template>
    <template v-else>
      <div v-for="(item, idx) in data.items" :key="idx">
        <TextMessage
          v-if="item.message_type === 'text'"
          :data="item"
          :author="message.author"
          :type="message.type"
          :onLinkClick="onLinkClick"
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
    </template>
  </div>
</template>

<script>
import Slider from 'vue-plain-slider'

import ImageMessage from "./ImageMessage.vue";
import ButtonMessage from "./ButtonMessage.vue";
import RichMessage from "./RichMessage.vue";
import TextMessage from "./TextMessage.vue";

export default {
  components: {
    ButtonMessage,
    ImageMessage,
    RichMessage,
    TextMessage,
    Slider
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
    message: {
      type: Object,
      required: true
    },
    onLinkClick: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showLeftArrow: false,
      showRightArrow: false,
    }
  },
  mounted () {
    this.showRightArrow = (this.data.items.length > 1) ? true : false
  },
  methods: {
    previousPage () {
      this.$refs.slider.prev()
    },
    nextPage () {
      this.$refs.slider.next()
    },
    onSlideChangeStart (currentPage, el) {
      this.showLeftArrow = (currentPage == 1) ? false : true
      this.showRightArrow = (this.data.items.length > 1 && currentPage < this.data.items.length) ? true : false
    }
  }
};
</script>

<style lang="scss">
.od-carousel {
  .od-carousel--arrows {
    position: absolute;
    top: calc(50% - 25px);
    width: calc(100% - 6px);
    left: 3px;
  }
  .od-carousel--arrows div {
    width: 20px;
    height: 20px;
    cursor: pointer;
  }
  .od-carousel--arrows img {
    width: 100%;
  }

  .od-carousel--arrows .od-carousel--arrow-left {
    float: left;
  }

  .od-carousel--arrows .od-carousel--arrow-right {
    float: right;
  }

  &.vertical {
    padding: 0;
    columns: 2;
    column-gap: 5px;
    max-width: 100%;
    width: 329px;
    
    @media screen and (max-width: 375px), only screen and (device-width: 414px) and (device-height: 896px) {
      width: 265px;
    }

    > div {
      display: inline-block;
    }

    .od-message-rich {
      margin-left: 0;
      border-radius: 6px;
      padding: 10px;
      margin: 0 0 5px 0;
      width: 162px;
      max-width: 162px;
      transform: translateZ(0);
      
      @media screen and (max-width: 375px), only screen and (device-width: 414px) and (device-height: 896px) {
        padding: 5px;
        width: 162px;
        max-width: 162px;
      }

      .od-message-rich--title {
        font-size: 13px;
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
        margin: -10px -10px 10px -10px;
        height: 91px;
        
        @media screen and (max-width: 375px), only screen and (device-width: 414px) and (device-height: 896px) {
          margin: -5px -5px 5px -5px;
          height: 73px;
        }
      }
    }
  }

  &.horizontal {
    padding: 0 20px;
    position: relative;
    max-width: 100%;
    width: 311px;

    .od-message-rich {
      margin-left: 10px;
      margin-right: 10px;
      border-radius: 6px;
      max-width: 100%;
    }
  }
}
</style>
