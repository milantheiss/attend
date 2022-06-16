<template>
  <div class="grid grid-cols-6">
    <button @click="getLastDate" class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 drop-shadow-md rounded-lg w-9 md:w-10 h-9 md:h-10 min-w-fit min-h-fit ">
      <img :src="'./img/arrow-left.svg'" alt="arrow left" class="w-3 mx-auto my-auto">
    </button>
    <p class="col-start-2 col-end-6 col-span-3 text-lg md:text-2xl font-medium text-center">{{ formatedDateString }}</p>
    <button @click="getNextDate" class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 drop-shadow-md rounded-lg w-9 md:w-10 h-9 md:h-10 min-w-fit min-h-fit">
      <img :src="'./img/arrow-right.svg'" alt="arrow right" class="w-3 mx-auto my-auto">
    </button>
  </div>

</template>

<script>
import {getDateOfTraining, getFormatedDateString} from "@/util/formatter";

export default {
  name: "DatePicker",
  props: {
    modelValue: Date,
  },
  emits: ['update:modelValue', 'onChange'],
  data() {
    return {
      date: new Date(Date.now()),
      formatedDateString: String,
      weekdays: Array
    }
  },
  methods: {
    newGroupSelected(){
      this.date = new Date(Date.now())
      this.getLastDate()
    },
    getNextDate() {
      if (this.weekdays[0] !== ' ' && this.weekdays.length !== 0) {
        this.date = getDateOfTraining(this.date, this.weekdays, true)
        this.formatedDateString = getFormatedDateString(this.date)
        this.$emit('update:modelValue', this.date)
        this.$emit('onChange')
      }
    },
    getLastDate() {
      if (this.weekdays[0] !== ' ' && this.weekdays.length !== 0) {
        this.date = getDateOfTraining(this.date, this.weekdays, false)
        this.formatedDateString = getFormatedDateString(this.date)
        this.$emit('update:modelValue', this.date)
        this.$emit('onChange')
      }
    }
  },
  created() {
    this.formatedDateString = getFormatedDateString(this.date)
  }
}
</script>

<style scoped>

</style>
