<template>
  <div @click="onClick"
    :class="this.activated ? 'text-white bg-gradient-to-tl from-dimmed-gradient-2 to-dimmed-gradient-1' : 'text-black bg-gradient-to-tr from-unchecked-gradient-1 to-unchecked-gradient-2'"
    class="px-3.5 md:px-7 py-4 rounded-xl drop-shadow font-medium text-xl hover:cursor-pointer select-none ">
    <span class="flex items-center justify-between">
      <h3 class="w-full">{{ participant.lastname }}, {{ participant.firstname }}</h3>
      <!--Checkmark Icon-->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
        class="w-8 h-8" v-show="activated">
        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      <!--Rect Icon-->
      <div v-show="!activated" class="min-w-[32px] min-h-[32px] border-[3px] border-light-gray rounded-xl"></div>
    </span>
  </div>
</template> 

<script>
export default {
  name: "AttendanceListCard",
  data() {
    return {
      activated: Boolean
    }
  },
  props: {
    participant: Object,
  },
  methods: {
    onClick() {
      this.activated = !this.activated
      this.$emit('onAttendedChange', this.participant.memberId, this.activated)
    },
  },
  watch: {
    participant: function (newVal) {
      this.activated = newVal.attended
    }
  },
  created() {
    this.activated = this.participant.attended
  }
};
</script>

<style scoped></style>
