<template>
    <div class="relative container mx-auto p-6 md:max-w-medium-width">
      <div class="flex items-center justify-between mb-4">
        <!--Select Group to edit. Auto Select zur Gruppe, von der man kommt.-->
        <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Gruppe"
          :options="this.groups" class="bg-background-greywhite  font-bold text-xl md:text-3xl" />
      </div>
  
      <div>
        <label for="filename" class="text-gray-700 font-light text-base md:text-lg">Vorname:</label>
            <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full ml-3 text-base md:text-lg" type="text"
                name="filename" v-model="firstname" placeholder="Vorname" />
      </div>

      <div>
      </div>
  
      <div class="grid grid-cols-2 mb-4 items-center">
        <p class="text-xl md:text-2xl font-medium text-gray-700 ml-3.5 ">Datum:</p>
        <DatePicker @onChange="pullAttendance" v-model="date" ref="datePicker"
          class="inline-flex items-center justify-items-center" />
      </div>
  
      <div>
        <TeilnehmerList :participants="this.attended.participants" :sortByLastName="true"
          @onAttendedChange="(id, bool) => attendanceChange(id, bool)"></TeilnehmerList>
        <AddTeilnehmer></AddTeilnehmer>
      </div>
    </div>
  </template>
  
  <script>
  import SelectList from "@/components/SelectList";
  import TeilnehmerList from "@/components/TeilnehmerList";
  import GroupInfo from "@/components/GroupInfo";
  import DatePicker from "@/components/DatePicker";
  import AddTeilnehmer from "@/components/AddTeilnehmer.vue";
  import { fetchGroups, fetchGroup, fetchAttendanceByDate, updateTrainingssession } from '@/util/fetchOperations'
  
  export default {
    name: "AttendanceListView",
    data() {
      return {
        groups: [],
        selectedGroup: undefined,
        date: new Date(),
        showGroups: false,
        attended: Object,
        weekday: []
      }
    },
    components: {
      SelectList,
      TeilnehmerList,
      DatePicker,
      GroupInfo,
      AddTeilnehmer
  },
    methods: {
  
      async updateSelectedGroup(groupID) {
        console.log(groupID)
        this.selectedGroup = await fetchGroup(groupID)
      },
  
      async pullAttendance() {
        if (typeof this.selectedGroup !== 'undefined') {
          const res = await fetchAttendanceByDate(this.selectedGroup.id, this.date)
          if (res.code === 404 && res.message === 'Requested Trainingssession not found') {
            // Sollte nicht mehr erreicht werden
            console.error("Etwas ist schief gelaufe. Dies hätte nicht passieren sollen. --> pullAttendance")
          } else {
            this.attended = await res
          }
        }
      },
  
      attendanceChange(id, newVal) {
        (this.attended.participants.find(foo => foo._id == id)).attended = newVal
        console.log(this.date)
        updateTrainingssession(this.selectedGroup.id, this.date, this.attended)
      },
  
      formatParticipantArray(participants) {
        for (const participant of participants) {
          participant.attended = typeof participants.attended === "undefined" ? false : participants.attended
        }
        return participants
      },
  
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
      }
    },
    async created() {
      this.groups = await fetchGroups()
      await this.pullAttendance()
      document.title = 'Wähle eine Gruppe'
      this.$store.commit("setViewname","Anwesenheitsliste")
    },
    watch: {
      selectedGroup() {
        this.weekday = this.getWeekdays(this.selectedGroup)
        this.$refs.datePicker.weekdays = this.weekday
        this.$refs.datePicker.newGroupSelected()
        this.$store.commit("setSelectedGroupID",this.selectedGroup.id)
        document.title = this.selectedGroup.name + ' - Attend'
      }
    }
  }
  </script>
  
  <style scoped>
  </style>
  