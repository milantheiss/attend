<template>
  <div>
    <div class="flex flex-col gap-8 mb-10">
      <!-- Group Info -->
      <div class="flex flex-col justify-center items-center gap-4 bg-white rounded-xl p-3.5 md:p-7">
        <!--Gruppenbezeichnung-->
        <div class="w-full flex items-center justify-between gap-4">
          <label for="name" class="font-medium">Name:</label>
          <TextInput name="name" v-model="group.name" placeholder="Gruppenbezeichnung" :showError="error.cause.nameInput"
            class="md:w-96"></TextInput>
        </div>

        <!--Abteilung-->
        <div class="w-full flex items-center justify-between gap-4">
          <!--Dropdown Selector aus allen Departments-->
          <p class="font-medium">Abteilung:</p>
          <SelectList v-model="group.department" :options="departments" :showError="error.cause.departmentInput"
            class="md:w-96 text-black" :sortAlphabetically="true"></SelectList>
        </div>

        <!--Zeiten der Gruppe -->
        <div class="w-full flex items-center justify-between gap-4">
          <CollapsibleContainer :show="true" class="w-full">
            <template #header>
              <p class="font-medium">Zeiten</p>
            </template>
            <template #content>
              <table class="table-auto md:table-fixed w-full mb-2">
                <thead class="border-b border-[#D1D5DB] text-left">
                  <tr>
                    <th class="pb-1.5 font-medium">Tag</th>
                    <th class="pb-1.5 font-medium  px-2.5">Start</th>
                    <th class="pb-1.5 font-medium">Ende</th>
                  </tr>
                </thead>
                <tbody>
                  <!--Zeiten-->
                  <tr class="border-b border-[#E5E7EB] last:border-0 group"
                    v-for="(time, index) in group.times.sort((a, b) => sorter[b] - sorter[a])" :key="index">
                    <td class="">
                      <!--Selector Day-->
                      <select v-model="time.day"
                        class="block md:hidden w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium ">
                        <option value="Montag">Mo.</option>
                        <option value="Dienstag">Di.</option>
                        <option value="Mittwoch">Mi.</option>
                        <option value="Donnerstag">Do.</option>
                        <option value="Freitag">Fr.</option>
                        <option value="Samstag">Sa.</option>
                        <option value="Sonntag">So.</option>
                      </select>
                      <select v-model="time.day"
                        class="hidden md:block w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium ">
                        <option value="Montag">Montag</option>
                        <option value="Dienstag">Dienstag</option>
                        <option value="Mittwoch">Mittwoch</option>
                        <option value="Donnerstag">Donnerstag</option>
                        <option value="Freitag">Freitag</option>
                        <option value="Samstag">Samstag</option>
                        <option value="Sonntag">Sonntag</option>
                      </select>
                    </td>
                    <td class="py-2 px-2.5">
                      <!--Time Selector-->
                      <input
                        class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                        :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                        v-model="time.starttime" min='00:00' :max='time.endtime' @change="validateTime(time)" />
                    </td>
                    <td class="">
                      <!--Time Selector-->
                      <input
                        class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                        :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                        v-model="time.endtime" :min='time.starttime' max='00:00' @change="validateTime(time)" />
                    </td>
                  </tr>

                  <!--Füge Zeit hinzu-->
                  <tr v-show="showNewTime">
                    <td class="pt-2 ">
                      <!--Selector Day-->
                      <select v-model="tempTime.day"
                        class="block md:hidden w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium ">
                        <option value="Montag">Mo.</option>
                        <option value="Dienstag">Di.</option>
                        <option value="Mittwoch">Mi.</option>
                        <option value="Donnerstag">Do.</option>
                        <option value="Freitag">Fr.</option>
                        <option value="Samstag">Sa.</option>
                        <option value="Sonntag">So.</option>
                      </select>
                      <select v-model="tempTime.day"
                        class="hidden md:block w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium ">
                        <option value="Montag">Montag</option>
                        <option value="Dienstag">Dienstag</option>
                        <option value="Mittwoch">Mittwoch</option>
                        <option value="Donnerstag">Donnerstag</option>
                        <option value="Freitag">Freitag</option>
                        <option value="Samstag">Samstag</option>
                        <option value="Sonntag">Sonntag</option>
                      </select>
                    </td>
                    <td class="pt-2 px-2.5">
                      <!--Time Selector-->
                      <input
                        class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                        :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                        v-model="tempTime.starttime" :max='tempTime.endtime' min='00:00' @change="tempTimeChange()" />
                    </td>
                    <td class="pt-2">
                      <!--Time Selector-->
                      <input
                        class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                        :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                        v-model="tempTime.endtime" max='00:00' :min='tempTime.starttime' @change="tempTimeChange()" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <div class="flex items-center justify-end w-full" v-show="!showNewTime">
                <button @click="showNewTime = true"
                  class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md px-3.5 py-1">
                  <p class="font-medium font-base md:text-lg">Zeit hinzufügen</p>
                </button>
              </div>
            </template>
          </CollapsibleContainer>
        </div>
        <!--Veranstaltungsort-->
        <div class="w-full flex items-center justify-between gap-4">
          <label for="venue" class="font-medium">Sportstätte:</label>
          <TextInput name="venue" v-model="group.venue" placeholder="Sportstätte" :showError="error.cause.venueInput"
            class="md:w-96"></TextInput>
        </div>
        <ErrorMessage></ErrorMessage>
        <button @click="saveChanges"
          class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-2.5">
          <p class="font-medium font-base md:text-lg">Speichern</p>
        </button>
      </div>

      <!-- TODO Teilnehmer/Trainer hinzufügen + Teilnehmer bearbeiten -->

      <!-- Liste Teilnehmer -->
      <div class="flex flex-col gap-4 items-center w-full">
        <div class="flex gap-4 items-center justify-between w-full px-3.5 md:px-7">
          <p class="font-medium text-xl md:text-2xl">Teilnehmer</p>
          <button @click="addMember()"
            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md px-3.5 md:px-7 py-2.5">
            <p class="font-medium font-base md:text-lg">Hinzufügen</p>
          </button>
        </div>
        <div class="h-fit max-h-[55vh] overflow-y-auto block w-full bg-white p-3.5 md:p-7 rounded-xl">
          <table class="table-auto w-full text-left">
            <thead class="sticky top-0 border-b border-[#D1D5DB]">
              <tr>
                <th scope="col" class="w-[142px] md:w-[152px] pb-2.5 font-medium"
                  @click="participantSortIndex.lastname = (participantSortIndex.lastname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="participantSortIndex.lastname"></SortIcon>
                    Name
                  </span>
                </th>
                <th scope="col" class="w-[142px] md:w-[152px] px-3 md:px-4 pb-2.5 font-medium"
                  @click="participantSortIndex.firstname = (participantSortIndex.firstname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="participantSortIndex.firstname"></SortIcon>
                    Vorname
                  </span>
                </th>
                <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                  @click="participantSortIndex.birthday = (participantSortIndex.birthday + 1) % 2">
                  <span class="hidden md:flex items-center gap-1 ">
                    <SortIcon :index="participantSortIndex.birthday"></SortIcon>
                    Geburtstag
                  </span>
                  <span class="flex md:hidden items-center gap-1 ">
                    <SortIcon :index="participantSortIndex.birthday"></SortIcon>
                    Geb.
                  </span>
                </th>
                <th scope="col" class="pb-2.5 font-medium w-full"></th>
              </tr>
            </thead>
            <tbody class="overscroll-y-scroll">
              <tr v-for="participant in group.participants" :key="participant._id"
                @click="openEditMember(participant._id)"
                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                <!--Lastname-->
                <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 w-fit text-base sm:text-lg md:text-xl">
                  <p class="">{{ participant.lastname }}</p>
                </td>
                <!--Firstname-->
                <td class="px-3 md:px-4 w-fit py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="">{{ participant.firstname }}</p>
                </td>
                <!--Birthday-->
                <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="text-light-gray">{{
                    new Date(participant.birthday).toLocaleDateString('de-DE', {
                      year: '2-digit', month:
                        '2-digit', day: '2-digit'
                    })
                  }}</p>
                </td>
                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end">
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
          <p v-show="typeof this.group.participants === 'undefined' || this.group.participants?.length === 0"
            class="font-medium text-gray-500 text-center pt-2.5">Keine Gruppen gefunden</p>
        </div>
      </div>

      <!-- Liste Trainer -->
      <div class="flex flex-col gap-4 items-center w-full">
        <div class="flex gap-4 items-center justify-between w-full px-3.5 md:px-7">
          <p class="font-medium text-xl md:text-2xl">Trainer</p>
          <button @click="addTrainer()"
            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md px-3.5 md:px-7 py-2.5">
            <p class="font-medium font-base md:text-lg">Hinzufügen</p>
          </button>
        </div>
        <div class="h-fit max-h-[55vh] overflow-y-auto block w-full bg-white p-3.5 md:p-7 rounded-xl">
          <table class="table-auto w-full text-left">
            <thead class="sticky top-0 border-b border-[#D1D5DB]">
              <tr>
                <th scope="col" class="w-[142px] md:w-[152px] pb-2.5 font-medium"
                  @click="trainersSortIndex.lastname = (trainersSortIndex.lastname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.lastname"></SortIcon>
                    Name
                  </span>
                </th>
                <th scope="col" class="w-[142px] md:w-[152px] px-3 md:px-4 pb-2.5 font-medium"
                  @click="trainersSortIndex.firstname = (trainersSortIndex.firstname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.firstname"></SortIcon>
                    Vorname
                  </span>
                </th>
                <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                  @click="trainersSortIndex.role = (trainersSortIndex.role + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.role"></SortIcon>
                    Rolle
                  </span>
                </th>
                <th scope="col" class="pb-2.5 font-medium w-full"></th>
              </tr>
            </thead>
            <tbody class="overscroll-y-scroll">
              <tr v-for="trainer in group.trainers" :key="trainer._id" @click="openEditMember(trainer._id)"
                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                <!--Lastname-->
                <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 w-fit text-base sm:text-lg md:text-xl">
                  <p class="">{{ trainer.lastname }}</p>
                </td>
                <!--Firstname-->
                <td class="px-3 md:px-4 w-fit py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="">{{ trainer.firstname }}</p>
                </td>
                <!--Rolle-->
                <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="text-light-gray">{{ trainer.role === "trainer" ? "Trainer" : "Assistent" }}</p>
                </td>
                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end">
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
          <p v-show="typeof this.group.trainers === 'undefined' || this.group.trainers?.length === 0"
            class="font-medium text-gray-500 text-center pt-2.5">Keine Gruppen gefunden</p>
        </div>
      </div>
    </div>
    <!-- Edit Participant -->
    <ModalDialog :show="showEditParticipantModal" :hasSubheader="false" @onClose="cancel">
      <!-- TODO Edit Participant Weiter -->
      <template #header>
        <p class="text-xl md:text-2xl">Bearbeiten</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">

          <!--Vorname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname" class="">Vorname:</label>
            <TextInput name="firstname" v-model="editParticipant.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname" class="">Nachname:</label>
            <TextInput name="lastname" v-model="editParticipant.lastname" placeholder="Nachname"
              :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Geburtstag des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="birthday" class=""><span class="hidden sm:block">Geburtstag:</span><span
                class="block sm:hidden">Geb.:</span></label>
            <DateInput v-model="editParticipant.birthday" name="birthday" :max="new Date().toJSON().slice(0, 10)"
              class="font-medium md:w-96" :showError="error.cause.birthdayInput">
            </DateInput>
          </div>

          <!--Erstes Training des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="birthday" class=""><span class="hidden sm:block">Erstes Training:</span><span
                class="block sm:hidden">Erstes Train.:</span></label>
            <DateInput v-model="editParticipant.birthday" name="birthday" :max="new Date().toJSON().slice(0, 10)"
              class="font-medium md:w-96" :showError="error.cause.firsttrainingInput">
            </DateInput>
          </div>

          <div class="w-full flex items-center justify-between gap-4 mt-4">
            <p class="">Teilnehmer entfernen:</p>
            <button @click="showDeleteButton = true" v-show="!showDeleteButton"
              class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 rounded-2xl drop-shadow-md w-fit px-3 md:px-6 py-3">
              <p class="font-medium font-base md:text-lg">Entfernen</p>
            </button>
            <button @click="removeParticipant(editParticipant._id)"
              class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-fit px-3 md:px-6 py-3"
              v-show="showDeleteButton">
              <p class="font-medium font-base md:text-lg">Wirklich entfernen?</p>
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
            <button @click="saveEditedParticipant"
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
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import ModalDialog from '@/components/ModalDialog.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import SelectList from "@/components/SelectList.vue";
import { fetchGroup, getAllDepartments } from "@/util/fetchOperations";

