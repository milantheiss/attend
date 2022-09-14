<template>
    <div class="bg-white px-5 py-4 rounded-lg drop-shadow-md" v-show="showInput">
        <div class="flex items-center justify-between mb-6 mt-2">
            <label for="filename" class="text-gray-700 font-light text-base md:text-lg">Vorname:</label>
            <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full ml-3 text-base md:text-lg" type="text"
                name="filename" v-model="firstname" placeholder="Vorname" />
        </div>
        <div class="flex items-center justify-between mb-4">
            <label for="filename" class="text-gray-700 font-light text-base md:text-lg">Nachname:</label>
            <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full ml-3 text-base md:text-lg" type="text"
                name="filename" v-model="lastname" placeholder="Nachname" />
        </div>
        <button @click="addParticipant()"  class="flex items-center mx-auto mt-8 mb-2 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-8 md:px-9 py-1.5 md:py-2 rounded-lg drop-shadow-md">
            <p class="font-medium font-base md:text-lg">Hinzufügen</p>
        </button>
    </div>
    <button @click="this.showInput = !this.showInput"
        class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-8 md:px-9 py-1.5 md:py-2 rounded-lg drop-shadow-md" v-show="!showInput">
        <p class="font-medium font-base md:text-lg">Neuer Teilnehmer</p>
    </button>
</template>
  
<script>
export default {
    name: "AddTeilnehmer",
    data() {
        return {
            firstname: "",
            lastname: "",
            showInput: false
        }
    },
    props: {
    },
    methods: {
        addParticipant(){
            this.showInput = !this.showInput
        }
    }
};
</script>