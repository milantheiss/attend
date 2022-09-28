<template>
  <div @click="showEditPanel = true"
    class="pl-3.5 rounded-lg mt-3 mb-3 drop-shadow-md font-normal text-xl text-black bg-gradient-to-r from-gray-100 to-background-greywhite"
    v-show="!showEditPanel">
    <span class="flex items-center justify-between">
      <h3>{{ participantData.lastname }}, {{ participantData.firstname }}</h3>
      <img :src="'./img/pen-icon.svg'" alt="pen icon" class="w-1.5 rotate-45 mr-6 py-1.5">
    </span>
  </div>
  <MemberEditor :participant="participantData" :createsNewMember="false" v-show="showEditPanel" @onClickOnSave="(participantData) => onClickOnSave(participantData)" @onClickOnDelete="(participantData) => onClickOnDelete(participantData)"/>
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
  