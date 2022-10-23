<template>
  <div class="relative container mx-auto pt-3 px-6 pb-6 md:max-w-medium-width">
    <div class="bg-white px-3 py-4 rounded-lg drop-shadow-md mb-4">
      <div class="grid grid-cols-2 mx-3">
        <div>
          <p class="text-gray-700 font-light text-base md:text-lg">Gruppe:</p>
        </div>
        <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Gruppe"
          :options="this.groups" class="font-bold text-xl md:text-2xl mt-1" />
      </div>

      <GroupInfo :group="selectedGroup" class="mt-4" />
    </div>

    <div class="grid items-center mt-6">
      <GroupListGomponent :participants="getParticipants()"
        @onClickOnSave="(participantData) => onClickOnSave(participantData)"
        @onClickOnDelete="(participantData) => onClickOnDelete(participantData)" />
      <p v-show="typeof getParticipants() === 'undefined'"
        class="text-xl md:text-2xl font-normal text-gray-400 mx-auto">Bitte wähle eine Gruppe</p>
    </div>
    <MemberEditor :createsNewMember="true" @onClickOnCreate="(participantData) => onClickOnSave(participantData)"
      v-show="typeof selectedGroup !== 'undefined'" />
  </div>
</template>
  
<script>
import SelectList from "@/components/SelectList";
import GroupListGomponent from "@/components/GroupListGomponent";
import { fetchGroups, fetchGroup, updateMemberInGroup, removeMemberFromGroup } from '@/util/fetchOperations'
import GroupInfo from "@/components/GroupInfo"
import MemberEditor from "@/components/MemberEditor";

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
    GroupInfo,
    MemberEditor
  },
  methods: {
    async updateSelectedGroup(groupID) {
      this.selectedGroup = await fetchGroup(groupID)
    },
    getParticipants() {
      if (typeof this.selectedGroup !== 'undefined') {
        return this.selectedGroup.participants
      } else {
        return undefined
      }
    },
    async onClickOnSave(participantData) {
      this.selectedGroup = await updateMemberInGroup(this.selectedGroup.id, participantData)
    },
    async onClickOnDelete(participantData) {
      this.selectedGroup = await removeMemberFromGroup(this.selectedGroup.id, participantData._id)
    }
  },

  async created() {
    this.groups = await fetchGroups()
    document.title = 'Gruppe bearbeiten - Attend'
    this.$store.commit("setViewname", "Gruppe bearbeiten")
  }
}
</script>
