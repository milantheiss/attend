<template>
  <div>
    <div class="container mx-auto flex flex-col gap-8 mb-20 text-almost-black">

      <!-- Group Info -->

      <div class="flex flex-col justify-center items-center gap-4 bg-white rounded-xl p-3.5 md:px-7 drop-shadow-md">

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
                    v-for="(time, index) in group.times" :key="index">

                    <!--Selector Day-->

                    <td>
                      <DaySelect v-model="time.day" @change="validateTime(time)"></DaySelect>
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
                      <DaySelect v-model="tempTime.day" @change="tempTimeChange()"></DaySelect>
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

        <div class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col w-full">
          <div class="h-fit max-h-[60vh] overflow-y-auto block">
            <table class="table-auto text-left">

              <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
                <tr>

                  <th scope="col" class="pb-2.5 font-medium"
                    @click="() => { if (participantSort.key === 'lastname') participantSort.index.lastname = (participantSort.index.lastname + 1) % 2; participantSort.key = 'lastname' }">
                    <span class="flex items-center gap-1">
                      <SortIcon :index="participantSort.index.lastname"></SortIcon>
                      Name
                    </span>
                  </th>

                  <th scope="col" class="px-3 md:px-4 pb-2.5 font-medium"
                    @click="() => { if (participantSort.key === 'firstname') participantSort.index.firstname = (participantSort.index.firstname + 1) % 2; participantSort.key = 'firstname' }">
                    <span class="flex items-center gap-1">
                      <SortIcon :index="participantSort.index.firstname"></SortIcon>
                      Vorname
                    </span>
                  </th>

                  <!-- Geburtstag -->

                  <!-- Wird ausgeblendet, wenn Screen zuklein -->
                  <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                    @click="() => { if (participantSort.key === 'birthday') participantSort.index.birthday = (participantSort.index.birthday + 1) % 2; participantSort.key = 'birthday' }">
                    <!-- Wird abgekürzt, wenn Screen kleiner als md -->
                    <span class="hidden md:flex items-center gap-1 ">
                      <SortIcon :index="participantSort.index.birthday"></SortIcon>
                      Geburtstag
                    </span>
                    <span class="flex md:hidden items-center gap-1 ">
                      <SortIcon :index="participantSort.index.birthday"></SortIcon>
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

        <div class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col w-full">
          <div class="h-fit max-h-[60vh] overflow-y-auto block">
            <table class="table-auto text-left">

              <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
                <tr>

                  <th scope="col" class="pb-2.5 font-medium w-[120px] sm:w-[240px]"
                    @click="() => { if (trainerSort.key === 'lastname') trainerSort.index.lastname = (trainerSort.index.lastname + 1) % 2; trainerSort.key = 'lastname' }">
                    <span class="flex items-center gap-1">
                      <SortIcon :index="trainerSort.index.lastname"></SortIcon>
                      Name
                    </span>
                  </th>

                  <th scope="col" class="pb-2.5 font-medium w-[130px]"
                    @click="() => { if (trainerSort.key === 'role') trainerSort.index.role = (trainerSort.index.role + 1) % 2; trainerSort.key = 'role' }">
                    <span class="flex items-center gap-1">
                      <SortIcon :index="trainerSort.index.role"></SortIcon>
                      Rolle
                    </span>
                  </th>

                  <!-- Spalte für Pfeil Icon -->
                  <th scope="col" class="pb-2.5 font-medium w-full"></th>
                </tr>
              </thead>

              <tbody class="overscroll-y-scroll">
                <!-- Eine Reihe pro Trainer -->
                <tr v-for="(trainer) in group.trainers" :key="trainer._id"
                  class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">

                  <!-- Name -->

                  <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0  w-[120px] md:w-[150px]">
                    <p class="text-ellipsis overflow-hidden">{{ trainer.firstname }} {{ trainer.lastname }}</p>
                  </td>

                  <!-- Rolle -->
                  <td class="px-2.5 py-2.5 group-last:pt-2.5 group-last:pb-0 w-[130px]">
                    <select v-model="trainer.role" @click.stop="" @change="updateTrainerRole(trainer)"
                      class="w-fit focus:ring-0 focus:border-standard-gradient-1 border-0 py-[4px] rounded-xl bg-[#D1D5DB] font-medium text-base md:text-lg">
                      <option value="trainer" class="bg-white">Trainer</option>
                      <option value="assistant" class="bg-white">Assistent</option>
                    </select>
                  </td>

                  <!-- - Icon -->
                  <!-- Click entfernt User -->
                  <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end"
                    @click="removeTrainer(trainer._id)">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                      stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto text-delete-gradient-1">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
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
    </div>

    <!-- Edit Teilnehmer -->

    <ParticipantModal ref="editParticipantModal" type="edit" access="staff" :groupID="group?._id" @onClose="close">
    </ParticipantModal>

    <!-- Add Teilnehmer -->

    <ParticipantModal ref="addParticipantModal" type="add" access="staff" :groupID="group?._id"
      :groupParticipants="group?.participants" @on-close="close"></ParticipantModal>

    <!-- Add Trainer -->

    <NewTrainerModal ref="addTrainerModal" :groupID="group?._id" :groupTrainers="group?.trainers" @onClose="close">
    </NewTrainerModal>
  </div>
