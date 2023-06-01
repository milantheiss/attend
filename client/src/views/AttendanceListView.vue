<template>
  <div class="relative container flex flex-col gap-4">
    <!--Oberer Container: Enthält Gruppenauswahl, Gruppen Info & Date Picker-->
    <div class="flex items-center justify-between px-3.5 md:px-7 gap-8">
      <!--Auswahlelement, um Gruppe auszuwählen-->
      <SelectList v-model="selectedGroup" defaultValue="Wähle eine Gruppe" :options="this.groups"
        class="font-bold text-2xl md:text-3xl" />

      <!--Toggelt zwischen TimesBox anzeigen und nicht anzeigen-->
      <button @click="showTimesBox = !showTimesBox"
        :class="showTimesBox ? 'bg-gradient-to-br from-dimmed-gradient-1 to-dimmed-gradient-2' : 'bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2'"
        class="text-white flex items-center px-3.5 md:px-7 py-3.5 rounded-2xl drop-shadow-md"
        v-show="typeof selectedGroup !== 'undefined'">
        <span class="flex items-center mr-2">
          <!--Clock Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-8 h-8" v-show="!showTimesBox">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>

          <!--Close Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
            class="w-8 h-8" v-show="showTimesBox">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
        <p class="font-medium">Zeiten</p>
      </button>
    </div>

    <!--Trainingszeiten Box-->
    <transition enter-active-class="transition ease-in-out duration-[200ms]" enter-from-class="-translate-y-5 opacity-0"
      enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-[200ms]"
      leave-from-class="opacity-100" leave-to-class="-translate-y-2 opacity-0">
      <div v-show="showTimesBox" class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col gap-3">
        <div class="flex justify-between items-center gap-4">
          <p class="text-light-gray w-full">Beginn: </p>
          <TimeInput class="text-right" v-model="attended.starttime" min="00:00" :max="attended.endtime"
            :show-error="attended.starttime === null || attended.starttime === ''"></TimeInput>
        </div>
        <div class="flex justify-between items-center gap-4">
          <p class="text-light-gray w-full">Ende: </p>
          <TimeInput class="text-right" v-model="attended.endtime" :min="attended.starttime" max="23:59"
            :show-error="attended.endtime === null || attended.endtime === ''">
          </TimeInput>
        </div>
        <div class="flex justify-between items-center gap-4">
          <p class="text-light-gray">Stundenanzahl: </p>
          <p class="font-medium text-right">{{ readableTotalHours }}</p>
        </div>
      </div>
    </transition>

    <!--Date Picker: Triggert GargabeCollector, wenn Date verändert wird. Bei Veränderung von Date wird eine neue Attendance List gepullt.-->
    <div class="mb-4 px-3.5 md:px-7" v-show="typeof selectedGroup !== 'undefined'">
      <DatePicker @onChange="pullAttendance()" v-model="date" ref="datePicker" />
    </div>

    <!--Liste aller Teilnehmer: Wird geupdatet, wenn neue Attendance List gepullt wird.-->
    <!--Wenn keine Attendance List geladen ist, wird "Bitte wähle eine Gruppe angezeigt."-->
    <div>
      <AttendanceListComponent :participants="this.attended.participants" :sortByLastName="true"
        @onAttendedChange="(id, bool) => attendanceChange(id, bool)"></AttendanceListComponent>
      <span class="flex justify-center items-center">
        <p v-show="typeof this.attended.participants === 'undefined'"
          class="text-xl md:text-2xl font-medium text-light-gray">Keine Gruppe ausgewählt!</p>
      </span>
    </div>

    <div>
      <!--TrainerBox-->
      <CollapsibleContainer ref="trainerBox" class="rounded-xl px-3.5 md:px-7 " v-if="typeof selectedGroup !== 'undefined'"
        :class="{ 'transition-all ease-in-out duration-[150ms] bg-transparent text-black': !trainerBox.showContent, 'transition-all ease-in-out duration-[150ms] drop-shadow-md bg-white px-3.5 md:px-7 py-4': trainerBox.showContent }">
        <template #header>
          <p class="font-bold text-xl md:text-2xl">Trainer</p>
        </template>
        <template #content>
          <div v-for="(trainer) in this.attended.trainers" :key="trainer.userId" class="mb-4 last:mb-0">
            <!--TODO Vielleicht nicht große Karte sondern nur Name und Checkbox-->
            <!--TODO Animation fixen-->
            <!--TODO Spacing zwischen Attandence List und TrainerBox fixen-->
            <!--Card list -> Trainer opt out-->
            <div @click="onTrainerAttendanceChange(trainer.userId)"
              class="text-black rounded-xl font-normal text-xl hover:cursor-pointer select-none"
              :class="{ '': !trainerBox.showContent }">
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
      class="flex justify-center items-center ">
      <p class="text-lg md:text-xl font-medium text-light-gray">{{ countParticipants(attended.participants) }} Teilnehmer
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
      attended: Object,
      blockSelectedGroupWatcher: false,
      pullingByQueryString: false
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
      if (typeof this.selectedGroup !== 'undefined' && typeof this.date !== 'undefined' && !this.pullingByQueryString) {
        const res = await fetchAttendanceByDate(this.selectedGroup._id, this.date)
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
      (this.attended.participants.find(foo => foo.memberId == id)).attended = newVal
      this.attended = await updateTrainingssession(this.selectedGroup._id, this.date, this.attended)

      if (this.attended.totalHours === null || this.attended.startingTime === null || this.attended.endingTime === null) {
        this.showTimesBox = true
      }
    },

    async onTrainerAttendanceChange(id) {
      const trainer = this.attended.trainers.find(foo => foo.userId == id)
      trainer.attended = !trainer.attended
      this.attended.totalHours = this.totalHours

      if (this.attended.totalHours === null || this.attended.startingTime === null || this.attended.endingTime === null) {
        this.showTimesBox = true
      } else {
        await updateTrainingssession(this.selectedGroup._id, this.date, this.attended)
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
    //Setzt Tab- und Seitenname
    document.title = 'Wähle eine Gruppe'
    this.dataStore.viewname = "Anwesenheitsliste"
  },
  async mounted() {
    //Zieht sich alle Namen und IDs der Gruppen auf die der Nutzer zugreifen kann.
    this.groups = await fetchGroups()
    const groupId = this.$route.query.groupId
    const date = this.$route.query.date

    if (typeof groupId !== 'undefined' && typeof date !== "undefined") {
      //Siehe Attendance, wenn eine GroupId & ein Date über Query String übergeben wird
      const res = await fetchAttendanceByDate(groupId, date)
      if (res.code === 404 && res.message === 'Requested Trainingssession not found') {
        // Sollte nicht mehr erreicht werden
        console.error("Etwas ist schief gelaufen. Dies hätte nicht passieren sollen. --> pullAttendance")
      } else {
        this.blockSelectedGroupWatcher = true
        this.pullingByQueryString = true
        this.selectedGroup = this.groups.find(foo => foo._id == groupId)
        this.date = new Date(date)
        this.attended = await res

        if (this.attended.totalHours === null || this.attended.startingTime === null || this.attended.endingTime === null) {
          this.showTimesBox = true
        }

        this.blockSelectedGroupWatcher = false
        this.pullingByQueryString = false
      }
    }
  },
  watch: {
    //Wenn eine neue Gruppe ausgewählt wird,...
    selectedGroup() {
      //Wochentage werden an Datepicker übergeben, damit man über Buttons zum nächsten Training springen kann.
      this.$refs.datePicker.weekdays = this.getWeekdays(this.selectedGroup)

      //Darf manchmal nicht ausgeführt werden, da dies einen Date Change triggert und die aktuellste Trainingssession geladen wird. --> Z.B. bei Attendance Pull über Query Parameter
      if (!this.blockSelectedGroupWatcher) {
        //Aktualisiert Date
        this.$refs.datePicker.newGroupSelected()
      }

      document.title = this.selectedGroup.name + ' - Attend'
    },
    async "attended.starttime"() {
      //Trainingssession wird geupdatet, damit Zeit abgespeichert wird.
      if (this.attended.participants.some(foo => foo.attended)) {
        this.attended = await updateTrainingssession(this.selectedGroup_id, this.date, this.attended)
      }
    },
    async "attended.endtime"() {
      //Trainingssession wird geupdatet, damit Zeit abgespeichert wird.
      if (this.attended.participants.some(foo => foo.attended)) {
        this.attended = await updateTrainingssession(this.selectedGroup_id, this.date, this.attended)
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
      const mm = ("0" + Math.round(60 * (this.totalHours - hh))).slice(-2)
      return `${hh}:${mm} Std`
    }
  }
}
</script>
