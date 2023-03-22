<template>
  <div class="relative container">
    <!--Oberer Container: Enthält Gruppenauswahl, Gruppen Info & Date Picker-->
    <div class="flex items-center justify-between mb-8">
      <!--Auswahlelement, um Gruppe auszuwählen-->
      <SelectList v-model="selectedGroup" defaultValue="Wähle eine Gruppe" :options="this.groups"
        class="font-bold text-2xl md:text-3xl"
        :class="{ 'mr-3': typeof selectedGroup !== 'undefined', 'mx-2': typeof selectedGroup === 'undefined' }" />

      <!--Toggelt zwischen TimesBox anzeigen und nicht anzeigen-->
      <button @click="showTimesBox = !showTimesBox"
        :class="showTimesBox ? 'bg-gradient-to-br from-dimmed-gradient-1 to-dimmed-gradient-2' : 'bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2'"
        class="text-white flex items-center px-2.5 md:px-4 py-2.5 rounded-lg drop-shadow-md ml-2"
        v-show="typeof selectedGroup !== 'undefined'">
        <span class="flex items-center w-6 mr-2">
          <!--Clock Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="currentColor"
            class="w-6 h-6 mx-auto" v-show="!showTimesBox">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!--Close Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0" stroke="currentColor"
            class="w-6 h-6 mx-auto" v-show="showTimesBox">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        <p class="font-medium font-base md:text-lg">Zeiten</p>
      </button>
    </div>

    <!--Trainingszeiten Box-->
    <div v-show="showTimesBox" class="bg-white p-6 rounded-lg drop-shadow-md mb-8">
      <div class="flex justify-between items-center mb-3">
        <p class="text-gray-700 font-light text-base md:text-lg w-full">Beginn: </p>
        <TimeInput class="text-black font-normal text-base md:text-lg text-right" v-model="attended.starttime" min="00:00"
          :max="attended.endtime" :show-error="attended.starttime === null || attended.starttime === ''"></TimeInput>
      </div>
      <div class="flex justify-between items-center mb-3">
        <p class="text-gray-700 font-light text-base md:text-lg w-full">Ende: </p>
        <TimeInput class="text-black font-normal text-base md:text-lg text-right" v-model="attended.endtime"
          :min="attended.starttime" max="23:59" :show-error="attended.endtime === null || attended.endtime === ''">
        </TimeInput>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-gray-700 font-light text-base md:text-lg ">Stundenanzahl: </p>
        <p class="text-black font-bold text-base md:text-lg text-right">{{ readableTotalHours }}</p>
      </div>
    </div>

    <!--Date Picker: Triggert GargabeCollector, wenn Date verändert wird. Bei Veränderung von Date wird eine neue Attendance List gepullt.-->
    <div class="mb-12" v-show="typeof selectedGroup !== 'undefined'">
      <DatePicker @onChange="pullAttendance()" v-model="date" ref="datePicker" />
    </div>

    <!--Liste aller Teilnehmer: Wird geupdatet, wenn neue Attendance List gepullt wird.-->
    <!--Wenn keine Attendance List geladen ist, wird "Bitte wähle eine Gruppe angezeigt."-->
    <div>
      <AttendanceListComponent :participants="this.attended.participants" :sortByLastName="true"
        @onAttendedChange="(id, bool) => attendanceChange(id, bool)"></AttendanceListComponent>
      <span class="flex justify-center items-center">
        <p v-show="typeof this.attended.participants === 'undefined'"
          class="text-xl md:text-2xl font-normal text-gray-500">Keine Gruppe ausgewählt!</p>
      </span>
    </div>

    <div>

    </div>

    <div>
      <!--Collapsable Container-->

      <CollapsibleContainer ref="trainerBox" class="p-3 rounded-lg" :class="{'bg-transparent text-black': !trainerBox.showContent, 'transition ease-in-out drop-shadow-md bg-white text-black': trainerBox.showContent}"  v-if="typeof selectedGroup !== 'undefined'">
        <template #header>
          <p class="font-bold text-xl md:text-2xl">Trainer</p>
        </template>
        <template #content>
          <div v-for="(trainer) in this.attended.trainers" :key="trainer._id" class="mb-4 last:mb-0 transition-none">
            <!--TODO Vielleicht nicht große Karte sondern nur Name und Checkbox-->
            <!--TODO Animation fixen-->
            <!--TODO Spacing zwischen Attandence List und TrainerBox fixen-->
            <!--Card list -> Trainer opt out-->
            <!--<div @click="onTrainerAttendanceChange(trainer._id)"
              :class="trainer.attended ? 'text-white bg-gradient-to-tl from-dimmed-gradient-2 to-dimmed-gradient-1' : 'text-black bg-gradient-to-tr from-unchecked-gradient-1 to-unchecked-gradient-2'"
              class="px-3.5 py-3 rounded-lg drop-shadow font-normal text-xl hover:cursor-pointer select-none">
              <span class="flex items-center justify-between">
                <h3>{{ trainer.lastname }}, {{ trainer.firstname }}</h3>
                <span class="self-center w-6">-->
                  <!--Checkmark Icon-->
                  <!--
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73.031 55.976" class="text-white"
                    v-show="trainer.attended">
                    <path fill="none" stroke="currentColor" stroke-width="9.973"
                      d="M69.465 3.486 25.048 48.925 3.486 27.847" />
                  </svg>-->
                  <!--Checkbox Icon-->
                  <!--
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.851 80.851" v-show="!trainer.attended"
                    class="text-dark-grey">
                    <path fill="none" stroke="currentColor" stroke-width="7.5"
                      d="M28.885 3.75h23.08a25.135 25.135 0 0 1 25.136 25.135v23.08a25.135 25.135 0 0 1-25.136 25.136h-23.08A25.135 25.135 0 0 1 3.75 51.966v-23.08A25.135 25.135 0 0 1 28.885 3.75z" />
                  </svg>
                </span>
              </span>
            </div>-->
            <div @click="onTrainerAttendanceChange(trainer._id)"
              class="text-black rounded-lg font-normal text-xl hover:cursor-pointer select-none" :class="{'': !trainerBox.showContent}">
              <span class="flex items-center justify-between">
                <h3>{{ trainer.lastname }}, {{ trainer.firstname }}</h3>
                <CheckboxInput v-model="trainer.attended"></CheckboxInput>
              </span>
            </div>
          </div>
        </template>
      </CollapsibleContainer>
    </div>

    <div v-if="(typeof this.attended.participants !== 'undefined' && this.attended.participants.length > 0)"
      class="flex justify-center items-center mt-3">
      <p class="text-lg md:text-xl font-normal text-gray-600">{{ countParticipants(attended.participants) }} Teilnehmer
        am {{ new Date(date).toLocaleDateString() }}</p>
    </div>
  </div>
