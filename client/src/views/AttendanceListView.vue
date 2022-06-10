<template>
  <h1>Hello</h1>
  <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Wähle eine Gruppe" :options="this.groups"/>
  <Button text="Zeige Gruppen Info" color="lightsteelblue"/>
  <TeilnehmerItem v-for="participant in this.groups[0].participants" :key="participant.id" :participant="participant"/>
</template>

<script>
import SelectList from "@/components/SelectList";
import Button from "@/components/Button";
import TeilnehmerItem from "@/components/TeilnehmerItem";

export default {
  name: "AttendanceListView",
  data(){
    return{
      groups: [],
      selectedGroup: Object,
      test: {
        firstname: "Lina",
        lastname: "Dvornik",
        yearofbirth: 2010,
        id: 1
      }
    }
  },
  components: {
    SelectList,
    Button,
    TeilnehmerItem
  },
  methods: {
    async fetchGroups(){
      return (await fetch('api/groups')).json();
    },
    heyU(){
      console.log("Btn clicked")
    },
    updateSelectedGroup(groupID){
      console.log(groupID)
    }
  },
  async created() {
    this.groups = await this.fetchGroups()
  }
}
</script>

<style scoped>
</style>
