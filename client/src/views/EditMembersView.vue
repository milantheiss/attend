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
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
              stroke="currentColor" class="w-6 h-6">
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
            <TextInput name="firstname" placeholder="Suche..." :showError="searchError" @onChange="(str) => search(str)"
              ref="searchBar">
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
              <th scope="col" class="hidden ty:table-cell pb-2.5 font-medium" @click="onClickOnSortByBirthday">
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
              <td class="hidden ty:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0">
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
    <ModalDialog :show="showCreateMemberModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Neuen Teilnehmer</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">

          <!--Vorname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname" class="hidden sm:block">Vorname:</label>
            <TextInput name="firstname" v-model="newMember.firstname" placeholder="Vorname" :showError="error.cause.firstnameInput"
              class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname" class="hidden sm:block">Nachname:</label>
            <TextInput name="lastname" v-model="newMember.lastname" placeholder="Nachname" :showError="error.cause.lastnameInput"
              class="md:w-96"></TextInput>
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
                    <button @click="createNewMEmber"
                        class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
                        <p class="font-medium font-base md:text-lg">Erstellen</p>
                    </button>
                </div>
            </div>
      </template>
    </ModalDialog>
  </div>
</template>
  
<script>
import { fetchGroups, updateMemberInGroup, removeMemberFromGroup, fetchGroup } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import ModalDialog from '@/components/ModalDialog.vue';
import DateInput from '@/components/DateInput.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';

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
      allMembers: [
        {
          _id: "62a20277c0176cd5bb8cfe84",
          firstname: "Paula",
          lastname: "Reichert",
          birthday: "2012-09-21T00:00:00.000Z",
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        },
        {
          _id: "62c5c117b71ac26b2896f683"
          ,
          firstname: "Anna",
          lastname: "Achilles",
          birthday: "2013-04-09T00:00:00.000Z",
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        },
        {
          _id: "62c5d144b07b3633590e92ce"
          ,
          firstname: "Marlene",
          lastname: "Rübsamen",
          birthday: "2013-03-02T00:00:00.000Z"
          ,
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        },
        {
          _id: "62c5d144b07b3633590e92ca"
          ,
          firstname: "Johanna",
          lastname: "Habenicht",
          birthday: "2012-12-15T00:00:00.000Z"
          ,
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        },
        {
          _id: "62c5d144b07b3633590e92d0"
          ,
          firstname: "Pauline",
          lastname: "Steiger",
          birthday: "2012-06-09T00:00:00.000Z"
          ,
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        },
        {
          _id: "6335c735da8f102d11c7bbe1"
          ,
          firstname: "Paula",
          lastname: "Schmitt",
          birthday: "2012-03-29T00:00:00.000Z"
          ,
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        },
        {
          _id: "636416053bab0b03effe2427"
          ,
          firstname: "Jannis",
          lastname: "Löffler",
          birthday: "2013-12-11T00:00:00.000Z"
          ,
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        },
        {
          _id: "636416383bab0b03effe24c1"
          ,
          firstname: "Mina",
          lastname: "Schäfer",
          birthday: "2013-04-28T00:00:00.000Z"
          ,
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        },
        {
          _id: "6384dd9859313c453afc648b"
          ,
          firstname: "Maha",
          lastname: "Dahbi",
          birthday: "2013-09-03T00:00:00.000Z"
          ,
          departments: [
            "62a61af829e45c479f708601"
          ],
          groups: [
            "62a2022bc0176cd5bb8cfe80"
          ]
        }
      ],
      searchResults: [],
      indexSort: {
        lastname: 0,
        firstname: 0,
        birthday: 0
      },
      showSearchBar: false,
      showCreateMemberModal: false,
      newMember: {
        firstname: '',
        lastname: '',
        birthday: ''
      },
      error: {
        message: '',
        show: false,
        cause: {
          firstnameInput: false,
          lastnameInput: false,
          birthdayInput: false
        }
      }
    }
  },
  components: {
    SortIcon,
    TextInput,
    ModalDialog,
    DateInput,
    ErrorMessage
  },
  methods: {
    //^ Start alter Funktionen
    /**
     * Isoliert Participant Array aus selectedGroup.
     * Wird zur Fehlerprävention eingesetzt.
     */
    getParticipants() {
      if (typeof this.groupData !== 'undefined') {
        return this.groupData.participants
      } else {
        return undefined
      }
    },
    /**
     * Handelt onClickOnSave Emit aus @see GroupListGomponent und @see MemberEditor 
     * Callt Fetch Methode und updatet ParticipantData im Backend
     * @param {Object} participantData 
     */
    async onClickOnSave(participantData) {
      //Update DB
      await updateMemberInGroup(this.selectedGroup.id, participantData)

      //Updated groupData locally damit Change instant ist
      this.groupData.participants = this.groupData.participants.map(p => {
        if (p.memberId === participantData.memberId) {
          return participantData
        } else {
          return p
        }
      })

      if (!this.groupData.participants.some(p => p.memberId === participantData.memberId)) {
        this.groupData.participants.push(participantData)
      }
    },
    /**
     * Handelt onClickOnDelete Emit aus @see GroupListGomponent und @see MemberEditor 
     * Callt Fetch Methode und löscht Participant aus Backend.
     * @param {Object} participantData 
     */
    async onClickOnDelete(participantData) {
      //Update DB
      await removeMemberFromGroup(this.selectedGroup.id, participantData.memberId)

      //Updated groupData locally damit Change instant ist
      this.groupData.participants = this.groupData.participants.filter(p => p.memberId !== participantData.memberId)
    },

    //^ Ende alter Funktionen


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

    cancel(){
      this.showCreateMemberModal = false
      this.newMember = {
        firstname: '',
        lastname: '',
        birthday: ''
      }
    }
  },

  async created() {
    this.groups = await fetchGroups()
    document.title = 'Mitglieder bearbeiten - Attend'
    this.dataStore.viewname = "Mitglieder bearbeiten"

    this.searchResults = this.allMembers
  },

  watch: {
    /**
     * Watcher für selectedGroup.
     * Wenn selectedGroup geändert wird, wird der Titel der Seite angepasst.
     */
    selectedGroup: async function (newVal) {
      if (typeof newVal !== 'undefined') {
        document.title = newVal.name + ' bearbeiten - Attend'
        this.groupData = await fetchGroup(newVal.id)
      }
    }
  }
}
</script>
