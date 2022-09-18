<template>
  <nav class="relative container mx-auto p-6 md:max-w-medium-width"
    v-show="currentRouteName != 'Login' && currentRouteName != 'Logout'">
    <div class="flex items-center justify-between mb-4">
      <button @click="showMenu = !showMenu" class="">
        <span class="">
          <img :src="'./img/menu-icon.svg'" alt="eye icon" class="w-7 h-5 mx-auto" v-show="!showMenu">
          <img :src="'./img/x-icon-black.svg'" alt="x icon" class="w-5 ml-1 mr-1 mx-auto" v-show="showMenu">
        </span>
      </button>
      <h2 class="font-semibold text-xl md:text-2xl">{{this.$store.state.viewname}}</h2>
      <img :src="'./img/default-profilpic.svg'" alt="eye icon" class="w-12 rounded-full"/>
    </div>

    <div class="grid" v-show="showMenu">
      <router-link @click="showMenu = !showMenu" to="/attendancelist" class="text-left font-semibold text-lg md:text-xl mt-2">Anwesenheit</router-link>
      <router-link @click="showMenu = !showMenu" to="/exportpdf" class="text-left font-semibold text-lg md:text-xl mt-2">Liste exportieren</router-link>
      <router-link @click="showMenu = !showMenu" to="/logout" class="text-left font-semibold text-lg md:text-xl mt-2">Logout</router-link>
    </div>
    
  </nav>
  <router-view class="font-ubuntu font-normal"/>
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

