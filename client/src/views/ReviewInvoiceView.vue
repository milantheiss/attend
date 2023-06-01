<template>
    <div class="relative container">
        <div>
            <!--Abrechnungsanzeige-->
            <div v-if="typeof invoice !== 'undefined'" class="flex flex-col gap-7">
                <!--Invoice Info Field-->
                <div class="bg-white px-3.5 md:px-7 py-4 md:py-8 rounded-xl drop-shadow-md flex flex-col gap-1">
                    <div class="flex justify-between items-baseline">
                        <p class="text-light-gray font-normal">Antragsteller: </p>
                        <p class="font-medium text-right">
                            {{ invoice.submittedBy.firstname }} {{ invoice.submittedBy.lastname }}
                        </p>
                    </div>

                    <div class="flex justify-between items-baseline">
                        <p class="text-light-gray font-normal">Abteilung: </p>
                        <p class="font-medium text-right">{{
                            invoice.department.name
                        }}</p>
                    </div>

                    <div class="flex justify-between items-baseline">
                        <p class="text-light-gray font-normal truncate">Zeitraum: </p>
                        <p class="font-normal text-right">
                            <span class="font-medium">{{
                                new Date(invoice.startdate).toLocaleDateString("de-DE", {
                                    year: "numeric",
                                    month: "2-digit", day: "2-digit"
                                })
                            }}</span>
                            bis <span class="font-medium">{{
                                new Date(invoice.enddate).toLocaleDateString("de-DE", {
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

                    <div class="flex justify-between items-baseline">
                        <p class="text-light-gray font-normal truncate">Erstellungsdatum: </p>
                        <p class="font-medium text-right">
                            {{ new Date(invoice.dateOfReceipt).toLocaleDateString("de-DE", {
                                year: "numeric",
                                month: "2-digit", day: "2-digit"
                            }) }}
                        </p>
                    </div>
                </div>

                <div class="flex flex-col gap-4">
                    <!--Je Gruppe ein Container-->
                    <CollapsibleContainer class="flex min-w-full px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md"
                        :show="false" :enableClickOnHeader="false" v-for="(group, index) in invoice.groups" :key="group._id"
                        ref="groupCards"
                        :class="{ 'bg-white': showGroupCard[index], 'bg-gradient-to-b from-unchecked-gradient-1 to-unchecked-gradient-2': !showGroupCard[index] }">
                        <template #header>
                            <p class="truncate text-xl font-semibold">{{ group.name }}</p>
                        </template>
                        <template #content>
                            <table class="table-auto w-full text-left">
                                <thead>
                                    <tr class="border-b border-[#D1D5DB]">
                                        <th scope="col" class="pb-2.5 font-medium w-fit cursor-pointer" @click="onClickOnDate()">
                                            <span class="flex items-center gap-1">
                                            <SortIconDate :index="indexSortButtonDate"></SortIconDate>
                                            Datum
                                        </span>    
                                        </th>
                                        <th scope="col" class="pl-3 md:pl-4 pb-2.5 font-medium cursor-pointer" @click="onClickOnLength()">
                                            <span class="flex items-center gap-1">
                                            <SortIcon :index="indexSortButtonLength"></SortIcon>
                                            Länge
                                        </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(trainingssession) in getSortedTrainingssessionlist(group.trainingssessions)" :key="trainingssession._id"
                                        class="border-b border-[#E5E7EB] last:border-0 group">
                                        <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 font-medium w-fit">
                                            {{ new Date(trainingssession.date).toLocaleDateString("de-DE", {
                                                weekday: "short", year: "numeric",
                                                month: "2-digit", day: "2-digit"
                                            }) }}
                                        </td>
                                        <td
                                            class="pl-3 md:pl-4 py-2.5 group-last:pt-2.5 group-last:pb-0 min-w-[80px] md:min-w-[100px]">
                                            <p class="text-light-gray">{{
                                                convertToReadableTime(calcTime(trainingssession.starttime,
                                                    trainingssession.endtime)) }}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </template>
                    </CollapsibleContainer>
                </div>

                <!--Bestätigungsfeld-->
                <div class="flex justify-between items-center gap-7">
                    <button @click="reject"
                        class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
                        <p class="font-medium font-base md:text-lg">Ablehnen</p>
                    </button>
                    <button @click="approve"
                        class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
                        <p class="font-medium font-base md:text-lg">Genehmigen</p>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { createInvoice } from "@/util/generatePdf"
import { getInvoiceById, approveInvoice, rejectInvoice } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import { ref } from 'vue';
import SortIconDate from '@/components/SortIconDate.vue';
import SortIcon from '@/components/SortIcon.vue';

export default {
    name: "ReviewInvoice",
    setup() {
        const dataStore = useDataStore()
        const authStore = useAuthStore()
        const showCollapsibleContainer = ref(true);
        const groupCards = ref([]);

        return {
            dataStore,
            authStore,
            showCollapsibleContainer,
            groupCards
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
            showToolbar: false,
            spin: false,
            //Möglich: date_ascending, date_descending, weekday, length_ascending & length_descending
            //Standard: date_descending
            //Wenn ein anderer Wert als die hier aufgeführten übergeben wird, wird der Standardwert verwendet
            sortMode: "length_descending",
            indexSortButtonDate: 0,
            indexSortButtonLength: 0,
        }
    },
    components: {
        CollapsibleContainer,
        SortIconDate,
        SortIcon
    },
    methods: {
        async reject() {
            //Backend: Invoice wird als Rejected gesetzt & Submitter wird benachrichtigt
            //TODO Reviewer bekommt Message Prompt angezeigt um Rejection zu begründen
            const res = await rejectInvoice(this.invoice.id)
            if (res.status === 200 && await res.text() === "Invoice rejected") {
                this.$router.push({ path: "/invoices" })
            }
        },

        async approve() {
            //Es wird Message an Backend gesendet --> Invoice wird als Approved gesetzt
            //... Submitter wird benachrichtigt

            //In Frontend: Invoice wird als PDF generiert und als Download angeboten
            //... bzw. als Email versendet/mailto Link generiert

            this.invoice.totalHours = this.totalHours

            const res = await approveInvoice(this.invoice.id)
            if (res.status === 200 && await res.text() === "Invoice approved") {
                this.filename = `Abrechnung_${this.invoice.submittedBy.lastname}_${this.invoice.submittedBy.firstname}_${new Date(this.invoice.dateOfReceipt).toJSON().split("T")[0]}`

                await createInvoice(this.filename, this.invoice)
                this.$router.push({ path: "/invoices" })
            }
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

        //Sortiert eine gegebene Liste nach dem Sortiermodus
        getSortedTrainingssessionlist(trainingssessions) {
            if (this.sortMode === "date_descending") {
                return trainingssessions.sort((a, b) => {
                    return new Date(b.date) - new Date(a.date)
                })
            } else if (this.sortMode === "weekday") {
                return trainingssessions.sort((a, b) => {
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
        document.title = 'Abrechnung prüfen - Attend'
        this.dataStore.viewname = "Abrechnung prüfen"

        const id = this.$route.query.id

        if (!id || typeof id !== "string") {
            console.error("No ID provided");
            this.$router.push("/openInvoices")
        }

        this.invoice = await getInvoiceById(id)

        if (typeof this.invoice.code !== "undefined") {
            console.error(this.invoice.message);
            this.$router.push("/openInvoices")
        }
    },
    computed: {
        totalHours() {
            let tHours = 0

            this.invoice.groups.forEach(val => {
                val.trainingssessions.forEach(element => {
                    tHours += this.calcTime(element.starttime, element.endtime)
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
                return this.invoice.groups.map(() => false)
            }
        }
    }
};
</script>
