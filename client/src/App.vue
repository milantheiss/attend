<template>
  <div class="mb-40">
    <nav class="relative container mx-auto mt-6 md:mt-12 mb-8 md:mb-12 md:max-w-medium-width"
      v-show="currentRouteName != 'Login' && currentRouteName != 'Logout'">
      <div class="flex justify-between justify-content-center items-center">
        <button @click="showMenu = !showMenu" class="w-10">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0"
              stroke="currentColor" class="text-black" v-show="!showMenu">
              <path stroke-linecap="butt" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0"
              stroke="currentColor" class="text-black" v-show="showMenu">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </button>
        <h2 class="font-semibold text-xl md:text-2xl">{{this.$store.state.viewname}}</h2>

        <span class="rounded-full bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.548 47.707"
            class=" text-white w-10 h-10 md:w-12 md:h-12 p-2 md:p-3">
            <g fill="none" stroke="currentColor" stroke-width="6.649" transform="translate(-93.958 -82.631)">
              <ellipse cx="118.732" cy="96.016" rx="10.439" ry="10.061" />
              <path d="M97.15 129.409a22.145 17.563 0 0 1 21.581-13.623 22.145 17.563 0 0 1 21.582 13.626" />
            </g>
          </svg>
        </span>
      </div>

      <div class="grid mt-2" v-show="showMenu">
        <router-link @click="showMenu = !showMenu" to="/attendancelist"
          class="text-left font-medium text-xl md:text-2xl mt-2  ml-2">Anwesenheit</router-link>
        <router-link @click="showMenu = !showMenu" to="/editgroup"
          class="text-left font-medium text-xl md:text-2xl mt-2  ml-2">Gruppe bearbeiten</router-link>
        <router-link @click="showMenu = !showMenu" to="/exportpdf"
          class="text-left font-medium text-xl md:text-2xl mt-2  ml-2">Liste exportieren</router-link>
        <router-link @click="showMenu = !showMenu" to="/logout"
          class="text-left font-medium text-xl md:text-2xl mt-2 ml-2">Logout</router-link>
        <p class="text-center font-light text-sm md:text-base mt-2 mx-auto">Erstellt von Milan Theiß - Version 0.1.2</p>
      </div>
    </nav>
    <router-view class="font-ubuntu font-normal md:max-w-medium-width mx-auto" />
  </div>
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

