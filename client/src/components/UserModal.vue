<template>
    <ModalDialog :show="show" :hasSubheader="false" @onClose="close">

        <template #header>
            <p class="text-xl md:text-2xl" v-if="type === 'edit'">Bearbeiten</p>
            <p class="text-xl md:text-2xl" v-if="type === 'new'">Neuer Benutzer</p>
        </template>

        <template #content>
            <div class="flex flex-col justify-center items-center gap-4">

                <!--Vorname des Benutzers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="firstname">Vorname:</label>
                    <TextInput name="firstname" v-model="user.firstname" placeholder="Vorname"
                        :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
                </div>

                <!--Nachname des Benutzers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="lastname">Nachname:</label>
                    <TextInput name="lastname" v-model="user.lastname" placeholder="Nachname"
                        :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
                </div>

                <!--E-Mail des Benutzers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="email" class="whitespace-nowrap">E-Mail:</label>
                    <TextInput name="email" v-model="user.email" placeholder="E-Mail" :showError="error.cause.emailInput"
                        class="md:w-96"></TextInput>
                </div>

                <!--Rollen des Benutzers-->
                <CollapsibleContainer class="w-full">
                    <template #header>
                        <p class="font-medium">Rollen</p>
                    </template>
                    <template #content>
                        <div class="flex flex-col gap-2">
                            <div class="w-full flex justify-between items-center">
                                <p>Admin</p>
                                <CheckboxInput v-model="roles.admin"></CheckboxInput>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <p>Mitarbeiter</p>
                                <CheckboxInput v-model="roles.staff"></CheckboxInput>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <p>Abteilungsleiter</p>
                                <CheckboxInput v-model="roles.head"></CheckboxInput>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <p>Trainer</p>
                                <CheckboxInput v-model="roles.trainer"></CheckboxInput>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <p>Assistent</p>
                                <CheckboxInput v-model="roles.assistant"></CheckboxInput>
                            </div>
                        </div>
                    </template>
                </CollapsibleContainer>

                <!-- Wird angezeigt, wenn type=edit -->
                <span v-if="type === 'edit'" class="flex flex-col justify-center items-center gap-4 w-full">

                    <!--Gruppen des Teilnehmers-->
                    <div class="w-full flex items-center justify-between gap-4">
                        <CollapsibleContainer>
                            <template #header>
                                <p class="font-medium">Gruppen</p>
                            </template>
                            <template #content>
                                <div v-for="group in user.accessible_groups " :key="group._id"
                                    v-show="user.accessible_groups.length !== 0"
                                    class="flex justify-between items-center gap-2">
                                    <p>{{ group.name }}</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="2.5" stroke="currentColor" class="w-8 h-8 -mr-[2px]"
                                        @click="user.accessible_groups = user.accessible_groups.filter(e => e !== group)">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <p class="text-light-gray" v-show="user.accessible_groups.length === 0">Keine Gruppe
                                    zugeteilt</p>
                            </template>
                        </CollapsibleContainer>
                    </div>

                    <!-- Password neu senden -->
                    <div class="w-full flex items-center justify-between gap-4 mt-4">
                        <p>Passwort neu senden:</p>
                        <StandardButton @click="resendPassword">
                            <p class="font-base md:text-lg">Senden</p>
                        </StandardButton>
                    </div>

                    <!-- Löschen Button -->
                    <div class="w-full flex items-center justify-between gap-4">
                        <p>Benutzer löschen:</p>
                        <button
                            @click="() => { showDeleteButton = true; error.message = 'Der Benutzer wird aus allen Gruppen und dazu gehörige Listen entfernt!'; error.show = true; }"
                            v-show="!showDeleteButton"
                            class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 drop-shadow-md w-[90px] md:w-[114px] rounded-[20px] px-3.5 md:px-7 py-2.5 ">
                            <p class="font-medium font-base md:text-lg">Löschen</p>
                        </button>
                        <button @click="deleteUser"
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

                <Toast ref="toast"></Toast>

                <div class="flex justify-between items-center gap-6 ">
                    <button @click="close"
                        class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-[20px] px-3.5 md:px-7 py-2.5">
                        <p class="font-medium font-base md:text-lg">Abbrechen</p>
                    </button>
                    <StandardButton @click="saveEditedUser" class="w-full" v-if="type === 'edit'">
                        <p class="font-base md:text-lg">Speichern</p>
                    </StandardButton>
                    <StandardButton @click="createNewUser" class="w-full" v-if="type === 'new'">
                        <p class="font-base md:text-lg">Erstellen</p>
                    </StandardButton>
                </div>

            </div>
        </template>
    </ModalDialog>
