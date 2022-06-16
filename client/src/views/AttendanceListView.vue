<template>
  <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Wähle eine Gruppe"
              :options="this.groups"/>
  <Button @btn-click="showGroups = !showGroups" text="Zeige Gruppen Info" id="group-btn"/>
  <GroupInfo v-show="showGroups" :group="selectedGroup"/>
  <!--TODO übergebe die Trainingstag richtig-->
  <DatePicker @onChange="pullAttendance" v-model="date" ref="datePicker"/>
  <TeilnehmerItem v-for="participant in this.attended.participants" :key="participant._id"
                  :participant="participant" @onAttendedChange="(value) => attendanceChange(participant, value)"/>
</template>

<script>
import SelectList from "@/components/SelectList";
import Button from "@/components/Button";
import TeilnehmerItem from "@/components/TeilnehmerItem";
import GroupInfo from "@/components/GroupInfo";
import DatePicker from "@/components/DatePicker";
import {getShortenedJSONDate} from "@/util/formatter";

//TODO Fetch reaparieren, sodass Frontend auf Backend zugreifen kann

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
    Button,
    TeilnehmerItem,
    DatePicker,
    GroupInfo
  },
  methods: {
    async fetchGroups() {
      console.debug("Fetching for all groups")
      return (await fetch([process.env.VUE_APP_API_URL, "groups"].join('/'))).json();
    },

    async fetchGroup(groupID) {
      console.debug(`Fetching for group by ID: ${groupID}`)
      return (await fetch([process.env.VUE_APP_API_URL, "groups", groupID].join('/'))).json();
    },

    async fetchAttendance(groupID) {
      console.debug(`Fetching for attendance by ID ${groupID}`)
      return (await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID].join('/'))).json();
    },

    async fetchAttendanceByDate(groupID, date) {
      console.debug(`Fetching for attendance by ID ${groupID} and date ${date}`)
      return (await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'))).json();
    },

    async updateAttendance(groupID, date, body) {
      await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'), {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      })
    },

    async addAttendance(groupID, body) {
      await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID].join('/'), {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      })
    },

    deleteAttendance(groupID, date) {
      fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, getShortenedJSONDate(date)].join('/'), {
        method: 'DELETE',
        headers: {'Content-type': 'application/json; charset=UTF-8'}
      })
    },

    async updateSelectedGroup(groupID) {
      this.selectedGroup = await this.fetchGroup(groupID)
    },

    async pullAttendance() {
      if (this.selectedGroup.name !== "No group selected") {
        const res = await this.fetchAttendanceByDate(this.selectedGroup.id, this.date)
        if (typeof res.error !== "undefined") {
          this.attended = {
            date: getShortenedJSONDate(this.date),
            participants: this.formatParticipantArray(this.selectedGroup.participants)
          }
        } else {
          this.attended = await res
        }
      }else {
        this.attended = {error: "No data yet"}
      }
    },

    attendanceChange(participant, newVal){
      let newList = true
      let emptyList = true

      for (const db_participant of this.attended.participants) {
        if (db_participant.attended === true){
          newList = false
        }
        if (participant._id === db_participant._id){
          db_participant.attended = newVal
        }
        if (db_participant.attended === true){
          emptyList = false
        }
      }

      if (newList) {
        this.addAttendance(this.selectedGroup.id, this.attended)
      }else if(emptyList){
        this.deleteAttendance(this.selectedGroup.id, this.date)
      }else {
        this.updateAttendance(this.selectedGroup.id, this.date, this.attended)
      }
    },

    formatParticipantArray(participants) {
      for (const participant of participants) {
        participant.attended = typeof participants.attended === "undefined" ? false : participants.attended
      }
      return participants
    },

    getWeekdays(group){
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
    this.groups = await this.fetchGroups()
    await this.pullAttendance()
  },
  watch: {
    selectedGroup(){
      this.weekday = this.getWeekdays(this.selectedGroup)
      this.$refs.datePicker.weekdays = this.weekday
      this.$refs.datePicker.newGroupSelected()
    }
  }
}
</script>

<style scoped>
#group-btn{
  position: absolute;
  width: 145px;
  height: 40px;
  left: 216px;
  top: 140px;
}
</style>