export default {
  name: "EditGroupView",
  setup() {
    const dataStore = useDataStore()
    return {
      dataStore
    }
  },
  data() {
    return {
      group: {
        name: "",
        department: {
        },
        times: [
        ],
        venue: "",
        participants: [
        ],
        trainers: [
        ]
      },
      tempTime: {
        day: "",
        starttime: "",
        endtime: ""
      },
      error: {
        message: '',
        show: false,
        cause: {
          venueInput: false,
          nameInput: false,
          departmentInput: false,
          timesInput: false,
          firstnameInput: false,
          lastnameInput: false,
          birthdayInput: false,
          firsttrainingInput: false
        }
      },
      participantSortIndex: {
        lastname: 0,
        firstname: 0,
        birthday: 0
      },
      trainersSortIndex: {
        lastname: 0,
        firstname: 0,
        role: 0
      },
      departments: [],
      showNewTime: false,
      sorter: {
        "Montag": 1,
        "Dienstag": 2,
        "Mittwoch": 3,
        "Donnerstag": 4,
        "Freitag": 5,
        "Samstag": 6,
        "Sonntag": 7
      },
      showAddParticipantModal: false,
      showEditParticipantModal: false,
      showDeleteButton: false,

      newParticipant: {
        firstname: '',
        lastname: '',
        birthday: ''
      },

      editParticipant: {
        firstname: '',
        lastname: '',
        birthday: '',
        id: '',
        groups: []
      }
    }
  },
  components: {
    SortIcon,
    TextInput,
    ErrorMessage,
    CollapsibleContainer,
    SelectList,
    ModalDialog
  },
  methods: {
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
    async onClickOnSave() {

    },

    tempTimeChange() {
      if (this.tempTime.day !== '' && this.tempTime.starttime !== '' && this.tempTime.endtime !== '') {
        if (parseInt(this.tempTime.starttime.replace(":", "")) > parseInt(this.tempTime.endtime.replace(":", ""))) {
          const temp = this.tempTime.starttime
          this.tempTime.starttime = this.tempTime.endtime
          this.tempTime.endtime = temp
        }
        this.group.times.push(this.tempTime)
        this.tempTime = {
          day: '',
          starttime: '',
          endtime: ''
        }
        this.showNewTime = false
      }
    },

    cancel() {
      this.showAddParticipantModal = false
      this.showEditParticipantModal = false
      this.showDeleteButton = false

      this.newParticipant = {
        firstname: '',
        lastname: '',
        birthday: ''
      }

      this.editParticipant = {
        firstname: '',
        lastname: '',
        birthday: '',
        id: '',
        groups: []
      }

      this.resetError()
    },
  },

  async created() {
    document.title = 'Gruppe bearbeiten - Attend'
    this.dataStore.viewname = "Gruppe bearbeiten"
  },

  async mounted() {
    const id = this.$route.query.id

    console.log(id);

    if (!id || typeof id !== "string") {
      console.error("No ID provided");
      this.$router.back()
    }

    this.group = await fetchGroup(id)

    this.departments = await getAllDepartments()
  },

  watch: {
    "participantSortIndex.lastname"() {
      this.group.participants.sort((a, b) => {
        if (this.participantSortIndex.lastname === 0) {
          return a.lastname.localeCompare(b.lastname)
        } else {
          return b.lastname.localeCompare(a.lastname)
        }
      })
    },
    "participantSortIndex.firstname"() {
      this.group.participants.sort((a, b) => {
        if (this.participantSortIndex.firstname === 0) {
          return a.firstname.localeCompare(b.firstname)
        } else {
          return b.firstname.localeCompare(a.firstname)
        }
      })
    },
    "participantSortIndex.birthday"() {
      this.group.participants.sort((a, b) => {
        if (this.participantSortIndex.birthday === 0) {
          return new Date(a.birthday) - new Date(b.birthday)
        } else {
          return new Date(b.birthday) - new Date(a.birthday)
        }
      })
    },
    "trainersSortIndex.lastname"() {
      this.group.trainers.sort((a, b) => {
        if (this.trainersSortIndex.lastname === 0) {
          return a.lastname.localeCompare(b.lastname)
        } else {
          return b.lastname.localeCompare(a.lastname)
        }
      })
    },
    "trainersSortIndex.firstname"() {
      this.group.trainers.sort((a, b) => {
        if (this.trainersSortIndex.firstname === 0) {
          return a.firstname.localeCompare(b.firstname)
        } else {
          return b.firstname.localeCompare(a.firstname)
        }
      })
    },
    "trainersSortIndex.role"() {
      this.group.trainers.sort((a, b) => {
        if (this.trainersSortIndex.role === 0) {
          return a.role.localeCompare(b.role)
        } else {
          return b.role.localeCompare(a.role)
        }
      })
    }
  }
}
</script>