</template>
  
<script>
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import ErrorMessage from '@/components/ErrorMessage.vue';
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import SelectList from "@/components/SelectList.vue";
import { fetchGroup, getAllDepartments, updateGroup, removeTrainerFromGroup, updateTrainerInGroup } from "@/util/fetchOperations";
import DaySelect from "@/components/DaySelect.vue";
import StandardButton from "@/components/StandardButton.vue";
import ParticipantModal from "@/components/ParticipantModal.vue";
import NewTrainerModal from "@/components/NewTrainerModal.vue";
import _ from "lodash";

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
        }
      },
      participantSort: {
        key: 'lastname',
        index: {
          lastname: 0,
          firstname: 0,
          birthday: 0
        }
      },
      trainerSort: {
        key: 'lastname',
        index: {
          lastname: 0,
          role: 0
        }
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
      }
    }
  },
  components: {
    SortIcon,
    TextInput,
    ErrorMessage,
    CollapsibleContainer,
    SelectList,
    DaySelect,
    StandardButton,
    ParticipantModal,
    NewTrainerModal
  },
  methods: {
    async close() {
      this.group = await fetchGroup(this.group._id)

      this.resetError()
    },

    async openEditParticipant(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      this.$refs.editParticipantModal.open(_.cloneDeep(this.group.participants.find(m => m.memberId === id)))
    },

    async updateTrainerRole(id) {
      const res = await updateTrainerInGroup(this.group._id, this.editTrainer.userId, this.group.trainers.find(t => t.userId === id))
      if (res.ok) {
        this.close()
      } else {
        this.error.message = res.body.message
        this.error.show = true
      }
    },

    async removeTrainer(id) {
      const res = await removeTrainerFromGroup(this.group._id, id)
      if (res.ok) {
        this.close()
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
          this.close()
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

        this.group.times = this.group.times.sort((a, b) => this.sorter[a.day] - this.sorter[b.day])
      }
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
    participantSort: {
      handler() {
        this.group.participants.sort((a, b) => {
          if (this.participantSort.key === 'birthday') return this.participantSort.index["birthday"] === 1 ? new Date(b["birthday"]) - new Date(a["birthday"]) : new Date(a["birthday"]) - new Date(b["birthday"])
          return this.participantSort.index[this.participantSort.key] === 1 ? b[this.participantSort.key].localeCompare(a[this.participantSort.key]) : a[this.participantSort.key].localeCompare(b[this.participantSort.key])
        })
      },
      deep: true
    },

    trainerSort: {
      handler() {
        this.group.trainers.sort((a, b) => this.trainerSort.index[this.trainerSort.key] === 1 ? b[this.trainerSort.key].localeCompare(a[this.trainerSort.key]) : a[this.trainerSort.key].localeCompare(b[this.trainerSort.key]))
      },
      deep: true
    }
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
