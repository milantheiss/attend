<template>
    <div>
        <div class="container mx-auto flex flex-col gap-8 mb-20 text-[#111827]" v-if="!error.cause.noGroups">

            <!--Auswahlelement, um Gruppe auszuwählen-->
            <!-- Wird angezeigt, wenn noch keine Gruppe ausgewählt wurde -->
            <div class="flex justify-center items-center w-full" v-if="group === undefined">
                <SelectList v-model="selectedGroup" defaultValue="Wähle eine Gruppe" @change="onSelectedGroupChanged"
                    :options="this.groups"
                    class="font-bold text-2xl md:text-3xl mx-3.5 md:mx-7" />
            </div>

            <!--Group Info-->

            <!-- Wird erst angezeigt, wenn eine Gruppe ausgewählt wurde -->
            <div class="flex flex-col justify-center items-center gap-4 bg-white rounded-xl p-3.5 md:px-7 drop-shadow-md"
                v-if="group !== undefined">

                <!-- Gruppenbezeichnung -->

                <div class="w-full flex items-center justify-between gap-4">
                    <label for="name" class="">Gruppe:</label>
                    <SelectList v-model="selectedGroup" defaultValue="Wähle eine Gruppe"
                        :options="this.groups.map(g => { return { _id: g._id, name: g.name } })" class="font-medium" />
                </div>

                <!-- Abteilung -->

                <div class="w-full flex items-center justify-between gap-4">
                    <!--Dropdown Selector aus allen Departments-->
                    <p class="">Abteilung:</p>
                    <p class="font-medium">{{ group.department.name }}</p>
                </div>

                <!-- Trainingszeiten der Gruppe -->

                <div class="w-full flex items-center justify-between gap-4"
                    :class="{ 'outline outline-2 outline-offset-4 rounded-lg outline-special-red': error.cause.timesInput }">
                    <CollapsibleContainer :show="true" class="w-full">

                        <template #header>
                            <p class="font-medium">Zeiten</p>
                        </template>

                        <template #content>
                            <table class="table-auto w-full mb-2">

                                <thead class="border-b border-[#D1D5DB] text-left">
                                    <tr>
                                        <th class="pb-1.5 font-medium">Tag</th>
                                        <!-- Wenn Screen zu klein wird, werden die Start- und Endzeit als Stapel angezeigt. -->
                                        <th class="pb-1.5 font-medium px-2.5"><span class="hidden ty:block">Start</span>
                                            <span class="block ty:hidden">Zeiten</span>
                                        </th>
                                        <th class="pb-1.5 font-medium hidden ty:block">Ende</th>
                                        <!-- Spalte für X Icon -->
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>

                                    <!--Zeiten-->

                                    <tr class="border-b border-[#E5E7EB] last:border-0 group"
                                        v-for="(time, index) in group.times.sort((a, b) => sorter[b.day] - sorter[a.day])"
                                        :key="index">

                                        <!--Selector Day-->

                                        <td>
                                            <DaySelect v-model="time.day"></DaySelect>
                                        </td>

                                        <!-- Start- und Endzeit -->

                                        <!-- Wenn Screen zu klein wird, werden die Start- und Endzeit als Stapel angezeigt. -->
                                        <td class="py-2 px-2.5 flex flex-col gap-2 sm:table-cell">
                                            <input :class="timeInputStyle" type='time' v-model="time.starttime" min='00:00'
                                                :max='time.endtime' @change="validateTime(time)" />
                                            <input class='block ty:hidden' :class="timeInputStyle" type='time'
                                                v-model="time.endtime" :min='time.starttime' max='00:00'
                                                @change="validateTime(time)" />
                                        </td>
                                        <td class="hidden ty:table-cell">
                                            <!--Time Selector-->
                                            <input :class="timeInputStyle" type='time' v-model="time.endtime"
                                                :min='time.starttime' max='00:00' @change="validateTime(time)" />
                                        </td>

                                        <!-- X Icon -->
                                        <td @click="group.times.splice(index, 1)">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="2" stroke="currentColor" class="w-7 h-7 ml-auto">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </td>
                                    </tr>

                                    <!--Füge Zeit hinzu-->

                                    <tr v-show="showNewTime">

                                        <!--Selector Day-->

                                        <td class="pt-2 ">
                                            <DaySelect v-model="tempTime.day"></DaySelect>
                                        </td>

                                        <!-- Wenn Screen zu klein wird, werden die Start- und Endzeit als Stapel angezeigt. -->
                                        <td class="pt-2 px-2.5">
                                            <!--Time Selector-->
                                            <input :class="timeInputStyle" type='time' v-model="tempTime.starttime"
                                                min='00:00' :max='tempTime.endtime' @change="tempTimeChange()" />
                                            <input class='block ty:hidden' :class="timeInputStyle" type='time'
                                                v-model="tempTime.endtime" :min='tempTime.starttime' max='00:00'
                                                @change="tempTimeChange()" />
                                        </td>

                                        <td class="pt-2 hidden ty:table-cell">
                                            <!--Time Selector-->
                                            <input :class="timeInputStyle" type='time' v-model="tempTime.endtime"
                                                max='00:00' :min='tempTime.starttime' @change="tempTimeChange()" />
                                        </td>

                                        <!-- X Icon Löscht Zeit -->
                                        <td
                                            @click="() => { tempTime = { day: '', starttime: '', endtime: '' }; showNewTime = false }">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="2" stroke="currentColor" class="w-7 h-7 ml-auto">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

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

                <div class="w-full">
                    <ErrorMessage
                        :show="error.cause.nameInput || error.cause.departmentInput || error.cause.timesInput || error.cause.venueInput"
                        :message="error.message"></ErrorMessage>
                </div>

                <StandardButton @click="saveChanges" class="w-full">
                    <p class="font-base md:text-lg">Speichern</p>
                </StandardButton>
            </div>

            <!--Liste aller Teilnehmer. OnClick wird ein MemberEditor geöffnet.-->
            <!--Anzeigereglung wird in Component geregelt.-->
            <div class="flex flex-col gap-4 items-center w-full" v-if="group !== undefined">

                <!-- Header -->

                <div class="flex gap-4 items-center justify-between w-full px-3.5 md:px-7">
                    <p class="font-medium text-xl md:text-2xl">Teilnehmer</p>
                    <StandardButton @click="$refs.addParticipantModal.open()">
                        <p class="font-medium font-base md:text-lg">Hinzufügen</p>
                    </StandardButton>
                </div>

                <div class="flex flex-col w-full bg-white p-3.5 md:p-7 rounded-xl">
                    <div class="h-fit max-h-[60vh] overflow-y-auto block">
                        <table class="table-auto w-full ">

                            <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
                                <tr>

                                    <th scope="col" class="pb-2.5 font-medium"
                                        @click="() => { if (sort.key === 'lastname') sort.index.lastname = (sort.index.lastname + 1) % 2; sort.key = 'lastname' }">
                                        <span class="flex items-center gap-1">
                                            <SortIcon :index="sort.index.lastname"></SortIcon>
                                            Name
                                        </span>
                                    </th>

                                    <th scope="col" class="px-3 md:px-4 pb-2.5 font-medium"
                                        @click="() => { if (sort.key === 'firstname') sort.index.firstname = (sort.index.firstname + 1) % 2; sort.key = 'firstname' }">
                                        <span class="flex items-center gap-1">
                                            <SortIcon :index="sort.index.firstname"></SortIcon>
                                            Vorname
                                        </span>
                                    </th>

                                    <!-- Geburtstag -->

                                    <!-- Wird ausgeblendet, wenn Screen zuklein -->
                                    <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                                        @click="() => { if (sort.key === 'birthday') sort.index.birthday = (sort.index.birthday + 1) % 2; sort.key = 'birthday' }">
                                        <!-- Wird abgekürzt, wenn Screen kleiner als md -->
                                        <span class="hidden md:flex items-center gap-1 ">
                                            <SortIcon :index="sort.index.birthday"></SortIcon>
                                            Geburtstag
                                        </span>
                                        <span class="flex md:hidden items-center gap-1 ">
                                            <SortIcon :index="sort.index.birthday"></SortIcon>
                                            Geb.
                                        </span>
                                    </th>

                                    <!-- Spalte für Pfeil -->
                                    <th scope="col" class="pb-2.5 font-medium w-full"></th>

                                </tr>
                            </thead>

                            <tbody class="overscroll-y-scroll">
                                <!-- Je eine Reihe pro Teilnehmer -->
                                <tr v-for="participant in group.participants" :key="participant._id"
                                    @click="openEditParticipant(participant._id)"
                                    class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">

                                    <!-- Nachname -->

                                    <td class="py-2.5 group-last:pt-2.5 group-last:pb-0">
                                        <p>{{ participant.lastname }}</p>
                                    </td>

                                    <!-- Vorname -->

                                    <td class="px-3 md:px-4 py-2.5 group-last:pt-2.5 group-last:pb-0">
                                        <p>{{ participant.firstname }}</p>
                                    </td>

                                    <!-- Geburtstag -->

                                    <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0">
                                        <p class="text-light-gray">{{
                                            new Date(participant.birthday).toLocaleDateString('de-DE', {
                                                year: '2-digit', month:
                                                    '2-digit', day: '2-digit'
                                            })
                                        }}</p>
                                    </td>

                                    <!-- Pfeil nach rechts -->

                                    <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke-width="3" stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                        </svg>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <!-- Wird angezeigt, wenn keine Teilnehmer der Gruppe zugeteilt sind -->
                        <p v-if="this.group.participants === undefined || this.group.participants?.length === 0"
                            class="font-medium text-gray-500 text-center pt-2.5">Keine Teilnehmer gefunden</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="mx-auto flex flex-col items-center gap-4 mt-8" v-if="error.cause.noGroups">
            <span class="flex items-center gap-2 text-[#111827]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <p class="w-fit text-xl md:text-2xl font-medium ">Dir sind
                    keine Gruppen zugeordnet!</p>
            </span>
            <StandardButton @click="$router.back()">Zurück</StandardButton>
        </div>

        <ParticipantModal ref="addParticipantModal" type="add" access="trainer" @onClose="close()" :groupID="group?._id">
        </ParticipantModal>

        <ParticipantModal ref="editParticipantModal" type="edit" access="trainer" @onClose="close()" :groupID="group?._id">
        </ParticipantModal>
    </div>
