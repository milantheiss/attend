<template>
  <div class="relative container mx-auto p-6 md:max-w-medium-width">
    <div class="bg-white px-3 py-1.5 rounded-lg drop-shadow-md mb-4">
      <div class="grid grid-cols-2">
        <div>
          <p class="text-gray-700 font-light text-base md:text-lg">Gruppe:</p>
        </div>
        <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Gruppe"
          :options="this.groups" class="font-bold text-xl md:text-2xl" />
      </div>

      <GroupInfo :group="selectedGroup" class="mt-4" />
    </div>
    
    <GroupListGomponent :participants="getParticipants()" @onClickOnSave="(body) => $emit(onClickOnSave(body))" @onClickOnDelete="(body) => $emit(onClickOnDelete(body))"/>
  </div>
</template>
  
<script>
import SelectList from "@/components/SelectList";
import GroupListGomponent from "@/components/GroupListGomponent";
import { fetchGroups, fetchGroup, updateMemberInGroup, removeMemberFromGroup } from '@/util/fetchOperations'
import GroupInfo from "@/components/GroupInfo"

export default {
  name: "EditGroupView",
  data() {
    return {
      groups: [],
      selectedGroup: undefined
    }
  },
  components: {
    SelectList,
    GroupListGomponent,
    GroupInfo
},

  methods: {
    async updateSelectedGroup(groupID) {
      this.selectedGroup = await fetchGroup(groupID)
    },
    getParticipants(){
      if (typeof this.selectedGroup !== 'undefined'){
        console.log("HALLLLO WARUM????")
        return this.selectedGroup.participants
      } else {
        return undefined
      }
    },
    async onClickOnSave(body){
      await updateMemberInGroup(this.selectedGroup.id, body)
    },
    async onClickOnDelete(body){
      await removeMemberFromGroup(this.selectedGroup.id, body._id)
    }
  },

  async created() {
    this.groups = await fetchGroups()
    document.title = 'Gruppe bearbeiten - Attend'
    this.$store.commit("setViewname", "Gruppe bearbeiten")
  }
}
</script>
