<template>
  <nav class="relative container mx-auto p-6 md:max-w-medium-width"
    v-show="currentRouteName != 'Login' && currentRouteName != 'Logout'">
    <div class="flex items-center justify-between mb-4">
      <button @click="showMenu = !showMenu" class="inline-flex items-center mx-3 md:mx-4 mt-4">
        <span class="">
          <img :src="'./img/menu-icon.svg'" alt="eye icon" class="w-7 h-5 mx-auto" v-show="!showMenu">
          <img :src="'./img/x-icon-black.svg'" alt="x icon" class="w-5 ml-1 mr-1 mx-auto" v-show="showMenu">
        </span>
      </button>
      <h2>{{this.$store.state.viewname}}</h2>
      <img :src="'./img/default-profilpic.svg'" alt="eye icon" class="w-11 rounded-full mx-auto"/>
    </div>

    <router-link to="/">Home</router-link> |
    <router-link to="/attendancelist">Attendance List</router-link>
  </nav>
  <router-view class="font-ubuntu font-normal" />
</template>

<script>
export default {
  data() {
    return {
      showMenu: false
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
}
</script>

