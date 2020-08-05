<template>
  <transition leave-active-class="fadeOut">
    <div
      class="od-message-typing mt"
      :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author === 'them',
    }]">
      <div class="all-blobs">
        <div class="blob">
          <div class="blob-content"></div>
        </div>
        <div class="blob">
          <div class="blob-content"></div>
        </div>
        <div class="blob">
          <div class="blob-content"></div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  methods: {},
  props: {
    data: {
      type: Object,
      required: true
    },
    author: {
      type: String,
      required: true
    }
  }
};
</script>
<style lang="scss">
@import '../../../sass/0-globals/_vars.scss';
@import '../../../sass/0-globals/_animations.scss';

.od-message-typing.mt {
  animation-duration: 0s;
  background-color: transparent !important;
  color: #efefeb !important;
  font-size: 14px;
  padding: 25px 20px 10px 5px;

  @media (min-width: $media-med) {
    padding: 15px 30px;
  }

  .typewriter {
    width: 60px;
  }

  .typewriter p {
    overflow: hidden; /* Ensures the content is not revealed until the animation */
    border-right: 0.15em solid currentColor;
    white-space: nowrap; /* Keeps the content on a single line */
    margin: -8px auto 0px;
    line-height: 1.5;
    animation: typing 3s steps(9, end) infinite,
      blink-caret 0.75s step-end infinite;
  }

  .all-blobs {
    display: flex;
    align-items: flex-start;

    height: 20px;
    @media (min-width: $media-med) {
      height: 30px;
    }
  }

  .blob {
    height: 22px;
    margin: 0 16px 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &:nth-child(1) {
      .blob-content {
        background-color: var(--od-icon-background);
        animation-delay: 0s;
      }
    }

    &:nth-child(2) {
      .blob-content {
        background-color: var(--od-button-background);
        animation-delay: 0.2s;
      }
    }

    &:nth-child(3) {
      margin-right: 0;

      .blob-content {
        background-color: var(--od-icon-hover-background);
        animation-delay: 0.4s;
      }
    }
  }

  .blob-content {
    max-height: 22px;
    height: 45%;
    animation: andrewsBlobBob 1.1s infinite;
    border-radius: 5px;
    width: 10px;
  }
}
</style>
