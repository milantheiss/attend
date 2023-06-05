<template>
  <div>
    <div class="container mx-auto flex flex-col gap-8 mb-20">

      <!-- Group Info -->

      <div class="flex flex-col justify-center items-center gap-4 bg-white rounded-xl p-3.5 md:px-7">

        <!-- Gruppenbezeichnung -->

        <div class="w-full flex items-center justify-between gap-4">
          <label for="name" class="font-medium">Name:</label>
          <TextInput name="name" v-model="group.name" placeholder="Gruppenbezeichnung" :showError="error.cause.nameInput"
            class="md:w-96"></TextInput>
        </div>

        <!-- Abteilung -->

        <div class="w-full flex items-center justify-between gap-4">
          <!--Dropdown Selector aus allen Departments-->
          <p class="font-medium">Abteilung:</p>
          <SelectList v-model="group.department" :options="departments" :showError="error.cause.departmentInput"
            class="md:w-96 text-black" :sortAlphabetically="true"></SelectList>
        </div>

        <!-- Trainingszeiten der Gruppe -->

        <div class="w-full flex items-center justify-between gap-4"
          :class="{ 'outline outline-2 outline-offset-4 rounded-lg outline-special-red': error.cause.timesInput }">
          <CollapsibleContainer :show="true" class="w-full">

            <template #header>
              <p class="font-medium">Zeiten</p>
            </template>

            <template #content>
              <table class="table-auto w-full mb-2">

                <thead class="border-b border-[#D1D5DB] text-left">
                  <tr>
                    <th class="pb-1.5 font-medium">Tag</th>
                    <!-- Wenn Screen zu klein wird, werden die Start- und Endzeit als Stapel angezeigt. -->
                    <th class="pb-1.5 font-medium px-2.5"><span class="hidden ty:block">Start</span> <span
                        class="block ty:hidden">Zeiten</span></th>
                    <th class="pb-1.5 font-medium hidden ty:block">Ende</th>
                    <!-- Spalte für X Icon -->
                    <th></th>
                  </tr>
                </thead>

                <tbody>

                  <!--Zeiten-->

                  <tr class="border-b border-[#E5E7EB] last:border-0 group"
                    v-for="(time, index) in group.times.sort((a, b) => sorter[b] - sorter[a])" :key="index">

                    <!--Selector Day-->

                    <td>
                      <DaySelect v-model="time.day"></DaySelect>
                    </td>

                    <!-- Start- und Endzeit -->

                    <!-- Wenn Screen zu klein wird, werden die Start- und Endzeit als Stapel angezeigt. -->
                    <td class="py-2 px-2.5 flex flex-col gap-2 sm:table-cell">
                      <input :class="timeInputStyle" type='time' v-model="time.starttime" min='00:00' :max='time.endtime'
                        @change="validateTime(time)" />
                      <input class='block ty:hidden' :class="timeInputStyle" type='time' v-model="time.endtime"
                        :min='time.starttime' max='00:00' @change="validateTime(time)" />
                    </td>
                    <td class="hidden ty:table-cell">
                      <!--Time Selector-->
                      <input :class="timeInputStyle" type='time' v-model="time.endtime" :min='time.starttime' max='00:00'
                        @change="validateTime(time)" />
                    </td>

                    <!-- X Icon -->
                    <td @click="group.times.splice(index, 1)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-7 h-7 ml-auto">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                  </tr>

                  <!--Füge Zeit hinzu-->

                  <tr v-show="showNewTime">

                    <!--Selector Day-->

                    <td class="pt-2 ">
                      <DaySelect v-model="tempTime.day"></DaySelect>
                    </td>

                    <!-- Wenn Screen zu klein wird, werden die Start- und Endzeit als Stapel angezeigt. -->
                    <td class="pt-2 px-2.5">
                      <!--Time Selector-->
                      <input :class="timeInputStyle" type='time' v-model="tempTime.starttime" min='00:00'
                        :max='tempTime.endtime' @change="tempTimeChange()" />
                      <input class='block ty:hidden' :class="timeInputStyle" type='time' v-model="tempTime.endtime"
                        :min='tempTime.starttime' max='00:00' @change="tempTimeChange()" />
                    </td>

                    <td class="pt-2 hidden ty:table-cell">
                      <!--Time Selector-->
                      <input :class="timeInputStyle" type='time' v-model="tempTime.endtime" max='00:00'
                        :min='tempTime.starttime' @change="tempTimeChange()" />
                    </td>

                    <!-- X Icon Löscht Zeit -->
                    <td @click="() => { tempTime = { day: '', starttime: '', endtime: '' }; showNewTime = false }">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-7 h-7 ml-auto">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
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

        <div class="w-full">
          <ErrorMessage
            :show="error.cause.nameInput || error.cause.departmentInput || error.cause.timesInput || error.cause.venueInput"
            :message="error.message"></ErrorMessage>
        </div>

        <StandardButton @click="saveChanges" class="w-full">
          <p class="font-base md:text-lg">Speichern</p>
        </StandardButton>
      </div>

      <!-- Liste Teilnehmer -->

      <div class="flex flex-col gap-4 items-center w-full">

        <!-- Header -->

        <div class="flex gap-4 items-center justify-between w-full px-3.5 md:px-7">
          <p class="font-medium text-xl md:text-2xl">Teilnehmer</p>
          <StandardButton @click="$refs.addParticipantModal.open()">
            <p class="font-medium font-base md:text-lg">Hinzufügen</p>
          </StandardButton>
        </div>

        <div class="h-fit max-h-[55vh] overflow-y-auto block w-full bg-white p-3.5 md:p-7 rounded-xl">
          <table class="table-auto w-full text-left">

            <thead class="sticky top-0 border-b border-[#D1D5DB]">
              <tr>

                <th scope="col" class="pb-2.5 font-medium"
                  @click="participantSortIndex.lastname = (participantSortIndex.lastname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="participantSortIndex.lastname"></SortIcon>
                    Name
                  </span>
                </th>

                <th scope="col" class="px-3 md:px-4 pb-2.5 font-medium"
                  @click="participantSortIndex.firstname = (participantSortIndex.firstname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="participantSortIndex.firstname"></SortIcon>
                    Vorname
                  </span>
                </th>

                <!-- Geburtstag -->

                <!-- Wird ausgeblendet, wenn Screen zuklein -->
                <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                  @click="participantSortIndex.birthday = (participantSortIndex.birthday + 1) % 2">
                  <!-- Wird abgekürzt, wenn Screen kleiner als md -->
                  <span class="hidden md:flex items-center gap-1 ">
                    <SortIcon :index="participantSortIndex.birthday"></SortIcon>
                    Geburtstag
                  </span>
                  <span class="flex md:hidden items-center gap-1 ">
                    <SortIcon :index="participantSortIndex.birthday"></SortIcon>
                    Geb.
                  </span>
                </th>

                <!-- Spalte für Pfeil -->
                <th scope="col" class="pb-2.5 font-medium w-full"></th>

              </tr>
            </thead>

            <tbody class="overscroll-y-scroll">
              <!-- Je eine Reihe pro Teilnehmer -->
              <tr v-for="participant in group.participants" :key="participant._id"
                @click="openEditParticipant(participant._id)"
                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">

                <!-- Nachname -->

                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0">
                  <p>{{ participant.lastname }}</p>
                </td>

                <!-- Vorname -->

                <td class="px-3 md:px-4 py-2.5 group-last:pt-2.5 group-last:pb-0">
                  <p>{{ participant.firstname }}</p>
                </td>

                <!-- Geburtstag -->

                <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0">
                  <p class="text-light-gray">{{
                    new Date(participant.birthday).toLocaleDateString('de-DE', {
                      year: '2-digit', month:
                        '2-digit', day: '2-digit'
                    })
                  }}</p>
                </td>

                <!-- Pfeil nach rechts -->

                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                    stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Wird angezeigt, wenn keine Teilnehmer der Gruppe zugeteilt sind -->
          <p v-show="typeof this.group.participants === 'undefined' || this.group.participants?.length === 0"
            class="font-medium text-gray-500 text-center pt-2.5">Keine Teilnehmer gefunden</p>
        </div>
      </div>

      <!-- Liste Trainer -->

      <div class="flex flex-col gap-4 items-center w-full">

        <!-- Heder -->

        <div class="flex gap-4 items-center justify-between w-full px-3.5 md:px-7">
          <p class="font-medium text-xl md:text-2xl">Trainer</p>
          <StandardButton @click="$refs.addTrainerModal.open()">
            <p class="font-base md:text-lg">Hinzufügen</p>
          </StandardButton>
        </div>

        <div class="h-fit max-h-[55vh] overflow-y-auto block w-full bg-white p-3.5 md:p-7 rounded-xl">
          <table class="table-auto w-full text-left">

            <thead class="sticky top-0 border-b border-[#D1D5DB]">
              <tr>

                <th scope="col" class="pb-2.5 font-medium"
                  @click="trainersSortIndex.lastname = (trainersSortIndex.lastname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.lastname"></SortIcon>
                    Name
                  </span>
                </th>

                <th scope="col" class="px-3 md:px-4 pb-2.5 font-medium"
                  @click="trainersSortIndex.firstname = (trainersSortIndex.firstname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.firstname"></SortIcon>
                    Vorname
                  </span>
                </th>

                <!-- Wird ausgeblendet, wenn Screen zu klein ist -->
                <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                  @click="trainersSortIndex.role = (trainersSortIndex.role + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.role"></SortIcon>
                    Rolle
                  </span>
                </th>

                <!-- Spalte für Pfeil Icon -->
                <th scope="col" class="pb-2.5 font-medium w-full"></th>
              </tr>
            </thead>

            <tbody class="overscroll-y-scroll">
              <!-- Eine Reihe pro Trainer -->
              <tr v-for="trainer in group.trainers" :key="trainer._id" @click="openEditTrainer(trainer._id)"
                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">

                <!-- Nachname -->

                <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0">
                  <p>{{ trainer.lastname }}</p>
                </td>

                <!-- Vorname -->

                <td class="px-3 md:px-4 py-2.5 group-last:pt-2.5 group-last:pb-0">
                  <p>{{ trainer.firstname }}</p>
                </td>

                <!-- Rolle -->

                <!-- Wird ausgeblendet, wenn Screen zu klein wird -->
                <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0">
                  <p class="text-light-gray">{{ trainer.role === "trainer" ? "Trainer" : "Assistent" }}</p>
                </td>

                <!-- Pfeil nach Rechts -->

                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                    stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Wird angezeigt, wenn kein Trainer der Gruppe zugeteilt ist -->
          <p v-show="typeof this.group.trainers === 'undefined' || this.group.trainers?.length === 0"
            class="font-medium text-gray-500 text-center pt-2.5">Keine Trainer gefunden</p>
        </div>
      </div>
    </div>

    <!-- Edit Trainer -->
    <ModalDialog :show="showEditTrainerModal" :hasSubheader="false" @onClose="cancel">
      <!-- TODO Edit Participant Weiter -->
      <template #header>
        <p class="text-xl md:text-2xl text-[#111827]">Bearbeiten</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4 text-[#111827]">

          <!--Vorname des Trainer-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname">Vorname:</label>
            <TextInput name="firstname" v-model="editTrainer.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Trainer-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname">Nachname:</label>
            <TextInput name="lastname" v-model="editTrainer.lastname" placeholder="Nachname"
              :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Rolle des Trainer-->
          <div class="w-full flex items-center justify-between gap-4">
            <p>Rolle:</p>
            <select v-model="editTrainer.role"
              class="w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-0 border-b-2 border-[#9ea3ae] text-base md:text-lg font-medium"
              :class="{ 'outline outline-2 outline-offset-4 rounded-lg outline-special-red': error.cause.roleInput }">
              <option value="trainer">Trainer</option>
              <option value="assistant">Assistent</option>
            </select>
          </div>

          <div class="w-full flex items-center justify-between gap-4 mt-4">
            <p>Trainer entfernen:</p>
            <button @click="showDeleteButton = true" v-show="!showDeleteButton"
              class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 rounded-2xl drop-shadow-md w-fit px-2 ty:px-3 md:px-6 py-3">
              <p class="font-medium font-base md:text-lg">Entfernen</p>
            </button>
            <button @click="removeTrainer(editTrainer._id)"
              class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-fit px-2 md:px-4 py-2"
              v-show="showDeleteButton">
              <p class="font-medium font-base md:text-lg">Wirklich entfernen?</p>
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show"></ErrorMessage>
          <div class="flex justify-between items-center gap-2 ty:gap-6 ">
            <button @click="cancel"
              class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-2 ty:px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Abbrechen</p>
            </button>
            <button @click="saveEditTrainer"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-2 ty:px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Speichern</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>

    <!-- Edit Teilnehmer -->

    <ParticipantModal ref="editParticipantModal" type="edit" access="staff" :groupID="group._id" @onClose="cancel">
    </ParticipantModal>

    <!-- Add Teilnehmer -->

    <ParticipantModal ref="addParticipantModal" type="new" access="staff" :groupID="group._id"
      :groupParticipants="group.participants" @on-close="cancel"></ParticipantModal>

    <!-- Add Trainer -->

    <NewTrainerModal ref="addTrainerModal" :groupID="group._id" :groupTrainers="group.trainers" @onClose="cancel">
    </NewTrainerModal>
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
import { fetchGroup, getAllDepartments, updateGroup, removeTrainerFromGroup, updateTrainerInGroup } from "@/util/fetchOperations";
import _ from "lodash";
import DaySelect from "@/components/DaySelect.vue";
import StandardButton from "@/components/StandardButton.vue";
import ParticipantModal from "@/components/ParticipantModal.vue";
import NewTrainerModal from "@/components/NewTrainerModal.vue";

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
          roleInput: false
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
      showEditParticipantModal: false,
      showEditTrainerModal: false,
      showAddTrainerModal: false,
      showDeleteButton: false,

      editParticipant: {
        firstname: '',
        lastname: '',
        birthday: '',
        firsttraining: '',
        memberId: '',
        id: ''
      },

      editTrainer: {
        firstname: '',
        lastname: '',
        role: '',
        userId: ''
      },

      searchString: '',
      selectedMembers: [],
      selectedUsers: [],
      allMembers: [],
      allUsers: []
    }
  },
  components: {
    SortIcon,
    TextInput,
    ErrorMessage,
    CollapsibleContainer,
    SelectList,
    ModalDialog,
    DaySelect,
    StandardButton,
    ParticipantModal,
    NewTrainerModal
  },
  methods: {
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

    async cancel() {
      this.showAddTrainerModal = false
      this.showEditParticipantModal = false
      this.showEditTrainerModal = false
      this.showDeleteButton = false

      this.editParticipant = {
        firstname: '',
        lastname: '',
        birthday: '',
        firsttraining: '',
        memberId: '',
        id: ''
      }

      this.editTrainer = {
        firstname: '',
        lastname: '',
        role: '',
        userId: ''
      }

      this.selectedMembers = []
      this.selectedUsers = []
      this.allMembers = []
      this.allUsers = []

      this.searchString = ''

      this.group = await fetchGroup(this.group._id)

      this.resetError()
    },


    async openEditTrainer(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      this.editTrainer = _.cloneDeep(this.group.trainers.find(t => t.userId === id))

      this.showEditTrainerModal = true
    },

    async saveEditTrainer() {
      this.validateTrainerInputs(this.editTrainer)

      if (!this.error.show) {
        const res = await updateTrainerInGroup(this.group._id, this.editTrainer.userId, this.editTrainer)
        if (res.ok) {
          this.group = await fetchGroup(this.group._id)
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async removeTrainer(id) {
      const res = await removeTrainerFromGroup(this.group._id, id)
      if (res.ok) {
        this.group = await fetchGroup(this.group._id)
        this.cancel()
      } else {
        this.error.message = res.body.message
        this.error.show = true
      }
    },

    async saveChanges() {
      this.validateInputs()

      if (!this.error.show) {
        this.group.department = this.group.department._id

        const res = await updateGroup(this.group._id, this.group)
        if (res.ok) {
          this.group = await fetchGroup(this.group._id)
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    resetError() {
      this.error.show = false
      this.error.cause = {
        venueInput: false,
        nameInput: false,
        departmentInput: false,
        timesInput: false,
        firstnameInput: false,
        roleInput: false
      }
      this.error.message = ''
    },

    validateInputs() {
      this.resetError()

      if (this.group.name.trim().length === 0 || !this.group.name.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen gültigen Namen ein.'
        this.error.show = true
        this.error.cause.nameInput = true
      }
      if (this.group.department._id.trim().length === 0 || !this.group.department._id.match(/^[0-9a-fA-F]{24}$/)) {
        this.error.message = 'Bitte wähle eine Abteilung aus.'
        this.error.show = true
        this.error.cause.departmentInput = true
      }

      if (this.group.venue.trim().length === 0 || !this.group.venue.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe eine gültige Sportstätte ein.'
        this.error.show = true
        this.error.cause.venueInput = true
      }

      if (this.group.times.length === 0) {
        this.error.message = 'Bitte gebe mindestens eine Zeit an.'
        this.error.show = true
        this.error.cause.timesInput = true
      }

      if (!this.group.times.every(t => ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].includes(t.day) && t.starttime.match(/^[0-9]{2}:[0-9]{2}$/) && t.endtime.match(/^[0-9]{2}:[0-9]{2}$/))) {
        this.error.message = 'Bitte kontrolliere die Zeiten.'
        this.error.show = true
        this.error.cause.timesInput = true
      }

      //If any error is true, set error.message to 'Mehrere Fehler.'
      if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
        this.error.message = 'Mehrere Fehler.'
      }
    },

    validateTime(time) {
      if (time.starttime !== "" && time.endtime !== "") {
        if (parseInt(time.starttime.replace(":", "")) > parseInt(time.endtime.replace(":", ""))) {
          const temp = time.starttime
          time.starttime = time.endtime
          time.endtime = temp
        }
      }
    },

    onClickOnNewTrainer(id) {
      if (!this.group.trainers.some(t => t.userId === id)) {
        if (this.selectedUsers.some(t => t._id === id)) {
          this.selectedUsers = this.selectedUsers.filter(t => t._id !== id)
        } else {
          this.allUsers.find(u => u._id === id).role = "role"
          this.selectedUsers.push(this.allUsers.find(u => u._id === id))
        }
      }
    }
  },

  async created() {
    document.title = 'Gruppe bearbeiten - Attend'
    this.dataStore.viewname = "Gruppe bearbeiten"
  },

  async mounted() {
    const id = this.$route.query.id

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
    },

  },
  computed: {
    timeInputStyle() {
      const standard = "font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3"

      return this.error.cause.timesInput ? standard + ' border-2 rounded-lg border-special-red' : standard
    }
  }
}
</script>
<style scoped>
input[type="time"] {
  line-height: 2rem;
  padding-bottom: 2px;
  padding-top: 5px;
}

input[type="time"]::-webkit-calendar-picker-indicator {
  display: block;
  opacity: 0;
}

input::-webkit-inner-spin-button,
input::-webkit-clear-button {
  display: block;
  opacity: 0;
}

input[type="time"] {
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%20class%3D%22w-6%20h-6%22%3E%0A%20%20%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M12%206v6h4.5m4.5%200a9%209%200%2011-18%200%209%209%200%200118%200z%22%20%2F%3E%0A%3C%2Fsvg%3E%0A");
  background-repeat: no-repeat;
  background-size: 1.5rem 1.5rem;
  background-position: right 0.25rem center;

  cursor: pointer;
}

input::-webkit-date-and-time-value {
  text-align: left;
}
</style>
