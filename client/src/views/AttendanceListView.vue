<template>
  <div class="relative container mx-auto p-6 md:max-w-medium-width">
    <div class="flex items-center justify-between mb-4">
      <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Gruppe"
        :options="this.groups" class="bg-background-greywhite  font-bold text-xl md:text-3xl" />

      <button @click="showGroups = !showGroups"
        :class="showGroups ? 'text-white bg-gradient-to-br from-dimmed-gradient-1 to-dimmed-gradient-2' : 'text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2'"
        class=" inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-lg drop-shadow-md">
        <span class="flex items-center w-6 mr-3">
          <img :src="'./img/eye-icon.svg'" alt="eye icon" class="w-6 mx-auto" v-show="!showGroups">
          <img :src="'./img/x-icon.svg'" alt="x icon" class="w-3.5 mx-auto" v-show="showGroups">
        </span>
        <p class="font-medium font-base md:text-lg">Gruppeninfo</p>
      </button>
    </div>

    <div>
      <GroupInfo v-show="showGroups" :group="selectedGroup" class="mb-4" />
    </div>

    <div class="grid grid-cols-2 mb-4 items-center">
      <p class="text-xl md:text-2xl font-medium text-gray-700 ml-3.5 ">Datum:</p>
      <DatePicker @onChange="pullAttendance" v-model="date" ref="datePicker"
        class="inline-flex items-center justify-items-center" />
    </div>

    <div>
      <TeilnehmerItem v-for="participant in this.attended.participants" :key="participant._id"
        :participant="participant" @onAttendedChange="(value) => attendanceChange(participant, value)" />
      <span class="grid content-center mt-6">
        <p v-show="attended.error === 'No data yet'"
          class="text-xl justify-self-center md:text-2xl font-normal text-gray-400 ml-3.5 ">Bitte wähle eine Gruppe</p>
      </span>
    </div>
  </div>
</template>

<script>
import SelectList from "@/components/SelectList";
import TeilnehmerItem from "@/components/TeilnehmerItem";
import GroupInfo from "@/components/GroupInfo";
import DatePicker from "@/components/DatePicker";
import { getShortenedJSONDate } from "@/util/formatter";
import {fetchGroups, fetchGroup, fetchAttendanceByDate, updateAttendance, deleteAttendance, addAttendance} from '@/util/fetchOperations'
//import axios from "axios";

export default {
  name: "AttendanceListView",
  data() {
    return {
      groups: [],
      selectedGroup: {
        name: "No group selected",
        trainer: [
          {
            name: ""
          }
        ],
        assistent: [
          {
            name: ""
          }
        ],
        times: [{
          day: ""
        }],
        venue: "",
        department: {
          name: ""
        }
      },
      date: new Date(),
      showGroups: false,
      attended: Object,
      weekday: []
    }
  },
  components: {
    SelectList,
    TeilnehmerItem,
    DatePicker,
    GroupInfo
  },
  methods: {
    

    async updateSelectedGroup(groupID) {
      this.selectedGroup = await fetchGroup(groupID)
    },

    async pullAttendance() {
      if (this.selectedGroup.name !== "No group selected") {
        const res = await fetchAttendanceByDate(this.selectedGroup.id, this.date)
        console.log(res)
        if (res.code === 404 && res.message === 'Requested Trainingssession not found') {
          this.attended = {
            date: getShortenedJSONDate(this.date),
            participants: this.formatParticipantArray(this.selectedGroup.participants)
          }
        } else {
          this.attended = await res
        }
      } else {
        this.attended = { error: "No data yet" }
      }
    },

    attendanceChange(participant, newVal) {
      let newList = true
      let emptyList = true

      for (const db_participant of this.attended.participants) {
        if (db_participant.attended === true) {
          newList = false
        }
        if (participant._id === db_participant._id) {
          db_participant.attended = newVal
        }
        if (db_participant.attended === true) {
          emptyList = false
        }
      }

      if (newList) {
        addAttendance(this.selectedGroup.id, this.attended)
      } else if (emptyList) {
        deleteAttendance(this.selectedGroup.id, this.date)
      } else {
        updateAttendance(this.selectedGroup.id, this.date, this.attended)
      }
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
  },
  watch: {
    selectedGroup() {
      this.weekday = this.getWeekdays(this.selectedGroup)
      this.$refs.datePicker.weekdays = this.weekday
      this.$refs.datePicker.newGroupSelected()
      document.title = this.selectedGroup.name + ' - Attend'
    }
  }
}
</script>

<style scoped>
</style>
