<template>
    <div class="relative container">
        <div>
            <div class="flex rounded-lg drop-shadow-md p-1 mb-2 text-dark-grey text-xl font-light px-3 gap-x-2">
                <div class="basis-5 md:hidden flex flex-none"></div>
                <p class="basis-[38%] sm:basis-[29%] truncate">Zeitraum</p>
                <p class="basis-[38%] truncate">Ersteller</p>
                <p class="basis-[20%] md:basis-[35%] truncate">Erstellt am</p>
                <div class="basis-[5%] flex justify-center">
                    <Transition>
                        <!--Refresh Icon-->
                        <span @click="refresh" ref="refreshIcon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                                :class="{ 'animate-refreshSpin': spin }" @animationend="spin = false" class="w-6 h-6"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round"
                                    d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                        </span>
                    </Transition>
                </div>
            </div>

            <!--InvoiceCard-->
            <div class="flex items-center bg-white rounded-lg drop-shadow-md hover:drop-shadow-xl px-3 py-2 mb-2 text-xl font-base text-dark-grey gap-x-2 cursor-pointer group"
                v-for="invoice in allAssignedInvoices" :key="invoice.id" @click="goToInvoice(invoice.id)">
                
                <div class="flex flex-col sm:flex-row basis-[38%] sm:basis-[29%]">
                    <p class="">{{
                        new Date(invoice.startdate).toLocaleDateString('de-DE', {
                            year: '2-digit', month:
                                'numeric', day: 'numeric'
                        })
                    }}</p>
                    <p class="mx-2 hidden sm:block">-</p>
                    <p class="">{{
                        new Date(invoice.enddate).toLocaleDateString('de-DE', {
                            year: '2-digit', month:
                                'numeric', day: 'numeric'
                        })
                    }}</p>
                </div>
                <p class="text-dark-grey basis-[41%] md:basis-[37%] truncate">{{
                    invoice.submittedBy.firstname + " " + invoice.submittedBy.lastname
                }}</p>
                <p class="text-dark-grey basis-[41%] md:basis-[37%] truncate">{{
                    new Date(invoice.dateOfReceipt).toLocaleDateString('de-DE', {
                        year: '2-digit', month:
                            'numeric', day: 'numeric'
                    })
                    }}</p>
                <!--Arrow Icon-->
                <div class="basis-[5%] flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-6 h-6 transition group-hover:translate-x-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </div>
            </div>
            <p v-show="typeof allAssignedInvoices === 'undefined' || allAssignedInvoices?.length === 0"
                class="text-xl md:text-2xl font-normal text-gray-500 text-center">Keine offenen Abrechnungen</p>
        </div>
    </div>
</template>

<script>
import { getAllAssignedInvoices } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import { ref } from 'vue';

//TODO Umstellen auf Antrag Seite

export default {
    name: "OpenInvoices",
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
            allAssignedInvoices: [],
            spin: false,
            //TODO sort by values in array eintragen
            sortBy: [

            ]
        }
    },
    methods: {
        async refresh() {
            this.spin = true
            setTimeout(() => {
                this.spin = false
            }, 1000)
            console.log('refresh');
            this.allAssignedInvoices = await getAllAssignedInvoices()

        },
        goToInvoice(id) {
            console.log(id);
            this.$router.push({path: '/reviewInvoice', query: {id: id}})
        }
    },
    async created() {
        document.title = 'Offene Abrechnung - Attend'
        this.dataStore.viewname = "Offene Abrechnungen"
    },
    async mounted() {
        this.allAssignedInvoices = await getAllAssignedInvoices()
        console.log(this.allAssignedInvoices);
    }
};
</script>
