<template>
  <div class="relative container">
    <!--Selector um Gruppe auszuwählen-->
    <div class="bg-white px-3 py-4 rounded-xl drop-shadow-md mb-6">
      <div class="flex justify-between items-center ml-3 mr-3">
        <p class="text-gray-700 font-light text-base md:text-lg">Gruppe:</p>
        <SelectList v-model="selectedGroup" defaultValue="Wähle eine Gruppe" :options="this.groups"
          class="font-bold text-xl md:text-2xl ml-3" />
      </div>

      <!--Gruppen Info-->
      <!--TODO Hier die Gruppen Infos bearbeiten-->
      <GroupInfo :group="groupData" class="mt-4" />
    </div>

    <!--Liste aller Teilnehmer. OnClick wird ein MemberEditor geöffnet.-->
    <!--Anzeigereglung wird in Component geregelt.-->
    <div class="grid items-center mb-2">
      <GroupListGomponent :participants="getParticipants()"
        @onClickOnSave="(participantData) => onClickOnSave(participantData)"
        @onClickOnDelete="(participantData) => onClickOnDelete(participantData)" />
      <!--Text wird angezeigt, wenn keine Gruppe ausgewählt ist.-->
      <p v-show="typeof getParticipants() === 'undefined'"
        class="text-xl md:text-2xl font-medium text-light-gray mx-auto">Bitte wähle eine Gruppe</p>
    </div>
    <!--MemberEditor wird immer angezeigt. Über diesen MemberEditor kann ein neuer Member hinzugefügt werden.-->
    <MemberEditor :createsNewMember="true" @onClickOnCreate="(participantData) => onClickOnSave(participantData)"
      v-show="typeof selectedGroup !== 'undefined'" />
  </div>
</template>
  
<script>
import SelectList from "@/components/SelectList.vue";
import GroupListGomponent from "@/components/GroupListComponent.vue";
import { fetchGroups, updateMemberInGroup, removeMemberFromGroup, fetchGroup } from '@/util/fetchOperations'
import GroupInfo from "@/components/GroupInfo.vue"
import MemberEditor from "@/components/MemberEditor.vue";
import { useDataStore } from "@/store/dataStore";

export default {
  name: "EditGroupView",
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
      groupData: undefined
    }
  },
  components: {
    SelectList,
    GroupListGomponent,
    GroupInfo,
    MemberEditor
  },
  methods: {
    /**
     * Isoliert Participant Array aus selectedGroup.
     * Wird zur Fehlerprävention eingesetzt.
     */
    getParticipants() {
      if (typeof this.groupData !== 'undefined') {
        return this.groupData.participants
      } else {
        return undefined
      }
    },
    /**
     * Handelt onClickOnSave Emit aus @see GroupListGomponent und @see MemberEditor 
     * Callt Fetch Methode und updatet ParticipantData im Backend
     * @param {Object} participantData 
     */
    async onClickOnSave(participantData) {
      //Update DB
      await updateMemberInGroup(this.selectedGroup.id, participantData)
      
      //Updated groupData locally damit Change instant ist
      this.groupData.participants = this.groupData.participants.map(p => {
        if(p.memberId === participantData.memberId) {
          return participantData
        } else {
          return p
        }
      }) 

      if(!this.groupData.participants.some(p => p.memberId === participantData.memberId)) {
        this.groupData.participants.push(participantData)
      }
    },
    /**
     * Handelt onClickOnDelete Emit aus @see GroupListGomponent und @see MemberEditor 
     * Callt Fetch Methode und löscht Participant aus Backend.
     * @param {Object} participantData 
     */
    async onClickOnDelete(participantData) {      
      //Update DB
      await removeMemberFromGroup(this.selectedGroup.id, participantData.memberId)
      
      //Updated groupData locally damit Change instant ist
      this.groupData.participants = this.groupData.participants.filter(p => p.memberId !== participantData.memberId)
    }
  },

  async created() {
    this.groups = await fetchGroups()
    document.title = 'Gruppe bearbeiten - Attend'
    this.dataStore.viewname = "Gruppe bearbeiten"
  },

  watch: {
    /**
     * Watcher für selectedGroup.
     * Wenn selectedGroup geändert wird, wird der Titel der Seite angepasst.
     */
    selectedGroup: async function (newVal) {
      if (typeof newVal !== 'undefined') {
        document.title = newVal.name + ' bearbeiten - Attend'
        this.groupData = await fetchGroup(newVal.id)
      }
    }
  }
}
</script>