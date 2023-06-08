<template>
    <ModalDialog :show="show" :hasSubheader="false" @onClose="close">

        <template #header>
            <p class="text-xl md:text-2xl text-[#111827]" v-if="type === 'edit'">Bearbeiten</p>
            <p class="text-xl md:text-2xl text-[#111827]" v-if="type === 'new'">Neues Mitglied</p>
        </template>

        <template #content>
            <div class="flex flex-col justify-center items-center gap-4 text-[#111827]">

                <!--Vorname des Teilnehmers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="firstname">Vorname:</label>
                    <TextInput name="firstname" v-model="member.firstname" placeholder="Vorname"
                        :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
                </div>

                <!--Nachname des Teilnehmers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="lastname">Nachname:</label>
                    <TextInput name="lastname" v-model="member.lastname" placeholder="Nachname"
                        :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
                </div>

                <!--Geburtstag des Teilnehmers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="birthday"><span class="hidden sm:block">Geburtstag:</span><span
                            class="block sm:hidden">Geb.:</span></label>
                    <DateInput v-model="member.birthday" name="birthday" :max="new Date().toJSON().slice(0, 10)"
                        class="font-medium md:w-96" :showError="error.cause.birthdayInput">
                    </DateInput>
                </div>

                <!-- Wird angezeigt, wenn type=edit -->
                <span v-if="type === 'edit'" class="flex flex-col justify-center items-center gap-4 w-full">

                    <!--Gruppen des Teilnehmers-->
                    <div class="w-full flex items-center justify-between gap-4">
                        <CollapsibleContainer>
                            <template #header>
                                <p class="font-medium">Gruppen</p>
                            </template>
                            <template #content>
                                <div v-for="group in member.groups " :key="group._id"
                                    class="flex justify-between items-center gap-2" v-show="member.groups.length !== 0">
                                    <p>{{ group.name }}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="2.5" stroke="currentColor" class="w-8 h-8 -mr-[2px]"
                                        @click="member.groups = member.groups.filter(e => e._id !== group._id)">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <p v-show="member.groups.length === 0">In keiner Gruppe</p>
                            </template>
                        </CollapsibleContainer>
                    </div>

                    <!-- Löschen Button -->
                    <div class="w-full flex items-center justify-between gap-4 mt-4">
                        <p >Mitglied löschen:</p>
                        <button
                            @click="() => { showDeleteButton = true; error.message = 'Das Mitglied wird aus allen Gruppen und dazu gehörige Listen entfernt!'; error.show = true; }"
                            v-show="!showDeleteButton"
                            class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 drop-shadow-md w-[90px] md:w-[114px] rounded-[20px] px-3.5 md:px-7 py-2.5 ">
                            <p class="font-medium font-base md:text-lg">Löschen</p>
                        </button>
                        <button @click="deleteMember"
                            class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-[20px] drop-shadow-md w-fit px-[7px] md:px-6 py-1.5"
                            v-show="showDeleteButton">
                            <p class="font-medium font-base md:text-lg">Wirklich löschen?</p>
                        </button>
                    </div>

                </span>
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
                    <StandardButton @click="createNewMember" class="w-full" v-if="type === 'new'">
                        <p class="font-base md:text-lg">Erstellen</p>
                    </StandardButton>
                    <StandardButton @click="saveEditedMember" class="w-full" v-if="type === 'edit'">
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
import CollapsibleContainer from './CollapsibleContainer.vue';
import ErrorMessage from './ErrorMessage.vue';
import StandardButton from './StandardButton.vue';
import { createNewMember, updateMember, deleteMember } from "@/util/fetchOperations";

export default {
    name: "MemberModal",
    components: {
        ModalDialog,
        TextInput,
        CollapsibleContainer,
        ErrorMessage,
        StandardButton,
        DateInput
    },
    data() {
        return {
            member: {
                firstname: '',
                lastname: '',
                birthday: ''
            },
            error: {
                message: '',
                show: false,
                cause: {
                    firstnameInput: false,
                    lastnameInput: false,
                    birthdayInput: false
                }
            },
            show: false,
            showDeleteButton: false
        }
    },
    props: {
        type: {
            type: String,
            required: true
        }
    },
    methods: {
        open(member = this.member) {
            this.member = member
            this.show = true
        },

        close() {
            //Müssen für type=new resetet werden
            this.member = { firstname: '', lastname: '', birthday: '' }
            //Muss auf false gesetzt werden, da sonst beim nächsten Öffnen des Modal der Löschen Button falsch angezeigt wird
            this.showDeleteButton = false
            this.resetError()
            this.show = false
            this.$emit("onClose")
        },

        async createNewMember() {
            this.validateInputs(this.member)

            if (!this.error.show) {
                const res = await createNewMember(this.member)
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            }
        },

        async saveEditedMember() {
            this.validateInputs(this.member)

            if (!this.error.show) {
                const res = await updateMember({
                    ...this.member,
                    groups: this.member.groups.map(g => g._id)
                })
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            }
        },

        async deleteMember() {
            const res = await deleteMember(this.member._id)
            if (res.ok) {
                this.close()
            } else {
                this.error.message = res.body.message
                this.error.show = true
            }
        },

        resetError() {
            this.error = {
                message: '',
                show: false,
                cause: {
                    firstnameInput: false,
                    lastnameInput: false,
                    birthdayInput: false
                }
            }
        },

        validateInputs(inputs) {
            this.resetError()

            if (inputs.firstname.trim().length === 0 || !inputs.firstname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
                this.error.message = 'Bitte gebe einen Vornamen ein.'
                this.error.show = true
                this.error.cause.firstnameInput = true
            }
            if (inputs.lastname.trim().length === 0 || !inputs.lastname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
                this.error.message = 'Bitte gebe einen Nachnamen ein.'
                this.error.show = true
                this.error.cause.lastnameInput = true
            }
            if (inputs.birthday.trim().length === 0 || !inputs.birthday.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
                this.error.message = 'Bitte gebe einen Geburtstag ein.'
                this.error.show = true
                this.error.cause.birthdayInput = true
            }

            //Wenn mehrere Fehler vorliegen, wird 'Mehrere Fehler.' angezeigt
            if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
                this.error.message = 'Mehrere Fehler.'
            }
        }
    },
    emits: ['onClose'],
    expose: ['open', 'close'],
}
</script>