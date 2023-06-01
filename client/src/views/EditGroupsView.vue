<template>
  <div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 px-3.5 md:px-7">
        <div class="flex gap-4 justify-end items-center ">
          <button @click="showCreateGroupModal = true"
            class="hidden ty:flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-fit px-3.5 md:px-7 py-3.5 z-10">
            <p class="font-medium font-base md:text-lg">Neue Gruppe</p>
          </button>
          <button @click="showCreateGroupModal = true"
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
            <TextInput name="searchbar" placeholder="Suche..." @onChange="(str) => search(str)" ref="searchBar">
            </TextInput>
            <div class="px-3.5 py-3.5"
              @click="() => { if ($refs.searchBar.input === '') showSearchBar = false; $refs.searchBar.input = ''; }">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </transition>
      </div>
      <!--TODO Collapsible für jedes Department-->
      <CollapsibleContainer v-for="department in this.departments" :key="department._id"
        class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col h-fit max-h-[73vh] overflow-y-auto">
        <template #header>
          <p class="font-medium">{{ department.name }}</p>
        </template>
        <template #content>
          <div class="">
            <table class="table-auto w-full text-left">
              <thead>
                <tr
                  :class="{ 'border-b border-[#D1D5DB]': typeof this.searchResults.filter(g => g.department._id === department._id) !== 'undefined' && this.searchResults.filter(g => g.department._id === department._id)?.length > 0 }">
                  <th scope="col" class="pb-2.5 font-medium" @click="onClickOnSortByGroupname">
                    <span class="flex items-center gap-1">
                      <SortIcon :index="indexSort.groupname"></SortIcon>
                      Gruppenbezeichnung
                    </span>
                  </th>
                  <th scope="col" class="pb-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="group in this.searchResults.filter(g => g.department._id === department._id)" :key="group._id"
                  @click="openEditGroup(group._id)" class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                  <!--Gruppenbezeichnung-->
                  <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                    <p class="">{{ group.name }}</p>
                  </td>

                  <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 justify-items-end">
                    <!--Arrow Right-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                      stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto transition group-hover:translate-x-0.5">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-show="typeof this.searchResults.filter(g => g.department._id === department._id) === 'undefined' || this.searchResults.filter(g => g.department._id === department._id)?.length === 0"
              class="font-medium text-gray-500 text-center pt-2.5">Keine Gruppen gefunden</p>
          </div>
        </template>
      </CollapsibleContainer>
    </div>

    <!-- Create New Group Modal -->
    <ModalDialog :show="showCreateGroupModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Neue Gruppe</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">
          <!--Gruppenbezeichnung-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="name" class="hidden sm:block">Name:</label>
            <TextInput name="name" v-model="newGroup.name" placeholder="Benutzername" :showError="error.cause.nameInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Zeiten der Gruppe -->
          <div class="w-full flex items-center justify-between gap-4">
            <!-- Selector für Tag (Mo, Di, Mi, ...) -->
            <!-- Time Selector -->
            <label for="firstname" class="hidden sm:block">Vorname:</label>
            <TextInput name="firstname" v-model="newGroup.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Hauptveranstaltungsort-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="venue" class="hidden sm:block">Sportstätte:</label>
            <TextInput name="venue" v-model="newGroup.venue" placeholder="Nachname" :showError="error.cause.venueInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Abteilung-->
          <div class="w-full flex items-center justify-between gap-4">
            <!--Dropdown Selector aus allen Departments-->
            <label for="email" class="hidden sm:block">E-Mail:</label>
            <TextInput name="email" v-model="newGroup.email" placeholder="E-Mail" :showError="error.cause.emailInput"
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
            <button @click="createNewGroup"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Erstellen</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>

    <!-- Edit Group Modal -->
    <ModalDialog :show="showEditGroupModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Bearbeiten</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">
          <!--Gruppenbezeichnung-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="name" class="hidden sm:block">Name:</label>
            <TextInput name="name" v-model="editGroup.name" placeholder="Benutzername" :showError="error.cause.nameInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Zeiten der Gruppe -->
          <div class="w-full flex items-center justify-between gap-4">
            <!-- Selector für Tag (Mo, Di, Mi, ...) -->
            <!-- Time Selector -->
            <label for="firstname" class="hidden sm:block">Vorname:</label>
            <TextInput name="firstname" v-model="editGroup.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Hauptveranstaltungsort-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="venue" class="hidden sm:block">Sportstätte:</label>
            <TextInput name="venue" v-model="editGroup.venue" placeholder="Nachname" :showError="error.cause.venueInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Abteilung-->
          <div class="w-full flex items-center justify-between gap-4">
            <!--Dropdown Selector aus allen Departments-->
            <label for="email" class="hidden sm:block">E-Mail:</label>
            <TextInput name="email" v-model="editGroup.email" placeholder="E-Mail" :showError="error.cause.emailInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Teilnehmer-->
          <div class="w-full flex items-center justify-between gap-4">
            <CollapsibleContainer>
              <template #header>
                <p class="font-medium">Teilnehmer</p>
              </template>
              <template #content>
                <div v-for="participant in editGroup.participants " :key="participant._id"
                  v-show="editGroup.participants.length !== 0" class="flex justify-between items-center gap-2">
                  <!--TODO Ordentliche Liste-->
                  <p>{{ participant.name }}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-8 h-8 -mr-[2px]"
                    @click="editGroup.accessible_groups = editGroup.accessible_groups.filter(e => e !== participant)">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <!--TODO Add Participant-->
                </div>
                <p class="text-light-gray" v-show="editGroup.participants.length === 0">Keine Teilnehmer zugeteilt</p>
              </template>
            </CollapsibleContainer>
          </div>

          <!--Teilnehmer-->
          <div class="w-full flex items-center justify-between gap-4">
            <CollapsibleContainer>
              <template #header>
                <p class="font-medium">Trainer</p>
              </template>
              <template #content>
                <div v-for="trainer in editGroup.trainers " :key="trainer._id" v-show="editGroup.trainers.length !== 0"
                  class="flex justify-between items-center gap-2">
                  <!--TODO Ordentliche Liste-->
                  <p>{{ trainer.name }}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-8 h-8 -mr-[2px]"
                    @click="editGroup.accessible_groups = editGroup.accessible_groups.filter(e => e !== trainer)">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <!--TODO Add Trainer-->
                </div>
                <p class="text-light-gray" v-show="editGroup.trainers.length === 0">Keine Trainer zugeteilt</p>
              </template>
            </CollapsibleContainer>
          </div>

          <div class="w-full flex items-center justify-between gap-4">
            <p class="">Gruppe löschen:</p>
            <button
              @click="() => { showDeleteButton = true; error.message = 'Die gehörige Listen werden ebenfalls gelöscht!'; error.show = true; }"
              v-show="!showDeleteButton"
              class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 rounded-2xl drop-shadow-md w-[90px] md:w-[114px] py-3">
              <p class="font-medium font-base md:text-lg">Löschen</p>
            </button>
            <button @click="deleteGroup(editGroup._id)"
              class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-fit px-[7px] md:px-6 py-1.5"
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
            <button @click="saveEditedGroup"
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
import { getAllGroups, createNewGroup, updateGroup, deleteGroup } from "@/util/fetchOperations"
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import ModalDialog from '@/components/ModalDialog.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";

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
      searchResults: [],
      indexSort: {
        groupname: 0,
        firstname: 0,
        roles: 0
      },
      showSearchBar: false,
      showCreateGroupModal: false,
      showEditGroupModal: false,
      newGroup: {
        name: '',
        venue: '',
        department: '',
        times: []
      },
      editGroup: {
        venue: '',
        name: '',
        department: '',
        times: [],
        participants: [],
        trainers: []
      },
      departments: [],
      error: {
        message: '',
        show: false,
        cause: {
          venueInput: false,
          nameInput: false
        }
      },
      showDeleteButton: false
    }
  },
  components: {
    SortIcon,
    TextInput,
    ModalDialog,
    ErrorMessage,
    CollapsibleContainer
  },
  methods: {
    onClickOnSortByGroupname() {
      this.indexSort.groupname = (this.indexSort.groupname + 1) % 2
      if (this.indexSort.groupname === 1) {
        this.searchResults.sort((a, b) => b.name.localeCompare(a.name))
      } else {
        this.searchResults.sort((a, b) => a.name.localeCompare(b.name))
      }
    },

    search(searchString) {
      if (this.showSearchBar) {
        if (searchString !== '') {
          this.searchResults = this.allGroups.filter(group => {
            return group.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1
          })
        } else {
          this.searchResults = this.allGroups
        }
      }
    },

    cancel() {
      this.showCreateGroupModal = false
      this.showEditGroupModal = false
      this.showDeleteButton = false

      this.newGroup = {
        name: '',
        venue: '',
        department: '',
        times: []
      }

      this.editGroup = {
        venue: '',
        name: '',
        department: '',
        times: [],
        participants: [],
        trainers: []
      }

      this.resetError()
    },

    async createNewGroup() {
      this.validateInputs(this.newGroup)

      if (!this.error.show) {
        const res = await createNewGroup(this.newGroup)
        if (res.ok) {
          this.getAllGroups()
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async saveEditedGroup() {
      this.validateInputs(this.editGroup)

      if (!this.error.show) {
        this.editGroup.department = this.editGroup.department._id

        const res = await updateGroup(this.editGroup)
        if (res.ok) {
          this.getAllGroups()
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async deleteGroup(id) {
      const res = await deleteGroup(id)
      if (res.ok) {
        this.getAllGroups()
        this.cancel()
      } else {
        this.error.message = res.body.message
        this.error.show = true
      }
    },

    async openEditGroup(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      this.editGroup = _.cloneDeep(this.allGroups.find(m => m._id === id))

      this.editGroup.department = this.departments.find(d => d._id === this.editGroup.department)

      this.showEditGroupModal = true
    },

    async getAllGroups() {
      this.allGroups = (await getAllGroups()).sort((a, b) => a.name.localeCompare(b.name))
      //Array aus allen Departments der Gruppen Keine Duplikate
      this.departments = this.allGroups.map(g => g.department).filter((value, index, array) => array.findIndex(t => (t._id === value._id)) === index)
      this.searchResults = this.allGroups
    },

    resetError() {
      this.error.show = false
      //TODO Update error.cause
      this.error.cause = {
        nameInput: false,
        venueInput: false
      }
      this.error.message = ''
    },

    validateInputs(inputs) {
      console.log(inputs);
      this.resetError()

      if (inputs.firstname.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Vornamen ein.'
        this.error.show = true
        this.error.cause.firstnameInput = true
      }
      if (inputs.lastname.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Nachnamen ein.'
        this.error.show = true
        this.error.cause.venueInput = true
      }
      if (inputs.username.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Benutzernamen ein.'
        this.error.show = true
        this.error.cause.nameInput = true
      }
      if (inputs.email.trim().length === 0) {
        this.error.message = 'Bitte gebe einen E-Mail ein.'
        this.error.show = true
        this.error.cause.emailInput = true
      }
      //Check if email is valid
      if (!inputs.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
        this.error.message = 'Bitte eine gültige E-Mail ein.'
        this.error.show = true
        this.error.cause.venueInput = true
      }

      //If any error is true, set error.message to 'Mehrere Fehler.'
      if (Object.keys(this.error.cause).some(k => this.error.cause[k])) {
        this.error.message = 'Mehrere Fehler.'
      }

      if (typeof inputs._id !== 'undefined') {
        const oldEntry = this.allGroups.find(m => m._id === inputs._id)
        if (_.isEqual(this.editGroup.firstname, oldEntry.firstname) && _.isEqual(this.editGroup.venue, oldEntry.lastname)
          && _.isEqual(this.editGroup.username, oldEntry.username) && _.isEqual(this.editGroup.email, oldEntry.email)
          && _.isEqual(this.editGroup.accessible_groups.map(g => g._id), oldEntry.accessible_groups) && _.isEqual(this.editGroup.roles, oldEntry.roles)) {
          this.error.message = 'Es wurden keine Änderungen vorgenommen.'
          this.error.show = true
        }
      }
    }
  },

  async created() {
    document.title = 'Benutzer bearbeiten - Attend'
    this.dataStore.viewname = "Benutzer bearbeiten"

    this.getAllGroups()
  },

  watch: {
    allGroups() {
      this.searchResults = this.allGroups
    },
    "roles.admin": function (newVal) {
      if (newVal && !this.editGroup.roles.includes('admin') && !this.newGroup.roles.includes('admin')) {
        this.editGroup.roles.push('admin')
        this.newGroup.roles.push('admin')
      } else if (!newVal) {
        this.editGroup.roles = this.editGroup.roles.filter(r => r !== 'admin')
        this.newGroup.roles = this.newGroup.roles.filter(r => r !== 'admin')
      }
    },
    "roles.staff": function (newVal) {
      if (newVal && !this.editGroup.roles.includes('staff') && !this.newGroup.roles.includes('staff')) {
        this.editGroup.roles.push('staff')
        this.newGroup.roles.push('staff')
      } else if (!newVal) {
        this.editGroup.roles = this.editGroup.roles.filter(r => r !== 'staff')
        this.newGroup.roles = this.newGroup.roles.filter(r => r !== 'staff')
      }
    },
    "roles.head": function (newVal) {
      if (newVal && !this.editGroup.roles.includes('head') && !this.newGroup.roles.includes('head')) {
        this.editGroup.roles.push('head')
        this.newGroup.roles.push('head')
      } else if (!newVal) {
        this.editGroup.roles = this.editGroup.roles.filter(r => r !== 'head')
        this.newGroup.roles = this.newGroup.roles.filter(r => r !== 'head')
      }
    },
    "roles.trainer": function (newVal) {
      if (newVal && !this.editGroup.roles.includes('trainer') && !this.newGroup.roles.includes('trainer')) {
        this.editGroup.roles.push('trainer')
        this.newGroup.roles.push('trainer')
      } else if (!newVal) {
        this.editGroup.roles = this.editGroup.roles.filter(r => r !== 'trainer')
        this.newGroup.roles = this.newGroup.roles.filter(r => r !== 'trainer')
      }
    },
    "roles.assistant": function (newVal) {
      if (newVal && !this.editGroup.roles.includes('assistant') && !this.newGroup.roles.includes('assistant')) {
        this.editGroup.roles.push('assistant')
        this.newGroup.roles.push('assistant')
      } else if (!newVal) {
        this.editGroup.roles = this.editGroup.roles.filter(r => r !== 'assistant')
        this.newGroup.roles = this.newGroup.roles.filter(r => r !== 'assistant')
      }
    }
  }
}
</script>
