<template>
    <div class="relative container">
        <div>
            <!--Toolbar toggle-->
            <div class="flex justify-between items-center w-full mb-4">
                <Transition>
                    <span class="w-8 h-8 ml-3 shrink-0" @click="refresh" ref="refreshIcon"
                        :class="spin ? 'animate-refreshSpin' : ''" @animationend="spin = false">
                        <!--Refresh Icon-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    </span>
                </Transition>
                <p
                    class="text-dark-grey text-base sm:text-lg font-normal w-full text-right hidden ty:block align-middle ml-3 mt-1">
                    Sortieren: </p>
                <span class="mx-3 w-[40rem] sm:w-64">
                    <select v-model="sortBy" class="block
                        w-full
                        pl-2 pb-0.5 
                        text-black text-lg md:text-xl align-middle
                        focus:ring-0 focus:border-dark-grey
                        bg-inherit border-0 border-b-2 border-gray-300 rounded-none"
                        style="background-position: right 0.1rem center;padding-right: 1.9rem;">
                        <option value="date" default>Datum</option>
                        <option value="read">Ungelesen</option>
                        <option value="title">Betreff</option>
                    </select>
                </span>
                <span class="mr-[0.372rem]" v-show="allAssignedInvoices.length !== 0">
                    <!--Horizontal Dots-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" v-show="!showToolbar" @click="showToolbar = true" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <!--X in Circle-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" v-show="showToolbar" @click="showToolbar = false" class="w-8 h-8">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            </div>

            <!--Toolbar-->
            <!--TODO Methoden implementieren-->
            <transition enter-active-class="transition ease-in-out duration-500"
                enter-from-class="-translate-y-8 opacity-0" enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition ease-in-out duration-500" leave-from-class="translate-y-0 opacity-100"
                leave-to-class="-translate-y-7 opacity-0">
                <div class="flex justify-between items-center w-full mb-4" v-show="showToolbar">
                    <span class="flex ml-4">
                        <div class="bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 p-1.5 rounded-lg mr-6"
                            @click="deleteSelected">
                            <!--Trashcan icon-->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="#ffffff" class="w-9 h-9">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>
                        </div>
                        <div class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 p-1.5 rounded-lg"
                            @click="setSelectedAsRead">
                            <!--Read icon-->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                stroke="#ffffff" class="w-9 h-9">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
                            </svg>
                        </div>
                    </span>
                    <!--Select all-->
                    <CheckboxInput class="mr-2" v-model="selectAll"></CheckboxInput>
                </div>
            </transition>

            <!--InvoiceCard-->
            <div class="flex justify-start items-center bg-white rounded-lg drop-shadow-md p-1 mb-2"
                v-for="invoice in allAssignedInvoices" :key="invoice.id">
                <div class="flex flex-col w-full">
                    <div class="flex items-center w-full" @click="goToInvoice(invoice.id)">
                        <!--New Notification Dot ~ Blauer Pulsierender Punkt-->
                        <div class="flex h-4 w-4 ml-2.5 mr-1" v-show="invoice.status === 'pending'">
                            <div
                                class="animate-[ping_1.5s_ease-in_infinite] absolute inline-flex h-4 w-4 rounded-full bg-standard-gradient-1 opacity-75">
                            </div>
                            <div class="relative inline-flex rounded-full h-4 w-4 bg-standard-gradient-2"></div>
                        </div>
                        <div class="flex w-full mx-2">
                            <p class="text-xl font-light text-dark-grey">{{
                                new Date(invoice.startdate).toLocaleDateString('de-DE', {
                                    year: 'numeric', month:
                                        'numeric', day: 'numeric'
                                })
                            }}</p>
                            <p class="mx-2 text-xl font-light text-dark-grey ">-</p>
                            <p class="text-xl font-light text-dark-grey">{{
                                new Date(invoice.enddate).toLocaleDateString('de-DE', {
                                    year: 'numeric', month:
                                        'numeric', day: 'numeric'
                                })
                            }}</p>

                        </div>
                        <!--
                        <transition enter-active-class="transition ease-in-out duration-700"
                            enter-from-class="opacity-0" enter-to-class="opacity-100"
                            leave-active-class="transition ease-in-out duration-500" leave-from-class="opacity-100"
                            leave-to-class="opacity-0">
                            <CheckboxInput class="mr-1 " v-if="showToolbar" @click="true"
                                v-model="localNotifications[index].selected"></CheckboxInput>
                        </transition>
                    -->
                    </div>
                    <p class="text-xl font-normal text-[#3f3f3f] mt-2 ml-2">{{
                        invoice.message
                    }}</p>
                </div>
            </div>
            <!--TODO Style den Text-->
            <p v-show="typeof dataStore.notifications === 'undefined' || dataStore.notifications?.length === 0"
                class="text-xl md:text-2xl font-normal text-gray-500 text-center">Keine
                Benachrichtigungen</p>
        </div>












        <!--Abrechnungsanzeige-->
        <div v-if="dataStore.invoiceData.groups?.some(val => val.trainingssessions.length > 0) && !status.show">
            <div class="bg-white px-6 py-5 rounded-lg drop-shadow-md">
                <!--Info Field-->
                <div class="flex justify-between items-center">
                    <p class="text-gray-700 font-light text-base md:text-lg">Abrechnung für den Zeitraum: </p>
                    <p class="text-black font-normal text-base md:text-lg text-right"><span class="font-medium">{{
                        new Date(dataStore.invoiceData.startdate).toLocaleDateString("de-DE", {
                            year: "numeric",
                            month: "short", day: "numeric"
                        })
                    }}</span>
                        bis <span class="font-medium">{{
                            new Date(dataStore.invoiceData.enddate).toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "short", day: "numeric"
                            })
                        }}</span></p>
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-gray-700 font-light text-base md:text-lg">Name: </p>
                    <p class="text-black font-normal text-base md:text-lg text-right">
                        {{ dataStore.invoiceData.userInfo.firstname }} {{ dataStore.invoiceData.userInfo.lastname }}
                    </p>
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-gray-700 font-light text-base md:text-lg">Abteilung: </p>
                    <p class="text-black font-normal text-base md:text-lg text-right">{{
                        dataStore.invoiceData.department.name
                    }}</p>
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-gray-700 font-light text-base md:text-lg"> </p>
                </div>
                <div class="flex justify-between items-center">
                    <p class="text-gray-700 font-light text-base md:text-lg">Stundenanzahl gesamt: </p>
                    <p class="text-black font-medium text-base md:text-lg text-right">{{ readableTotalHours }}</p>
                </div>
            </div>

            <div class="mt-8">
                <!--Je Gruppe ein Container-->
                <div class="flex justify-between items-center min-w-full" v-for="group in dataStore.invoiceData.groups"
                    :key="group._id">
                    <CollapsibleContainer :show="group.include" class="mb-4">
                        <template #header>
                            <CheckboxInput class="mr-3" v-model="group.include"></CheckboxInput>
                            <p class="truncate text-xl font-semibold"
                                :class="!group.include ? 'text-light-gray line-through' : ''">{{ group.name }}</p>
                        </template>
                        <template #content>
                            <!--Je Trainingsstunde ein Element-->
                            <!--TODO Auswechseln für reine Anzeige-->
                            <TrainingssessionItem class="mb-4"
                                v-for="(trainingsssession, index) in group.trainingssessions"
                                :key="trainingsssession._id" v-model="group.trainingssessions[index]"
                                @onClickOnRemove="(session) => removeTrainingssession(session)">
                            </TrainingssessionItem>
                        </template>
                    </CollapsibleContainer>
                </div>
            </div>

            <!--Bestätigungsfeld-->
            <div class="bg-white px-6 py-5 rounded-lg drop-shadow-md">
                <div class="flex items-center">
                    <CheckboxInput class="mr-3"></CheckboxInput>
                    <p class="text-black font-medium text-base md:text-lg text-left"><span class="text-orange-600">TODO
                            Bestätigungsmessage</span>
                    </p>
                </div>
                <div class="flex justify-around items-center">
                    <button @click="cancel"
                        class="flex items-center text-white bg-gradient-to-br from-slate-400 to-slate-500 px-5 md:px-6 py-2 rounded-lg drop-shadow-md"
                        :class="error.show ? 'mt-4' : 'mt-8'">
                        <p class="font-medium font-base md:text-lg">Abbrechen</p>
                    </button>
                    <button @click="send"
                        class="flex items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-5 md:px-6 py-2 rounded-lg drop-shadow-md"
                        :class="error.show ? 'mt-4' : 'mt-8'">
                        <p class="font-medium font-base md:text-lg">Senden</p>
                    </button>
                </div>
            </div>
        </div>

        <!--Sendebestätigung-->
        <div class="bg-white px-6 py-5 rounded-lg drop-shadow-md" v-show="status.show">
            <div class="flex flex-col justify-center items-center">
                <div class="mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                        stroke="currentColor" class="w-14 h-14 animate-[spin_1s_linear_infinite]"
                        v-show="status.processing">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>

                    <!--Check Circle-->
                    <!--TODO Fix Bounce-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75"
                        stroke="currentColor" class="w-16 h-16 text-lime-600 animate-smaller-bounce"
                        v-show="status.success && !status.processing">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    <!--X Circle-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75"
                        stroke="currentColor" class="w-16 h-16 text-delete-gradient-1 animate-wiggle"
                        v-show="!status.success && !status.processing">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <p class="mb-3 text-lg">{{ status.text }}</p>
                <button @click="ok"
                    class="flex items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-4 md:px-5 py-1.5 rounded-lg drop-shadow-md">
                    <p class="font-medium font-base md:text-lg">Okay</p>
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { createInvoice } from "@/util/generatePdf"
import { fetchDataForNewInvoice, fetchGroups, sendInvoice, getAllAssignedInvoices } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import TrainingssessionItem from "@/components/TrainingssessionCard.vue"
import { ref } from 'vue';
import CheckboxInput from "@/components/CheckboxInput.vue";

