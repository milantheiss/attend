<template>
    <ModalDialog :show="show" :hasSubheader="false" @onClose="close">

        <template #header>
            <p class="text-xl md:text-2xl">Neue Gruppe</p>
        </template>

        <template #content>
            <div class="flex flex-col justify-center items-center gap-4">

                <!-- Gruppenbezeichnung -->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="name" class="font-medium">Name:</label>
                    <TextInput name="name" v-model="group.name" placeholder="Gruppenbezeichnung"
                        :showError="error.cause.nameInput" class="md:w-96"></TextInput>
                </div>

                <!-- Abteilung -->
                <div class="w-full flex items-center justify-between gap-4">
                    <!--Dropdown Selector aus allen Departments-->
                    <p class="font-medium">Abteilung:</p>
                    <SelectList v-model="group.department" :options="departments" :showError="error.cause.departmentInput"
                        class="md:w-96 text-black" :sortAlphabetically="true">
                    </SelectList>
                </div>

                <!-- Zeiten -->
                <div class="w-full flex items-center justify-between gap-4">
                    <CollapsibleContainer :show="true" class="w-full">

                        <template #header>
                            <p class="font-medium">Zeiten</p>
                        </template>

                        <template #content>
                            <table class="table-auto w-full mb-2">

                                <thead class="border-b border-[#D1D5DB] text-left">
                                    <tr>
                                        <th class="pb-1.5 font-medium">Tag</th>
                                        <th class="pb-1.5 font-medium  px-2.5">Start</th>
                                        <th class="pb-1.5 font-medium">Ende</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    <!-- Bereits eingetragene Zeiten -->
                                    <tr class="border-b border-[#E5E7EB] last:border-0 group"
                                        v-for="(time, index) in group.times.sort((a, b) => sorter[b] - sorter[a])"
                                        :key="index">

                                        <!-- Trainingstag -->
                                        <td class="py-2 group-last:pt-2 group-last:pb-0">
                                            <DaySelect v-model="time.day"></DaySelect>
                                        </td>

                                        <!-- Start- und Endzeit -->

                                        <!-- Wird als Stapel angezeigt, wenn Screen zu klein wird -->
                                        <td class="py-2 px-2.5 flex flex-col gap-2 sm:table-cell">
                                            <!--Starttime Selector-->
                                            <input :class="inputStyle" type='time' v-model="time.starttime" min='00:00'
                                                :max='time.endtime' @change="validateTime(time)" />
                                            <!--Endtime Selector-->
                                            <input class='block ty:hidden' :class="inputStyle" type='time'
                                                v-model="time.endtime" :min='time.starttime' max='00:00'
                                                @change="validateTime(time)" />
                                        </td>

                                        <td class="hidden ty:table-cell">
                                            <!--Endtime Selector-->
                                            <input :class="inputStyle" type='time' v-model="time.endtime"
                                                :min='time.starttime' max='00:00' @change="validateTime(time)" />
                                        </td>

                                        <!-- X Icon zum löschen der Zeit -->
                                        <td @click="group.times.splice(index, 1)">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="2" stroke="currentColor" class="w-7 h-7">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </td>
                                    </tr>

                                    <!-- NewTime Row, zum hinzufügen von neuen Zeiten -->
                                    <tr v-show="showNewTime">
                                        <td class="pt-2 ">
                                            <DaySelect v-model="tempTime.day"></DaySelect>
                                        </td>
                                        <td class="pt-2 px-2.5">
                                            <!--Time Selector-->
                                            <input :class="inputStyle" type='time' v-model="tempTime.starttime"
                                                :max='tempTime.endtime' min='00:00' @change="tempTimeChange()" />
                                        </td>
                                        <td class="pt-2">
                                            <!--Time Selector-->
                                            <input :class="inputStyle" type='time' v-model="tempTime.endtime" max='00:00'
                                                :min='tempTime.starttime' @change="tempTimeChange()" />
                                        </td>
                                        <!-- X Icon Löscht Zeit -->
                                        <td
                                            @click="() => { tempTime = { day: '', starttime: '', endtime: '' }; showNewTime = false }">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="2" stroke="currentColor" class="w-7 h-7">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <!-- Toggelt die NewTime Row -->
                            <div class="flex items-center justify-end w-full" v-show="!showNewTime">
                                <button @click="showNewTime = true"
                                    class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md px-3.5 py-1">
                                    <p class="font-medium font-base md:text-lg">Zeit hinzufügen</p>
                                </button>
                            </div>
                        </template>
                    </CollapsibleContainer>
                </div>

                <!--Veranstaltungsort-->
                <div class="w-full flex items-center justify-between gap-4">
                    <label for="venue" class="font-medium">Sportstätte:</label>
                    <TextInput name="venue" v-model="group.venue" placeholder="Sportstätte"
                        :showError="error.cause.venueInput" class="md:w-96"></TextInput>
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
                    <StandardButton @click="createNewGroup" class="w-full">
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
import CollapsibleContainer from './CollapsibleContainer.vue';
import ErrorMessage from './ErrorMessage.vue';
import StandardButton from './StandardButton.vue';
import { createNewGroup } from "@/util/fetchOperations";
import DaySelect from './DaySelect.vue';
import SelectList from './SelectList.vue';