</template>
<script>
import ModalDialog from './ModalDialog.vue';
import TextInput from './TextInput.vue';
import CheckboxInput from './CheckboxInput.vue';
import CollapsibleContainer from './CollapsibleContainer.vue';
import ErrorMessage from './ErrorMessage.vue';
import StandardButton from './StandardButton.vue';
import { createNewUser, updateUser, deleteUser, resendPassword } from "@/util/fetchOperations";
import Toast from './Toast.vue';

export default {
    name: "UserModal",
    components: {
    ModalDialog,
    TextInput,
    CheckboxInput,
    CollapsibleContainer,
    ErrorMessage,
    StandardButton,
    Toast
},
    data() {
        return {
            user: {
                firstname: '',
                lastname: '',
                email: '',
                roles: []
            },
            roles: {
                admin: false,
                staff: false,
                head: false,
                trainer: false,
                assistant: false
            },
            error: {
                message: '',
                show: false,
                cause: {
                    firstnameInput: false,
                    lastnameInput: false,
                    emailInput: false
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
        open(user = this.user, roles = this.roles) {
            this.user = user
            this.roles = roles

            this.show = true
        },

        close() {
            //Müssen für type=new resetet werden
            this.user = { firstname: '', lastname: '', email: '', roles: [] }
            this.roles = { admin: false, staff: false, head: false, trainer: false, assistant: false }

            //Muss auf false gesetzt werden, da sonst beim nächsten Öffnen des Modal der Löschen Button falsch angezeigt wird
            this.showDeleteButton = false
            this.resetError()
            this.show = false
            this.$emit("onClose")
        },

        async createNewUser() {
            this.validateInputs(this.user)

            if (!this.error.show) {
                const res = await createNewUser(this.user)
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            }
        },

        async saveEditedUser() {
            this.validateInputs(this.user)

            if (!this.error.show) {
                this.user.accessible_groups = this.user.accessible_groups.map(g => g._id)

                const res = await updateUser(this.user)
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            }
        },

        async deleteUser() {
            const res = await deleteUser(this.user._id)
            if (res.ok) {
                this.close()
            } else {
                this.error.message = res.body.message
                this.error.show = true
            }
        },

        async resendPassword() {
            const res = await resendPassword(this.user._id)
            if(res.ok) {
                this.$refs.toast.trigger(3000, 'success', 'Das Passwort wurde erfolgreich gesendet.')
            } else {
                this.$refs.toast.trigger(3000, 'error', res.body.message)
            }
        },

        resetError() {
            this.error = {
                message: '',
                show: false,
                cause: {
                    firstnameInput: false,
                    lastnameInput: false,
                    emailInput: false
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
            if (!inputs.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/)) {
                this.error.message = 'Bitte gebe einen gültigen E-Mail ein.'
                this.error.show = true
                this.error.cause.emailInput = true
            }

            if (inputs.roles.length === 0) {
                this.error.message = 'Bitte wähle mindestens eine Rolle aus.'
                this.error.show = true
            }

            //Wenn mehrere Fehler vorliegen, wird 'Mehrere Fehler.' angezeigt
            if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
                this.error.message = 'Mehrere Fehler.'
            }
        }
    },
    emits: ['onClose'],
    expose: ['open', 'close'],
    watch: {
        "roles.admin": function (newVal) {
            if (newVal && !this.user.roles.includes('admin')) {
                this.user.roles.push('admin')
            } else if (!newVal) {
                this.user.roles = this.user.roles.filter(r => r !== 'admin')
            }
        },
        "roles.staff": function (newVal) {
            if (newVal && !this.user.roles.includes('staff')) {
                this.user.roles.push('staff')
            } else if (!newVal) {
                this.user.roles = this.user.roles.filter(r => r !== 'staff')
            }
        },
        "roles.head": function (newVal) {
            if (newVal && !this.user.roles.includes('head')) {
                this.user.roles.push('head')
            } else if (!newVal) {
                this.user.roles = this.user.roles.filter(r => r !== 'head')
            }
        },
        "roles.trainer": function (newVal) {
            if (newVal && !this.user.roles.includes('trainer')) {
                this.user.roles.push('trainer')
            } else if (!newVal) {
                this.user.roles = this.user.roles.filter(r => r !== 'trainer')
            }
        },
        "roles.assistant": function (newVal) {
            if (newVal && !this.user.roles.includes('assistant')) {
                this.user.roles.push('assistant')
            } else if (!newVal) {
                this.user.roles = this.user.roles.filter(r => r !== 'assistant')
            }
        },
    }
}
</script>