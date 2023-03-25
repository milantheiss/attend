<template>
  <GroupListItem v-for="participant in this.participantArr" :key="participant.memberId" :participant="participant"
    @onClickOnSave="(participantData) => $emit('onClickOnSave', participantData)"
    @onClickOnDelete="(participantData) => $emit('onClickOnDelete', participantData)" />
    <p v-show="participantArr.length === 0"
    class="text-xl md:text-2xl font-normal text-gray-400 mx-auto">Liste ist leer</p>
</template>
  
<script>
import GroupListItem from "@/components/GroupListCard.vue";

export default {
  name: "GroupListComponent",
  data() {
    return {
      participantArr: Array
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
  emits: ['onClickOnSave', 'onClickOnDelete'],
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