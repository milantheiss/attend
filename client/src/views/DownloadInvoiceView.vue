<template>
    <div class="container mx-auto flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
            class="w-9 h-9 animate-[spin_1s_linear_infinite]">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
        </svg>
        <p class="ml-4 text-xl font-medium">Bitte warten...</p>
        <StandardButton @click="$router.back()">Zurück</StandardButton>
    </div>
</template>

<script>
import { createInvoice } from "@/util/generatePdf"
import { getInvoiceById } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import StandardButton from '@/components/StandardButton.vue';

export default {
    name: "DownloadInvoice",
    setup() {
        const dataStore = useDataStore()

        return {
            dataStore
        }
    },
    data() {
        return {
            filename: 'anwesenheitslist',
            invoice: undefined,
        }
    },
    methods: {
        async downloadInvoice(invoiceId) {
            this.invoice = await getInvoiceById(invoiceId)

            this.invoice.totalHours = this.totalHours()

            this.filename = `Abrechnung_${this.invoice.submittedBy.lastname}_${this.invoice.submittedBy.firstname}_${new Date(this.invoice.dateOfReceipt).toJSON().split("T")[0]}`

            if (await createInvoice(this.filename, this.invoice)) {
                this.$router.back()
            }
        },
        calcTime(startingTime, endingTime) {
            //Formatiert Zeit vom Format 18:45 in 18,75
            // Wird mit 100 multipliziert, um Floating Point Fehler zu vermeiden
            const starttimeNumeric = Number(startingTime?.split(":")[0]) * 100 + (Number(startingTime?.split(":")[1]) / 60 * 100) || 0;

            const endtimeNumeric = Number(endingTime?.split(":")[0]) * 100 + (Number(endingTime?.split(":")[1]) / 60 * 100) || 0;

            //Berechnet Länge des Trainings. Bsp: Für 1 Std 30 min --> 1,5
            return endtimeNumeric - starttimeNumeric > 0 && starttimeNumeric > 0 ? (endtimeNumeric - starttimeNumeric) / 100 : 0;
        },
        totalHours() {
            let tHours = 0

            this.invoice.groups.forEach(val => {
                val.trainingssessions.forEach(element => {
                    tHours += this.calcTime(element.starttime, element.endtime)
                })
            })

            return tHours
        }
    },
    async created() {
        document.title = 'Abrechnung wird heruntergeladen - Attend'
        this.dataStore.viewname = "Abrechnung wird heruntergeladen..."

        const id = this.$route.query.id

        if (!id || typeof id !== "string") {
            console.error("No ID provided");
            this.$router.back()
        }
        
        this.$router.back()

        await this.downloadInvoice(id)

        if (typeof this.invoice.code !== "undefined") {
            console.error(this.invoice.message);
        }

        this.$router.back()
    },
    components: { StandardButton }
}
</script>
