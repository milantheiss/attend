<template>
  <div @click="showEditPanel = true"
    class="px-3.5 rounded-lg mt-3 mb-3 drop-shadow-md font-normal text-xl text-black bg-gradient-to-r from-gray-200 to-background-greywhite"
    v-show="!showEditPanel">
    <span class="flex items-center justify-between">
      <h3>{{ participantData.lastname }}, {{ participantData.firstname }}</h3>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
        class="w-7 rotate-4 py-2 text-black">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
      </svg>
    </span>
  </div>
  <MemberEditor :participant="participantData" :createsNewMember="false" v-show="showEditPanel"
    @onClickOnSave="(participantData) => onClickOnSave(participantData)"
    @onClickOnDelete="(participantData) => onClickOnDelete(participantData)" />
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
      showEditPanel: false,
      participantData: {}
    }
  },
  props: {
    participant: Object,
  },
  methods: {
    onClickOnSave() {
      this.showEditPanel = false
      this.$emit('onClickOnSave', this.participantData)
    },
    onClickOnDelete() {
      this.showEditPanel = false
      this.$emit('onClickOnDelete', this.participantData)
    }
  },
  watch: {
    participant(newVal) {
      this.participantData = newVal
      this.participantData.birthday = newVal.birthday.slice(0, 10)
    }
  },

  created() {
    if (typeof this.participant !== 'undefined') {
      this.participantData = this.participant
      this.participantData.birthday = this.participant.birthday.slice(0, 10)
    }
  }
};
</script>
  
<style scoped>

</style>
  