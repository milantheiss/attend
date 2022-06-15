<template>
  <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Wähle eine Gruppe"
              :options="this.groups"/>
  <Button @btn-click="showGroups = !showGroups" text="Zeige Gruppen Info" color="lightsteelblue"/>
  <GroupInfo v-show="showGroups" :group="selectedGroup"/>
  <!--TODO übergebe die Trainingstag richtig-->
  <DatePicker @dateChanged="changeAtDate" :weekdays="weekdays" v-model="date"/>
  <TeilnehmerItem v-for="participant in this.selectedGroup.participants" :key="participant._id"
                  :participant="participant"/>
</template>

<script>
import SelectList from "@/components/SelectList";
import Button from "@/components/Button";
import TeilnehmerItem from "@/components/TeilnehmerItem";
import GroupInfo from "@/components/GroupInfo";
import DatePicker from "@/components/DatePicker";

//TODO Fetch reaparieren, sodass Frontend auf Backend zugreifen kann

export default {
  name: "AttendanceListView",
  data() {
    return {
      groups: [],
      selectedGroup: {
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
      selectedAttendance: Object,
      header: new Headers({'Content-Type': 'application/JSON'})
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
      console.log("Fetching for all groups")
      return (await fetch([process.env.VUE_APP_API_URL, "groups"].join('/'))).json();
    },

    async fetchGroup(groupID) {
      console.log(`Fetching for group by ID: ${groupID}`)
      return (await fetch([process.env.VUE_APP_API_URL, "groups", groupID].join('/'))).json();
    },

    async fetchAttendance(groupID) {
      console.log(`Fetching for attendance by ID ${groupID}`)
      return (await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID].join('/'))).json();
    },

    async fetchAttendanceByDate(groupID, date) {
      console.log(`Fetching for attendance by ID ${groupID} and date ${date}`)
      return (await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, date].join('/'))).json();
    },

    async updateAttendance(groupID, date, body){
      return (await fetch([process.env.VUE_APP_API_URL, "attendance/byGroupID", groupID, date].join('/'),{
        method: 'PATCH',
        body: body,
        headers: this.headers
      })).json()
    },

    async updateSelectedGroup(groupID) {
      this.selectedGroup = await this.fetchGroup(groupID)
    },
    changeAtDate(){
      console.log(this.date)
    }
  },
  async created() {
    this.groups = await this.fetchGroups()
  },
  computed: {
    weekdays() {
      let temp = []
      for (const time of this.selectedGroup.times) {
        if (time.day.length >= 2){
          temp.push(time.day.slice(0, 2))
        }else {
          temp.push(" ")
        }
      }

      return temp
    }
  }
}
</script>

<style scoped>
</style>
