<template>
    <ModalDialog :show="show" :hasSubheader="false" @onClose="close">

        <template #header>
            <p class="text-xl md:text-2xl text-almost-black" v-if="type === 'edit'">Bearbeiten</p>
            <p class="text-xl md:text-2xl text-almost-black" v-if="type === 'add'">Teilnehmer hinzufügen</p>
        </template>

        <template #content>

            <!-- Wird angezeigt, wenn type=edit oder type=new & access=trainer (Trainer kann nicht auf alle Mitglieder zugreifen) -->
            <div class="flex flex-col justify-center items-center gap-4 text-almost-black"
                v-if="type === 'edit' || (type === 'add' && access === 'trainer')">

                <!--Vorname des Teilnehmers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="firstname">Vorname:</label>
                    <TextInput name="firstname" v-model="participant.firstname" placeholder="Vorname"
                        v-if="type === 'add' || type === 'edit' && access === 'staff'"
                        :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
                    <p class="font-medium" v-if="type === 'edit' && access === 'trainer'">{{ participant.firstname }}</p>
                </div>

                <!--Nachname des Teilnehmers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="lastname">Nachname:</label>
                    <TextInput name="lastname" v-model="participant.lastname" placeholder="Nachname"
                        v-if="type === 'add' || type === 'edit' && access === 'staff'"
                        :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
                    <p class="font-medium" v-if="type === 'edit' && access === 'trainer'">{{ participant.lastname }}</p>
                </div>

                <!--Geburtstag des Teilnehmers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="birthday"><span class="hidden sm:block">Geburtstag:</span><span
                            class="block sm:hidden">Geb.:</span></label>
                    <DateInput v-model="participant.birthday" name="birthday" :max="new Date().toJSON().slice(0, 10)"
                        v-if="type === 'add' || type === 'edit' && access === 'staff'" class="font-medium md:w-96"
                        :showError="error.cause.birthdayInput">
                    </DateInput>
                    <p class="font-medium" v-if="type === 'edit' && access === 'trainer'">{{ new
                        Date(participant.birthday).toLocaleDateString('de-DE', {
                            year: '2-digit',
                            month: '2-digit', day: '2-digit'
                        }) }}</p>
                </div>

                <!--Erstes Training des Teilnehmers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="firsttraining"><span class="hidden sm:block">Erstes Training:</span><span
                            class="block sm:hidden">Erstes Train.:</span></label>
                    <DateInput v-model="participant.firsttraining" name="firsttraining"
                        :max="new Date().toJSON().slice(0, 10)" class="font-medium md:w-96"
                        :showError="error.cause.firsttrainingInput">
                    </DateInput>
                </div>


                <!-- Wird angezeigt, wenn type=edit -->
                <span v-if="type === 'edit'" class="flex flex-col justify-center items-center gap-4 w-full">

                    <!-- Löschen Button -->
                    <div class="w-full flex items-center justify-between gap-4 mt-4">
                        <p>Teilnehmer entfernen:</p>
                        <button @click="showDeleteButton = true" v-show="!showDeleteButton"
                            class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 drop-shadow-md w-[90px] md:w-[114px] rounded-[20px] px-3.5 md:px-7 py-2.5 ">
                            <p class="font-medium font-base md:text-lg">Entfernen</p>
                        </button>
                        <button @click="removeParticipant()"
                            class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-[20px] drop-shadow-md w-fit px-[7px] md:px-6 py-1.5"
                            v-show="showDeleteButton">
                            <p class="font-medium font-base md:text-lg">Wirklich entfernen?</p>
                        </button>
                    </div>

                </span>
            </div>

            <!-- Wird angezeigt wenn type=new & access=staff -> Nur staff kann auf alle Participant zugreifen (Datenschutz) -->
            <div class="flex flex-col gap-4 text-almost-black" v-if="type === 'add' && access === 'staff'">

                <!-- Search Bar -->
                <div class="w-full flex items-center justify-between gap-4">
                    <TextInput name="search" v-model="searchString" placeholder="Suche" class="w-full"></TextInput>
                    <span class="mr-2">
                        <!-- Lupe -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="w-7 h-7" v-show="searchString === ''">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                        <!-- X Icon -->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="w-7 h-7" v-show="searchString !== ''" @click="searchString = ''">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </span>
                </div>

                <!-- Tabelle Mitglieder -->
                <div class="h-fit max-h-[40vh] overflow-y-auto block w-full pr-2">
                    <div v-for="participant in searchResult" :key="participant._id"
                        @click="onClickOnNewParticipant(participant._id)"
                        class="w-full border-b last:border-0 border-[#D1D5DB] py-3 last:pb-0 flex justify-between items-center gap-2 cursor-pointer">

                        <div class="w-full flex justify-start items-center gap-2">
                            <p>{{ participant.firstname }} {{ participant.lastname }}</p>
                            <p class="text-light-gray">{{ new Date(participant.birthday).toLocaleDateString('de-DE', {
                                year: '2-digit', month:
                                    '2-digit', day: '2-digit'
                            }) }}</p>
                        </div>

                        <div class="w-fit h-fit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                                stroke="currentColor" class="w-7 h-7 text-almost-black"
                                v-show="selectedMembers.some(m => m._id === participant._id) || groupParticipants.some(p => p.memberId === participant._id)">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <div v-show="!selectedMembers.some(m => m._id === participant._id) && !groupParticipants.some(p => p.memberId === participant._id)"
                                class="w-[28px] h-[28px] border-[2.25pt] border-light-gray rounded-xl"></div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex flex-col gap-4">

                <ErrorMessage :message="error.message" :show="error.show"></ErrorMessage>

                <div class="flex justify-between items-center gap-6 ">
                    <button @click="close"
                        class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-[20px] px-3.5 md:px-7 py-2.5">
                        <p class="font-medium font-base md:text-lg">Abbrechen</p>
                    </button>
                    <StandardButton @click="addMultipleParticipants()" class="w-full"
                        v-if="type === 'add' && access === 'staff'">
                        <p class="font-base md:text-lg">Hinzufügen</p>
                    </StandardButton>
                    <StandardButton @click="addParticipant()" class="w-full" v-if="type === 'add' && access === 'trainer'">
                        <p class="font-base md:text-lg">Hinzufügen</p>
                    </StandardButton>
                    <StandardButton @click="saveEditedParticipant()" class="w-full" v-if="type === 'edit'">
                        <p class="font-base md:text-lg">Speichern</p>
                    </StandardButton>
                </div>

            </div>
        </template>
    </ModalDialog>
