<template>
    <div class="container mx-auto flex flex-col gap-4">
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
            <StandardButton @click="createNewInvoice()" v-show="auth.user?.lengthAccessibleGroups > 0">Erstellen</StandardButton>
        </div>

        <!--Eigene Abrechnungen-->
        <CollapsibleContainer :enableClickOnHeader="false" :show="true"
            class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col">
            <template #header>
                <p class="font-semibold flex items-baseline">Abrechnungen in <YearInput v-model="selectedYear"
                        class="ml-1 font-semibold">
                    </YearInput>
                </p>
            </template>
            <template #content>
                <!--Invoice Tabelle-->
                <div class="h-fit max-h-[25vh] overflow-y-auto block">
                    <table class="table-auto w-full text-left">
                        <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
                            <tr>
                                <th scope="col" class="pb-2.5 font-medium" @click="onClickOnTimespan">
                                    <span class="flex items-center gap-1">
                                        <SortIcon :index="indexSortButtonTimespan"></SortIcon>
                                        Zeitraum
                                    </span>
                                </th>
                                <th scope="col" class="w-[142px] md:w-[152px] px-3 md:px-4 pb-2.5 font-medium"
                                    @click="onClickOnStatus">
                                    <span class="flex items-center gap-1">
                                        <SortIcon :index="indexSortButtonStatus"></SortIcon>
                                        Status
                                    </span>
                                </th>
                                <th scope="col" class="hidden md:table-cell pb-2.5 font-medium">Download</th>
                                
                                <th scope="col" class="hidden ty:table-cell md:hidden"></th>
                            </tr>
                        </thead>
                        <tbody class="overscroll-y-scroll">
                            <tr v-for="invoice in allInvoicesInYear" :key="invoice._id"
                                @click="downloadInvoice(invoice._id)"
                                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                                <td class="truncate">
                                    <div class="hidden md:flex py-2.5 group-last:pt-2.5 group-last:pb-0">
                                        <p >{{
                                            new Date(invoice.startdate).toLocaleDateString('de-DE', {
                                                year: '2-digit', month:
                                                    '2-digit', day: '2-digit'
                                            })
                                        }}</p>
                                        <p class="mx-2">-</p>
                                        <p >{{
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
                                            <p >{{
                                                new Date(invoice.enddate).toLocaleDateString('de-DE', {
                                                    year: '2-digit', month:
                                                        '2-digit', day: '2-digit'
                                                })
                                            }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-3 md:px-4 w-fit sm:w-full py-2.5 group-last:pt-2.5 group-last:pb-0">
                                    <!--Status Badge-->
                                    <div v-show="invoice.status === 'pending'"
                                        class="rounded-full bg-light-gray bg-opacity-20 w-[112px] sm:w-[132px] md:w-[142px] h-[32px] md:h-[34px] flex justify-center items-center">
                                        <p class="text-base md:text-lg font-medium text-[#3F4550]">Ausstehend</p>
                                    </div>
                                    <div v-show="invoice.status === 'approved'"
                                        class="rounded-full bg-[#59D10D] bg-opacity-20 w-[112px] sm:w-[132px] md:w-[142px] h-[32px] md:h-[34px] flex justify-center items-center">
                                        <p class="text-[#087E00] font-medium text-base md:text-lg">Genehmigt</p>
                                    </div>
                                    <div v-show="invoice.status === 'rejected'"
                                        class="rounded-full bg-[#D95454] bg-opacity-20 w-[112px] sm:w-[132px] md:w-[142px] h-[32px] md:h-[34px] flex justify-center items-center">
                                        <p class="text-[#B73939] font-medium text-base md:text-lg">Abgelehnt</p>
                                    </div>
                                </td>
                                <td class="hidden ty:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0">
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
                </div>
                <p v-show="typeof allInvoicesInYear === 'undefined' || allInvoicesInYear?.length === 0"
                    class="font-medium text-gray-500 text-center pt-2.5">Keine Abrechnungen gefunden</p>
            </template>
        </CollapsibleContainer>

        <!--Zu prüfen-->
        <CollapsibleContainer v-if="typeof allAssignedInvoices !== 'undefined' && allAssignedInvoices?.length > 0"
            :show="true" class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col">
            <template #header>
                <p class="font-semibold">Zu prüfen</p>
            </template>
            <template #content>
                <div class="h-fit max-h-[55vh] overflow-y-auto block">
                    <table class="table-auto w-full text-left">
                        <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
                            <tr>
                                <th scope="col" class="w-full pb-2.5 font-medium" @click="onClickOnSubmitter">
                                    <span class="flex items-center gap-1">
                                        <SortIcon :index="indexSortButtonSubmitter"></SortIcon>
                                        Ersteller
                                    </span>
                                </th>
                                <th scope="col" class="pl-2 md:pl-4 w-[108px] md:w-[132px] pb-2.5 font-medium"
                                    @click="onClickOnDate">
                                    <span class="flex items-center gap-1">
                                        <SortIcon :index="indexSortButtonDate"></SortIcon>
                                        Datum
                                    </span>
                                </th>
                                <th scope="col" class="hidden ty:table-cell text-right w-fit pb-2.5 pl-6 md:pl-12"></th>
                            </tr>
                        </thead>
                        <tbody class="overscroll-y-scroll">
                            <tr v-for="invoice in allAssignedInvoices" :key="invoice._id" @click="goToInvoice(invoice._id)"
                                class="border-b border-[#E5E7EB] last:border-0 group cursor-pointer">
                                <td class="w-full truncate py-2.5 group-last:pt-2.5 group-last:pb-0">
                                    {{ invoice.submittedBy.firstname + " " + invoice.submittedBy.lastname }}

                                </td>
                                <td
                                    class="text-light-gray pl-2 md:pl-4 py-2.5 group-last:pt-2.5 group-last:pb-0 w-[108px] md:w-[132px]">
                                    {{
                                        new Date(invoice.dateOfReceipt).toLocaleDateString('de-DE', {
                                            year: 'numeric', month:
                                                '2-digit', day: '2-digit'
                                        })
                                    }}</td>
                                <td
                                    class="hidden ty:table-cell w-fit py-2.5 group-last:pt-2.5 group-last:pb-0 pl-6 md:pl-12">
                                    <!--Arrow Icon-->
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                        stroke="currentColor"
                                        class="w-7 md:w-8 h-7 md:h-8 ml-auto">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                    </svg>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </template>
        </CollapsibleContainer>
    </div>
</template>

<script>
import { getAllAssignedInvoices, getAllInvoicesInYear } from '@/util/fetchOperations'
import { downloadInvoice } from '@/util/generatePdf';
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { ref } from 'vue';
import StandardButton from '@/components/StandardButton.vue';
import CollapsibleContainer from '@/components/CollapsibleContainer.vue';
import YearInput from '@/components/YearInput.vue';
import SortIcon from '@/components/SortIcon.vue';

export default {
    name: "InvoiceOverviewView",
    setup() {
        const dataStore = useDataStore();
        const auth = useAuthStore();
        const showCollapsibleContainer = ref(true);
        return {
            auth,
            dataStore,
            showCollapsibleContainer
        };
    },
    data() {
        return {
            allAssignedInvoices: [],
            allInvoicesInYear: [],
            spin: false,
            selectedYear: new Date().getFullYear(),
            indexSortButtonStatus: 0,
            indexSortButtonTimespan: 0,
            indexSortButtonSubmitter: 0,
            indexSortButtonDate: 0,
        };
    },
    methods: {
        async refresh() {
            this.spin = true;
            setTimeout(() => {
                this.spin = false;
            }, 1000);
            this.allAssignedInvoices = await getAllAssignedInvoices();
            this.allInvoicesInYear = await getAllInvoicesInYear(this.selectedYear);
        },
        goToInvoice(id) {
            this.$router.push({ path: "/review-invoice", query: { id: id } });
        },
        createNewInvoice() {
            this.$router.push({ path: "/create-invoice" });
        },
        downloadInvoice(id) {
            downloadInvoice(id)
        },
        onClickOnStatus() {
            this.indexSortButtonStatus = (this.indexSortButtonStatus + 1) % 2;
            if (this.indexSortButtonStatus == 0) {
                this.allInvoicesInYear.sort((a, b) => b.status.localeCompare(a.status))
            } else {
                this.allInvoicesInYear.sort((a, b) => a.status.localeCompare(b.status))
            }
        },
        onClickOnTimespan() {
            this.indexSortButtonTimespan = (this.indexSortButtonTimespan + 1) % 2;
            if (this.indexSortButtonTimespan == 0) {
                this.allInvoicesInYear.sort((a, b) => {
                    if (new Date(a.startdate) - new Date(b.startdate) === 0) {
                        return new Date(a.enddate) - new Date(b.enddate);
                    } else {
                        return new Date(a.startdate) - new Date(b.startdate);
                    }
                })
            } else {
                this.allInvoicesInYear.sort((a, b) => {
                    if (new Date(a.startdate) - new Date(b.startdate) === 0) {
                        return new Date(b.enddate) - new Date(a.enddate);
                    } else {
                        return new Date(b.startdate) - new Date(a.startdate);
                    }
                })
            }
        },
        onClickOnSubmitter() {
            this.indexSortButtonSubmitter = (this.indexSortButtonSubmitter + 1) % 2;
            if (this.indexSortButtonSubmitter == 0) {
                this.allInvoicesInYear.sort((a, b) => {
                    return a.submittedBy.lastname.localeCompare(b.submittedBy.lastname)
                })
            } else {
                this.allInvoicesInYear.sort((a, b) => {
                    return b.submittedBy.lastname.localeCompare(a.submittedBy.lastname)
                })
            }
        },
        onClickOnDate() {
            this.indexSortButtonDate = (this.indexSortButtonDate + 1) % 2;
            if (this.indexSortButtonDate == 0) {
                this.allInvoicesInYear.sort((a, b) => {
                    return new Date(a.dateOfReceipt) - new Date(b.dateOfReceipt);
                })
            } else {
                this.allInvoicesInYear.sort((a, b) => {
                    return new Date(b.dateOfReceipt) - new Date(a.dateOfReceipt);
                })
            }
        }
    },
    async created() {
        document.title = "Abrechnung - Attend";
        this.dataStore.viewname = "Abrechnungen";
    },
    watch: {
        selectedYear: async function (newVal) {
            this.allInvoicesInYear = await getAllInvoicesInYear(newVal);
        }
    },
    async mounted() {
        this.allAssignedInvoices = await getAllAssignedInvoices();

        if (this.indexSortButtonTimespan == 0) {
            this.allInvoicesInYear.sort((a, b) => {
                if (new Date(a.startdate) - new Date(b.startdate) === 0) {
                    return new Date(a.enddate) - new Date(b.enddate);
                } else {
                    return new Date(a.startdate) - new Date(b.startdate);
                }
            })
        } else {
            this.allInvoicesInYear.sort((a, b) => {
                if (new Date(a.startdate) - new Date(b.startdate) === 0) {
                    return new Date(b.enddate) - new Date(a.enddate);
                } else {
                    return new Date(b.startdate) - new Date(a.startdate);
                }
            })
        }

        this.allInvoicesInYear = await getAllInvoicesInYear(this.selectedYear);
    },
    components: { StandardButton, CollapsibleContainer, YearInput, SortIcon }

};
</script>
