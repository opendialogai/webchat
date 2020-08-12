<template>
  <div class="od-progress-bar">
    <div class="od-progress-bar__wrapper">
      <div class="od-progress-bar__track">
        <div class="od-progress-bar__progress" :style="{'width': `${progress}%`}"></div>
      </div>
      <p class="od-progress-bar__label">{{labelText}}</p>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  data() {
    return {};
  },
  methods: {},
  computed: {
    ...mapState({
      progress: state => state.messageMetaData.progressPercent,
      labelText: state => state.messageMetaData.progressText
    })
  }
};
</script>

<style lang="scss">
@import '../../../sass/0-globals/_vars.scss';

.od-progress-bar {
  background-color: var(--od-message-list-background);
  min-height: 40px;
  padding: 16px;

  @media (min-width: $media-med) {
    min-height: 50px;
  }

  .od-progress-bar__wrapper {
    align-items: center;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    max-width: 830px;
    width: 100%;
  }

  .od-progress-bar__track {
    background-color: #c8c8c8;
    flex: 1 0 auto;
    height: 2px;
    margin-right: 16px;
    max-width: 136px;
    position: relative;

    @media (min-width: $media-med) {
      max-width: 655px;
    }
  }

  .od-progress-bar__progress {
    background-color: var(--od-icon-background);
    height: 2px;
    left: 0;
    position: absolute;
    top: 0;

    &:after {
      background-color: var(--od-icon-background);
      border-radius: 50%;
      content: '';
      display: block;
      height: 8px;
      position: absolute;
      right: -4px;
      top: 50%;
      transform: translateY(-50%);
      width: 8px;
    }
  }

  .od-progress-bar__label {
    font-size: 13px;
    max-width: 40%;
  }
}
</style>
