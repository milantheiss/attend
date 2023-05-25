<template>
    <div class="relative container">
        <div>
            <!--Abrechnungsanzeige-->
            <div v-if="typeof invoice !== 'undefined' && !this.status.show">
                <div class="bg-white px-6 py-5 rounded-lg drop-shadow-md">
                    <!--Info Field-->
                    <div class="flex justify-between items-center">
                        <p class="text-gray-700 font-light text-base md:text-lg">Antragsteller: </p>
                        <p class="text-black font-normal text-base md:text-lg text-right">
                            {{ invoice.submittedBy.firstname }} {{ invoice.submittedBy.lastname }}
                        </p>
                    </div>

                    <div class="flex justify-between items-center">
                        <p class="text-gray-700 font-light text-base md:text-lg">Abteilung: </p>
                        <p class="text-black font-normal text-base md:text-lg text-right">{{
                            invoice.department.name
                        }}</p>
                    </div>

                    <div class="flex justify-between items-center">
                        <p class="text-gray-700 font-light text-base md:text-lg">Abrechnungszeitraum: </p>
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
                        <p class="text-black font-medium text-base md:text-lg text-right">{{
                            convertToReadableTime(totalHours) }}</p>
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
                                <Card class="mb-4" v-for="(trainingsssession, index) in group.trainingssessions"
                                    :ref="`sessionCard${i}`" :key="trainingsssession._id">
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
                                            <div class="flex justify-between items-center mb-6"
                                                @click="$refs[`sessionCard${i}`][index].togglePanel()">
                                                <h3>{{
                                                    new Date(trainingsssession.date).toLocaleDateString("de-DE",
                                                        {
                                                            weekday: "short", year: "numeric", month: "short", day:
                                                                "numeric"
                                                        })
                                                }}</h3>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                    stroke-width="2" stroke="currentColor" class="w-6 h-6">
                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                        d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                                                </svg>
                                            </div>
                                            <div class="flex justify-between items-center mb-3">
                                                <p class="text-gray-700 font-light text-base md:text-lg w-full">
                                                    Beginn: </p>
                                                <p
                                                    class="text-black font-medium text-base md:text-lg text-right flex items-center">
                                                    {{ trainingsssession.starttime }}
                                                    <!--Clock Icon-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        stroke-width="2" stroke="currentColor" class="w-6 h-6 ml-2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>

                                                </p>
                                            </div>
                                            <div class="flex justify-between items-center mb-3">
                                                <p class="text-gray-700 font-light text-base md:text-lg w-full">
                                                    Ende: </p>
                                                <p
                                                    class="text-black font-medium text-base md:text-lg text-right flex items-center">
                                                    {{ trainingsssession.endtime }}
                                                    <!--Clock Icon-->
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        stroke-width="2" stroke="currentColor" class="w-6 h-6 ml-2">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                    </svg>

                                                </p>
                                            </div>
                                            <div class="flex justify-between items-center mb-3">
                                                <p class="text-gray-700 font-light text-base md:text-lg w-full">
                                                    Stundenanzahl: </p>
                                                <p class="text-black font-bold text-base md:text-lg text-right">{{
                                                    convertToReadableTime(calcTime(trainingsssession.starttime,
                                                        trainingsssession.endtime))
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
                <div class="bg-white py-5 rounded-lg drop-shadow-md">
                    <div class="flex items-center">
                        <CheckboxInput class="mr-3"></CheckboxInput>
                        <p class="text-black font-medium text-base md:text-lg text-left"><span class="text-orange-600">TODO
                                Bestätigungsmessage</span>
                        </p>
                    </div>
                    <div class="flex justify-between items-center">
                        <button @click="reject"
                            class="flex justify-center items-center text-white bg-gradient-to-br from-slate-400 to-slate-500 px-5 md:px-6 py-2 w-full md:ml-16 ty:ml-4 ml-1 md:mr-8 ty:mr-2 mr-0.5 rounded-lg drop-shadow-md"
                            :class="error.show ? 'mt-4' : 'mt-8'">
                            <p class="font-medium font-base md:text-lg">Ablehnen</p>
                        </button>
                        <button @click="approve"
                            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-5 md:px-6 py-2 w-full md:ml-8 ty:ml-2 ml-0.5 md:mr-16 ty:mr-4 mr-1 rounded-lg drop-shadow-md"
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
import { getInvoiceById, approveInvoice, rejectInvoice } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import { ref } from 'vue';
import CheckboxInput from "@/components/CheckboxInput.vue";
import Card from "@/components/Card.vue";

export default {
    name: "ReviewInvoice",
    setup() {
        const dataStore = useDataStore()
        const authStore = useAuthStore()
        const showCollapsibleContainer = ref(true);

        return {
            dataStore,
            authStore,
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
                show: false,
                text: "Bitte warten...",
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
        async reject() {
            //Backend: Invoice wird als Rejected gesetzt & Submitter wird benachrichtigt
            //TODO Reviewer bekommt Message Prompt angezeigt um Rejection zu begründen
            await rejectInvoice(this.invoice.id)

            this.$router.push("/openInvoices")
        },

        async approve() {
            //Es wird Message an Backend gesendet --> Invoice wird als Approved gesetzt
            //... Submitter wird benachrichtigt

            //In Frontend: Invoice wird als PDF generiert und als Download angeboten
            //... bzw. als Email versendet/mailto Link generiert

            this.invoice.totalHours = this.totalHours

            this.status.show = true

            const res = await approveInvoice(this.invoice.id)
            if (res.status === 200 && await res.text() === "Invoice approved") {
                this.status.success = true
                this.status.processing = false
                this.status.text = 'Abrechnung genehmigt.'

                this.filename = `Abrechnung_${this.invoice.submittedBy.lastname}_${this.invoice.submittedBy.firstname}_${new Date(this.invoice.dateOfReceipt).toJSON().split("T")[0]}`

                await createInvoice(this.filename, this.invoice)
            } else {
                this.status.success = false
                this.status.processing = false
                this.status.text = 'Abrechnung konnte nicht genehmigt werden.'
            }
        },
        ok() {
            this.$router.push("/openInvoices")
            this.status.show = false
            this.status.processing = true
            this.status.success = false
            this.status.text = 'Bitte warten...'
        },
        convertToReadableTime(timeInDecimal) {
            const hh = Math.trunc(timeInDecimal)
            const mm = ("0" + Math.round(60 * (this.totalHours - hh))).slice(-2)
            return `${hh}:${mm} Std`
        },
        calcTime(startingTime, endingTime) {
            //Formatiert Zeit vom Format 18:45 in 18,75
            // Wird mit 100 multipliziert, um Floating Point Fehler zu vermeiden
            const starttimeNumeric = Number(startingTime?.split(":")[0]) * 100 + (Number(startingTime?.split(":")[1]) / 60 * 100) || 0;

            const endtimeNumeric = Number(endingTime?.split(":")[0]) * 100 + (Number(endingTime?.split(":")[1]) / 60 * 100) || 0;

            //Berechnet Länge des Trainings. Bsp: Für 1 Std 30 min --> 1,5
            return endtimeNumeric - starttimeNumeric > 0 && starttimeNumeric > 0 ? (endtimeNumeric - starttimeNumeric) / 100 : 0;
        }
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
        }
    }
};
</script>
