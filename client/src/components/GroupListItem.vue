<template>
  <div
    class="pl-3.5 rounded-lg mt-3 mb-3 font-normal text-xl text-black bg-gradient-to-r from-gray-100 to-background-graywhite">
    <span class="flex items-center justify-between">
      <!--<h3>{{ participant.lastname }}, {{ participant.firstname }}</h3>-->
      <h3>Mustermann, Max</h3>
      <button @click="onClickToEdit"
        class="flex items-center my-1 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 w-11 h-11 rounded-lg drop-shadow-md">
        <img :src="'./img/pen-icon.svg'" alt="pen icon" class="w-1.5 rotate-45 mx-auto">
      </button>
    </span>
  </div>
  <div class="bg-white px-3 py-1.5 rounded-lg drop-shadow-md">
    <div class="flex items-center justify-between mb-4">
      <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full ml-3 text-base md:text-lg" type="text"
        name="firstname" v-model="temp.firstname" :placeholder="temp.firstname" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full ml-3 text-base md:text-lg" type="text"
        name="firstname" v-model="temp.lastname" :placeholder="temp.lastname" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <label for="birthday" class="text-gray-700 font-light text-base md:text-lg">Geburtstag:</label>
      <input type="date" v-model="temp.birthday" name="enddate"
        class="border-b-2 border-gray-300 text-black ml-3 font-medium text-base md:text-lg" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <label for="birthday" class="text-gray-700 font-light text-base md:text-lg">Erstes Training:</label>
      <input type="date" v-model="temp.firsttraining" name="enddate"
        class="border-b-2 border-gray-300 text-black ml-3 font-medium text-base md:text-lg" />
    </div>

    <button @click="exportPDF"
      class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-8 md:px-9 py-1.5 md:py-2 rounded-lg drop-shadow-md">
      <p class="font-medium font-base md:text-lg">Exportieren</p>
    </button>
  </div>
</template>
  
<script>
export default {
  name: "GroupListItem",
  data() {
    return {
      showEditPanel: false,
      temp: {
        firstname: 'Max',
        lastname: 'Mustermann',
        birthday: new Date("2012-09-21").toJSON().slice(0, 10),
        firsttraining: new Date("2021-11-31").toJSON().slice(0, 10)
      }
    }
  },
  props: {
    //participant: Object,
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
  