<template>
  <div @click="showEditPanel = true"
    class="pl-3.5 rounded-lg mt-3 mb-3 drop-shadow-md font-normal text-xl text-black bg-gradient-to-r from-gray-100 to-background-greywhite"
    v-show="!showEditPanel">
    <span class="flex items-center justify-between">
      <h3>{{ temp.lastname }}, {{ temp.firstname }}</h3>
      <img :src="'./img/pen-icon.svg'" alt="pen icon" class="w-1.5 rotate-45 mr-6 py-1.5">
    </span>
  </div>
  <div class="bg-white px-3 py-1.5 mt-3 mb-3 rounded-lg drop-shadow-md" v-if="showEditPanel">
    <div class="flex items-center justify-between mb-4 mt-3">
      <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full mx-3 text-base md:text-lg" type="text"
        name="firstname" v-model="temp.firstname" :placeholder="temp.firstname" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full mx-3 text-base md:text-lg" type="text"
        name="firstname" v-model="temp.lastname" :placeholder="participant.lastname" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <label for="birthday" class="text-gray-700 font-light text-base md:text-lg ml-3">Geburtstag:</label>
      <input type="date" v-model="temp.birthday" name="birthday"
        class="border-b-2 border-gray-300 text-black mx-3 font-medium text-base md:text-lg" />
    </div>

    <div class="flex items-center justify-between mb-4">
      <label for="firsttraining" class="text-gray-700 font-light text-base md:text-lg ml-3">Erstes Training:</label>
      <input type="date" v-model="temp.firsttraining" name="firsttraining"
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
      temp: {}
    }
  },
  props: {
    participant: Object,
  },
  methods: {
    onClickOnSave() {
      this.showEditPanel = false
      this.$emit('onClickOnSave', this.temp)
    },
    onClickOnDelete() {
      this.showEditPanel = false
      this.$emit('onClickOnDelete', this.temp)
    }
  },
  watch: {
    participant(newVal) {
      this.temp = newVal
      this.temp.birthday = newVal.birthday.slice(0, 10)
    }
  },
  
  created() {
    if (typeof this.participant !== 'undefined') {
      this.temp = this.participant
      this.temp.birthday = this.participant.birthday.slice(0, 10)
    }
  }
};
</script>
  
<style scoped>

</style>
  