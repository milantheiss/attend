<template>
    <div class="relative container">
        <div>
            <!--Abrechnungsanzeige-->
            <div v-if="typeof invoice !== 'undefined'">
                <div class="bg-white px-6 py-5 rounded-lg drop-shadow-md">
                    <!--Info Field-->
                    <div class="flex justify-between items-center">
                        <p class="text-gray-700 font-light text-base md:text-lg">Antragsteller: </p>
                        <p class="text-black font-normal text-base md:text-lg text-right">
                            {{ invoice.userInfo.firstname }} {{ invoice.userInfo.lastname }}
                        </p>
                    </div>

                    <div class="flex justify-between items-center">
                        <p class="text-gray-700 font-light text-base md:text-lg">Abteilung: </p>
                        <p class="text-black font-normal text-base md:text-lg text-right">{{
                            invoice.department.name
                        }}</p>
                    </div>

                    <div class="flex justify-between items-center">
                        <p class="text-gray-700 font-light text-base md:text-lg">Abrechnung für den Zeitraum: </p>
                        <p class="text-black font-normal text-base md:text-lg text-right"><span class="font-medium">{{
                            new Date(invoice.startdate).toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "short", day: "numeric"
                            })
                        }}</span>
                            bis <span class="font-medium">{{
                                new Date(invoice.enddate).toLocaleDateString("de-DE", {
                                    year: "numeric",
                                    month: "short", day: "numeric"
                                })
                            }}</span></p>
                    </div>

                    <div class="flex justify-between items-center">
                        <p class="text-gray-700 font-light text-base md:text-lg">Stundenanzahl gesamt: </p>
                        <p class="text-black font-medium text-base md:text-lg text-right">{{ convertToReadableTime(invoice.totalHours) }}</p>
                    </div>
                </div>

                <div class="mt-8">
                    <!--Je Gruppe ein Container-->
                    <div class="flex justify-between items-center min-w-full" v-for="(group, i) in invoice.groups"
                        :key="group._id">
                        <CollapsibleContainer :show="true" class="mb-4">
                            <template #header>
                                <p class="truncate text-xl font-semibold">{{ group.name }}</p>
                            </template>
                            <template #content>
                                <Card class="mb-4" v-for="(trainingsssession, index) in group.trainingssessions" :ref="`sessionCard${i}`"
                                    :key="trainingsssession._id" >
                                    <template #header>
                                        <h3>{{
                                            new Date(trainingsssession.date).toLocaleDateString("de-DE", {
                                                weekday:
                                                    "short", year: "numeric", month: "short", day: "numeric"
                                            })
                                        }}</h3>
                                    </template>
                                    <template #content>
                                        <div
                                            class="bg-white px-3.5 py-3 rounded-lg drop-shadow-md font-normal text-lg md:text-xl text-black overflow-hidden">
                                            <!--Chevron Up-->
                                            <div class="flex justify-between items-center mb-6" @click="$refs[`sessionCard${i}`][index].togglePanel()">
                                                <h3>{{
                                                    new Date(trainingsssession.date).toLocaleDateString("de-DE",
                                                        {
                                                            weekday: "short", year: "numeric", month: "short", day:
                                                                "numeric"
                                                        })
                                                }}</h3>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="2" stroke="currentColor" class="w-6 h-6"
                                                    >
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </div>
                                            <div class="flex justify-between items-center mb-3">
                                                <p class="text-gray-700 font-light text-base md:text-lg w-full">
                                                    Beginn: </p>
                                                <p class="text-black font-medium text-base md:text-lg text-right flex items-center">
                                                    {{ trainingsssession.starttime }}
                                                    <!--Clock Icon-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                        class="w-6 h-6 ml-2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>

                                                </p>
                                            </div>
                                            <div class="flex justify-between items-center mb-3">
                                                <p class="text-gray-700 font-light text-base md:text-lg w-full">
                                                    Ende: </p>
                                                <p class="text-black font-medium text-base md:text-lg text-right flex items-center">
                                                    {{ trainingsssession.endtime }}
                                                    <!--Clock Icon-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                                                        class="w-6 h-6 ml-2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>

                                                </p>
                                            </div>
                                            <div class="flex justify-between items-center mb-3">
                                                <p class="text-gray-700 font-light text-base md:text-lg w-full">
                                                    Stundenanzahl: </p>
                                                <p class="text-black font-bold text-base md:text-lg text-right">{{
                                                    convertToReadableTime(trainingsssession.totalHours)
                                                }}</p>
                                            </div>
                                        </div>
                                    </template>
                                </Card>
                            </template>
                        </CollapsibleContainer>
                    </div>
                </div>

                <!--Bestätigungsfeld-->
                <div class="bg-white px-6 py-5 rounded-lg drop-shadow-md">
                    <div class="flex items-center">
                        <CheckboxInput class="mr-3"></CheckboxInput>
                        <p class="text-black font-medium text-base md:text-lg text-left"><span
                                class="text-orange-600">TODO
                                Bestätigungsmessage</span>
                        </p>
                    </div>
                    <div class="flex justify-around items-center">
                        <button @click="reject"
                            class="flex items-center text-white bg-gradient-to-br from-slate-400 to-slate-500 px-5 md:px-6 py-2 rounded-lg drop-shadow-md"
                            :class="error.show ? 'mt-4' : 'mt-8'">
                            <p class="font-medium font-base md:text-lg">Ablehnen</p>
                        </button>
                        <button @click="approve"
                            class="flex items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-5 md:px-6 py-2 rounded-lg drop-shadow-md"
                            :class="error.show ? 'mt-4' : 'mt-8'">
                            <p class="font-medium font-base md:text-lg">Bestätigen</p>
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
    </div>
