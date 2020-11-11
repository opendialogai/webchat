<template>

</template>

<script>
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);

export default {
name: "WebChatConfirmPop",
mounted() {
    this.$confirm("Are you sure?").then(() => {
      //do something...
    });
  }
}
</script>

<style scoped>

</style>
