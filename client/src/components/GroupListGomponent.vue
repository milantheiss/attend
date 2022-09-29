<template>
    <GroupListItem v-for="participant in this.participantArr" :key="participant._id" :participant="participant"
      @onClickOnSave="(participantData) => $emit('onClickOnSave', participantData)" @onClickOnDelete="(participantData) => $emit('onClickOnDelete', participantData)"/>
    <span class="grid content-center mt-6">
      <p v-show="participantArr.length === 0"
        class="text-xl justify-self-center md:text-2xl font-normal text-gray-400 mx-auto">Bitte wähle eine Gruppe</p>
    </span>
  </template>
  
  <script>
  import GroupListItem from "@/components/GroupListItem";
  
  export default {
    name: "GroupListGomponent",
    data() {
      return {
        participantArr: []
      }
    },
    props: {
      participants: Array,
      sortByFirstName: {
        type: Boolean,
        default: false
      },
      sortByLastName: {
        type: Boolean,
        default: true
      }
    },
    components: {
    GroupListItem
},
    methods: {
      sortParticipants(list) {
        if (this.sortByFirstName) {
          list.sort((a, b) => a.firstname.localeCompare(b.firstname))
        } else if (this.sortByLastName) {
          list.sort((a, b) => a.lastname.localeCompare(b.lastname))
        }
  
        return list
      }
  
    },
    watch: {
      participants(newVal) {
        this.participantArr = this.sortParticipants(newVal)
      }
    },
    created() {
      if (typeof this.participants !== 'undefined') {
        this.participantArr = this.sortParticipants(this.participants)
      }
    }
  };
  </script>