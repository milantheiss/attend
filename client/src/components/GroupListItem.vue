<template>
  <!--pl-3.5 py-2 rounded-lg drop-shadow mb-3 font-normal text-xl-->
  <span class="mb-4">
    <div @click="showEditPanel = true"
      class="px-3.5 py-3 rounded-lg drop-shadow-md font-normal text-lg md:text-xl text-black bg-gradient-to-tr from-unchecked-gradient-1 to-unchecked-gradient-2"
      v-show="!showEditPanel">
      <span class="flex items-center justify-between">
        <h3>{{ participant.lastname }}, {{ participant.firstname }}</h3>
        <!--Pen Icon-->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="w-7 rotate-4 text-black">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
      </span>
    </div>
    <MemberEditor :participant="participant" :createsNewMember="false" v-show="showEditPanel"
      @onClickOnSave="(participantData) => onClickOnSave(participantData)"
      @onClickOnDelete="(participantData) => onClickOnDelete(participantData)" @onClickOnClose="onClickOnClose()" />
  </span>
</template>
  
<script>
import MemberEditor from "@/components/MemberEditor"

export default {
  name: "GroupListItem",
  components: {
    MemberEditor
  },
  data() {
    return {
      showEditPanel: false
    }
  },
  props: {
    participant: Object,
  },
  emits: ['onClickOnSave', 'onClickOnDelete'],
  methods: {
    onClickOnSave(participantData) {
      this.showEditPanel = false
      this.$emit('onClickOnSave', participantData)
    },
    onClickOnDelete(participantData) {
      this.showEditPanel = false
      this.$emit('onClickOnDelete', participantData)
    },
    onClickOnClose() {
      this.showEditPanel = false
    }
  }
};
</script>
  
<style scoped>

</style>
  