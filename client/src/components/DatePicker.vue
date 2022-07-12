<template>
  <div class="grid grid-cols-6">
    <button @click="getLastDate"
      class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 drop-shadow-md rounded-lg w-9 md:w-10 h-9 md:h-10 min-w-fit min-h-fit ">
      <img :src="'./img/arrow-left.svg'" alt="arrow left" class="w-3 mx-auto my-auto">
    </button>
    <p class="col-start-2 col-end-6 col-span-3 text-base md:text-2xl font-medium text-center mx-2">{{ formatedDateString
    }}</p>
    <button @click="getNextDate"
      class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 drop-shadow-md rounded-lg w-9 md:w-10 h-9 md:h-10 min-w-fit min-h-fit">
      <img :src="'./img/arrow-right.svg'" alt="arrow right" class="w-3 mx-auto my-auto">
    </button>
  </div>

</template>

<script>
import { getDateOfTraining, getFormatedDateString, isClosestTrainingToday } from "@/util/formatter";
import { runGarbageCollector } from '@/util/fetchOperations'

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
      weekdays: undefined
    }
  },
  methods: {
    newGroupSelected() {
      if (typeof this.weekdays !== 'undefined') {
        if (typeof this.$store.state.attendancelist.selectedGroupID !== 'undefined') {
          runGarbageCollector(this.$store.state.attendancelist.selectedGroupID, this.date)
        }
        this.date = new Date(Date.now())
        if (isClosestTrainingToday(this.weekdays)) {
          this.formatedDateString = getFormatedDateString(this.date)
          this.$emit('update:modelValue', this.date)
          this.$emit('onChange')
        } else {
          this.getLastDate()
        }
      }
    },
    getNextDate() {
      if (typeof this.weekdays !== 'undefined') {
        if (typeof this.$store.state.attendancelist.selectedGroupID !== 'undefined') {
          runGarbageCollector(this.$store.state.attendancelist.selectedGroupID, this.date)
        }
        this.date = getDateOfTraining(this.date, this.weekdays, true)
        this.formatedDateString = getFormatedDateString(this.date)
        this.$emit('update:modelValue', this.date)
        this.$emit('onChange')
        console.log(this.date)
      }
    },
    getLastDate() {
      if (typeof this.weekdays !== 'undefined') {
        if (typeof this.$store.state.attendancelist.selectedGroupID !== 'undefined') {
          runGarbageCollector(this.$store.state.attendancelist.selectedGroupID, this.date)
        }
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
