<template>
  <div>
    <div class="container mx-auto flex flex-col gap-4 mb-20 text-almost-black">

      <!-- Header mit Neue G Button & Search Bar -->

      <div class="flex flex-col gap-4 px-3.5 md:px-7">
        <div class="flex gap-4 justify-end items-center">

          <!-- Button callapset wenn Screen zu klein wird. Es wird nur noch + Icon gezeigt -->


          <StandardButton @click="$refs.newGroupModal.open()" class="hidden ty:flex">
            <p class="font-base md:text-lg">Neue Gruppe</p>
          </StandardButton>
          <button @click="$refs.newGroupModal.open()"
            class="flex ty:hidden justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md w-fit h-fit p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
              class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <!-- Toggle Search Bar -->

          <button @click="showSearchBar = !showSearchBar"
            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md w-fit h-fit p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>

        <!-- Searchbar -->

        <transition enter-active-class="transition ease-linear duration-200" enter-from-class="-translate-y-9"
          enter-to-class="translate-y-0" leave-active-class="transition ease-linear duration-200"
          leave-from-class="translate-y-0" leave-to-class="-translate-y-9">
          <div class="flex items-center gap-4" v-show="showSearchBar">
            <TextInput name="searchbar" placeholder="Suche..." v-model="searchString"></TextInput>
            <!-- X Icon entweder clear searchString oder schließt Searchbar, wenn searchString leer -->
            <div class="px-3.5 py-3.5"
              @click="() => { if (searchString === '') showSearchBar = false; searchString = ''; }">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </transition>
      </div>

      <!-- Abteilungsbox (Je eine Box für eine Abteilung) -->

      <CollapsibleContainer v-for="( department, index ) in   departments  " :key="department._id"
        class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col" :show="index === 0">

        <template #header>
          <p class="font-medium">{{ department.name }}</p>
        </template>

        <template #content>
          
          <div class="h-fit max-h-[55vh] overflow-y-auto block">
            <table class="table-auto w-full text-left">

              <!-- Tabellen Header -->
              <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
                <tr>
                  <th scope="col" class="pb-2.5 font-medium cursor-pointer"
                    @click="departments[index].sortIndex = (departments[index].sortIndex + 1) % 2">
                    <span class="flex items-center gap-1">
                      <SortIcon :index="departments[index].sortIndex"></SortIcon>
                      Gruppenbezeichnung
                    </span>
                  </th>
                  <th scope="col" class="pb-2.5 font-medium"></th>
                </tr>
              </thead>

              <!-- Je eine Zeil für jede Gruppe der jeweiligen Abteilung -->
              <tbody class="overscroll-y-scroll">
                <tr v-for=" group in searchResults.filter(g => g.department._id === department._id).sort((a, b) => {
                  if (departments[index].sortIndex === 1) return b.name.localeCompare(a.name)
                  return a.name.localeCompare(b.name)
                }) " :key="group._id" @click="openEditGroup(group._id)"
                  class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                  <!--Gruppenbezeichnung-->
                  <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                    <p>{{ group.name }}</p>
                  </td>

                  <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 justify-items-end">
                    <!--Arrow Right-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                      stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </td>
                </tr>
              </tbody>

            </table>
            <!-- Wird angezeigt, wenn einer Abteilung keine Gruppe zugeteilt ist -->
            <p v-show="typeof searchResults.filter(g => g.department._id === department._id) === 'undefined' || searchResults.filter(g => g.department._id === department._id)?.length === 0"
              class="font-medium text-gray-500 text-center pt-2.5">Keine Gruppen gefunden</p>

          </div>
        </template>
      </CollapsibleContainer>
    </div>

    <!-- Create New Group Modal -->
    <GroupModal ref="newGroupModal" :departments="departments" @onClose="getAllGroups"></GroupModal>
  </div>
</template>
  
<script>
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import GroupModal from "@/components/GroupModal.vue";
import StandardButton from "@/components/StandardButton.vue";
import { getAllGroups, getAllDepartments } from "@/util/fetchOperations";

export default {
  name: "EditUsersView",
  setup() {
    const dataStore = useDataStore()
    return {
      dataStore
    }
  },
  data() {
    return {
      allGroups: [],
      showSearchBar: false,
      departments: [],
      searchString: '',
    }
  },
  components: {
    SortIcon,
    TextInput,
    CollapsibleContainer,
    GroupModal,
    StandardButton
  },
  methods: {

    //Zum Bearbeiten einer Gruppe wird auf die EditGroupView weitergeleitet
    async openEditGroup(id) {
      this.$router.push({ path: '/administration/edit-group', query: { id: id } })
    },

    async getAllGroups() {
      this.allGroups = (await getAllGroups()).sort((a, b) => a.name.localeCompare(b.name))
      //Array aus allen Departments der Gruppen Keine Duplikate
      this.departments = (await getAllDepartments()).map(d => {
        return {
          ...d,
          //Wird für jede Abteilung einzeln initialisiert, damit die einzelnen Boxen
          //gesondert sortiert werden können (SortIndex 0 = Aufsteigend, 1 = Absteigend)
          sortIndex: 0
        }
      }).sort((a, b) => a.name.localeCompare(b.name))
    },
  },

  async created() {
    document.title = 'Gruppen bearbeiten - Attend'
    this.dataStore.viewname = "Gruppen bearbeiten"

  },

  async mounted() {
    await this.getAllGroups()
  },

  computed: {
    searchResults() {
      return this.allGroups.filter(group => {
        // Ermöglicht suche nach mehreren Wörtern (z.B. "Max Mustermann")
        if (this.searchString.indexOf(" ") > -1) {
          const searchStrings = this.searchString.split(" ")
          return searchStrings.every(s => group.name.toLowerCase().indexOf(s.toLowerCase()) > -1)
        }
        return group.name.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || this.searchString === ''
      })
    }
  }

}
</script>
