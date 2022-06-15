<template>
  <Button @btn-click="getLastDate" text="<" color="blue"></Button>
  <p v-on:change="updateValue($event.target.date)">{{ formatedDateString }}</p>
  <Button @btn-click="getNextDate" text=">" color="blue"></Button>
</template>

<script>
import Button from "@/components/Button";
import {getDateOfTraining, getFormatedDateString} from "@/util/weekday-processor";

export default {
  name: "DatePicker",
  components: {
    Button
  },
  props: {
    weekdays: {
      type: Array,
      required: true,
    }
  },
  data() {
    return {
      date: new Date(Date.now()),
      formatedDateString: String
    }
  },
  methods: {
    getNextDate() {
      if (this.weekdays[0] !== ' ') {
        this.date = getDateOfTraining(this.date, this.weekdays, true)
        this.formatedDateString = getFormatedDateString(this.date)
        this.$emit('dateChanged', this.date)
      }
    },
    getLastDate() {
      if (this.weekdays[0] !== ' ') {
        this.date = getDateOfTraining(this.date, this.weekdays, false)
        this.formatedDateString = getFormatedDateString(this.date)
      }
    },
    updateValue (value) {
      this.$emit('change', value)
    }
  },
  created() {
    this.formatedDateString = getFormatedDateString(this.date)
  }
}
</script>

<style scoped>

</style>
