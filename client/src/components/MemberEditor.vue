<template>
    <div class="bg-white px-3 rounded-lg drop-shadow-md" :class="!createsNewMember ? 'pt-0 pb-5' : 'py-5'">
        <div class="grid place-items-end mr-1 pt-2" v-show="!createsNewMember">
            <!--Closing X Icon-->
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-9 text-black" @click="onClickOnClose()">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>

        <!--Vorname des Teilnehmers-->
        <div class="flex items-center justify-between mb-4">
            <TextInput name="firstname" v-model="participantData.firstname" placeholder="Vorname"
                :showError="error.cause.firstnameInput" class="mx-3 text-black"></TextInput>
        </div>

        <!--Nachname des Teilnehmers-->
        <div class="flex items-center justify-between mb-4">
            <TextInput name="lastname" v-model="participantData.lastname" placeholder="Nachname"
                :showError="error.cause.lastnameInput" class="mx-3 text-black"></TextInput>
        </div>

        <!--Geburtstag des Teilnehmers-->
        <div class="flex items-center justify-between mb-4">
            <label for="birthday"
                class="text-gray-700 font-normal md:font-light text-base md:text-lg ml-3 w-full">Geburtstag:</label>
            <DateInput v-model="participantData.birthday" name="birthday" :max="participantData.firsttraining"
                class="mx-3 text-black font-medium" :showError="error.cause.birthdayInput">
            </DateInput>
        </div>

        <!--Datum des ersten Trainings seit dem der Teilnehmer aufgelistet werden soll-->
        <div class="flex items-center justify-between mb-6">
            <label for="firsttraining"
                class="text-gray-700 font-normal md:font-light text-base md:text-lg ml-3 w-full">Erstes
                Training:</label>
            <DateInput v-model="participantData.firsttraining" name="firsttraining"
                :max="(new Date(Date.now()).toJSON()).slice(0, 10)" :min="participantData.birthday"
                class="mx-3 text-black font-medium" :show-error="error.cause.firsttrainingInput"></DateInput>
        </div>

        <ErrorMessage :message="error.message" :show="error.show" class="mx-3 my-6" />

        <!--Wird angezeigt, wenn ein existierender Teilnehmer bearbeitet werden soll-->
        <div class="flex items-center justify-between" v-if="!createsNewMember">
            <button @click="onClickOnDelete()"
                class="mx-auto text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-2 rounded-lg drop-shadow-md">
                <p class="font-medium text-base md:text-lg">Entfernen</p>
            </button>

            <button @click="onClickOnSave()"
                class="mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-2 rounded-lg drop-shadow-md">
                <p class="font-medium text-base md:text-lg">Speichern</p>
            </button>
        </div>

        <!--Wird angezeigt, wenn ein neuer Teilnehmer erstellt werden soll-->
        <div class="flex justify-center items-center" v-if="createsNewMember">
            <button @click="onClickOnCreate()"
                class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-3 ty:px-6 sm:px-8 md:px-9 py-2 rounded-lg drop-shadow-md">
                <p class="font-medium text-base md:text-lg">Hinzufügen</p>
            </button>
        </div>
    </div>
</template>
  
<script>
import ErrorMessage from './ErrorMessage.vue';
import TextInput from './TextInput.vue';
import DateInput from './DateInput.vue';
export default {
    name: "MemberEditor",
    data() {
        return {
            participantData: {},
            error: {
                message: "Fehler",
                show: false,
                cause: {
                    firstnameInput: false,
                    lastnameInput: false,
                    birthdayInput: false,
                    firsttrainingInput: false
                }
            }
        };
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
                };
            }
        }
    },
    methods: {
        async onClickOnSave() {
            if (!this.hasAnError()) {
                this.$emit("onClickOnSave", this.participantData);
            }
        },
        async onClickOnDelete() {
            console.log(this.participantData);
            this.$emit("onClickOnDelete", this.participantData);
        },
        async onClickOnCreate() {
            if (!this.hasAnError()) {
                this.$emit("onClickOnCreate", this.participantData);
                //Reset participantData
                this.participantData = {
                    firstname: "",
                    lastname: "",
                    birthday: "",
                    firsttraining: (new Date(Date.now()).toJSON()).slice(0, 10)
                };
            }
        },
        async onClickOnClose() {
            this.formateParticipant(this.participant);
            this.$emit("onClickOnClose");
        },
        formateParticipant(newVal) {
            // INFO Es wird jedes Attribut einzeln übertragen, da sonst nur ein Pointer zum Prop gesetzt wird. 
            // IMPORTANT Wenn neues Attribut zu ParticipantData kommt muss es hier erst übergeben werden --> Sonst ist es undefined
            this.participantData.firstname = newVal.firstname;
            this.participantData.lastname = newVal.lastname;
            this.participantData._id = newVal._id;
            try {
                this.participantData.birthday = newVal.birthday.slice(0, 10);
            }
            catch {
                console.error("Unable to slice date string of 'participant.birthday'");
            }
            try {
                this.participantData.firsttraining = (new Date(newVal.firsttraining).toJSON()).slice(0, 10);
            }
            catch {
                console.error("Unable to slice date string of 'participant.firsttraining'");
            }
        },
        /**
         * Checkt ob ein Fehler vorliegt.
         */
        hasAnError() {
            this.error.cause.firstnameInput = typeof this.participantData.firstname !== "string" || this.participantData.firstname.trim().length === 0
            this.error.cause.lastnameInput = typeof this.participantData.lastname !== "string" || this.participantData.lastname.trim().length === 0
            this.error.cause.birthdayInput = typeof this.participantData.birthday !== "string" || this.participantData.birthday.trim().length === 0
            this.error.cause.firsttrainingInput = typeof this.participantData.firsttraining !== "string" || this.participantData.firsttraining.trim().length === 0

            if (this.error.cause.firstnameInput) {
                this.error.message = "Es muss ein Vorname angegeben werden.";
                this.error.show = true;
            } else if (this.error.cause.lastnameInput) {
                this.error.message = "Es muss ein Nachname angegeben werden.";
                this.error.show = true;
            } else if (this.error.cause.birthdayInput) {
                this.error.message = "Es muss ein Geburtstag angegeben werden.";
                this.error.show = true;
            } else if (this.error.cause.firsttrainingInput) {
                this.error.message = "Es muss das Datum des ersten Trainings ausgewählt sein.";
                this.error.show = true;
            } else {
                this.error.message = "Kein Fehler";
                this.error.show = false;
            }

            if ([this.error.cause.firstnameInput, this.error.cause.lastnameInput, this.error.cause.birthdayInput, this.error.cause.firsttrainingInput].filter(x => x === true).length >= 2) {
                this.error.message = "Alle Felder müssen ausgefüllt sein."
            }

            return this.error.show
        }
    },
    watch: {
        participant(newVal) {
            this.formateParticipant(newVal);
        }
    },
    created() {
        if (typeof this.participant !== "undefined") {
            this.formateParticipant(this.participant);
        }
    },
    components: { ErrorMessage, TextInput, DateInput }
};
</script>