export default {
    name: "ReviewInvoice",
    setup() {
        const dataStore = useDataStore()
        const showCollapsibleContainer = ref(true);

        return {
            dataStore,
            showCollapsibleContainer
        }
    },
    data() {
        return {
            filename: 'anwesenheitslist',
            groups: [],
            startdate: new Date(Date.now()).toJSON().slice(0, 10),
            enddate: new Date(Date.now()).toJSON().slice(0, 10),
            error: {
                message: "Fehler",
                show: false,
                cause: {
                    groupInput: false,
                    filenameInput: false,
                    noData: false
                }
            },
            status: {
                text: 'Abrechnung wird versendet...',
                show: false,
                processing: true,
                success: false,
            },
            allAssignedInvoices: [],
            showToolbar: false,
            spin: false,
            //TODO sort by values in array eintragen
            sortBy: [

            ]
        }
    },
    components: {
        CollapsibleContainer,
        TrainingssessionItem,
        CheckboxInput
    },
    methods: {
        /**
         * Zieht Attendance Daten von der Datenbank und erstellt mit @see createList() ein neues PDF
         */
        async exportPDF() {
            //if (!this.hasAnError()) {
            //TODO --> Erstelle zwei Abrechnungen für Gruppenauswahl mit zwei Departments

            //this.dataStore.invoiceData = await fetchDataForNewInvoice(this.selectedGroups, new Date(this.startdate), new Date(this.enddate))
            // if (attendance.dates.length === 0) {
            //     this.error.show = true
            //     this.error.cause.timespanFaulty = true
            //     this.error.message = 'Es wurden keine Teilnehmerlisten in der gewählten Zeitspanne gefunden!'
            // } else {
            await createInvoice(this.filename, this.dataStore.invoiceData)
            // }
            //}
        },
        async getInvoice() {
            if (!this.hasAnError()) {
                this.dataStore.invoiceData = await fetchDataForNewInvoice(this.selectedGroups, new Date(this.startdate), new Date(this.enddate))
                this.dataStore.invoiceData.groups.forEach(group => group.include = true)

                if (!this.dataStore.invoiceData.groups?.some(val => val.trainingssessions.length > 0)) {
                    this.error.show = true
                    this.error.cause.noData = true
                    this.error.message = 'Es konnten keine abrechenbare Trainingsstunden gefunden werden!\nBitte kontrolliere, dass du die richtige Zeitspanne und Gruppen ausgewählt hast.'
                    this.dataStore.invoiceData = {}
                }
            }
        },

        /**
         * Checkt ob ein Fehler vorliegt.
         * Error Timespan Faulty kann erst getriggert werden, wenn Attendance List von der Datenbank gezogen wurde.
         */
        hasAnError() {
            this.error.message = "Keine Fehler"

            this.error.show = this.selectedGroups.length === 0 || typeof this.filename !== "string" || this.filename.trim().length === 0;
            this.error.cause.groupInput = this.selectedGroups.length === 0
            this.error.cause.filenameInput = typeof this.filename !== "string" || this.filename.trim().length === 0
            this.error.cause.noData = false

            if (this.error.cause.groupInput) {
                this.error.message = "Es muss mindesten eine Gruppe ausgewählt sein.";
            } else if (this.error.cause.filenameInput) {
                this.error.message = "Es muss ein Dateiname angegeben werden."
            }

            this.error.message = this.error.cause.groupInput && this.error.cause.filenameInput ? "Mehrere Fehler." : this.error.message

            return this.error.show;
        },

        removeTrainingssession(session) {
            const group = this.dataStore.invoiceData.groups.find(val => val._id === session.groupID)
            const index = group.trainingssessions.indexOf(session)
            group.trainingssessions.splice(index, 1)
        },

        cancel() {
            this.dataStore.invoiceData = {}
        },

        async send() {
            this.status.show = true

            this.dataStore.invoiceData.groups = this.dataStore.invoiceData.groups.filter(val => val.include)
            this.dataStore.invoiceData.groups.forEach(group => delete group.include)

            //Send Invoice
            const res = await sendInvoice(this.dataStore.invoiceData)

            if (res.status === 200 && await res.text() === "Invoice submitted") {
                this.status.success = true
                this.status.processing = false
                this.status.text = 'Abrechnung erfolgreich versendet!'
                //Trigger send success
            } else {
                this.status.success = false
                this.status.processing = false
                this.status.text = 'Abrechnung konnte nicht versendet werden!'
                //Trigger send error
            }

            this.dataStore.invoiceData = {}
        },
        ok() {
            this.status.show = false
            this.status.processing = true
            this.status.success = false
            this.status.text = 'Abrechnung wird versendet...'
        },
        refresh() {
            //TODO --> Refresh Invoice

            this.spin = true
            setTimeout(() => {
                this.spin = false
            }, 1000)
        },
        goToInvoice(id) {
            //TODO --> Go to Invoice by ID
            console.log(id);
        }
    },
    async created() {
        const res = await fetchGroups()
        this.groups = (res).map(val => {
            return {
                name: val.name,
                _id: val.id
            }
        })
        document.title = 'Erstelle eine Abrechnung - Attend'
        this.dataStore.viewname = "Offene Abrechnungen"
    },
    watch: {
        totalHours(newVal) {
            this.dataStore.invoiceData.totalHours = newVal
        }
    },
    computed: {
        selectedGroups() {
            return (this.groups.filter(val => this.$refs.checkboxList.selectedElements.includes(val.name))).map(val => val._id)
        },
        totalHours() {
            let tHours = 0

            this.dataStore.invoiceData.groups?.filter(val => val.include).forEach(val => {
                val.trainingssessions.forEach(element => {
                    if (typeof element.starttime !== "string" || typeof element.endtime !== "string" || element.starttime === "" || element.endtime === "") {
                        element.faultyTimes = true
                    } else {
                        //Formatiert Zeit vom Format 18:45 in 18,75
                        const starttimeNumeric = Number(element.starttime.split(":")[0]) + Number(element.starttime.split(":")[1] / 60) || 0;

                        const endtimeNumeric = Number(element.endtime.split(":")[0]) + Number(element.endtime.split(":")[1] / 60) || 0;

                        //Berechnet Länge des Trainings. Bsp: Für 1 Std 30 min --> 1,5
                        tHours += endtimeNumeric - starttimeNumeric > 0 && starttimeNumeric > 0 ? endtimeNumeric - starttimeNumeric : 0;
                    }
                })
            })

            return tHours
        },
        readableTotalHours() {
            const hh = Math.trunc(this.totalHours)
            const mm = Math.round(60 * (this.totalHours - hh))
            return `${hh} Std ${mm} Min`
        }
    },
    async mounted() {
        this.allAssignedInvoices = await getAllAssignedInvoices()
        console.log(this.allAssignedInvoices);
    }
};
</script>
