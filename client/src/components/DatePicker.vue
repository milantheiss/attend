<template>
  <Button @btn-click="getLastDate" text="<"></Button>
  <p class="text-3xl text-pink-500 font-bold">{{ formatedDateString }}</p>
  <Button @btn-click="getNextDate" text=">"></Button>
</template>

<script>
import Button from "@/components/Button";
import {getDateOfTraining, getFormatedDateString} from "@/util/formatter";

export default {
  name: "DatePicker",
  components: {
    Button
  },
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
