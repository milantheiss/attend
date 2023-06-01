<template>
  <div>
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-4 px-3.5 md:px-7">
        <div class="flex gap-4 justify-end items-center ">
          <button @click="showCreateMemberModal = true"
            class="hidden ty:flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-fit px-3.5 md:px-7 py-3.5 z-10">
            <p class="font-medium font-base md:text-lg">Neues Mitglied</p>
          </button>
          <button @click="showCreateMemberModal = true"
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
      <div class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col overflow-y-auto h-[73vh]">
        <table class="table-auto w-full text-left">
          <thead>
            <tr :class="{ 'border-b border-[#D1D5DB]': typeof allMembers !== 'undefined' && allMembers?.length > 0 }">
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
              <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium" @click="onClickOnSortByBirthday">
                <span class="hidden md:flex items-center gap-1 ">
                  <SortIcon :index="indexSort.birthday"></SortIcon>
                  Geburtstag
                </span>
                <span class="flex md:hidden items-center gap-1 ">
                  <SortIcon :index="indexSort.birthday"></SortIcon>
                  Geb.
                </span>
              </th>
              <th scope="col" class="pb-2.5 font-medium w-full"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="member in searchResults" :key="member.id" @click="openEditMember(member.id)"
              class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
              <!--Lastname-->
              <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 w-fit text-base sm:text-lg md:text-xl">
                <p class="">{{ member.lastname }}</p>
              </td>
              <!--Firstname-->
              <td class="px-3 md:px-4 w-fit py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                <p class="">{{ member.firstname }}</p>
              </td>
              <!--Birthday-->
              <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                <p class="text-light-gray">{{
                  new Date(member.birthday).toLocaleDateString('de-DE', {
                    year: '2-digit', month:
                      '2-digit', day: '2-digit'
                  })
                }}</p>
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

    <!-- Create New Member Modal -->
    <ModalDialog :show="showCreateMemberModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Neuen Teilnehmer</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">

          <!--Vorname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname" class="">Vorname:</label>
            <TextInput name="firstname" v-model="newMember.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname" class="">Nachname:</label>
            <TextInput name="lastname" v-model="newMember.lastname" placeholder="Nachname"
              :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Geburtstag des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="birthday" class=""><span class="hidden sm:block">Geburtstag:</span><span
                class="block sm:hidden">Geb.:</span></label>
            <DateInput v-model="newMember.birthday" name="birthday" :max="new Date().toJSON().slice(0, 10)"
              class="font-medium md:w-96" :showError="error.cause.birthdayInput">
            </DateInput>
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
            <button @click="createNewMember"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Erstellen</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>

    <!-- Edit Member Modal -->
    <ModalDialog :show="showEditMemberModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Bearbeiten</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">

          <!--Vorname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname" class="">Vorname:</label>
            <TextInput name="firstname" v-model="editMember.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname" class="">Nachname:</label>
            <TextInput name="lastname" v-model="editMember.lastname" placeholder="Nachname"
              :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Geburtstag des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="birthday" class=""><span class="hidden sm:block">Geburtstag:</span><span
                class="block sm:hidden">Geb.:</span></label>
            <DateInput v-model="editMember.birthday" name="birthday" :max="new Date().toJSON().slice(0, 10)"
              class="font-medium md:w-96" :showError="error.cause.birthdayInput">
            </DateInput>
          </div>

          <!--Gruppen des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <CollapsibleContainer>
              <template #header>
                <p class="font-medium">Gruppen</p>
              </template>
              <template #content>
                <div v-for="group in editMember.groups " :key="group.id" class="flex justify-between items-center gap-2"
                  v-show="editMember.groups.length !== 0">
                  <p>{{ group.name }}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-8 h-8 -mr-[2px]"
                    @click="editMember.groups = editMember.groups.filter(e => e.id !== group.id)">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <p v-show="editMember.groups.length === 0">In keiner Gruppe</p>
              </template>
            </CollapsibleContainer>
          </div>
          <div class="w-full flex items-center justify-between gap-4 mt-4">
            <p class="">Mitglied löschen:</p>
            <button
              @click="() => { showDeleteButton = true; error.message = 'Das Mitglied wird aus allen Gruppen und dazu gehörige Listen entfernt!'; error.show = true; }"
              v-show="!showDeleteButton"
              class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 rounded-2xl drop-shadow-md w-fit px-3 md:px-6 py-3">
              <p class="font-medium font-base md:text-lg">Löschen</p>
            </button>
            <button @click="deleteMember(editMember.id)"
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
            <button @click="saveEditedMember"
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
import { getAllMembers, updateMember, deleteMember, getGroupName, createNewMember } from '@/util/fetchOperations'
import _ from "lodash"
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import ModalDialog from '@/components/ModalDialog.vue';
import DateInput from '@/components/DateInput.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import CollapsibleContainer from '@/components/CollapsibleContainer.vue';

