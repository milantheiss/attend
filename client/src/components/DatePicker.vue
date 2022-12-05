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
      :max="getFormattedDate(new Date())"></DateInput>
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
import DateInput from "./DateInput.vue";
import { useDataStore } from "@/store/dataStore";

export default {
  name: "DatePicker",
  setup() {
    const dataStore = useDataStore()
    return {
      dataStore
    }
  },
  props: {
    modelValue: Date,
  },
  emits: ["update:modelValue", "onChange", "on"],
  data() {
    return {
      date: this.getFormattedDate(new Date()),
      weekdays: undefined
    };
  },
  methods: {
    newGroupSelected() {
      if (typeof this.weekdays !== "undefined") {
        if (isClosestTrainingToday(this.weekdays)) {
          this._updateDate(this.getFormattedDate(new Date()));
        }
        else {
          this.date = new Date()
          this._updateDate(this.getLastDate());
        }
      }
    },
    getNextDate() {
      if (typeof this.weekdays !== "undefined") {
        //Blockt Button, sodass kein Training in der Zukunft ausgewählt werden kann.
        if (getDateOfTraining(this.date, this.weekdays, true) <= Date.now()) {
          this._updateDate(this.getFormattedDate(getDateOfTraining(this.date, this.weekdays, true)));
        }
      }
    },
    getLastDate() {
      if (typeof this.weekdays !== "undefined") {
        return this.getFormattedDate(getDateOfTraining(this.date, this.weekdays, false));
      }
    },
    getFormattedDate(date) {
      return date.toJSON().slice(0, 10)
    },
    _updateDate(date) {
      this.date = date
      this.$emit("update:modelValue", new Date(date));
      this.$emit("onChange");
    }
  },
  components: { DateInput }
}
</script>

<style scoped>

</style>
