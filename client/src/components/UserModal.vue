<template>
    <ModalDialog :show="showCreateUserModal" :hasSubheader="false" @onClose="cancel">
        <template #header>
            <p class="text-xl md:text-2xl">Neuen Benutzer</p>
        </template>
        <template #content>
            <div class="flex flex-col justify-center items-center gap-4">
                <!--Username des Benutzers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="username" class="hidden sm:block">Benutzername:</label>
                    <TextInput name="username" v-model="newUser.username" placeholder="Benutzername"
                        :showError="error.cause.usernameInput" class="md:w-96"></TextInput>
                </div>

                <!--Vorname des Benutzers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="firstname" class="hidden sm:block">Vorname:</label>
                    <TextInput name="firstname" v-model="newUser.firstname" placeholder="Vorname"
                        :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
                </div>

                <!--Nachname des Benutzers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="lastname" class="hidden sm:block">Nachname:</label>
                    <TextInput name="lastname" v-model="newUser.lastname" placeholder="Nachname"
                        :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
                </div>

                <!--E-Mail des Benutzers-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="email" class="hidden sm:block">E-Mail:</label>
                    <TextInput name="email" v-model="newUser.email" placeholder="E-Mail" :showError="error.cause.emailInput"
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
                                <p class="">Admin</p>
                                <CheckboxInput class="" v-model="roles.admin"></CheckboxInput>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <p class="">Mitarbeiter</p>
                                <CheckboxInput class="" v-model="roles.staff"></CheckboxInput>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <p class="">Abteilungsleiter</p>
                                <CheckboxInput class="" v-model="roles.head"></CheckboxInput>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <p class="">Trainer</p>
                                <CheckboxInput class="" v-model="roles.trainer"></CheckboxInput>
                            </div>
                            <div class="w-full flex justify-between items-center">
                                <p class="">Assistent</p>
                                <CheckboxInput class="" v-model="roles.assistant"></CheckboxInput>
                            </div>
                        </div>
                    </template>
                </CollapsibleContainer>
            </div>
        </template>
        <template #footer>
            <div class="flex flex-col gap-4">
                <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
                <div class="flex justify-between items-center gap-6 ">
                    <button @click="cancel"
                        class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-3.5 md:px-7 py-3.5">
                        <p class="font-medium font-base md:text-lg">Abbrechen</p>
                    </button>
                    <button @click="createNewUser"
                        class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
                        <p class="font-medium font-base md:text-lg">Erstellen</p>
                    </button>
                </div>
            </div>
        </template>
    </ModalDialog>
</template>
<script>
import ModalDialog from './ModalDialog.vue';
export default {
    name: "UserModal",
    components: {
        ModalDialog
    },
    data() {
        return {
            user: {
                firstname: '',
                lastname: '',
                username: '',
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
                    emailInput: false,
                    usernameInput: false
                }
            },
            showDeleteButton: false,
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false,
            required: true
        },
        modelValue: {
            type: Object,
            default: () => {
                return {
                    firstname: '',
                    lastname: '',
                    username: '',
                    email: '',
                    roles: []
                }
            }
        }
    },
    methods: {
        cancel() {
            this.showCreateUserModal = false
            this.showEditUserModal = false
            this.showDeleteButton = false

            this.searchString = ''

            this.user = {
                firstname: '',
                lastname: '',
                username: '',
                email: '',
                roles: []
            }

            this.roles = {
                admin: false,
                staff: false,
                head: false,
                trainer: false,
                assistant: false
            }

            this.resetError()
        },
        resetError() {
            this.error.show = false
            this.error.cause = {
                firstnameInput: false,
                lastnameInput: false,
                emailInput: false,
                usernameInput: false
            }
            this.error.message = ''
        },
    },
    watch: {
        //Open mit Ref Methode
        // v-model austausch mit user
        //WICHTIG Commit bevor größere Changes
    }
    mounted() {

    },
}
</script>