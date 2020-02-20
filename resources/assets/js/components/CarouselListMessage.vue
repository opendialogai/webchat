<template>
  <div class="sc-message--carousel-list">
    <slider
      :direction="data.view_type"
      :pagination-visible="true"
      :pagination-clickable="true"
      :drag-enable="false"
      ref="slider"
      @slide-change-start="onSlideChangeStart"
    >
      <div v-for="(item, idx) in data.items" :key="idx">
        <TextMessage
          v-if="item.message_type === 'text'"
          :data="item"
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
    </slider>

    <div v-if="data.view_type == 'horizontal'" class="sc-message--carousel-list--arrows">

      <div v-if="showLeftArrow" class="sc-message--carousel-list--arrow-left" @click="previousPage">
        <!-- <img src="./assets/left.svg" /> -->
        <span>&lt;</span>
      </div>
      <div v-if="showRightArrow" class="sc-message--carousel-list--arrow-right" @click="nextPage">
        <!-- <img src="./assets/right.svg" /> -->

        <span>&gt;</span>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "vue-plain-slider";

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
    },
    onLinkClick: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      showLeftArrow: false,
      showRightArrow: false
    };
  },
  mounted() {
    this.showRightArrow = this.data.items.length > 1 ? true : false;
  },
  methods: {
    previousPage() {
      this.$refs.slider.prev();
    },
    nextPage() {
      this.$refs.slider.next();
    },
    onSlideChangeStart(currentPage, el) {
      this.showLeftArrow = currentPage == 1 ? false : true;
      this.showRightArrow =
        this.data.items.length > 1 && currentPage < this.data.items.length
          ? true
          : false;
    }
  }
};
</script>

<style scoped>
/*         carousel           */

.sc-message--carousel-list {
  background: #eaeaea;
  border-radius: 6px;
  padding: 0 15px;
  max-width: calc(100% - 40px);
  position: relative;
}

.sc-message--carousel-list .slider.horizontal {
  padding-bottom: 30px;
}
.sc-message--carousel-list .slider.vertical {
  padding-right: 30px;
}

.sc-message--carousel-list--arrows {
  position: absolute;
  top: calc(50% - 25px);
  width: calc(100% - 6px);
  left: 3px;
}
.sc-message--carousel-list--arrows div {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
.sc-message--carousel-list--arrows img {
  width: 100%;
}

.sc-message--carousel-list--arrows .sc-message--carousel-list--arrow-left {
  float: left;
}
.sc-message--carousel-list--arrows .sc-message--carousel-list--arrow-right {
  float: right;
}
</style>