</template>
    
<script>
import SelectList from "@/components/SelectList.vue";
import { useDataStore } from "@/store/dataStore";
import { fetchGroups, updateGroup, fetchGroup } from "@/util/fetchOperations";
import DaySelect from "@/components/DaySelect.vue";
import TextInput from "@/components/TextInput.vue";
import ErrorMessage from "@/components/ErrorMessage.vue";
import StandardButton from "@/components/StandardButton.vue";
import SortIcon from "@/components/SortIcon.vue";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import ParticipantModal from "@/components/ParticipantModal.vue";
import _ from "lodash";

export default {
    name: "MyGroupsView",
    setup() {
        const dataStore = useDataStore()
        return {
            dataStore
        }
    },
    data() {
        return {
            groups: [],
            group: undefined,
            selectedGroup: undefined,
            error: {
                cause: {
                    nameInput: false,
                    departmentInput: false,
                    timesInput: false,
                    venueInput: false,
                    noGroups: false
                },
                message: ''
            },
            tempTime: {
                day: '',
                starttime: '',
                endtime: ''
            },
            showNewTime: false,
            sorter: {
                "Montag": 1,
                "Dienstag": 2,
                "Mittwoch": 3,
                "Donnerstag": 4,
                "Freitag": 5,
                "Samstag": 6,
                "Sonntag": 7
            },
            sort: {
                key: 'lastname',
                index: {
                    lastname: 0,
                    firstname: 0,
                    birthday: 0
                }
            }
        }
    },
    components: {
        SelectList,
        CollapsibleContainer,
        DaySelect,
        TextInput,
        ErrorMessage,
        StandardButton,
        SortIcon,
        ParticipantModal
    },
    methods: {
        async close() {
            this.group = await fetchGroup(this.group._id)
            this.resetError()
        },

        async openEditParticipant(id) {
            //Deep Copy, damit Änderungen nicht direkt übernommen werden
            this.$refs.editParticipantModal.open(_.cloneDeep(this.group.participants.find(m => m.memberId === id)))
        },

        async saveChanges() {
            if (this.group.venue.trim().length === 0 || !this.group.venue.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
                this.error.message = 'Bitte gebe eine gültige Sportstätte ein.'
                this.error.show = true
                this.error.cause.venueInput = true
            }

            if (this.group.times.length === 0) {
                this.error.message = 'Bitte gebe mindestens eine Zeit an.'
                this.error.show = true
                this.error.cause.timesInput = true
            }

            if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
                this.error.message = 'Mehrere Fehler.'
            }

            if (!this.error.show) {
                this.group.department = this.group.department._id
                const res = await updateGroup(this.group._id, this.group)
                if (res.ok) {
                    this.close()
                } else {
                    this.error.message = res.body.message
                    this.error.show = true
                }
            }

        },

        resetError() {
            this.error.show = false
            this.error.cause = {
                venueInput: false,
                timesInput: false,
                firstnameInput: false
            }
            this.error.message = ''
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
        },

        async onSelectedGroupChanged() {
            this.group = await fetchGroup(this.selectedGroup._id)
            this.resetError()
        }
    },

    watch: {

        sort: {
            handler() {
                this.group.participants.sort((a, b) => {
                    if (this.sort.key === 'birthday') return this.sort.index["birthday"] === 1 ? new Date(b["birthday"]) - new Date(a["birthday"]) : new Date(a["birthday"]) - new Date(b["birthday"])
                    return this.sort.index[this.sort.key] === 1 ? b[this.sort.key].localeCompare(a[this.sort.key]) : a[this.sort.key].localeCompare(b[this.sort.key])
                })
            },
            deep: true
        },
    },

    async created() {
        document.title = 'Meine Gruppen - Attend'
        this.dataStore.viewname = "Meine Gruppen"
    },

    async mounted() {
        const res = await fetchGroups()
        if (!res.ok && res.status === 204) {
            // this.groups = []
            this.error.cause.noGroups = true
        } else {
            this.groups = res.body.map(g => { return { _id: g._id, name: g.name } })
            if (this.groups.length === 1) {
                this.selectedGroup = {
                    _id: this.groups[0]._id,
                    name: this.groups[0].name
                }
                this.onSelectedGroupChanged()
            }
        }
    },

    computed: {
        timeInputStyle() {
            const standard = "font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3"
            return this.error.cause.timesInput ? standard + ' border-2 rounded-lg border-special-red' : standard
        }
    }
}
</script>