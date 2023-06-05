<template>
    <ModalDialog :show="show" :hasSubheader="false" @onClose="close">

        <template #header>
            <p class="text-xl md:text-2xl text-[#111827]">Trainer hinzufügen</p>
        </template>

        <template #content>
            <!-- Wird angezeigt wenn type=new & access=staff -> Nur staff kann auf alle Participant zugreifen (Datenschutz) -->
            <div class="flex flex-col gap-4 text-[#111827]">

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
                    <div v-for="user in searchResult" :key="user._id" @click="onClickOnNewTrainer(user._id)"
                        class="w-full border-b last:border-0 border-[#D1D5DB] py-3 last:pb-0 flex justify-between items-center gap-2 cursor-pointer">

                        <div class="w-full flex justify-between items-center gap-2 -my-[4px]">
                            <p>{{ user.firstname }} {{ user.lastname }}</p>
                            <select v-model="user.role" @click.stop=""
                                class="w-fit focus:ring-0 focus:border-standard-gradient-1 border-0 py-[4px] rounded-xl bg-[#D1D5DB] font-medium text-base md:text-lg"
                                :class="{ 'outline outline-2 outline-offset-4 rounded-lg outline-special-red': (error.cause.roleInput && user.role === 'role') }"
                                v-show="selectedUsers.some(m => m._id === user._id)">
                                <option value="trainer" class="bg-white">Trainer</option>
                                <option value="assistant" class="bg-white">Assistent</option>
                                <option value="role" disabled hidden class="bg-white">Rolle</option>
                            </select>
                        </div>

                        <div class="w-fit h-fit">
                            <!-- Checkmark Icon -->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                                stroke="currentColor" class="w-7 h-7 text-[#111827]"
                                v-show="selectedUsers.some(m => m._id === user._id) || groupTrainers.some(p => p.userId === user._id)">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            <!-- Rectangle -->
                            <div v-show="!selectedUsers.some(m => m._id === user._id) && !groupTrainers.some(p => p.userId === user._id)"
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
                    <StandardButton @click="addTrainers()" class="w-full">
                        <p class="font-base md:text-lg">Hinzufügen</p>
                    </StandardButton>
                </div>

            </div>
        </template>
    </ModalDialog>
</template>
<script>
import ModalDialog from './ModalDialog.vue';
import TextInput from './TextInput.vue';
import ErrorMessage from './ErrorMessage.vue';
import StandardButton from './StandardButton.vue';
import { getAllUsers, addMultipleTrainerToGroup } from "@/util/fetchOperations";

export default {
    name: "NewTrainerModal",
    components: {
        ModalDialog,
        TextInput,
        ErrorMessage,
        StandardButton
    },
    data() {
        return {
            show: false,
            error: {
                message: '',
                show: false,
                cause: {
                    roleInput: false
                }
            },

            searchString: '',
            selectedUsers: [],
            allUsers: [],
        }
    },
    props: {
        groupTrainers: {
            type: Array,
            required: false
        },
        groupID: {
            type: String,
            required: true
        }
    },
    methods: {
        async open() {
            this.allUsers = (await getAllUsers()).sort((a, b) => a.lastname.localeCompare(b.lastname))

            this.show = true
        },

        close() {
            //Müssen für type=new resetet werden
            this.searchString = ''
            this.selectedUsers = []
            this.allUsers = []

            //Muss auf false gesetzt werden, da sonst beim nächsten Öffnen des Modal der Löschen Button falsch angezeigt wird
            this.resetError()
            this.show = false
            this.$emit("onClose")
        },

        async addTrainers() {
            if (this.selectedUsers.length > 0) {
                this.selectedUsers = this.selectedUsers.map(u => {
                    return {
                        ...u,
                        role: u.role
                    }
                })

                if (this.selectedUsers.some(u => u.role === "role")) {
                    this.error.message = "Bitte wähle für jeden Trainer eine Rolle aus."
                    this.error.show = true
                    this.error.cause.roleInput = true
                    return
                }

                const res = await addMultipleTrainerToGroup(this.groupID, this.selectedUsers)
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

        onClickOnNewTrainer(id) {
            if (!this.groupTrainers.some(p => p.userId === id)) {
                if (this.selectedUsers.some(m => m._id === id)) {
                    this.selectedUsers = this.selectedUsers.filter(m => m._id !== id)
                } else {
                    const user = this.allUsers.find(m => m._id === id)
                    user.role = 'role'
                    this.selectedUsers.push(user)
                }
            }
        },

        resetError() {
            this.error = {
                message: '',
                show: false,
                cause: {
                    roleInput: false
                }
            }
        }
    },

    emits: ['onClose'],

    expose: ['open', 'close'],

    computed: {
        searchResult() {
            return this.allUsers.filter(u => {
                // Ermöglicht suche nach mehreren Wörtern (z.B. "Max Mustermann")
                if (this.searchString.indexOf(" ") > -1) {
                    const searchStrings = this.searchString.split(" ")
                    return searchStrings.every(s => u.firstname.toLowerCase().indexOf(s.toLowerCase()) > -1 || u.lastname.toLowerCase().indexOf(s.toLowerCase()) > -1)
                }
                
                return u.firstname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || u.lastname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || this.searchString === ''
            })
        }
    }
}
</script>