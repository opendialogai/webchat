<template>
  <div
    class="od-message-rich mt reap"
    :class="[{
      animate: this.data.animate,
      linkable: (this.data.callback || this.data.link),
    }]"
    @click="_handleMessageClick"
  >
    <div class="od-message-rich--title">{{ data.title }}</div>
    <div class="od-message-rich--subtitle">{{ data.subtitle }}</div>
    <p class="od-message-rich--text" v-linkified>
      <span v-html="data.text"></span>
    </p>

    <template v-if="data.image">
      <div class="od-message-rich--image">
        <template v-if="data.image.url">
          <a :href="data.image.url" :target="data.image.link_new_tab ? '_blank' : '_parent'"><img :src="data.image.src" /></a>
        </template>
        <template v-else>
          <img :src="data.image.src" />
        </template>
      </div>
    </template>

    <template v-if="data.buttons.length">
      <div class="od-message-rich--buttons">
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
    }
  },
  methods: {
    _handleMessageClick() {
      if (this.data.callback || this.data.link) {
        this.$store.dispatch('buttonClick', {button: null, data: this.data})
      }
    },
    _handleClick(button) {
      this.$store.dispatch('buttonClick', {button, data: this.message})
    }
  }
}
</script>

<style lang="scss">

.od-message-rich.mt {
  background: var(--od-received-message-background);
  border-radius: 10px;
  box-shadow: 0 13px 12px 2px rgba(0, 0, 0, 0.14);
  padding: 0 10px;
  max-width: calc(100% - 40px);
  width: 251px;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &.linkable {
    cursor: pointer;
  }

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

  .od-message-rich--title {
    font-size: 16px;
    font-weight: 600;
    line-height: 22px;
    color: #000000;
  }

  .od-message-rich--subtitle {
    font-size: 12px;
    line-height: 16px;
    color: #575759;
    margin-top: 5px;
  }

  .od-message-rich--text {
    font-size: 12px;
    font-weight: 400;
    line-height: 16px;
    color: #000000;
    white-space: pre-wrap;
    word-wrap: break-word;
    -webkit-font-smoothing: subpixel-antialiased;

    &:before {
      content: "";
      display: block;
      width: 32px;
      height: 3px;
      background: #a3cae9;
      margin: 5px 0 9px 0;
    }
  }

  .od-message-rich--image {
    text-align: center;
    order: -1;
    height: 141px;
    margin: 0 -10px 10px;
  }

  .od-message-rich--image img {
    max-width: 100%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  .od-message-rich--buttons {
    text-align: center;
    margin: 10px -10px -10px -10px;

    button {
      background: var(--od-button-background);
      color: #fff;
      font-size: 12px;
      line-height: 16px;
      padding: 7px 10px;
      width: 100%;
      border-radius: 0;

      &:hover {
        background: var(--od-button-hover-background);
        text-decoration: none;
      }
    }
  }
}

</style>
