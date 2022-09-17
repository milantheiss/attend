<template>
  <div class="bg-white px-3 py-1.5 rounded-lg drop-shadow-md">
    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Gruppe:</p>
      </div>
      <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Gruppe"
        :options="this.groups" class="bg-background-greywhite  font-bold text-xl md:text-3xl" />
    </div>


    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Abteilung:</p>
      </div>
      <div>
        <p class="text-base md:text-lg text-right" :class="group.department.name === '. . .' ? 'pr-0.5' : ''">
          {{ group.department.name }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Trainer:</p>
      </div>
      <div>
        <p class="text-base text-right md:text-lg" :class="group.department.name === '. . .' ? 'pr-0.5' : ''"
          v-for="trainer in group.trainer" :key="trainer.name">{{ trainer.name }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Assistent:</p>
      </div>
      <div>
        <p class="text-base md:text-lg text-right" :class="group.department.name === '. . .' ? 'pr-0.5' : ''"
          v-for="assistent in group.assistent" :key="assistent.name">{{ assistent.name }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Zeiten:</p>
      </div>
      <div>
        <p class="text-base md:text-lg text-right" :class="group.department.name === '. . .' ? 'pr-0.5' : ''"
          v-for="time in group.times" :key="time">{{ getTime(time) }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Sportstätte:</p>
      </div>
      <div>
        <p class="text-base md:text-lg text-right" :class="group.department.name === '. . .' ? 'pr-0.5' : ''"
          :key="group.venue">{{ group.venue }}</p>
      </div>
    </div>
  </div>
</template>
  
<script>
import SelectList from "@/components/SelectList";
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
    SelectList
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
  
<style scoped>

</style>
  