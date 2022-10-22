<template>
  <div class="relative container mx-auto pt-3 px-6 pb-6 md:max-w-medium-width">
    <div class="flex items-center justify-between mb-4">
      <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Gruppe"
        :options="this.groups" class="bg-background-greywhite  font-bold text-xl md:text-3xl mt-1" />

      <button @click="showGroups = !showGroups"
        :class="showGroups ? 'text-white bg-gradient-to-br from-dimmed-gradient-1 to-dimmed-gradient-2' : 'text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2'"
        class="inline-flex items-center px-2 md:px-3 py-1.5 md:py-2 rounded-lg drop-shadow-md ml-2">
        <span class="flex items-center w-6 mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0"
            stroke="currentColor" class="w-6 h-6 mx-auto text-white" v-show="!showGroups">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.0"
            stroke="currentColor" class="w-6 h-6 mx-auto text-white" v-show="showGroups">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
          </svg>
        </span>
        <p class="font-medium font-base md:text-lg">Gruppeninfo</p>
      </button>
    </div>

    <div>
      <GroupInfo v-show="showGroups" :group="selectedGroup"
        class="mb-4 bg-white px-3 py-1.5 rounded-lg drop-shadow-md" />
    </div>

    <div class="grid grid-cols-3 mb-4 items-center">
      <p class="text-xl md:text-2xl font-medium text-gray-700 ml-2">Datum:</p>
      <DatePicker @onChange="pullAttendance" v-model="date" ref="datePicker"
        class="col-start-2 col-span-2 inline-flex items-center justify-items-center" />
    </div>

    <div>
      <AttendanceListComponent :participants="this.attended.participants" :sortByLastName="true"
        @onAttendedChange="(id, bool) => attendanceChange(id, bool)"></AttendanceListComponent>
    </div>
  </div>
</template>

<script>
import SelectList from "@/components/SelectList";
import AttendanceListComponent from "@/components/AttendanceListComponent";
import GroupInfo from "@/components/GroupInfo";
import DatePicker from "@/components/DatePicker";
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
    AttendanceListComponent,
    DatePicker,
    GroupInfo
  },
  methods: {

    async updateSelectedGroup(groupID) {
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
    this.$store.commit("setViewname", "Anwesenheitsliste")
  },
  watch: {
    selectedGroup() {
      this.weekday = this.getWeekdays(this.selectedGroup)
      this.$refs.datePicker.weekdays = this.weekday
      this.$refs.datePicker.newGroupSelected()
      this.$store.commit("setSelectedGroupID", this.selectedGroup.id)
      document.title = this.selectedGroup.name + ' - Attend'
    }
  }
}
</script>
