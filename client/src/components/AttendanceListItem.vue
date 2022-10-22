<template>
  <div @click="onClick"
    :class="this.activated ? 'text-white bg-gradient-to-br from-dimmed-gradient-1 to-dimmed-gradient-2':'text-black bg-gradient-to-br from-unchecked-gradient-1 to-unchecked-gradient-2'"
    class="pl-3.5 py-2 rounded-lg drop-shadow mb-3 font-normal text-xl">
    <span class="flex items-center justify-between">
      <h3>{{ participant.lastname }}, {{ participant.firstname }}</h3>
      <span class="self-center w-6 mr-3">
        <!--Checkmark Icon-->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 73.031 55.976" class="text-white" v-show="activated">
          <path fill="none" stroke="currentColor" stroke-width="9.973" d="M69.465 3.486 25.048 48.925 3.486 27.847" />
        </svg>
        <!--Checkbox Icon-->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.851 80.851" v-show="!activated" class="text-dark-grey">
          <path fill="none" stroke="currentColor" stroke-width="7.5"
            d="M28.885 3.75h23.08a25.135 25.135 0 0 1 25.136 25.135v23.08a25.135 25.135 0 0 1-25.136 25.136h-23.08A25.135 25.135 0 0 1 3.75 51.966v-23.08A25.135 25.135 0 0 1 28.885 3.75z" />
        </svg>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: "AttendanceListItem",
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
      this.$emit('onAttendedChange', this.participant._id, this.activated)
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

<style scoped>

</style>
