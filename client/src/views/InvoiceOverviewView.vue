<template>
    <div class="relative container flex flex-col gap-4">
        <!--Header-->
        <div class="flex justify-between items-center px-3.5 md:px-7 mb-2.5">
            <!--Refresh Button-->
            <Transition>
                <!--Refresh Icon-->
                <span @click="refresh" ref="refreshIcon">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                        :class="{ 'animate-refreshSpin': spin }" @animationend="spin = false" class="w-8 h-8 ml-0.5"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </span>
            </Transition>
            <!--Erstellen Button-->
            <Button @click="createNewInvoice">Erstellen</Button>
        </div>

        <!--Eigene Abrechnungen-->
        <CollapsibleContainer class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col gap-1">
            <template #header>
                <p class="font-medium">Eigene Abrechnungen</p>
            </template>
            <template #content>
                <table class="table-auto w-full text-left">
                    <thead>
                        <tr>
                            <th scope="col" class="">Zeitraum</th>
                            <th scope="col" class="w-[142px] md:w-[152px] px-3 md:px-4">Status</th>
                            <th scope="col" class="invisible sm:visible">Download</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="invoice in allInvoicesInYear" :key="invoice.id" @click="downloadInvoice(invoice.id)"
                            class="border-b border-[#E5E7EB] last:border-0">
                            <td class="truncate py-2.5">
                                <div class="hidden md:flex">
                                    <p class="">{{
                                        new Date(invoice.startdate).toLocaleDateString('de-DE', {
                                            year: '2-digit', month:
                                                '2-digit', day: '2-digit'
                                        })
                                    }}</p>
                                    <p class="mx-2">-</p>
                                    <p class="">{{
                                        new Date(invoice.enddate).toLocaleDateString('de-DE', {
                                            year: '2-digit', month:
                                                '2-digit', day: '2-digit'
                                        })
                                    }}</p>
                                </div>
                                <div class="md:hidden">
                                    <p class="text-left">{{
                                        new Date(invoice.startdate).toLocaleDateString('de-DE', {
                                            year: '2-digit', month:
                                                '2-digit', day: '2-digit'
                                        })
                                    }}</p>
                                    <div class="flex">
                                        <p class="mr-2">-</p>
                                        <p class="">{{
                                            new Date(invoice.enddate).toLocaleDateString('de-DE', {
                                                year: '2-digit', month:
                                                    '2-digit', day: '2-digit'
                                            })
                                        }}</p>
                                    </div>
                                </div>
                            </td>
                            <td class="px-3 md:px-4 py-2.5 w-fit sm:w-full ">
                                <!--Status Badge-->
                                <div v-show="invoice.status === 'pending'"
                                    class="rounded-full bg-[#7B7C8F] w-[112px] sm:w-[132px] md:w-[152px] h-[32px] md:h-[36px] flex justify-center items-center">
                                    <p class="text-white text-base md:text-lg">Ausstehend</p>
                                </div>
                                <div v-show="invoice.status === 'approved'"
                                    class="rounded-full bg-[#4BB84B] w-[112px] sm:w-[132px] md:w-[152px] h-[32px] md:h-[36px] flex justify-center items-center">
                                    <p class="text-white text-base md:text-lg">Genehmigt</p>
                                </div>
                                <div v-show="invoice.status === 'rejected'"
                                    class="rounded-full bg-[#D95454] w-[112px] sm:w-[132px] md:w-[152px] h-[32px] md:h-[36px] flex justify-center items-center">
                                    <p class="text-white text-base md:text-lg">Abgelehnt</p>
                                </div>
                            </td>
                            <td class="py-2.5 hidden ty:inline">
                                <!--Download Icon-->
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                    stroke="currentColor" class="w-8 h-8 mx-auto">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                </svg>

                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-show="typeof allInvoicesInYear === 'undefined' || allInvoicesInYear?.length === 0"
                    class="font-medium text-gray-500 text-center">Keine Abrechnungen gefunden</p>
            </template>
        </CollapsibleContainer>

        <!--Zu prüfen-->
        <CollapsibleContainer class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col gap-1">
            <template #header>
                <p class="font-medium">Zu prüfen</p>
            </template>
            <template #content>
                <table class="table-auto w-full text-left "
                    v-if="typeof allAssignedInvoices !== 'undefined' && allAssignedInvoices?.length > 0">
                    <thead>
                        <tr class="border-b border-[#D1D5DB]">
                            <th scope="col" class="w-full ">Ersteller</th>
                            <th scope="col" class="px-2 md:px-4 ">Datum</th>
                            <th scope="col" class="text-right w-fit "></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="invoice in allAssignedInvoices" :key="invoice.id" @click="goToInvoice(invoice.id)"
                            class="border-b border-[#E5E7EB] last:border-0">
                            <td class="w-full truncate py-2.5">
                                {{ invoice.submittedBy.firstname + " " + invoice.submittedBy.lastname }}

                            </td>
                            <td class="text-[#6B7280] w-fit px-2 md:px-4 py-2.5">{{
                                new Date(invoice.dateOfReceipt).toLocaleDateString('de-DE', {
                                    year: 'numeric', month:
                                        '2-digit', day: '2-digit'
                                })
                            }}</td>
                            <td class="w-fit py-2.5">
                                <!--Arrow Icon-->
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                    stroke="currentColor" class="w-6 h-6 transition group-hover:translate-x-2">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-show="typeof allAssignedInvoices === 'undefined' || allAssignedInvoices?.length === 0"
                    class="font-medium text-gray-500 text-center">Keine offenen Abrechnungen</p>
            </template>
        </CollapsibleContainer>
    </div>
</template>

<script>
import { getAllAssignedInvoices, getAllInvoicesInYear } from '@/util/fetchOperations'
import { useDataStore } from "@/store/dataStore";
import { ref } from 'vue';
import Button from '@/components/Button.vue';
import CollapsibleContainer from '@/components/CollapsibleContainer.vue';

//TODO Umstellen auf Antrag Seite

export default {
    name: "InvoiceOverviewView",
    setup() {
        const dataStore = useDataStore();
        const showCollapsibleContainer = ref(true);
        return {
            dataStore,
            showCollapsibleContainer
        };
    },
    data() {
        return {
            allAssignedInvoices: [],
            allInvoicesInYear: [],
            spin: false,
            //TODO sort by values in array eintragen
            sortBy: []
        };
    },
    methods: {
        async refresh() {
            this.spin = true;
            setTimeout(() => {
                this.spin = false;
            }, 1000);
            this.allAssignedInvoices = await getAllAssignedInvoices();
            this.allInvoicesInYear = await getAllInvoicesInYear(2023);
        },
        goToInvoice(id) {
            this.$router.push({ path: "/reviewInvoice", query: { id: id } });
        },
        createNewInvoice() {
            this.$router.push({ path: "/createInvoice" });
        },
        downloadInvoice(id) {
            console.log(id);
            //TODO download invoice
        }
    },
    async created() {
        document.title = "Abrechnung - Attend";
        this.dataStore.viewname = "Abrechnungen";
    },
    async mounted() {
        this.allAssignedInvoices = await getAllAssignedInvoices();
        this.allInvoicesInYear = await getAllInvoicesInYear(2023);
    },
    components: { Button, CollapsibleContainer }
};
</script>
