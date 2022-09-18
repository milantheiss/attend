<template>
    <div class="pl-3.5 py-2 rounded-lg drop-shadow mb-3 font-normal text-xl text-black bg-gradient-to-br from-slate-300 to-background-gray">
      <span class="flex items-center justify-between">
        <h3>{{ participant.lastname }}, {{ participant.firstname }}</h3>
        <button @click="onClickToEdit"
            class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-8 md:px-9 py-1.5 md:py-2 rounded-lg drop-shadow-md">
            <img :src="'./img/pen-icon.svg'" alt="pen icon" class="w-6 mx-auto">
        </button>
      </span>
    </div>
  </template>
  
  <script>
  export default {
    name: "AttendanceListItem",
    data() {
      return {
        showEditPanel
      }
    },
    props: {
      participant: Object,
    },
    methods: {
      onClickToEdit() {
        this.showEditPanel = true
        this.$emit('onClick', this.participant._id)
      },
    }
  };
  </script>
  
  <style scoped>
  </style>
  