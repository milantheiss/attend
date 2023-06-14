<template>
  <div class="flex flex-col gap-4">
    <AttendanceListItem v-for="participant in this.participantArr" :key="participant.memberId" :participant="participant"
      @onAttendedChange="(id, bool) => $emit('onAttendanceChange', id, bool)" />
    <span class="flex justify-center items-center w-full">
      <p v-show="participantArr.length === 0" class="text-xl md:text-2xl font-medium text-light-gray mx-auto">Liste ist leer
      </p>
    </span>
  </div>
</template>

<script>
import AttendanceListItem from "@/components/AttendanceListCard.vue";

export default {
  name: "AttendanceListComponent",
  data() {
    return {
      participantArr: Object
    }
  },
  emits: ['onAttendanceChange'],
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
    AttendanceListItem
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