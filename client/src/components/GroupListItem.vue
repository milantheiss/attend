<template>
  <div @click="onClickOnEdit"
    class="pl-3.5 rounded-lg mt-3 mb-3 drop-shadow-md font-normal text-xl text-black bg-gradient-to-r from-gray-100 to-background-greywhite" v-show="!showEditPanel">
    <span class="flex items-center justify-between">
      <!--<h3>{{ participant.lastname }}, {{ participant.firstname }}</h3>-->
      <h3>Mustermann, Max</h3>
      <img :src="'./img/pen-icon.svg'" alt="pen icon" class="w-1.5 rotate-45 mr-6 py-1.5">
    </span>
  </div>
  <div class="bg-white px-3 py-1.5 mt-3 mb-3 rounded-lg drop-shadow-md" v-show="showEditPanel">
    <div class="flex items-center justify-between mb-4 mt-3">
      <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full mx-3 text-base md:text-lg" type="text"
        name="firstname" v-model="temp.firstname" :placeholder="temp.firstname" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full mx-3 text-base md:text-lg" type="text"
        name="firstname" v-model="temp.lastname" :placeholder="temp.lastname" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <label for="birthday" class="text-gray-700 font-light text-base md:text-lg ml-3">Geburtstag:</label>
      <input type="date" v-model="temp.birthday" name="enddate"
        class="border-b-2 border-gray-300 text-black mx-3 font-medium text-base md:text-lg" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <label for="birthday" class="text-gray-700 font-light text-base md:text-lg ml-3">Erstes Training:</label>
      <input type="date" v-model="temp.firsttraining" name="enddate"
        class="border-b-2 border-gray-300 text-black mx-3 font-medium text-base md:text-lg" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <button @click="onClickOnDelete"
      class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-1 md:py-1.5 rounded-lg drop-shadow-md">
      <p class="font-medium font-base md:text-lg">Entfernen</p>
      </button>

      <button @click="onClickOnSave"
        class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-1 md:py-1.5 rounded-lg drop-shadow-md">
        <p class="font-medium font-base md:text-lg">Speichern</p>
      </button>
    </div>
    
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
    onClickOnEdit() {
      this.showEditPanel = true
      this.$emit('onClick', this.participant._id)
    },
    onClickOnSave() {
      this.showEditPanel = false
      this.$emit('onClick', this.participant._id)
    },
    onClickOnDelete() {
      this.showEditPanel = false
      this.$emit('onClick', this.participant._id)
    }
  }
};
</script>
  
<style scoped>

</style>
  