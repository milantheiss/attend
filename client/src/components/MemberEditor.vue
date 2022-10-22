<template>
    <div class="bg-white px-3 py-1.5 mt-3 mb-3 rounded-lg drop-shadow-md">
        <div class="grid place-items-end mt-1 mr-1" v-if="!createsNewMember">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-8 text-black" @click="onClickOnClose()">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>

        <div class="flex items-center justify-between mb-4">
            <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full mx-3 text-base md:text-lg" type="text"
                name="firstname" v-model="participantData.firstname" placeholder="Vorname" />
        </div>

        <div class="flex items-center justify-between mb-4">
            <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full mx-3 text-base md:text-lg" type="text"
                name="firstname" v-model="participantData.lastname" placeholder="Nachname" />
        </div>

        <div class="flex items-center justify-between mb-4">
            <label for="birthday" class="text-gray-700 font-light text-base md:text-lg ml-3">Geburtstag:</label>
            <input type="date" v-model="participantData.birthday" name="birthday"
                :max="(new Date(Date.now()).toJSON()).slice(0, 10)"
                class="border-b-2 border-gray-300 text-black mx-3 font-medium text-base md:text-lg" />
        </div>

        <div class="flex items-center justify-between mb-4">
            <label for="firsttraining" class="text-gray-700 font-light text-base md:text-lg ml-3">Erstes
                Training:</label>
            <input type="date" v-model="participantData.firsttraining" name="firsttraining"
                class="border-b-2 border-gray-300 text-black mx-3 font-medium text-base md:text-lg" />
        </div>

        <div class="flex justify-left items-center ml-3 my-6" v-show="error.show">
            <!--Error Panel-->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                stroke="currentColor" class="w-6.5 mr-2 text-red-600">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p class="font-semibold text-red-600">{{error.text}}</p>
        </div>

        <div class="flex items-center justify-between mb-4 mt-6" v-if="!createsNewMember">
            <button @click="onClickOnDelete()"
                class="flex items-center mx-auto text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-1 md:py-1.5 rounded-lg drop-shadow-md">
                <p class="font-medium font-base md:text-lg">Entfernen</p>
            </button>

            <button @click="onClickOnSave()"
                class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-1 md:py-1.5 rounded-lg drop-shadow-md">
                <p class="font-medium font-base md:text-lg">Speichern</p>
            </button>
        </div>


        <div class="flex justify-center items-center mb-4 mt-6" v-if="createsNewMember">
            <button @click="onClickOnCreate()"
                class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-1 md:py-1.5 rounded-lg drop-shadow-md">
                <p class="font-medium font-base md:text-lg">Hinzufügen</p>
            </button>
        </div>

    </div>
</template>
  
<script>
export default {
    name: "MemberEditor",
    data() {
        return {
            participantData: {},
            error: {
                text: "Fehler",
                show: false
            }
        }
    },
    props: {
        createsNewMember: Boolean,
        participant: {
            type: Object,
            required: false,
            default() {
                return {
                    firstname: "",
                    lastname: "",
                    birthday: "",
                    firsttraining: (new Date(Date.now()).toJSON()).slice(0, 10)
                }
            }
        }
    },
    
    methods: {
        async onClickOnSave() {
            if (!this.hasAnError()) {
                this.$emit('onClickOnSave', this.participantData)
            }
        },
        async onClickOnDelete() {
            this.$emit('onClickOnDelete', this.participantData)
        },
        async onClickOnCreate() {
            if (!this.hasAnError()) {
                this.$emit('onClickOnCreate', this.participantData)
                this.participantData = {
                    firstname: "",
                    lastname: "",
                    birthday: "",
                    firsttraining: (new Date(Date.now()).toJSON()).slice(0, 10)
                }
            }
        },
        async onClickOnClose() {
            this.formateParticipant(this.participant)
            this.$emit('onClickOnClose')
        },
        formateParticipant(newVal) {
            console.log('übertragen?')
            this.participantData.firstname = newVal.firstname
            this.participantData.lastname = newVal.lastname
            try {
                this.participantData.birthday = newVal.birthday.slice(0, 10)
            } catch {
                console.error("Unable to slice date string of 'participant.birthday'")
            }
            try {
                this.participantData.firsttraining = (new Date(newVal.firsttraining).toJSON()).slice(0, 10)
            } catch {
                console.error("Unable to slice date string of 'participant.firsttraining'")
            }
        },
        hasAnError() {
            if (typeof this.participantData.firstname !== 'string' || this.participantData.firstname.trim().length === 0) {
                this.error.text = "Fehler: Es wurde kein Vorname angegeben"
                this.error.show = true
                return true
            } else if (typeof this.participantData.lastname !== 'string' || this.participantData.lastname.trim().length === 0) {
                this.error.text = "Fehler: Es wurde kein Nachnamen angegeben"
                this.error.show = true
                return true
            } else if (typeof this.participantData.birthday !== 'string' || this.participantData.birthday.trim().length === 0) {
                this.error.text = "Fehler: Es wurde kein Geburtstag angegeben"
                this.error.show = true
                return true
            } else if (typeof this.participantData.firsttraining !== 'string' || this.participantData.firsttraining.trim().length === 0) {
                this.error.text = "Fehler: Datum des ersten Trainings fehlt."
                this.error.show = true
                return true
            } else {
                this.error.text = "Fehler"
                this.error.show = false
                return false
            }
        }
    },
    watch: {
        participant(newVal) {
            this.formateParticipant(newVal)
        }
    },
    created() {
        if (typeof this.participant !== 'undefined') {
            this.formateParticipant(this.participant)
        }
    }
};
</script>