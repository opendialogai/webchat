<template>
  <div
    class="od-message-rich mt reap mt-message-rich sc-message--rich"
    :class="[{
      animate: this.data.animate,
      linkable: (this.data.callback || this.data.link),
    }]"
    @click="_handleMessageClick"
  >
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
        <button
          v-for="(button, idx) in data.buttons"
          :key="idx" @click="_handleClick(button)">
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
    message: {
      type: Object,
      required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    }
  },
  methods: {
    _handleMessageClick() {
      if (this.data.callback || this.data.link) {
        this.onButtonClick(null, this.data)
      }
    },
    _handleClick(button) {
      this.onButtonClick(button, this.message)
    }
  }
}
</script>

<style lang="scss">

.od-message-rich.sc-message--rich {
  border-radius: 6px;
  padding: 0 10px;
  max-width: calc(100% - 40px);

  &.emit {
    background-color: var(--od-sent-message-background);
    color: var(--od-sent-message-text);
  }

  &.reap {
    background-color: var(--od-received-message-background);
    color: var(--od-received-message-text);
  }

  button {
    background-color: var(--od-button-background);
    color: var(--od-button-text);
    border: 2px solid var(--od-button-background);
    margin-bottom: 10px;
    font-size: 15px;
    line-height: 1.33;
    text-align: center;
    color: #ffffff;
    font-weight: normal;
    cursor: pointer;
    outline: none;
    position: relative;
    transition: 0.4s;
    width: 95%;
    max-width: 325px;
    border-radius: 34.5px;
    padding: 0 20px;

    &:hover {
      background-color: var(--od-button-hover-background);
      border: 2px solid var(--od-button-hover-background);
    }
    
    @media (min-width: 450px) {
      padding: 0 10px;
    }
  }

  .sc-message--rich--image {
    text-align: center;
    margin-bottom: 10px;
  }

  .sc-message--rich--image img {
    max-width: 100%;
  }
}

</style>
