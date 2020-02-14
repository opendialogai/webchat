<template>
  <div
    class="sc-header"
    @click="onClose"
    :style="{background: colors.header.bg, color: colors.header.text}"
  >
    <div class="sc-header-wrapper">
      <div class="sc-header--team-name">
        <p v-if="teamName" v-html="teamName"></p>
      </div>

      <div class="sc-header--img">
        <img v-if="imageUrl" :src="imageUrl" alt />
      </div>

      <div @click="onRestartButtonClick" class="sc-header--restart-button">
        <div v-if="showRestartButton">
          <img src="./assets/restart.svg" />
          <span>Restart</span>
        </div>
      </div>
    </div>

    <div class="sc-header__btm-fade"></div>
  </div>
</template>


<script>
export default {
  props: {
    imageUrl: {
      type: String
    },
    teamName: {
      type: String
    },
    onClose: {
      type: Function,
      required: true
    },
    onExpand: {
      type: Function,
      required: true
    },
    onRestartButtonClick: {
      type: Function,
      required: true
    },
    showRestartButton: {
      type: Boolean,
      default: () => false
    },
    showExpandButton: {
      type: Boolean,
      default: true
    },
    colors: {
      type: Object,
      required: true
    }
  }
};
</script>
<style scoped>
.sc-header {
  /* min-height: 56px; */
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: 40px 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  position: relative;
}

.sc-header__btm-fade {
  position: absolute;
  bottom: -25px;
  height: 25px;
  width: 100%;
  background: rgb(27, 33, 42);
  background: linear-gradient(
    180deg,
    rgba(27, 33, 42, 1) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  z-index: 999;
}

.sc-header-wrapper {
  box-sizing: border-box;
  width: calc(100% - 50px);
  margin: 30px auto 0;
  display: flex;
  height: 100%;
  justify-content: space-between;
  cursor: pointer;
}

@media (min-width: 410px) {
  .sc-header-wrapper {
    cursor: unset;
  }
}
@media (min-width: 992px) {
}
@media (min-width: 1200px) {
}

.sc-header--img {
  align-self: center;
  width: 40%;
  min-width: 175px;
}

.sc-header--img img {}


@media (min-width: 768px) {
  .sc-header--img {
    width: 28%;
  }
}

.sc-header--team-name {
  user-select: none;
  width: 28%;
  align-items: center;
  justify-content: center;
  display: none;
}

@media (min-width: 992px) {
  .sc-header--team-name {
    display: flex;
  }
}

.sc-header--team-name p {
  margin: 0;
  line-height: 1;
}

.sc-header--restart-button {
  width: 28%;
  margin: 0 !important;

  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.sc-header--restart-button img {
  vertical-align: middle;
}

.sc-header--restart-button span {
  vertical-align: middle;
}

.sc-chat-window.opened .sc-header--minimize-button svg.maximize {
  display: none;
}
.sc-chat-window.closed .sc-header--minimize-button svg.minimize {
  display: none;
}
.sc-chat-window.closed .sc-header--minimize-button svg.maximize {
  display: block;
}
</style>
