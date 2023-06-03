<template>
    <div class="relative container">
        <!--Pull Invoice Data Modal Dialog-->
        <!--Wird angezeigt, wenn keine Daten vorhanden sind-->
        <ModalDialog
            :show="(Object.keys(dataStore?.invoiceData).length === 0 || !dataStore.invoiceData.groups?.some(val => val.trainingssessions.length > 0)) && !status.show && showPullDataModal"
            :hasHeader="false" :hasSubheader="false" :disableClickOutside="true">
            <template #content>
                <div class="flex flex-col gap-4">
                    <!--Gruppen Auswahl-->
                    <CollapsibleContainer :show="true">
                        <template #header>
                            <p class="text-light-gray">Gruppe:</p>
                        </template>
                        <template #content>
                            <CheckboxList ref="checkboxList" :list="this.groups.map(val => val.name)" class=""
                                :sortAlphabetically="true" :default="true">
                            </CheckboxList>
                        </template>
                    </CollapsibleContainer>
                    <!--Timespan-->
                    <div class="flex items-center justify-between">
                        <label for="startdate" class="text-light-gray">Anfang:</label>
                        <DateInput v-model="startdate" name="startdate" :max="enddate" class="ml-3"></DateInput>
                    </div>

                    <div class="flex items-center justify-between">
                        <label for="enddate" class="text-light-gray">Ende:</label>
                        <DateInput v-model="enddate" name="enddate" class="ml-3"
                            :max="(new Date(Date.now()).toJSON()).slice(0, 10)" :min="startdate"></DateInput>
                    </div>

                    <ErrorMessage :message="error.message" :show="error.show"></ErrorMessage>
                </div>
            </template>

            <template #footer>
                <div class="flex gap-4">
                    <!--INFO Margin auf cancle Btn gleicht Offset von Outline aus-->
                    <button @click="cancel"
                        class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-3.5 md:px-7 my-0.5">
                        <p class="font-medium font-base md:text-lg">Abbrechen</p>
                    </button>
                    <button @click="getInvoiceData(startdate, enddate)"
                        class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
                        <p class="font-medium font-base md:text-lg">Weiter</p>
                    </button>
                </div>
            </template>
        </ModalDialog>

        <!--Abrechnungsanzeige-->
        <div v-if="dataStore.invoiceData.groups?.some(val => val.trainingssessions.length > 0) && !status.show">

            <!--TODO Add ÜL Nummer Prompt-->
            <!--TODO ÜL Info-->

            <!--Invoice Info Field-->
            <div class="bg-white px-3.5 md:px-7 py-4 md:py-8 rounded-xl drop-shadow-md flex flex-col gap-1">
                <div class="flex justify-between items-baseline">
                    <p class="text-light-gray font-normal">Antragsteller: </p>
                    <p class="font-medium text-right">
                        {{ dataStore.invoiceData.submittedBy.firstname }} {{ dataStore.invoiceData.submittedBy.lastname }}
                    </p>
                </div>

                <div class="flex justify-between items-baseline">
                    <p class="text-light-gray font-normal">Abteilung: </p>
                    <p class="font-medium text-right">{{
                        dataStore.invoiceData.department.name
                    }}</p>
                </div>

                <div class="flex justify-between items-baseline">
                    <p class="text-light-gray font-normal">Abrechnungszeitraum: </p>
                    <p class="font-normal text-right">
                        <span class="font-medium">{{
                            new Date(dataStore.invoiceData.startdate).toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "2-digit", day: "2-digit"
                            })
                        }}</span>
                        bis
                        <span class="font-medium">{{
                            new Date(dataStore.invoiceData.enddate).toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "2-digit", day: "2-digit"
                            })
                        }}</span>
                    </p>
                </div>
                <div class="flex justify-between items-baseline">
                    <p class="text-light-gray font-normal">Stundenanzahl gesamt: </p>
                    <p class="font-medium text-right">{{ convertToReadableTime(totalHours) }}</p>
                </div>
            </div>

            <!--Group Cards: Alle Gruppe, der Invoice-->
            <div class="my-7 flex flex-col gap-5">
                <!--Je Gruppe ein Container-->
                <CollapsibleContainer class="flex min-w-full px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md " :show="false"
                    :enableClickOnHeader="false" v-for="(group, index) in dataStore.invoiceData.groups" ref="groupCards"
                    :key="group._id"
                    :class="{ 'bg-white': showGroupCard[index], 'bg-gradient-to-b from-unchecked-gradient-1 to-unchecked-gradient-2': !showGroupCard[index] }">
                    <template #header>
                        <CheckboxInput class="mr-3" v-model="group.include"></CheckboxInput>
                        <p class="truncate text-xl font-semibold"
                            :class="!group.include ? 'text-light-gray line-through' : ''">{{ group.name }}</p>
                    </template>
                    <template #content>
                        <div class="h-fit max-h-[55vh] overflow-y-auto block">
                            <table class="table-auto w-full text-left">
                                <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
                                    <tr class="">
                                        <th class="font-medium w-fit cursor-pointer"
                                            @click="onClickOnDate()">
                                            <span class="flex items-center gap-1">
                                                <SortIconDate :index="indexSortButtonDate"></SortIconDate>
                                                Datum
                                            </span>
                                        </th>
                                        <th
                                            class="w-[80px] md:w-[100px] px-3 md:px-4 pb-2.5 font-medium cursor-pointer"
                                            @click="onClickOnLength()">
                                            <span class="flex items-center gap-1">
                                                <SortIcon :index="indexSortButtonLength"></SortIcon>
                                                Länge
                                            </span>
                                        </th>
                                        <th class="hidden ty:table-cell pb-2.5 font-medium w-full"></th>
                                    </tr>
                                </thead>
                                <tbody class="overscroll-y-scroll">
                                    <tr v-for="(trainingssession) in getSortedTrainingssessionlist(group.trainingssessions)"
                                        :key="trainingssession._id"
                                        @click="goToTrainingssession(group._id, trainingssession.date)"
                                        class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                                        <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 font-medium w-fit">
                                            {{ new Date(trainingssession.date).toLocaleDateString("de-DE", {
                                                weekday: "short", year: "numeric",
                                                month: "2-digit", day: "2-digit"
                                            }) }}
                                        </td>
                                        <td class="px-3 md:px-4 py-2.5 group-last:pt-2.5 group-last:pb-0 w-[80px] md:w-[100px]">
                                            <p class="text-light-gray">{{
                                                convertToReadableTime(calcTime(trainingssession.starttime,
                                                    trainingssession.endtime)) }}</p>
                                        </td>
                                        <td
                                            class="hidden ty:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end">
                                            <!--Arrow Right-->
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="3" stroke="currentColor"
                                                class="w-7 md:w-8 h-7 md:h-8 ml-auto">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                                            </svg>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </template>
                </CollapsibleContainer>
            </div>

            <!--Bestätigungsfeld-->
            <div class="">
                <ErrorMessage :message="error.message" :show="error.show" class="mt-4"></ErrorMessage>
                <div class="flex justify-between items-center gap-7 mb-20">
                    <button @click="cancel"
                        class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-3.5 md:px-7 py-3.5"
                        :class="error.show ? 'mt-4' : ''">
                        <p class="font-medium font-base md:text-lg">Abbrechen</p>
                    </button>
                    <button @click="send"
                        class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4"
                        :class="error.show ? 'mt-4' : ''">
                        <p class="font-medium font-base md:text-lg">Versenden</p>
                    </button>
                </div>
            </div>
        </div>

        <!--Sendebestätigung-->
        <ModalDialog :show="status.show" :hasHeader="false" :hasSubheader="false" @onClose="cancel">
            <template #content>
                <div class="flex flex-col justify-center items-center gap-4">
                    <div class="flex justify-center items-center w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="w-14 h-14 animate-[spin_1s_linear_infinite]"
                            v-show="status.processing">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>

                        <!--Check Circle-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="w-16 h-16 text-lime-600"
                            v-show="status.success && !status.processing">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>

                        <!--X Circle-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                            stroke="currentColor" class="w-16 h-16 text-delete-gradient-1"
                            v-show="!status.success && !status.processing">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p class="font-semibold text-center">{{ status.text }}</p>
                </div>
            </template>
            <template #footer>
                <button @click="cancel"
                    class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
                    <p class="font-medium">Fertig</p>
                </button>
            </template>
        </ModalDialog>
    </div>
