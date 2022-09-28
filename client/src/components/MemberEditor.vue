<template>
    <div class="bg-white px-3 py-1.5 mt-3 mb-3 rounded-lg drop-shadow-md">
        <div class="flex items-center justify-between mb-4 mt-3">
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
                class="border-b-2 border-gray-300 text-black mx-3 font-medium text-base md:text-lg" />
        </div>

        <div class="flex items-center justify-between mb-3">
            <label for="firsttraining" class="text-gray-700 font-light text-base md:text-lg ml-3">Erstes
                Training:</label>
            <input type="date" v-model="participantData.firsttraining" name="firsttraining"
                class="border-b-2 border-gray-300 text-black mx-3 font-medium text-base md:text-lg" />
        </div>

        <div class="flex items-center justify-between mb-4" v-if="!createsNewMember">
            <button @click="onClickOnDelete()"
                class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-1 md:py-1.5 rounded-lg drop-shadow-md">
                <p class="font-medium font-base md:text-lg">Entfernen</p>
            </button>

            <button @click="onClickOnSave()"
                class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-1 md:py-1.5 rounded-lg drop-shadow-md">
                <p class="font-medium font-base md:text-lg">Speichern</p>
            </button>
        </div>

        <div class="flex items-right justify-between mb-4" v-if="createsNewMember">
            <button @click="onClickOnCreate()"
                class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-1 md:py-1.5 rounded-lg drop-shadow-md">
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
            participantData: {}
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
            this.$emit('onClickOnSave', this.participantData)
        },
        async onClickOnDelete() {
            this.$emit('onClickOnDelete', this.participantData)
        },
        async onClickOnCreate() {
            this.$emit('onClickOnCreate', this.participantData)
            this.participantData = {
                firstname: "",
                lastname: "",
                birthday: "",
                firsttraining: (new Date(Date.now()).toJSON()).slice(0, 10)
            }
        },
        formateParticipant(newVal) {
            this.participantData = newVal
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