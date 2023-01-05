<template>
    <div class="relative container">
        <div
            v-show="(Object.keys(dataStore?.invoiceData).length === 0 || !dataStore.invoiceData.groups?.some(val => val.trainingssessions.length > 0)) && !status.show">
            <!--Export Settings-->
            <div class="bg-white px-6 py-5 rounded-lg drop-shadow-md">
                <!--TODO WENN Trainer Daten incomplete -> Dialog-->
                <!--Dateiname-->
                <div class="flex items-center justify-between mb-4">
                    <label for="filename"
                        class="text-gray-700 font-normal md:font-light text-base md:text-lg ">Dateiname:</label>
                    <TextInput name="filename" v-model="filename" placeholder="Dateiname"
                        :showError="error.cause.filenameInput" class="ml-3"></TextInput>
                </div>
                <!--Gruppen also collapsable Dropdown-->
                <div class="flex items-start justify-between mb-4 w-full">
                    <p class="text-gray-700 font-normal md:font-light text-base md:text-lg ">Gruppe:</p>
                    <!--Add Collapsable Container here-->
                    <!--TODO Styling hier fixen-->
                    <CollapsibleContainer class="ml-3" :show="true">
                        <template #content>
                            <CheckboxList ref="checkboxList" :list="this.groups.map(val => val.name)" class=""
                                :sortAlphabetically="true" :default="true">
                            </CheckboxList>
                        </template>
                    </CollapsibleContainer>
                </div>
                <!--Timespan-->
                <div class="flex items-center justify-between mb-4">
                    <label for="startdate"
                        class="text-gray-700 font-normal md:font-light text-base md:text-lg w-full">Anfang:</label>
                    <DateInput v-model="startdate" name="startdate" :max="enddate" class="ml-3"></DateInput>
                </div>

                <div class="flex items-center justify-between mb-4">
                    <label for="enddate"
                        class="text-gray-700 font-normal md:font-light text-base md:text-lg w-full text-left">Ende:</label>
                    <DateInput v-model="enddate" name="enddate" class="ml-3"
                        :max="(new Date(Date.now()).toJSON()).slice(0, 10)" :min="startdate"></DateInput>
                </div>

                <ErrorMessage :message="error.message" :show="error.show"></ErrorMessage>

                <button @click="getInvoice"
                    class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-8 md:px-9 py-2.5 rounded-lg drop-shadow-md"
                    :class="error.show ? 'mt-4' : 'mt-8'">
                    <p class="font-medium font-base md:text-lg">Exportieren</p>
                </button>
            </div>
        </div>

        <!--Abrechnungsanzeige-->
        <div v-if="dataStore.invoiceData.groups?.some(val => val.trainingssessions.length > 0) && !status.show">
            <!--TODO Add ÜL Nummer Prompt-->
            <!--TODO ÜL Info-->
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
                        stroke="currentColor" class="w-14 h-14 animate-[spin_1s_linear_infinite]" v-show="status.processing">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>

                    <!--Check Circle-->
                    <!--TODO Fix Bounce-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75"
                        stroke="currentColor" class="w-16 h-16 text-lime-600 animate-smaller-bounce" v-show="status.success && !status.processing">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>

                    <!--X Circle-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.75"
                        stroke="currentColor" class="w-16 h-16 text-delete-gradient-1 animate-wiggle" v-show="!status.success && !status.processing">
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
import { fetchDataForNewInvoice, fetchGroups, sendInvoice } from '@/util/fetchOperations'
import ErrorMessage from "@/components/ErrorMessage.vue";
import TextInput from "@/components/TextInput.vue";
import DateInput from "@/components/DateInput.vue";
import { useDataStore } from "@/store/dataStore";
import CheckboxList from "@/components/CheckboxList.vue";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import TrainingssessionItem from "@/components/TrainingssessionItem.vue"
import { ref } from 'vue';
import CheckboxInput from "@/components/CheckboxInput.vue";

export default {
    name: "CreateInvoice",
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
            }
        }
    },
    components: {
        ErrorMessage,
        TextInput,
        DateInput,
        CheckboxList,
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

            this.dataStore.invoiceData = await fetchDataForNewInvoice(this.selectedGroups, new Date(this.startdate), new Date(this.enddate))
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
                console.log("🚀 ~ file: CreateInvoiceView.vue:151 ~ getInvoice ~ this.dataStore.invoiceData", this.dataStore.invoiceData)

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
            const group = this.dataStore.invoiceData.groups.find(val => val._id === session._id)
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
                console.log("Invoice submitted");
                //Trigger send success
            } else {
                this.status.success = false
                this.status.processing = false
                this.status.text = 'Abrechnung konnte nicht versendet werden!'
                //Trigger send error
            }

            this.dataStore.invoiceData = {}
        },
        ok(){
            this.status.show = false
            this.status.processing = true
            this.status.success = false
            this.status.text = 'Abrechnung wird versendet...'
        }
    },
    async created() {
        const res = await fetchGroups()
        console.log("🚀 ~ file: CreateInvoiceView.vue:278 ~ created ~ res", res)
        this.groups = (res).map(val => {
            return {
                name: val.name,
                _id: val.id
            }
        })
        document.title = 'Erstelle eine Abrechnung - Attend'
        this.dataStore.viewname = "Abrechnung erstellen"
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
                    if (typeof element.starttime === "undefined" || typeof element.endtime === "undefined") {
                        element.faultyTimes = true
                    } else {
                        //Formatiert Zeit vom Format 18:45 in 18,75
                        const startingTime = Number(element.starttime.split(":")[0]) + Number(element.starttime.split(":")[1] / 60) || 0;

                        const endingTime = Number(element.endtime.split(":")[0]) + Number(element.endtime.split(":")[1] / 60) || 0;

                        //Berechnet Länge des Trainings. Bsp: Für 1 Std 30 min --> 1,5
                        element.length = endingTime - startingTime;
                        element.length = element.length < 0 ? 0 : element.length
                        tHours += element.length
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
  