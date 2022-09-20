<template>
  <div class="relative container mx-auto p-6 md:max-w-medium-width">
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
        <p class="text-base md:text-lg text-right" v-if="typeof selectedGroup !== 'undefined'">
          {{ selectedGroup.department.name }}</p>
      </div>
    </div>

      <!--
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
    -->
    </div>
    <GroupListGomponent></GroupListGomponent>
  </div>
</template>
  
<script>
import SelectList from "@/components/SelectList";
import GroupListGomponent from "@/components/GroupListGomponent.vue";
import { fetchGroups, fetchGroup } from '@/util/fetchOperations'

export default {
  name: "EditGroupView",
  data() {
    return {
      groups: [],
      selectedGroup: undefined,
    }
  },
  components: {
    SelectList,
    GroupListGomponent
  },

  methods: {
    async updateSelectedGroup(groupID) {
      this.selectedGroup = await fetchGroup(groupID)
    }
  },
  async created() {
    this.groups = await fetchGroups()
    document.title = 'Gruppe bearbeiten - Attend'
    this.$store.commit("setViewname", "Gruppe bearbeiten")
  }
}
</script>
