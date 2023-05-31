<template>
  <div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 px-3.5 md:px-7">
        <div class="flex gap-4 justify-end items-center ">
          <button @click="showCreateUserModal = true"
            class="hidden ty:flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-fit px-3.5 md:px-7 py-3.5 z-10">
            <p class="font-medium font-base md:text-lg">Neuer Benutzer</p>
          </button>
          <button @click="showCreateUserModal = true"
            class="flex ty:hidden justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md w-fit h-fit p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
              class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <button @click="showSearchBar = !showSearchBar"
            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md w-fit h-fit p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
        <transition enter-active-class="transition ease-linear duration-200" enter-from-class="-translate-y-9"
          enter-to-class="translate-y-0" leave-active-class="transition ease-linear duration-200"
          leave-from-class="translate-y-0" leave-to-class="-translate-y-9">
          <div class="flex items-center gap-4" v-show="showSearchBar">
            <TextInput name="firstname" placeholder="Suche..." @onChange="(str) => search(str)" ref="searchBar">
            </TextInput>
            <div class="px-3.5 py-3.5" @click="$refs.searchBar.input = ''">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </transition>
      </div>
      <div class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col">
        <table class="table-auto w-full text-left">
          <thead>
            <tr :class="{ 'border-b border-[#D1D5DB]': typeof allUsers !== 'undefined' && allUsers?.length > 0 }">
              <th scope="col" class="w-[142px] md:w-[152px] pb-2.5 font-medium" @click="onClickOnSortByLastname">
                <span class="flex items-center gap-1">
                  <SortIcon :index="indexSort.lastname"></SortIcon>
                  Name
                </span>
              </th>
              <th scope="col" class="w-[142px] md:w-[152px] px-3 md:px-4 pb-2.5 font-medium"
                @click="onClickOnSortByFirstname">
                <span class="flex items-center gap-1">
                  <SortIcon :index="indexSort.firstname"></SortIcon>
                  Vorname
                </span>
              </th>
              <th scope="col" class="hidden ty:table-cell pb-2.5 font-medium" @click="onClickOnRoles">
                <span class="flex items-center gap-1 ">
                  <SortIcon :index="indexSort.roles"></SortIcon>
                  Rolle
                </span>
              </th>
              <th scope="col" class="pb-2.5 font-medium w-full"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in searchResults" :key="user.id" @click="openEditUser(user.id)"
              class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
              <!--Lastname-->
              <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 w-fit text-base sm:text-lg md:text-xl">
                <p class="">{{ user.lastname }}</p>
              </td>
              <!--Firstname-->
              <td class="px-3 md:px-4 w-fit py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                <p class="">{{ user.firstname }}</p>
              </td>
              <!--Höchste Rolle-->
              <td class="hidden ty:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0">
                <p class="text-light-gray">{{ getHighestRole(user.roles) }}</p>
              </td>
              <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end">
                <!--Arrow Right-->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                  stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto transition group-hover:translate-x-0.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                </svg>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-show="typeof searchResults === 'undefined' || searchResults?.length === 0"
          class="font-medium text-gray-500 text-center pt-2.5">Keine Mitglieder gefunden</p>
      </div>
    </div>

    <!-- Create New User Modal -->
    <ModalDialog :show="showCreateUserModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Neuen Teilnehmer</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">
          <!--Username des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="username" class="hidden sm:block">Benutzername:</label>
            <TextInput name="username" v-model="newUser.username" placeholder="Benutzername"
              :showError="error.cause.usernameInput" class="md:w-96"></TextInput>
          </div>

          <!--Vorname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname" class="hidden sm:block">Vorname:</label>
            <TextInput name="firstname" v-model="newUser.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname" class="hidden sm:block">Nachname:</label>
            <TextInput name="lastname" v-model="newUser.lastname" placeholder="Nachname"
              :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
          </div>

          <!--E-Mail des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="email" class="hidden sm:block">E-Mail:</label>
            <TextInput name="email" v-model="newUser.email" placeholder="E-Mail" :showError="error.cause.emailInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Rollen des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="role" class="hidden sm:block">Rollen:</label>
            <TextInput name="role" v-model="newUser.roles" placeholder="Rollen" :showError="error.cause.roleInput"
              class="md:w-96"></TextInput>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
          <div class="flex justify-between items-center gap-6 ">
            <button @click="cancel"
              class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Abbrechen</p>
            </button>
            <button @click="createNewUser"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Erstellen</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>

    <!-- Edit User Modal -->
    <ModalDialog :show="showEditUserModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Bearbeiten</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">

          <!--Username des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="username" class="hidden sm:block">Benutzername:</label>
            <TextInput name="username" v-model="editUser.username" placeholder="Benutzername"
              :showError="error.cause.usernameInput" class="md:w-96"></TextInput>
          </div>

          <!--Vorname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname" class="hidden sm:block">Vorname:</label>
            <TextInput name="firstname" v-model="editUser.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname" class="hidden sm:block">Nachname:</label>
            <TextInput name="lastname" v-model="editUser.lastname" placeholder="Nachname"
              :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
          </div>

          <!--E-Mail des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="email" class="hidden sm:block">E-Mail:</label>
            <TextInput name="email" v-model="editUser.email" placeholder="E-Mail" :showError="error.cause.emailInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Rollen des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="role" class="hidden sm:block">Rollen:</label>
            <TextInput name="role" v-model="editUser.roles" placeholder="Rollen" :showError="error.cause.roleInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Gruppen des Teilnehmers-->
          <!-- <div class="w-full flex items-center justify-between gap-4">
            <CollapsibleContainer>
              <template #header>
                <p>Gruppen</p>
              </template>
              <template #content>
                <div v-for="group in editUser.groups " :key="group.id" class="flex justify-between items-center gap-2">
                  <p>{{ group.name }}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-8 h-8 -mr-[2px]"
                    @click="editUser.groups = editUser.groups.filter(e => e.id !== group.id)">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </template>
            </CollapsibleContainer>
          </div> -->
          <div class="w-full flex items-center justify-between gap-4 mt-4">
            <p class="">Benutzer löschen:</p>
            <button
              @click="() => { showDeleteButton = true; error.message = 'Das Mitglied wird aus allen Gruppen und dazu gehörige Listen entfernt!'; error.show = true; }"
              v-show="!showDeleteButton"
              class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 rounded-2xl drop-shadow-md w-fit px-3 md:px-6 py-3">
              <p class="font-medium font-base md:text-lg">Löschen</p>
            </button>
            <button @click="deleteUser(editUser.id)"
              class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-fit px-3 md:px-6 py-3"
              v-show="showDeleteButton">
              <p class="font-medium font-base md:text-lg">Wirklich Löschen?</p>
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
          <div class="flex justify-between items-center gap-6 ">
            <button @click="cancel"
              class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Abbrechen</p>
            </button>
            <button @click="saveEditedUser"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Speichern</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>
  
