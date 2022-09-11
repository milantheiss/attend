<template>
    <div>
        <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Gruppe"
            :options="this.groups" class="bg-background-greywhite  font-bold text-xl md:text-3xl" />
        <label for="filename">Dateiname:</label>
        <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full" type="text" name="filename"
            v-model="filename" :placeholder="filename" />
        <label for="startdate">Anfang:</label>
        <input type="date" v-model="startdate" name="startdate" />
        <label for="enddate">Ende:</label>
        <input type="date" v-model="enddate" name="enddate" />
        <button @click="exportPDF"
            class="text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 inline-flex items-center px-3 md:px-4 py-1.5 md:py-2 rounded-lg drop-shadow-md">
            <p class="font-medium font-base md:text-lg">Exportieren</p>
        </button>
    </div>
</template>
  
<script>
import SelectList from "@/components/SelectList";
// eslint-disable-next-line 
import { createListe } from "@/util/generatePdf"
// eslint-disable-next-line 
import { fetchAttendanceByDateRange, fetchGroups, fetchGroupInfo } from '@/util/fetchOperations'

export default {
    name: "ExportPdf",
    data() {
        return {
            filename: 'anwesenheitslist.pdf',
            groups: [],
            selectedGroup: undefined,
            startdate: new Date(Date.now()).toJSON().slice(0, 10),
            enddate: new Date(Date.now()).toJSON().slice(0, 10)
        }
    },
    components: {
        SelectList
    },
    methods: {
        async updateSelectedGroup(groupID) {
            this.selectedGroup = await fetchGroupInfo(groupID)
        },
        async exportPDF() {
            //WARNING Leeres PDF


            const attendance = await fetchAttendanceByDateRange(this.selectedGroup.id, new Date(this.startdate), new Date(this.enddate))

            console.log(attendance)

            await createListe(this.selectedGroup, attendance, this.filename)
            console.log("Now Exporting")
        }
    },
    async created() {
        this.groups = await fetchGroups()

        /*
        console.log("Creating PDF...")
        const attendancelist = await fetchAttendanceByDateRange("62a2022bc0176cd5bb8cfe80", new Date('2022-08-01'), new Date('2022-08-31'))
        console.log(attendancelist)
        
        */
        document.title = 'Wähle eine Gruppe - Attend'
    },
    watch: {
        selectedGroup() {
            document.title = 'Exportiere Liste für ' + this.selectedGroup.name + ' - Attend'
        }
    }
};
</script>
  