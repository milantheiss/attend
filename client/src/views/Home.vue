<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/mevn.jpg" width="350" />
    <HelloWorld msg="Default Boilerplate Template" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "home",
  components: {
    HelloWorld
  }
};
</script>
