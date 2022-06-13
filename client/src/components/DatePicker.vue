<template>
  <Button @btn-click="getLastDate" text="<" color="blue"></Button>
  <p>{{ formatedDateString }}</p>
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
        console.log(this.weekdays)
        this.date = getDateOfTraining(this.date, this.weekdays, true)
        this.formatedDateString = getFormatedDateString(this.date)
      }
    },
    getLastDate() {
      if (this.weekdays[0] !== ' ') {
        this.date = getDateOfTraining(this.date, this.weekdays, false)
        this.formatedDateString = getFormatedDateString(this.date)
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
