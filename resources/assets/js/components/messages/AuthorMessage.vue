<template>
  <!-- <div class="message-author" :class="{ animate: this.data.animate }"> -->

  <div
    class="od-author mt od-author"
    :class="[
    { animate: this.data.animate,
      emit : this.author === 'me',
      reap: this.author === 'them',
      'author--name': this.data.text !== '',
    }]"
  >
    <!-- emit message - intials -->
    <template v-if="data.author && data.author == 'me'">
      <span v-if="data.text" class="od-author--name">{{data.text}}</span>
      <span v-if="data.avatar" v-html="data.avatar"></span>
      <p v-if="data.meta" class="mt-meta">{{data.meta}}</p>
    </template>

    <!-- reap message - img avatar -->
    <template v-else>
      <span v-if="data.avatar" v-html="data.avatar"></span>
      <span v-if="data.text" class="od-author--name">{{data.text}}</span>
      <p v-if="data.meta" class="mt-meta">{{data.meta}}</p>
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

    author: {
      type: String,
      required: false
    }
  }
};
</script>

<style lang="scss">
.od-author.mt {
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin: 0 0 -15px 0;
  padding: 0;
  border-radius: 0;
  background-color: rgba(0, 0, 0, 0);
  font-size: 15px;
  font-weight: 600;
  animation-name: fadeInUp;
  animation-duration: 0.5s;

  @media screen and (min-width: 900px) {
    align-items: flex-start;
  }

  img.avatar {
    padding: 0;
    height: 53px;
    width: 53px;
    object-fit: contain;
    object-position: center center;
    border-radius: 100%;

    @media screen and (min-width: 900px) {
      width: 80px;
      height: 80px;
    }
  }

  span.avatar {
    width: 35px;
    height: 35px;
    margin: 9px 0;
    border-radius: 50px;
    background: var(--od-received-message-background);
    display: block;
    text-align: center;
    line-height: 35px;
    color: var(--od-received-message-text);

    @media screen and (min-width: 900px) {
      width: 60px;
      height: 60px;
      line-height: 60px;
    }
  }

  span {
    display: inline-block;
  }

  .od-author--name {
    vertical-align: top;
    color: var(--od-received-message-background);
    padding-top: 12px;
    padding-bottom: 15px;

    @media (min-width: 900px) {
      margin-top: -30px;
      margin-left: 20px;
    }
  }

  &.emit {
    margin-right: 5px;

    @media (min-width: 900px) {
      margin-right: -85px;
      margin-bottom: -60px;
      padding-top: 50px;
    }
    .od-author--name {
      padding-top: 5px;
      margin-right: 10px;

      @media (min-width: 900px) {
        margin-bottom: 0px;
        padding-top: 0px;
      }
    }
  }

  &.reap {
    @media (min-width: 900px) {
      margin-left: -100px;
      margin-bottom: -70px;
      padding-top: 30px;
    }
  }
}
</style>
