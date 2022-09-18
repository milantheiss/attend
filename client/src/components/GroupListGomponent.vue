<template>
    <GroupListItem v-for="participant in this.participantArr" :key="participant._id" :participant="participant"
      @onAttendedChange="(id, bool) => $emit('onClick', id, bool)" />
    <span class="grid content-center mt-6">
      <p v-show="participantArr.length === 0"
        class="text-xl justify-self-center md:text-2xl font-normal text-gray-400 ml-3.5 ">Bitte wähle eine Gruppe</p>
    </span>
  </template>
  
  <script>
  import GroupListItem from "@/components/GroupListItem";
  
  export default {
    name: "GroupListComponent",
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
        default: false
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