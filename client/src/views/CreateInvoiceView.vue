<template>
    <div class="relative container">
        <!--Export Settings-->
        <div class="bg-white px-6 py-5 rounded-lg drop-shadow-md">
            <!--WENN Trainer Daten incomplete -> Dialog-->
            <!--Timespan-->
            <!--Gruppen also collapsable Dropdown-->
            <!--Dateiname-->
            <div class="flex items-center justify-between mb-4">
                <label for="filename"
                    class="text-black font-normal md:font-light text-base md:text-lg ">Dateiname:</label>
                <TextInput name="filename" v-model="filename" placeholder="Dateiname"
                    :showError="error.cause.filenameInput" class="ml-3"></TextInput>
            </div>
            <div class="flex items-start justify-between mb-4">
                <p class="text-gray-700 font-normal md:font-light text-base md:text-lg ">Gruppe:</p>
                <!--Add Collapsable Container here-->
                <CheckboxList v-model="testList"></CheckboxList>
            </div>
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

            <button @click="exportPDF"
                class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-8 md:px-9 py-2.5 rounded-lg drop-shadow-md"
                :class="error.show ? 'mt-4' : 'mt-8'">
                <p class="font-medium font-base md:text-lg">Exportieren</p>
            </button>
        </div>

    </div>
</template>
  
<script>
import { createListe } from "@/util/generatePdf"
import { fetchAttendanceByDateRange, fetchGroups } from '@/util/fetchOperations'
import ErrorMessage from "@/components/ErrorMessage.vue";
import TextInput from "@/components/TextInput.vue";
import DateInput from "@/components/DateInput.vue";
import { useDataStore } from "@/store/dataStore";
import CheckboxList from "@/components/CheckboxList.vue";

export default {
    name: "CreateInvoice",
    setup() {
        const dataStore = useDataStore()
        return {
            dataStore
        }
    },
    data() {
        return {
            filename: 'anwesenheitslist',
            groups: [],
            selectedGroup: undefined,
            startdate: new Date(Date.now()).toJSON().slice(0, 10),
            enddate: new Date(Date.now()).toJSON().slice(0, 10),
            error: {
                message: "Fehler",
                show: false,
                cause: {
                    groupInput: false,
                    filenameInput: false,
                    timespanFaulty: false
                }
            },
            testList: [
                "U12",
                "U08",
                "U14"
            ]
        }
    },
    components: {
        ErrorMessage,
        TextInput,
        DateInput,
        CheckboxList
    },
    methods: {
        /**
         * Zieht Attendance Daten von der Datenbank und erstellt mit @see createList() ein neues PDF
         */
        async exportPDF() {
            if (!this.hasAnError()) {
                const attendance = await fetchAttendanceByDateRange(this.selectedGroup.id, new Date(this.startdate), new Date(this.enddate))
                if (attendance.dates.length === 0) {
                    this.error.show = true
                    this.error.cause.timespanFaulty = true
                    this.error.message = 'Es wurden keine Teilnehmerlisten in der gewählten Zeitspanne gefunden!'
                } else {
                    await createListe(this.selectedGroup, attendance, this.filename, this.startdate, this.enddate)
                }
            }
        },
        /**
         * Checkt ob ein Fehler vorliegt.
         * Error Timespan Faulty kann erst getriggert werden, wenn Attendance List von der Datenbank gezogen wurde.
         */
        hasAnError() {
            this.error.message = "Keine Fehler"

            this.error.show = typeof this.selectedGroup === 'undefined' || typeof this.filename !== "string" || this.filename.trim().length === 0;
            this.error.cause.groupInput = typeof this.selectedGroup === 'undefined'
            this.error.cause.filenameInput = typeof this.filename !== "string" || this.filename.trim().length === 0
            this.error.cause.timespanFaulty = false

            if (this.error.cause.groupInput) {
                this.error.message = "Es muss eine Gruppe ausgewählt sein.";
            } else if (this.error.cause.filenameInput) {
                this.error.message = "Es muss ein Dateiname angegeben werden."
            }

            this.error.message = this.error.cause.groupInput && this.error.cause.filenameInput ? "Alle Felder müssen ausgefüllt sein." : this.error.message

            return this.error.show;
        }
    },
    async created() {
        this.groups = await fetchGroups()
        document.title = 'Erstelle eine Abrechnung - Attend'
        this.dataStore.viewname = "Abrechnung erstellen"
    },
    watch: {
    }
};
</script>
  