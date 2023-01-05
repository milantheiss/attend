<template>
  <div class="mb-40 m-4">
    <!--Navbar: Wird angezeigt, wenn Session Authenticated-->
    <nav class="relative container mx-auto mt-6 md:mt-12 mb-8 md:mb-12 md:max-w-medium-width" v-if="auth.authenticated">
      <div class="flex justify-between justify-content-center items-center">
        <!--Menu Icon-->
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

        <!--Seitentitel-->
        <h2 class="font-semibold text-xl md:text-2xl">{{ dataStore.viewname }}</h2>

        <!--Profile Avatar-->
        <!--TODO Custom Avatar jenach User-->
        <!--TODO Link zu User Page-->

          <router-link @click="showMenu = false" to="/profile">
              <div class="absolute -top-2 -right-2 z-10 w-6 h-6 bg-delete-gradient-1 rounded-full flex justify-center items-center text-center shadow-lg text-white text-sm font-bold">2</div>
              <div class="rounded-full bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 z-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.548 47.707"
                  class=" text-white w-10 h-10 md:w-12 md:h-12 p-2 md:p-3">
                  <g fill="none" stroke="currentColor" stroke-width="6.649" transform="translate(-93.958 -82.631)">
                    <ellipse cx="118.732" cy="96.016" rx="10.439" ry="10.061" />
                    <path d="M97.15 129.409a22.145 17.563 0 0 1 21.581-13.623 22.145 17.563 0 0 1 21.582 13.626" />
                  </g>
                </svg>
              </div>
          </router-link>
      </div>

      <!--Navbar Links: Werden angezeigt, wenn auf Menu Icon geklickt wird.-->
      <transition enter-active-class="transition ease-in-out duration-700" enter-from-class="-translate-y-9 opacity-0"
        enter-to-class="translate-y-0 opacity-100">
        <div class="grid mt-2" v-show="showMenu">
          <router-link @click="showMenu = !showMenu" to="/attendancelist"
            class="text-left font-medium text-xl md:text-2xl mt-2  ml-2">Anwesenheitsliste</router-link>
          <router-link @click="showMenu = !showMenu" to="/createInvoice"
            class="text-left font-medium text-xl md:text-2xl mt-2  ml-2">Abrechnung erstellen</router-link>
          <router-link @click="showMenu = !showMenu" to="/editgroup"
            class="text-left font-medium text-xl md:text-2xl mt-2  ml-2">Gruppe bearbeiten</router-link>
          <router-link @click="showMenu = !showMenu" to="/exportpdf"
            class="text-left font-medium text-xl md:text-2xl mt-2  ml-2">Liste exportieren</router-link>
          <router-link @click="showMenu = !showMenu" to="/logout"
            class="text-left font-medium text-xl md:text-2xl mt-2 ml-2">Logout</router-link>
          <p class="text-center font-light text-sm md:text-base mt-2 mx-auto">Erstellt von Milan Theiß - Version 0.1.4
          </p>
        </div>
      </transition>
    </nav>

    <div v-if="dataStore.showPatchNotesDialog">
      <ModalDialog :show="showPatchNotes">
        <template #header>
          <div v-html="patchNotes.title"></div>
        </template>
        <template #subheader>
          <p>{{ new Date(patchNotes.date).toLocaleDateString() }}</p>
        </template>
        <template #content>
          <div v-html="patchNotes.text"></div>
        </template>
        <template #footer><button @click="dataStore.readPatchNotes()"
            class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-6 ty:px-10 sm:px-12 py-1.5 rounded-lg drop-shadow-md">
            <p class="font-medium text-base md:text-lg">Gelesen</p>
          </button></template>
      </ModalDialog>
    </div>

    <!--Seiten Inhalte: Router reguliert, welche Seite angezeigt wird.-->
    <router-view class="font-ubuntu font-normal md:max-w-medium-width mx-auto" v-slot="{ Component }">
      <transition enter-active-class="transition ease-in-out duration-500" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition ease-in-out duration-500 transform"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script>
import { useAuthStore } from './store/authStore'
import { useDataStore } from './store/dataStore'
import { getLastPatchNotes } from "@/util/fetchOperations"
import ModalDialog from './components/ModalDialog.vue';
import { ref } from 'vue';

export default {
  setup() {
    document.title = 'Attend'
    const dataStore = useDataStore();
    const auth = useAuthStore();
    const showPatchNotes = ref(dataStore.showPatchNotesDialog);
    return {
      dataStore,
      auth,
      showPatchNotes
    };
  },
  data() {
    return {
      showMenu: false,
      patchNotes: {
        title: "Patchnotes",
        text: "Was wurde geändert."
      }
    };
  },
  watch: {
    async "dataStore.showPatchNotesDialog"(newVal) {
      if (newVal) {
        this.patchNotes = await getLastPatchNotes();
      }
      this.showPatchNotes = newVal
    }
  },
  components: { ModalDialog }
}
</script>

