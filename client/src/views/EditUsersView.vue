<template>
  <div>
    <div class="container mx-auto flex flex-col gap-4">

      <!-- Header mit Neuer B Button & Search Bar -->

      <div class="flex flex-col gap-4 px-3.5 md:px-7">
        <div class="flex gap-4 justify-end items-center">

          <!-- Button callapset wenn Screen zu klein wird. Es wird nur noch + Icon gezeigt -->

          <StandardButton @click="() => { this.$refs.newUserModal.open() }" class="hidden ty:flex">
            <p class="font-base md:text-lg">Neuer Benutzer</p>
          </StandardButton>
          <button @click="() => { this.$refs.newUserModal.open() }"
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
            <TextInput name="searchbar" placeholder="Suche..." v-model="searchString" ref="searchBar"></TextInput>
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

      <div class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col w-full">
        <!-- INFO Muss in zwei Divs aufgeteilt sein, ansonsten scrollt Tabelle durch Header durch und kann über Header gesehen werden -->
        <div class="h-fit max-h-[60vh] overflow-y-auto block">
          <table class="table-auto w-full">

            <!-- Tabellen Header ist sticky -->
            <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
              <tr>
                <th scope="col" class="pb-2.5 font-medium"
                  @click="() => { if (sortKey === 'lastname') indexSort.lastname = (indexSort.lastname + 1) % 2; sortKey = 'lastname' }">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="indexSort.lastname"></SortIcon>
                    Name
                  </span>
                </th>

                <th scope="col" class="px-3 md:px-4 pb-2.5 font-medium"
                  @click="() => { if (sortKey === 'firstname') indexSort.firstname = (indexSort.firstname + 1) % 2; sortKey = 'firstname' }">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="indexSort.firstname"></SortIcon>
                    Vorname
                  </span>
                </th>

                <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                  @click="() => { if (sortKey === 'roles') indexSort.roles = (indexSort.roles + 1) % 2; sortKey = 'roles' }">
                  <span class="flex items-center gap-1 ">
                    <SortIcon :index="indexSort.roles"></SortIcon>
                    Rolle
                  </span>
                </th>

                <!-- Spalte für Pfeil -->
                <th scope="col" class="pb-2.5"></th>

              </tr>
            </thead>

            <tbody class="overscroll-y-scroll">
              <tr v-for="user in searchResults" :key="user._id" @click="openEditUser(user._id)"
                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                <!--Lastname-->
                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p>{{ user.lastname }}</p>
                </td>
                <!--Firstname-->
                <td class="px-3 md:px-4 py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p>{{ user.firstname }}</p>
                </td>
                <!--Höchste Rolle-->
                <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="text-light-gray">{{ getHighestRole(user.roles) }}</p>
                </td>

                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0">
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

          <!-- Wenn keine Benutzer gefunden wurden -->
          <p v-show="typeof searchResults === 'undefined' || searchResults?.length === 0"
            class="font-medium text-gray-500 text-center pt-2.5">Keine Mitglieder gefunden</p>
        </div>
      </div>
    </div>
    <!-- Ende Benutzer Box -->

    <!-- Create User Modal -->
    <UserModal ref="newUserModal" @onClose="getAllUsers" type="new"></UserModal>

    <!-- Edit User Modal -->
    <UserModal ref="editUserModal" @onClose="getAllUsers" type="edit"></UserModal>
  </div>
</template>
  
<script>
import _ from "lodash"
import { getAllUsers, getGroupName } from "@/util/fetchOperations"
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import StandardButton from "@/components/StandardButton.vue";
import UserModal from "@/components/UserModal.vue";

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
      allUsers: [],
      indexSort: {
        lastname: 0,
        firstname: 0,
        roles: 0
      },
      sortKey: 'lastname',
      searchString: '',
      showSearchBar: false,
    }
  },

  components: {
    SortIcon,
    TextInput,
    StandardButton,
    UserModal
  },

  methods: {

    async openEditUser(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      const editUser = _.cloneDeep(this.allUsers.find(m => m._id === id))

      editUser.accessible_groups = await Promise.all(editUser.accessible_groups.map(async g => getGroupName(g)))

      const roles = {
        admin: editUser.roles.includes('admin'),
        staff: editUser.roles.includes('staff'),
        head: editUser.roles.includes('head'),
        trainer: editUser.roles.includes('trainer'),
        assistant: editUser.roles.includes('assistant')

      }

      this.$refs.editUserModal.open(editUser, roles)
    },

    async getAllUsers() {
      this.allUsers = await getAllUsers()
    },

    getHighestRole(roles) {
      if (roles.includes('admin')) {
        return 'Admin'
      } else if (roles.includes('staff')) {
        return 'Mitarbeiter'
      } else if (roles.includes('head')) {
        return 'Abteilungsleiter'
      } else if (roles.includes('trainer')) {
        return 'Trainer'
      } else if (roles.includes('assistant')) {
        return 'Assistent'
      } else {
        return 'Keine Rolle'
      }
    }
  },

  async created() {
    document.title = 'Benutzer bearbeiten - Attend'
    this.dataStore.viewname = "Benutzer bearbeiten"
  },

  async mounted() {
    await this.getAllUsers()
  },

  computed: {
    searchResults() {
      //Filtert die Nutzer nach dem Suchstring bzw. wenn der Suchstring leer ist, wird die Liste ungefiltert zurückgegeben
      const arr = this.allUsers.filter(user => {
        // Ermöglicht suche nach mehreren Wörtern (z.B. "Max Mustermann")
        if (this.searchString.indexOf(" ") > -1) {
          const searchStrings = this.searchString.split(" ")
          return searchStrings.every(s => user.firstname.toLowerCase().indexOf(s.toLowerCase()) > -1
            || user.lastname.toLowerCase().indexOf(s.toLowerCase()) > -1
            || this.getHighestRole(user.roles).toLowerCase().indexOf(s.toLowerCase()) > -1)
        }

        return user.firstname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          || user.lastname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          || this.getHighestRole(user.roles).toLowerCase().indexOf(this.searchString.toLowerCase()) > -1
          || this.searchString.trim().length === 0
      }
      ).sort((a, b) => {
        //Sortiert die Nutzer nach dem SortKey
        //Wenn der SortKey 'roles' ist, wird die höchste Rolle des Benutzers verglichen
        if (this.sortKey === "roles") return this.getHighestRole(a.roles).localeCompare(this.getHighestRole(b.roles));
        return a[this.sortKey].localeCompare(b[this.sortKey])
      })
      //Wenn der indexSort des SortKeys 1 ist, wird die Liste umgedreht
      return this.indexSort[this.sortKey] === 1 ? arr.reverse() : arr
    }
  }
}
</script>