<script>
import _ from "lodash"
import { getAllUsers, createNewUser, updateUser, deleteUser } from "@/util/fetchOperations"
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import ModalDialog from '@/components/ModalDialog.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

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
      searchResults: [],
      indexSort: {
        lastname: 0,
        firstname: 0,
        roles: 0
      },
      showSearchBar: false,
      showCreateUserModal: false,
      showEditUserModal: false,
      newUser: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        roles: []
      },
      editUser: {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        roles: []
      },
      error: {
        message: '',
        show: false,
        cause: {
          firstnameInput: false,
          lastnameInput: false,
          roleInput: false
        }
      },
      showDeleteButton: false
    }
  },
  components: {
    SortIcon,
    TextInput,
    ModalDialog,
    ErrorMessage
  },
  methods: {
    onClickOnSortByLastname() {
      this.indexSort.lastname = (this.indexSort.lastname + 1) % 2
      if (this.indexSort.lastname === 1) {
        this.searchResults.sort((a, b) => b.lastname.localeCompare(a.lastname))
      } else {
        this.searchResults.sort((a, b) => a.lastname.localeCompare(b.lastname))
      }
    },

    onClickOnSortByFirstname() {
      this.indexSort.firstname = (this.indexSort.firstname + 1) % 2
      if (this.indexSort.firstname === 1) {
        this.searchResults.sort((a, b) => b.firstname.localeCompare(a.firstname))
      } else {
        this.searchResults.sort((a, b) => a.firstname.localeCompare(b.firstname))
      }
    },

    onClickOnRoles() {
      this.indexSort.roles = (this.indexSort.roles + 1) % 2
      if (this.indexSort.roles === 1) {
        this.searchResults.sort((a, b) => b.role.localeCompare(a.role))
      } else {
        this.searchResults.sort((a, b) => a.role.localeCompare(b.role))
      }
    },

    search(searchString) {
      if (this.showSearchBar) {
        // this.showSearchBar = false
        if (searchString !== '') {
          this.searchResults = this.allUsers.filter(user => {
            return user.firstname.toLowerCase().indexOf(searchString.toLowerCase()) > -1 || user.lastname.toLowerCase().indexOf(searchString.toLowerCase()) > -1 || this.getHighestRole(user.roles).toLowerCase().indexOf(searchString.toLowerCase()) > -1
          })
        } else {
          this.searchResults = this.allUsers
        }
      }
    },

    cancel() {
      this.showCreateUserModal = false
      this.showEditUserModal = false
      this.showDeleteButton = false

      this.newUser = {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        roles: []
      }

      this.editUser = {
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        roles: []
      }

      this.resetError()
    },

    async createNewUser() {
      this.resetError()

      if (this.newUser.firstname.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Vornamen ein.'
        this.error.show = true
        this.error.cause.firstnameInput = true
      }
      if (this.newUser.lastname.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Nachnamen ein.'
        this.error.show = true
        this.error.cause.lastnameInput = true
      }
      //TODO Fehler abfangen für Role
      if ([this.error.cause.firstnameInput, this.error.cause.lastnameInput, this.error.cause.roleInput].filter(x => x === true).length >= 2) {
        this.error.message = 'Mehrere Fehler.'
      }

      if (!this.error.show) {
        //Create User --> POST
        //TODO Implement POST request
        const res = await createNewUser(this.newUser)
        if (res.status === 201) {
          //Update User --> PUT
          this.getAllUsers()
          this.resetError()

          this.showCreateUserModal = false
        } else {
          this.error.message = 'Es ist ein Fehler aufgetreten.'
          this.error.show = true
        }
      }
    },

    async saveEditedUser() {
      this.resetError()

      if (this.editUser.firstname.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Vornamen ein.'
        this.error.show = true
        this.error.cause.firstnameInput = true
      }
      if (this.editUser.lastname.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Nachnamen ein.'
        this.error.show = true
        this.error.cause.lastnameInput = true
      }
      //TODO Fehler abfangen für Role
      if ([this.error.cause.firstnameInput, this.error.cause.lastnameInput, this.error.cause.roleInput].filter(x => x === true).length >= 2) {
        this.error.message = 'Mehrere Fehler.'
      }

      if (!this.error.show) {
        const oldEntry = this.allUsers.find(m => m.id === this.editUser.id)

        if (this.editUser.firstname === oldEntry.firstname && this.editUser.lastname === oldEntry.lastname && this.editUser.roles === oldEntry.roles) {
          this.error.message = 'Es wurden keine Änderungen vorgenommen.'
          this.error.show = true
        } else {
          const res = await updateUser({
            ...this.editUser,
            groups: this.editUser.groups.map(g => g.id)
          })
          if (res.status === 200) {
            //Update User
            this.getAllUsers()
            this.resetError()

            this.showEditUserModal = false
          } else {
            this.error.message = 'Es ist ein Fehler aufgetreten.'
            this.error.show = true
          }
        }
      }
    },

    async deleteUser(id) {
      const res = await deleteUser(id)
      if (res.status === 200) {
        //Update User
        this.getAllUsers()
        this.cancel()
      } else {
        this.error.message = 'Es ist ein Fehler aufgetreten.'
        this.error.show = true
      }
    },

    async openEditUser(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      this.editUser = _.cloneDeep(this.allUsers.find(m => m.id === id))

      this.showEditUserModal = true
    },

    async getAllUsers() {
      this.allUsers = (await getAllUsers()).sort((a, b) => a.lastname.localeCompare(b.lastname))
    },

    resetError() {
      this.error.show = false
      this.error.cause.firstnameInput = false
      this.error.cause.lastnameInput = false
      this.error.cause.roleInput = false
      this.error.message = ''
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

    this.getAllUsers()
  },

  watch: {
    allUsers() {
      this.searchResults = this.allUsers
    }
  }
}
</script>