</template>

<script>
import _ from "lodash"
import { fetchDataForNewInvoice, fetchGroups, sendInvoice } from '@/util/fetchOperations'
import ErrorMessage from "@/components/ErrorMessage.vue";
import DateInput from "@/components/DateInput.vue";
import { useDataStore } from "@/store/dataStore";
import CheckboxList from "@/components/CheckboxList.vue";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import { ref } from 'vue';
import CheckboxInput from "@/components/CheckboxInput.vue";
import ModalDialog from '@/components/ModalDialog.vue';
import SortIconDate from '@/components/SortIconDate.vue';
import SortIcon from '@/components/SortIcon.vue';

export default {
    name: "CreateInvoice",
    setup() {
        const dataStore = useDataStore()
        const showCollapsibleContainer = ref(true);
        const groupCards = ref([]);

        return {
            groupCards,
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
                    noData: false
                }
            },
            status: {
                text: 'Abrechnung wird versendet...',
                show: false,
                processing: true,
                success: false,
            },
            showPullDataModal: true,
            //Möglich: date_ascending, date_descending, weekday, length_ascending & length_descending
            //Standard: date_ascending
            //Wenn ein anderer Wert als die hier aufgeführten übergeben wird, wird der Standardwert verwendet
            sortMode: "date_asceding",
            indexSortButtonDate: 0,
            indexSortButtonLength: 0,
        }
    },
    components: {
        ErrorMessage,
        DateInput,
        CheckboxList,
        CollapsibleContainer,
        CheckboxInput,
        ModalDialog,
        SortIconDate,
        SortIcon
    },
    methods: {
        async getInvoiceData(startdate, enddate) {
            if (!this.hasAnError()) {
                //Diese Methode muss aufgeteilt werden, da sonst der InvoiceData Reload nicht funktioniert, da selectedGroups Computed ist und checkboxList.selectedElements nicht gesetzt ist, wenn das Pull Data Modal übersprungen wird
                this.pullInvoiceData(this.selectedGroups, startdate, enddate)
            }
        },

        async pullInvoiceData(selectedGroups, startdate, enddate) {
            this.dataStore.invoiceData = await fetchDataForNewInvoice(selectedGroups, new Date(startdate), new Date(enddate))
            this.dataStore.invoiceData.groups.forEach(group => group.include = true)

            if (!this.dataStore.invoiceData.groups?.some(val => val.trainingssessions.length > 0)) {
                this.error.show = true
                this.error.cause.noData = true
                this.error.message = 'Es konnten keine abrechenbare Trainingsstunden gefunden werden!\nBitte kontrolliere, dass du die richtige Zeitspanne und Gruppen ausgewählt hast.'
                this.dataStore.invoiceData = {}
            } else {
                this.showPullDataModal = false
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
            this.error.cause.noData = false

            if (this.error.cause.groupInput) {
                this.error.message = "Es muss mindesten eine Gruppe ausgewählt sein.";
            }

            return this.error.show;
        },

        cancel() {
            this.showPullDataModal = false
            this.$router.push({ path: "/invoices" })
            this.error.show = false
            this.dataStore.invoiceData = {}
        },

        async send() {
            //Fehlerprüfung: Fehlende Zeiten
            if (this.dataStore.invoiceData.groups.some(val => val.trainingssessions.some(v => v.faultyTimes === true))) {
                this.error.message = "Jede Trainingsstunde muss eine Start- und Endzeit haben!"
                this.error.show = true;
                return
            }

            //Status wird angezeigt
            this.status.show = true

            this.dataStore.invoiceData.groups = this.dataStore.invoiceData.groups.filter(val => val.include)
            this.dataStore.invoiceData.groups.forEach(group => delete group.include)

            //Send Invoice
            this.error.show = false

            const res = await sendInvoice(this.dataStore.invoiceData)

            if (res.status === 200 && await res.text() === "Invoice submitted") {
                this.status.success = true
                this.status.processing = false
                this.status.text = 'Abrechnung erfolgreich versendet!'
            } else {
                this.status.success = false
                this.status.processing = false
                this.status.text = 'Abrechnung konnte nicht versendet werden!'
            }

            this.dataStore.invoiceData = {}
        },

        ok() {
            // OK Button in Status
            this.status.show = false
            this.status.processing = true
            this.status.success = false
            this.status.text = 'Abrechnung wird versendet...'
        },

        convertToReadableTime(timeNumberic) {
            const hh = Math.trunc(timeNumberic)
            const mm = ("0" + Math.round(60 * (timeNumberic - hh))).slice(-2)
            return `${hh}:${mm} Std`
        },

        calcTime(starttime, endtime) {
            //Formatiert Zeit vom Format 18:45 in 18,75
            // Wird mit 100 multipliziert, um Floating Point Fehler zu vermeiden
            const starttimeNumeric = Number(starttime.split(":")[0]) * 100 + (Number(starttime.split(":")[1]) / 60 * 100) || 0;

            const endtimeNumeric = Number(endtime.split(":")[0]) * 100 + (Number(endtime.split(":")[1]) / 60 * 100) || 0;

            //Berechnet Länge des Trainings. Bsp: Für 1 Std 30 min --> 1,5
            return endtimeNumeric - starttimeNumeric > 0 && starttimeNumeric > 0 ? (endtimeNumeric - starttimeNumeric) / 100 : 0;
        },

        goToTrainingssession(groupId, date) {
            date = date.slice(0, 10)

            this.$router.push({ path: `/attendancelist`, query: { groupId: groupId, date: date } })
        },

        //Sortiert eine gegebene Liste nach dem Sortiermodus
        getSortedTrainingssessionlist(trainingssessions) {
            if (this.sortMode === "date_descending") {
                return trainingssessions.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date)
                })
            } else if (this.sortMode === "weekday") {
                //Make deep copy of trainingssessions
                let t = _.cloneDeep(trainingssessions)

                t.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date)
                })
                return t.sort((a, b) => {
                    return new Date(a.date).getDay() - new Date(b.date).getDay()
                })
            } else if (this.sortMode === "length_ascending") {
                return trainingssessions.sort((a, b) => {
                    return this.calcTime(a.starttime, a.endtime) - this.calcTime(b.starttime, b.endtime)
                })
            } else if (this.sortMode === "length_descending") {
                return trainingssessions.sort((a, b) => {
                    return this.calcTime(b.starttime, b.endtime) - this.calcTime(a.starttime, a.endtime)
                })
            } else {
                //INFO Sort Mode date_ascending ist default. Wenn Sort Mode string invalid, wird nach Datum aufsteigend sortiert
                return trainingssessions.sort((a, b) => {
                    return new Date(a.date) - new Date(b.date)
                })
            }
        },

        onClickOnDate() {
            const sortModes = ["date_ascending", "date_descending", "weekday"]
            this.indexSortButtonDate = (this.indexSortButtonDate + 1) % sortModes.length
            this.sortMode = sortModes[this.indexSortButtonDate]
        },

        onClickOnLength() {
            const sortModes = ["length_ascending", "length_descending"]
            this.indexSortButtonLength = (this.indexSortButtonLength + 1) % sortModes.length
            this.sortMode = sortModes[this.indexSortButtonLength]
        },
    },
    async created() {
        const res = await fetchGroups()
        this.groups = (res).map(val => {
            return {
                name: val.name,
                _id: val._id
            }
        })

        document.title = 'Erstelle eine Abrechnung - Attend'
        this.dataStore.viewname = "Abrechnung erstellen"
    },
    async mounted() {
        if (typeof this.dataStore.invoiceData?.startdate !== "undefined" && typeof this.dataStore.invoiceData?.enddate !== "undefined") {
            const groups = this.dataStore.invoiceData.groups.map(val => val._id)
            await this.pullInvoiceData(groups, this.dataStore.invoiceData.startdate, this.dataStore.invoiceData.enddate)
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
                        tHours += this.calcTime(element.starttime, element.endtime);
                    }
                })
            })

            return tHours
        },
        showGroupCard() {
            //INFO Das konditionelle Styling funktioniert in diesem Fall nur, wenn die Refs in 'setup' aufgesetzt werden.

            //Wenn Ref initialisiert wurde, dann soll der Wert von showContent zurückgegeben werden
            if (typeof this.groupCards !== "undefined" && this.groupCards?.length > 0) {
                return this.groupCards.map(val => val.showContent)
            } else {
                //Wenn Ref noch nicht initialisiert ist, dann wird als default false zurückgegeben
                return this.dataStore.invoiceData.groups.map(() => false)
            }
        }
    }
};
</script>
```
