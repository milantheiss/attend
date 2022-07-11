<template>
  <div @click="onClick"
       :class="this.activated ? 'text-white bg-gradient-to-br from-dimmed-gradient-1 to-dimmed-gradient-2':'text-black bg-gradient-to-br from-unchecked-gradient-1 to-unchecked-gradient-2'"
       class="pl-3.5 py-2 rounded-lg drop-shadow mb-3 font-normal text-xl">
    <span class="flex items-center justify-between">
      <h3>{{ participant.firstname }} {{ participant.lastname }}</h3>
      <span class="self-center w-6 mr-3">
            <img :src="'./img/checkmark.svg'" alt="checkmark icon" v-show="activated">
            <img :src="'./img/checkbox.svg'" alt="checkbox icon" v-show="!activated">
      </span>
    </span>
  </div>
</template>

<script>
export default {
  name: "TeilnehmerItem",
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