</template>
<script>
import ModalDialog from './ModalDialog.vue';
import TextInput from './TextInput.vue';
import DateInput from './DateInput.vue';
import ErrorMessage from './ErrorMessage.vue';
import StandardButton from './StandardButton.vue';
import { updateParticipantInGroup, getAllMembers, removeParticipantFromGroup, addMultipleMembersToGroup, addMemberToGroup } from "@/util/fetchOperations";

export default {
    name: "ParticipantModal",
    components: {
        ModalDialog,
        TextInput,
        ErrorMessage,
        StandardButton,
        DateInput
    },
    data() {
        return {
            show: false,
            participant: {
                firstname: '',
                lastname: '',
                birthday: '',
                firsttraining: '',
            },
            error: {
                message: '',
                show: false,
                cause: {
                    firstnameInput: false,
                    lastnameInput: false,
                    birthdayInput: false,
                    firsttrainingInput: false
                }
            },

            showDeleteButton: false,

            searchString: '',
            selectedMembers: [],
            allMembers: [],
        }
    },
    props: {
        type: {
            type: String,
            required: true
        },
        access: {
            type: String,
            required: true
        },
        groupParticipants: {
            type: Array,
            required: false
        },
        groupID: {
            required: true
        }
    },
    methods: {
        async open(participant = this.participant) {
            if (this.type === 'add' && this.access === 'staff') {
                this.allMembers = (await getAllMembers()).sort((a, b) => a.lastname.localeCompare(b.lastname))
            } else if (this.type === 'edit') {
                participant = {
                    ...participant,
                    birthday: participant.birthday.slice(0, 10),
                    firsttraining: participant.firsttraining.slice(0, 10)
                }

                this.participant = participant
            }

            this.show = true
        },

        close() {
            //Müssen für type=new resetet werden
            this.participant = { firstname: '', lastname: '', birthday: '', firsttraining: '' }
            this.searchString = ''
            this.selectedMembers = []
            this.allMembers = []

            //Muss auf false gesetzt werden, da sonst beim nächsten Öffnen des Modal der Löschen Button falsch angezeigt wird
            this.showDeleteButton = false
            this.resetError()
            this.show = false
            this.$emit("onClose")
        },

        async saveEditedParticipant() {
            this.validateInputs(this.participant)

            if (!this.error.show) {
                const res = await updateParticipantInGroup(this.groupID, this.participant.memberId, this.participant)
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            }
        },

        async removeParticipant() {
            const res = await removeParticipantFromGroup(this.groupID, this.participant.memberId)
            if (res.ok) {
                this.close()
            } else {
                this.error.message = res.body.message
                this.error.show = true
            }
        },

        //Für Staff add multiple members
        async addMultipleParticipants() {
            if (this.selectedMembers.length > 0) {
                this.selectedMembers = this.selectedMembers.map(m => {
                    return {
                        ...m,
                        firsttraining: new Date().toJSON().slice(0, 10)
                    }
                })

                const res = await addMultipleMembersToGroup(this.groupID, this.selectedMembers)
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            } else {
                this.cancel()

            }
        },

        //Für Trainer add one member
        async addParticipant() {
            this.validateInputs(this.participant)

            if (!this.error.show) {
                const res = await addMemberToGroup(this.groupID, this.participant)
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            }
        },

        onClickOnNewParticipant(id) {
            if (!this.groupParticipants.some(p => p.memberId === id)) {
                if (this.selectedMembers.some(m => m._id === id)) {
                    this.selectedMembers = this.selectedMembers.filter(m => m._id !== id)
                } else {
                    this.selectedMembers.push(this.allMembers.find(m => m._id === id))
                }
            }
        },

        resetError() {
            this.error = {
                message: '',
                show: false,
                cause: {
                    firstnameInput: false,
                    lastnameInput: false,
                    birthdayInput: false,
                    firsttrainingInput: false
                }
            }
        },

        validateInputs(inputs) {
            this.resetError()

            if (inputs.firstname.trim().length === 0 || !inputs.firstname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
                this.error.message = 'Bitte gebe einen gültigen Vornamen ein.'
                this.error.show = true
                this.error.cause.firstnameInput = true
            }
            if (inputs.lastname.trim().length === 0 || !inputs.lastname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
                this.error.message = 'Bitte gebe einen gültigen Nachnamen ein.'
                this.error.show = true
                this.error.cause.lastnameInput = true
            }
            if (inputs.birthday.trim().length === 0 || !inputs.birthday.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
                this.error.message = 'Bitte gebe einen Geburtstag ein.'
                this.error.show = true
                this.error.cause.birthdayInput = true
            }

            if (inputs.firsttraining.trim().length === 0 || !inputs.firsttraining.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
                this.error.message = 'Bitte das erste Trainingsdatum ein.'
                this.error.show = true
                this.error.cause.firsttrainingInput = true
            }

            //If any error is true, set error.message to 'Mehrere Fehler.'
            if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
                this.error.message = 'Mehrere Fehler.'
            }
        }
    },

    emits: ['onClose'],

    expose: ['open', 'close'],

    computed: {
        searchResult() {
            return this.allMembers.filter(m => {
                // Ermöglicht suche nach mehreren Wörtern (z.B. "Max Mustermann")
                if (this.searchString.indexOf(" ") > -1) {
                    const searchStrings = this.searchString.split(" ")
                    return searchStrings.every(s => m.firstname.toLowerCase().indexOf(s.toLowerCase()) > -1 || m.lastname.toLowerCase().indexOf(s.toLowerCase()) > -1)
                }

                return m.firstname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || m.lastname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || this.searchString === ''
            })
        }
    }
}
</script>