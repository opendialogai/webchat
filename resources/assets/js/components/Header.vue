<template>
  <div class="sc-header" @click="onClose" :style="{background: colors.header.bg, color: colors.header.text}">
    <div class="sc-header-wrapper">
      <div v-if="showExpandButton" class="sc-header--expand-button">
        <img @click.stop="onExpand" src="./assets/pop_out.svg" />
      </div>
      <div v-else class="sc-header--expand-button" ></div>
      <img v-if="imageUrl" class="sc-header--img" :src="imageUrl" alt="" />
      <div class="sc-header--team-name" v-html="teamName"></div>
      <div v-if="showRestartButton" @click="onRestartButtonClick" class="sc-header--restart-button">
        <img src="./assets/restart.svg" />
        <span>Restart</span>
      </div>
      <div class="sc-header--minimize-button">
        <svg width="18px" height="18px" viewBox="0 0 18 18" class="minimize">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g>
              <polygon id="Rectangle" :fill="colors.minimizeButton.bg" fill-rule="nonzero" points="5 7 13 7 8.99257813 11.3664551"></polygon>
              <rect id="Rectangle" :stroke="colors.minimizeButton.bg" x="0.5" y="0.5" width="17" height="17" rx="3"></rect>
            </g>
          </g>
        </svg>
        <svg width="18px" height="18px" viewBox="0 0 18 18" class="maximize">
          <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g>
              <polygon id="Rectangle" :fill="colors.minimizeButton.bg" fill-rule="nonzero" transform="translate(9.000000, 9.183228) rotate(-180.000000) translate(-9.000000, -9.183228) " points="5 7.0000009 13 7.0000009 8.99257813 11.366456"></polygon>
              <rect id="Rectangle" :stroke="colors.minimizeButton.bg" x="0.5" y="0.5" width="17" height="17" rx="3"></rect>
            </g>
          </g>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    imageUrl: {
      type: String,
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
}
</script>
<style scoped>
.sc-header {
  min-height: 56px;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: 10px;
  box-shadow: 0 1px 4px rgba(0,0,0,.2);
  position: relative;
  box-sizing: border-box;
  cursor: pointer;
}

.sc-header-wrapper {
  display: flex;
  height: 100%;
}

.sc-header--img {
  align-self: center;
  padding: 10px;
}

.sc-header--team-name {
  align-self: center;
  padding: 10px;
  flex: 1;
  user-select: none;
}

.sc-header--expand-button {
  width: 40px;
  align-self: center;
  height: 40px;
  margin-right: 10px;
  box-sizing: border-box;
}

.sc-header--expand-button img {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}
.sc-chat-window.expanded .sc-header--expand-button img {
  transform: rotate(180deg);
}

.sc-header--restart-button img {
  vertical-align: middle;
  height: 22px;
  margin: 9px 0;
}
.sc-header--restart-button span {
  vertical-align: middle;
  margin: 9px 5px;
}

.sc-header--minimize-button {
  width: 40px;
  align-self: center;
  height: 40px;
  margin-right: 10px;
  box-sizing: border-box;
}

.sc-header--minimize-button svg {
  width: 100%;
  height: 100%;
  padding: 11px;
  box-sizing: border-box;
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
