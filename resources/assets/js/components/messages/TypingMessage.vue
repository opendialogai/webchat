<template>
  <transition leave-active-class="fadeOut">
    <div
      class="od-message-typing mt"
      :class="[{
        animate: this.data.animate,
        emit : this.author === 'me',
        reap: this.author === 'them',
    }]">
      <div v-if="$store.state.settings.general.typingIndicatorStyle === 'typewriter'">
        <div ref="typewriter" class="typewriter">
          <p>typing...</p>
        </div>
      </div>
      <div v-else class="all-blobs">
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
  background-color: transparent;
  color: #efefeb;
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
    height: 20px;

    @media (min-width: $media-med) {
      height: 30px;
    }

    width: 6px;
    margin: 0 5px 0 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    &:nth-child(1) {
      .blob-content {
        animation-delay: 0s;
      }
    }

    &:nth-child(2) {
      .blob-content {
        animation-delay: 0.2s;
      }
    }

    &:nth-child(3) {
      .blob-content {
        animation-delay: 0.4s;
      }
    }
  }

  .blob-content {
    max-height: 40px;
    height: 30%;
    background-color: black;
    animation: andrewsBlobBob 1.2s infinite;
    border-radius: 5px;
  }
}
</style>