</template>

<script>
import { createInvoice } from "@/util/generatePdf"
import { fetchDataForNewInvoice, getInvoiceById } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import { ref } from 'vue';
import CheckboxInput from "@/components/CheckboxInput.vue";
import Card from "@/components/Card.vue";

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
            invoice: undefined,
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
            showToolbar: false,
            spin: false,
            //TODO sort by values in array eintragen
            sortBy: [

            ]
        }
    },
    components: {
        CollapsibleContainer,
        CheckboxInput,
        Card
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

        reject() {
            //Backend: Invoice wird als Rejected gesetzt & Submitter wird benachrichtigt
            //... Reviewer bekommt Message Prompt angezeigt um Rejection zu begründen
            this.dataStore.invoiceData = {}
        },

        async approve() {
            //Es wird Message an Backend gesendet --> Invoice wird als Approved gesetzt
            //... Submitter wird benachrichtigt

            //In Frontend: Invoice wird als PDF generiert und als Download angeboten
            //... bzw. als Email versendet/mailto Link generiert

            await createInvoice(this.filename, this.invoice)

            // this.status.show = true

            // this.dataStore.invoiceData.groups = this.dataStore.invoiceData.groups.filter(val => val.include)
            // this.dataStore.invoiceData.groups.forEach(group => delete group.include)

            // //Send Invoice
            // const res = await sendInvoice(this.dataStore.invoiceData)

            // if (res.status === 200 && await res.text() === "Invoice submitted") {
            //     this.status.success = true
            //     this.status.processing = false
            //     this.status.text = 'Abrechnung erfolgreich versendet!'
            //     //Trigger send success
            // } else {
            //     this.status.success = false
            //     this.status.processing = false
            //     this.status.text = 'Abrechnung konnte nicht versendet werden!'
            //     //Trigger send error
            // }

            // this.dataStore.invoiceData = {}
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
        },
        convertToReadableTime(timeInDecimal) {
            const hh = Math.trunc(timeInDecimal)
            const mm = Math.round(60 * (timeInDecimal - hh))
            return `${hh} Std ${mm} Min`
        },
    },
    async created() {
        document.title = 'Abrechnung prüfen - Attend'
        this.dataStore.viewname = "Abrechnung prüfen"

        const id = this.$route.query.id

        console.log(id);

        if (!id || typeof id !== "string") {
            console.error("No ID provided");
            this.$router.push("/openInvoices")
        }

        this.invoice = await getInvoiceById(id)

        if (typeof this.invoice.code !== "undefined") {
            console.error(this.invoice.message);
            this.$router.push("/openInvoices")
        }

        console.log(this.invoice);
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
    }
};
</script>
