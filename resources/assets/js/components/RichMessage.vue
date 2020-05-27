<template>
  <div class="mt reap mt-message-rich sc-message--rich" :style="messageColors"  :class="[{
        animate: this.data.animate,
    }]">
    <div class="sc-message--rich--title">{{ data.title }}</div>
    <div class="sc-message--rich--subtitle">{{ data.subtitle }}</div>
    <p class="sc-message--rich--text" v-linkified>
      <span v-html="data.text"></span>
    </p>

    <template v-if="data.image">
      <div class="sc-message--rich--image">
        <template v-if="data.image.url">
          <a :href="data.image.url" :target="data.image.link_new_tab ? '_blank' : '_parent'"><img :src="data.image.src" /></a>
        </template>
        <template v-else>
          <img :src="data.image.src" />
        </template>
      </div>
    </template>

    <template v-if="data.buttons.length">
      <div class="sc-message--rich--buttons">
        <button v-for="(button, idx) in data.buttons" :key="idx" @click="_handleClick(button)" :style="{backgroundColor: colors.button.bg, color: colors.button.text, '--button-hover': colors.button.hoverbg}">
          {{button.text}}
        </button>
      </div>
    </template>
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
    _handleClick(button) {
      this.onButtonClick(button, this.message)
    }
  }
}
</script>

<style scoped>
.sc-message--rich {
  border-radius: 6px;
  padding: 0 10px;
  max-width: calc(100% - 40px);
}

.sc-message--rich button {
  margin-bottom: 10px;

  border: 1px solid;
  font-size: 15px;
  line-height: 1.33;

  text-align: center;
  color: #ffffff;

  font-weight: normal;
  cursor: pointer;

  border: none;
  outline: none;
  position: relative;
  transition: 0.4s;
  width: 95%;
  max-width: 325px;
  border-radius: 34.5px;

  padding: 0 20px;
  @media (min-width: 450px) {
    padding: 0 10px;
  }
}

.sc-message--rich button {
  background-color: var(--btn-bg);
  color: var(--btn-color);
  border: 2px solid var(--btn-border-color);
}

.sc-message--rich button:hover {
  background-color: var(--btn-bg-hover);
  color: var(--btn-color-hover);
  border: 2px solid var(--btn-border-color-hover);
}

.sc-message--rich .sc-message--rich--image {
  text-align: center;
  margin-bottom: 10px;
}

.sc-message--rich .sc-message--rich--image img {
  max-width: 100%;
}
</style>
