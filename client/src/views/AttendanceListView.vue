<template>
  <div class="relative container">
    <!--Oberer Container: Enthält Gruppenauswahl, Gruppen Info & Date Picker-->
    <div class="flex items-center justify-between mb-8">
      <!--Auswahlelement, um Gruppe auszuwählen-->
      <SelectList v-model="selectedGroup" defaultValue="Wähle eine Gruppe"
        :options="this.groups" class="font-bold text-2xl md:text-3xl mr-3"/>

      <!--Toggelt zwischen Gruppeninfo anzeigen und nicht anzeigen-->
      <button @click="showGroups = !showGroups"
        :class="showGroups ? 'bg-gradient-to-br from-dimmed-gradient-1 to-dimmed-gradient-2' : 'bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2'"
        class="text-white inline-flex items-center px-2.5 md:px-4 py-2.5 rounded-lg drop-shadow-md ml-2">
        <span class="flex items-center w-6 mr-2">
          <!--Open Eye Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0"
            stroke="currentColor" class="w-6 h-6 mx-auto" v-show="!showGroups">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <!--Closed Eye Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0"
            stroke="currentColor" class="w-6 h-6 mx-auto" v-show="showGroups">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        </span>
        <p class="font-medium font-base md:text-lg">Gruppeninfo</p>
      </button>
    </div>

    <!--Gruppeninfo Box: Wird angezeigt, wenn mit Button getoggelt wird.-->
    <div class="mb-8">
      <GroupInfo v-show="showGroups" :group="selectedGroup"
        class="bg-white px-4 py-4 rounded-lg drop-shadow-md" />
    </div>

    <!--Date Picker: Triggert GargabeCollector, wenn Date verändert wird. Bei Veränderung von Date wird eine neue Attendance List gepullt.-->
    <div class="mb-12">
      <DatePicker @onChange="pullAttendance" v-model="date" ref="datePicker"/>
    </div>

    <!--Liste aller Teilnehmer: Wird geupdatet, wenn neue Attendance List gepullt wird.-->
    <!--Wenn keine Attendance List geladen ist, wird "Bitte wähle eine Gruppe angezeigt."-->
    <div>
      <AttendanceListComponent :participants="this.attended.participants" :sortByLastName="true"
        @onAttendedChange="(id, bool) => attendanceChange(id, bool)"></AttendanceListComponent>
      <span class="flex justify-center items-center">        
        <p v-show="typeof this.attended.participants === 'undefined'"
        class="text-xl md:text-2xl font-normal text-gray-400">Bitte wähle eine Gruppe</p>
      </span>
    </div>
  </div>
</template>

<script>
import SelectList from "@/components/SelectList";
import AttendanceListComponent from "@/components/AttendanceListComponent";
import GroupInfo from "@/components/GroupInfo";
import DatePicker from "@/components/DatePicker";
import { fetchGroups, fetchAttendanceByDate, updateTrainingssession } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";

export default {
  name: "AttendanceListView",
  setup() {
        const dataStore = useDataStore()
        return {
            dataStore
        }
    },
  data() {
    return {
      groups: [],
      selectedGroup: undefined,
      date: new Date(),
      showGroups: false,
      attended: Object,
    }
  },
  components: {
    SelectList,
    AttendanceListComponent,
    DatePicker,
    GroupInfo
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
          console.error("Etwas ist schief gelaufe. Dies hätte nicht passieren sollen. --> pullAttendance")
        } else {
          this.attended = await res
        }
      }
    },

    /**
     * Wird von @see AttendanceListComponent getriggert. Updatet die Attendance List auf dem Client und schickt die veränderte Trainingssession zum Server.
     * @param {String} id ID des Teilnehmers
     * @param {Boolean} newVal Ob der Teilnehmer teilgenommen hat.
     */
    attendanceChange(id, newVal) {
      (this.attended.participants.find(foo => foo._id == id)).attended = newVal
      updateTrainingssession(this.selectedGroup.id, this.date, this.attended)
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
    }
  }
}
</script>