</template>

<script>
import SelectList from "@/components/SelectList.vue";
import AttendanceListComponent from "@/components/AttendanceListComponent.vue";
import DatePicker from "@/components/DatePicker.vue";
import { fetchGroups, fetchAttendanceByDate, updateTrainingssession } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import TimeInput from "@/components/TimeInput.vue";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import { ref } from 'vue'
import CheckboxInput from "@/components/CheckboxInput.vue";

export default {
  name: "AttendanceListView",
  setup() {
    const dataStore = useDataStore()
    const trainerBox = ref("")
    return {
      dataStore,
      trainerBox
    }
  },
  data() {
    return {
      groups: [],
      selectedGroup: undefined,
      date: new Date(),
      showTimesBox: false,
      attended: Object
    }
  },
  components: {
    SelectList,
    AttendanceListComponent,
    DatePicker,
    TimeInput,
    CollapsibleContainer,
    CheckboxInput
},
  methods: {
    /**
     * Zieht beim aufrufen die Attendance List der in @see SelectList ausgewählten Gruppe für das im @see DatePicker ausgewählte Datum vom Server. 
     * Wenn eine Attendance List erfolgreich gezogen wurde, wird sie in 'attended' abgespeichert und von @see AttendanceListComponent gerendert.
     * Wenn der Server mit einem Fehler antwortet, wird dieser in der Console ausgegeben.
     */
    async pullAttendance() {
      if (typeof this.selectedGroup !== 'undefined' && typeof this.date !== 'undefined') {
        const res = await fetchAttendanceByDate(this.selectedGroup.id, this.date)
        if (res.code === 404 && res.message === 'Requested Trainingssession not found') {
          // Sollte nicht mehr erreicht werden
          console.error("Etwas ist schief gelaufen. Dies hätte nicht passieren sollen. --> pullAttendance")
        } else {
          this.attended = await res
          if (this.attended.totalHours === null || this.attended.startingTime === null || this.attended.endingTime === null) {
            this.showTimesBox = true
          }
        }
      }
    },

    /**
     * Wird von @see AttendanceListComponent getriggert. Updatet die Attendance List auf dem Client und schickt die veränderte Trainingssession zum Server.
     * @param {String} id ID des Teilnehmers
     * @param {Boolean} newVal Ob der Teilnehmer teilgenommen hat.
     */
    async attendanceChange(id, newVal) {
      (this.attended.participants.find(foo => foo._id == id)).attended = newVal
      this.attended.totalHours = this.totalHours
      this.attended = await updateTrainingssession(this.selectedGroup.id, this.date, this.attended)

      if (this.attended.totalHours === null || this.attended.startingTime === null || this.attended.endingTime === null) {
        this.showTimesBox = true
      }
    },

    async onTrainerAttendanceChange(id) {
      const trainer = this.attended.trainers.find(foo => foo._id == id)
      trainer.attended = !trainer.attended
      this.attended.totalHours = this.totalHours
      
      if (this.attended.totalHours === null || this.attended.startingTime === null || this.attended.endingTime === null) {
        this.showTimesBox = true
      } else {
        console.log(await updateTrainingssession(this.selectedGroup.id, this.date, this.attended))
      }
    },

    /**
     * Zieht Trainingstage aus group Objekt und gibt sie formatiert als Array zurück. Wochentage werden nach dem Schema Montag --> Mo formatiert. 
     * @param {Object} group 
     * @returns {Array} Array aller Wochentage, an denen ein Training stattfindet.
     */
    getWeekdays(group) {
      let temp = []
      for (const time of group.times) {
        if (time.day.length >= 2) {
          temp.push(time.day.slice(0, 2))
        } else {
          temp.push(" ")
        }
      }
      return temp
    },

    countParticipants(participants) {
      let count = 0
      for (const element of participants) {
        if (element.attended) {
          count++
        }
      }
      return count > 0 ? count : "Keine"
    }
  },
  async created() {
    //Zieht sich alle Namen und IDs der Gruppen auf die der Nutzer zugreifen kann.
    this.groups = await fetchGroups()

    //Setzt Tab- und Seitenname
    document.title = 'Wähle eine Gruppe'
    this.dataStore.viewname = "Anwesenheitsliste"
  },
  watch: {
    //Wenn neue Gruppe ausgewählt wird...
    selectedGroup() {
      //Wochentage werden an Datepicker übergeben, damit man über Buttons zum nächsten Training springen kann.
      this.$refs.datePicker.weekdays = this.getWeekdays(this.selectedGroup)
      //Aktualisiert Date
      this.$refs.datePicker.newGroupSelected()

      document.title = this.selectedGroup.name + ' - Attend'
    },
    async totalHours() {
      console.log("🚀 ~ file: AttendanceListView.vue:191 ~ totalHours ~ this.totalHours", this.totalHours)

      if (this.attended.participants.some(foo => foo.attended)) {
        this.attended.totalHours = this.totalHours
        this.attended = await updateTrainingssession(this.selectedGroup.id, this.date, this.attended)
      }
    },
  },
  computed: {
    totalHours() {
      if (this.attended.starttime && this.attended.endtime) {
        const startingTime = Number(this.attended.starttime?.split(":")[0]) + Number(this.attended.starttime?.split(":")[1] / 60) || 0;

        const endingTime = Number(this.attended.endtime?.split(":")[0]) + Number(this.attended.endtime?.split(":")[1] / 60) || 0;

        return endingTime - startingTime > 0 && startingTime > 0 ? endingTime - startingTime : 0;
      } else {
        return null
      }
    },
    readableTotalHours() {
      const hh = Math.trunc(this.totalHours) ?? 0
      const mm = Math.round(60 * (this.totalHours - hh)) ?? 0
      return `${hh} Std ${mm} Min`
    }
  }
}
</script>