export default {
    name: "GroupModal",
    components: {
        ModalDialog,
        TextInput,
        CollapsibleContainer,
        ErrorMessage,
        StandardButton,
        DaySelect,
        SelectList
    },

    data() {
        return {
            group: {
                name: '',
                venue: '',
                department: {},
                times: []
            },
            error: {
                message: '',
                show: false,
                cause: {
                    venueInput: false,
                    nameInput: false,
                    departmentInput: false,
                    timesInput: false
                }
            },
            show: false,
            showDeleteButton: false,
            showNewTime: false,
            tempTime: {
                day: '',
                starttime: '',
                endtime: ''
            },
            sorter: {
                "Montag": 1,
                "Dienstag": 2,
                "Mittwoch": 3,
                "Donnerstag": 4,
                "Freitag": 5,
                "Samstag": 6,
                "Sonntag": 7
            }
        }
    },

    props: {
        departments: {
            type: Array,
            required: true
        }
    },

    methods: {
        open() {
            this.show = true
        },

        close() {
            this.group = { name: '', venue: '', department: {}, times: [] }
            this.tempTime = { day: '', starttime: '', endtime: '' }

            //Muss auf false gesetzt werden, da sonst beim nächsten Öffnen des Modal der Löschen Button falsch angezeigt wird
            this.showDeleteButton = false
            this.showNewTime = false
            this.resetError()
            this.show = false

            this.$emit("onClose")
        },


        async createNewGroup() {
            this.validateInputs(this.group)

            if (!this.error.show) {
                this.group.department = this.group.department._id

                const res = await createNewGroup(this.group)
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            }
        },

        resetError() {
            this.error = {
                message: '',
                show: false,
                cause: {
                    venueInput: false,
                    nameInput: false,
                    departmentInput: false,
                    timesInput: false
                }
            }
        },

        validateInputs(inputs) {
            this.resetError()

            //Regex Groß- und Kleinbuchstaben, Umlaute, ß, Bindestriche, Leerzeichen, Schrägstriche, Punkte, Kommas & Zahlen
            //Regex: /^[a-zA-ZäöüÄÖÜß-\/\s.,0-9]+$/

            if (inputs.name.trim().length === 0 || !inputs.name.match(/^[a-zA-ZäöüÄÖÜß-\s/.,0-9]+$/)) {
                this.error.message = 'Bitte gebe einen gültigen Name ein.'
                this.error.show = true
                this.error.cause.nameInput = true
            }
            //Regex Groß- und Kleinbuchstaben, Umlaute, ß, Bindestriche & Leerzeichen
            //Regex: /^[a-zA-ZäöüÄÖÜß- ]+$/
            if (inputs.venue.trim().length === 0 || !inputs.venue.match(/^[a-zA-ZäöüÄÖÜß-\s/.,0-9]+$/)) {
                this.error.message = 'Bitte gebe einen gültigen Veranstaltungsort ein.'
                this.error.show = true
                this.error.cause.venueInput = true
            }
            if (typeof inputs.department._id === "undefined" || inputs.department._id?.trim().length === 0 || !inputs.department._id?.match(/^[0-9a-fA-F]{24}$/)) {
                this.error.message = 'Bitte wähle eine Abteilung aus.'
                this.error.show = true
                this.error.cause.departmentInput = true
            }
            if (inputs.times.length === 0 || !inputs.times.every(t => ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].includes(t.day) && t.starttime.match(/^[0-9]{2}:[0-9]{2}$/) && t.endtime.match(/^[0-9]{2}:[0-9]{2}$/))) {
                this.error.message = 'Bitte gebe die Trainingszeiten ein.'
                this.error.show = true
                this.error.cause.timesInput = true
            }

            //If any error is true, set error.message to 'Mehrere Fehler.'
            if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
                this.error.message = 'Mehrere Fehler.'
            }
        },

        validateTime(time) {
            if (time.starttime !== "" && time.endtime !== "") {
                if (parseInt(time.starttime.replace(":", "")) > parseInt(time.endtime.replace(":", ""))) {
                    const temp = time.starttime
                    time.starttime = time.endtime
                    time.endtime = temp
                }
            }
        },

        tempTimeChange() {
            if (this.tempTime.day !== '' && this.tempTime.starttime !== '' && this.tempTime.endtime !== '') {
                if (parseInt(this.tempTime.starttime.replace(":", "")) > parseInt(this.tempTime.endtime.replace(":", ""))) {
                    const temp = this.tempTime.starttime
                    this.tempTime.starttime = this.tempTime.endtime
                    this.tempTime.endtime = temp
                }
                this.group.times.push(this.tempTime)

                this.tempTime = {
                    day: '',
                    starttime: '',
                    endtime: ''
                }
                this.showNewTime = false
            }
        }
    },

    emits: ['onClose'],

    expose: ['open', 'close'],

    computed: {
        inputStyle() {
            const standard = "font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3"

            return this.error.cause.timesInput ? standard + ' border-2 rounded-lg border-special-red' : standard
        }
    }
}
</script>
<style scoped>
input[type="time"] {
    line-height: 2rem;
    padding-bottom: 2px;
    padding-top: 5px;
}

input[type="time"]::-webkit-calendar-picker-indicator {
    display: block;
    opacity: 0;
}

input::-webkit-inner-spin-button,
input::-webkit-clear-button {
    display: block;
    opacity: 0;
}

input[type="time"] {
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%20class%3D%22w-6%20h-6%22%3E%0A%20%20%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M12%206v6h4.5m4.5%200a9%209%200%2011-18%200%209%209%200%200118%200z%22%20%2F%3E%0A%3C%2Fsvg%3E%0A");
    background-repeat: no-repeat;
    background-size: 1.5rem 1.5rem;
    background-position: right 0.25rem center;

    cursor: pointer;
}

input::-webkit-date-and-time-value {
    text-align: left;
}
</style>