<template>
  <div class="sc-message--list" :style="messageColors">
    <div class="sc-message--list--element" v-for="element in data.elements">
      <template v-if="element.image">
        <div class="sc-message--list--image"><img :src="element.image" /></div>
      </template>

      <div class="sc-message--list--title">{{ element.title }}</div>
      <div class="sc-message--list--subtitle">{{ element.subtitle }}</div>

      <div class="sc-message--list--button">
        <template v-if="element.button.url">
          <a :href="element.button.url" :target="element.button.link_new_tab ? '_blank' : '_parent'" :style="{backgroundColor: colors.button.bg, color: colors.button.text, '--button-hover': colors.button.hoverbg}">{{ element.button.text }}</a>
        </template>
        <template v-else-if="element.button.callback">
          <button @click="_handleClick(element.button.callback)" :style="{backgroundColor: colors.button.bg, color: colors.button.text, '--button-hover': colors.button.hoverbg}">
            {{ element.button.text }}
          </button>
        </template>
      </div>
    </div>
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
.sc-message--list {
  width: 100%;
  border-radius: 6px;
  word-wrap: break-word;
  max-width: 100%;
  -webkit-font-smoothing: subpixel-antialiased;
}
.sc-message--list .sc-message--list--element {
  display: inline-block;
  width: calc(100% - 24px);
  border-bottom: 1px solid #999;
  padding: 12px;
}
.sc-message--list .sc-message--list--element:last-child {
  border-bottom: none;
}
.sc-message--list .sc-message--list--image {
  float: right;
  width: 80px;
  margin: 0 0 5px 5px;
}
.sc-message--list .sc-message--list--image img {
  float: left;
  width: 100%;
  height: auto;
}
.sc-message--list .sc-message--list--title {
  margin-bottom: 7px;
  line-height: 20px;
}
.sc-message--list .sc-message--list--subtitle {
  font-size: 13px;
  line-height: 16px;
  color: #444;
  margin-bottom: 10px;
}
.sc-message--list .sc-message--list--button a {
  display: inline-block;
  color: white;
  background-color: #4e8cff;
  border-radius: 7px;
  font-size: 13px;
  padding: 4px 10px;
  text-decoration: none;
  text-align: center;
}
.sc-message--list .sc-message--list--button a:hover {
  background-color: var(--button-hover) !important;
}
.sc-message--list .sc-message--list--button button {
  cursor: pointer;
  border-radius: 7px;
  border: none;
  font-size: 13px;
  padding: 4px 10px;
}
.sc-message--list .sc-message--list--button button:hover {
  background-color: var(--button-hover) !important;
}
</style>
