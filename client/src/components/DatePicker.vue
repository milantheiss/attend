<template>
  <div class="flex justify-between items-center">
    <button @click="getLastDate"
      class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 drop-shadow-md rounded-lg p-2 md:p-2.5">
      <!--Left Chevron Icon-->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.0" stroke="currentColor"
        class="w-6 md:w-7 h-6 md:h-7 text-white">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
      </svg>
    </button>
    <DateInput class="text-2xl md:text-3xl font-medium text-center mx-4 md:mx-12" v-model="date"
      :max="getFormattedDate(new Date(Date.now()))"></DateInput>
    <button @click="getNextDate"
      class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 drop-shadow-md rounded-lg p-2 md:p-2.5">
      <!--Right Chevron Icon-->
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3.0" stroke="currentColor"
        class="w-6 md:w-7 h-6 md:h-7 text-white">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
      </svg>
    </button>
  </div>
</template>

<script>
import { getDateOfTraining, isClosestTrainingToday } from "@/util/formatter";
import { runGarbageCollector } from '@/util/fetchOperations'
import DateInput from "./DateInput.vue";

export default {
  name: "DatePicker",
  props: {
    modelValue: Date,
  },
  emits: ["update:modelValue", "onChange", "on"],
  data() {
    return {
      date: this.getFormattedDate(new Date(Date.now())),
      weekdays: undefined
    };
  },
  methods: {
    newGroupSelected() {
      if (typeof this.weekdays !== "undefined") {
        if (typeof this.$store.state.attendancelist.selectedGroupID !== "undefined") {
          runGarbageCollector(this.$store.state.attendancelist.selectedGroupID, new Date(this.date));
        }
        if (isClosestTrainingToday(this.weekdays)) {
          this.date = undefined
          this.date = this.getFormattedDate(new Date(Date.now()));
        }
        else {
          this.getLastDate();
        }
      }
    },
    getNextDate() {
      if (typeof this.weekdays !== "undefined") {
        if (getDateOfTraining(this.date, this.weekdays, true) <= Date.now()) {
          if (typeof this.$store.state.attendancelist.selectedGroupID !== "undefined") {
            runGarbageCollector(this.$store.state.attendancelist.selectedGroupID, new Date(this.date));
          }
          this.date = this.getFormattedDate(getDateOfTraining(this.date, this.weekdays, true));

        }
      }
    },
    getLastDate() {
      if (typeof this.weekdays !== "undefined") {
        if (typeof this.$store.state.attendancelist.selectedGroupID !== "undefined") {
          runGarbageCollector(this.$store.state.attendancelist.selectedGroupID, new Date(this.date));
        }
        this.date = this.getFormattedDate(getDateOfTraining(this.date, this.weekdays, false));
      }
    },
    getFormattedDate(date) {
      return date.toJSON().slice(0, 10)
    }
  },
  components: { DateInput },
  watch: {
    date(newVal) {
      if(typeof newVal !== 'undefined'){
        this.$emit("update:modelValue", new Date(newVal));
        this.$emit("onChange");
      }
    }
  }
}
</script>

<style scoped>

</style>