export default {
  name: "EditMembersView",
  setup() {
    const dataStore = useDataStore()
    return {
      dataStore
    }
  },
  data() {
    return {
      allMembers: [],
      searchResults: [],
      indexSort: {
        lastname: 0,
        firstname: 0,
        birthday: 0
      },
      showSearchBar: false,
      showCreateMemberModal: false,
      showEditMemberModal: false,
      newMember: {
        firstname: '',
        lastname: '',
        birthday: ''
      },
      editMember: {
        firstname: '',
        lastname: '',
        birthday: '',
        id: '',
        groups: []
      },
      error: {
        message: '',
        show: false,
        cause: {
          firstnameInput: false,
          lastnameInput: false,
          birthdayInput: false
        }
      },
      showDeleteButton: false
    }
  },
  components: {
    SortIcon,
    TextInput,
    ModalDialog,
    DateInput,
    ErrorMessage,
    CollapsibleContainer
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

    onClickOnSortByBirthday() {
      this.indexSort.birthday = (this.indexSort.birthday + 1) % 2
      if (this.indexSort.birthday === 1) {
        this.searchResults.sort((a, b) => new Date(b.birthday) - new Date(a.birthday))
      } else {
        this.searchResults.sort((a, b) => new Date(a.birthday) - new Date(b.birthday))
      }
    },

    search(searchString) {
      if (this.showSearchBar) {
        // this.showSearchBar = false
        if (searchString !== '') {
          this.searchResults = this.allMembers.filter(member => {
            //Search for birthday
            //Regex if searchString contains only numbers, dots, slashes or dashes
            //Regex . / - and numbers
            if (/^[0-9./-]*$/.test(searchString)) {
              //Split searchString by . / -
              const dateString = searchString.split(/\.|\//).filter(s => s !== '')
              //If searchString contains 3 parts or less, search in dates
              if (dateString.length <= 3) {
                //If searchString contains 3 parts, search for day, month and year
                if (dateString.length === 3) {
                  return new Date(member.birthday).getDate() === parseInt(dateString[0]) && new Date(member.birthday).getMonth() + 1 === parseInt(dateString[1]) && new Date(member.birthday).getFullYear() === parseInt(dateString[2]) || new Date(member.birthday).getDate() === parseInt(dateString[0]) && new Date(member.birthday).getMonth() + 1 === parseInt(dateString[1]) && new Date(member.birthday).getFullYear().toString().slice(2, 4) === dateString[2]
                }
                //If dateString contains 2 parts, search for day and month
                if (dateString.length === 2) {
                  return new Date(member.birthday).getDate() === parseInt(dateString[0]) && new Date(member.birthday).getMonth() + 1 === parseInt(dateString[1]) || new Date(member.birthday).getMonth() + 1 === parseInt(dateString[0]) && new Date(member.birthday).getFullYear() === parseInt(dateString[1]) || new Date(member.birthday).getMonth() + 1 === parseInt(dateString[0]) && new Date(member.birthday).getFullYear().toString().slice(2, 4) === dateString[1]
                }
                //If dateString contains 1 part, search for day, month or year
                if (dateString.length === 1) {
                  return new Date(member.birthday).getDate() === parseInt(dateString[0]) || new Date(member.birthday).getMonth() + 1 === parseInt(dateString[0]) || new Date(member.birthday).getFullYear() === parseInt(dateString[0]) || new Date(member.birthday).getFullYear().toString().slice(2, 4) === dateString[0]
                }
              }
            }

            return member.firstname.toLowerCase().indexOf(searchString.toLowerCase()) > -1 || member.lastname.toLowerCase().indexOf(searchString.toLowerCase()) > -1
          })
        } else {
          this.searchResults = this.allMembers
        }
      }
    },

    cancel() {
      this.showCreateMemberModal = false
      this.showEditMemberModal = false
      this.showDeleteButton = false

      this.newMember = {
        firstname: '',
        lastname: '',
        birthday: ''
      }

      this.editMember = {
        firstname: '',
        lastname: '',
        birthday: '',
        id: '',
        groups: []
      }

      this.resetError()
    },

    async createNewMember() {
      this.validateInputs(this.newMember)

      if (!this.error.show) {
        const res = await createNewMember(this.newMember)
        if (res.status === 201) {
          this.getAllMembers()
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async saveEditedMember() {
      this.validateInputs(this.editMember)

      if (!this.error.show) {
        const res = await updateMember({
          ...this.editMember,
          groups: this.editMember.groups.map(g => g.id)
        })
        if (res.status === 200) {
          this.getAllMembers()
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async deleteMember(id) {
      const res = await deleteMember(id)
      if (res.status === 200) {
        this.getAllMembers()
        this.cancel()
      } else {
        this.error.message = res.body.message
        this.error.show = true
      }
    },

    async openEditMember(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      this.editMember = _.cloneDeep(this.allMembers.find(m => m.id === id))

      this.editMember.birthday = this.editMember.birthday.slice(0, 10)

      this.editMember.groups = await Promise.all(this.editMember.groups.map(async g => getGroupName(g)))

      this.showEditMemberModal = true
    },

    async getAllMembers() {
      this.allMembers = (await getAllMembers()).sort((a, b) => a.lastname.localeCompare(b.lastname))
    },

    resetError() {
      this.error.show = false
      this.error.cause = {
        firstnameInput: false,
        lastnameInput: false,
        birthdayInput: false
      }
      this.error.message = ''
    },

    validateInputs(inputs) {
      this.resetError()

      if (inputs.firstname.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Vornamen ein.'
        this.error.show = true
        this.error.cause.firstnameInput = true
      }
      if (inputs.lastname.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Nachnamen ein.'
        this.error.show = true
        this.error.cause.lastnameInput = true
      }
      if (this.editMember.birthday.trim().length === 0) {
        this.error.message = 'Bitte gebe einen Geburtstag ein.'
        this.error.show = true
        this.error.cause.birthdayInput = true
      }

      //If any error is true, set error.message to 'Mehrere Fehler.'
      if (Object.keys(this.error.cause).some(k => this.error.cause[k])) {
        this.error.message = 'Mehrere Fehler.'
      }

      if (typeof inputs.id !== 'undefined') {
        const oldEntry = this.allMembers.find(m => m.id === this.editMember.id)
        if (this.editMember.firstname === oldEntry.firstname && this.editMember.lastname === oldEntry.lastname
          && this.editMember.birthday === oldEntry.birthday.slice(0, 10)
          && _.isEqual(this.editMember.groups.map(g => g.id), oldEntry.groups)) {
          this.error.message = 'Es wurden keine Änderungen vorgenommen.'
          this.error.show = true
        }
      }
    },
  },

  async created() {
    document.title = 'Mitglieder bearbeiten - Attend'
    this.dataStore.viewname = "Mitglieder bearbeiten"

    this.getAllMembers()
  },

  watch: {
    allMembers() {
      this.searchResults = this.allMembers
    }
  }
}
</script>
