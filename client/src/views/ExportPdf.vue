<template>
    <div class="relative container">
        <div class="bg-white px-5 py-3 rounded-lg drop-shadow-md">
            <div class="flex items-center justify-between mb-4">
                <p class="text-gray-700 font-normal md:font-light text-base md:text-lg ">Gruppe:</p>
                <SelectList @new-selected-value="(value) => updateSelectedGroup(value)" default-value="Gruppe"
                    :options="this.groups" class="font-bold text-xl md:text-2xl mt-1" />
            </div>
            <div class="flex items-center justify-between mb-4">
                <label for="filename" class="text-gray-700 font-normal md:font-light text-base md:text-lg ">Dateiname:</label>
                <input class="border-b-2 border-gray-300 pl-1.5 text-dark-grey w-full ml-3 text-lg md:text-xl" type="text" name="filename"
                    v-model="filename" placeholder="Dateiname" />
            </div>
            <div class="flex items-center justify-between mb-4">
                <label for="startdate" class="text-gray-700 font-normal md:font-light text-base md:text-lg ">Anfang:</label>
                <input type="date" v-model="startdate" name="startdate" class="border-b-2 border-gray-300 text-black ml-3 font-medium text-lg md:text-xl"/>
            </div>

            <div class="flex items-center justify-between mb-4">
                <label for="enddate" class="text-gray-700 font-normal md:font-light text-base md:text-lg ">Ende:</label>
                <input type="date" v-model="enddate" name="enddate" class="border-b-2 border-gray-300 text-black ml-3 font-medium text-lg md:text-xl"/>
            </div>
        </div>

        <button @click="exportPDF"
            class="flex items-center mx-auto mt-8 text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-8 md:px-9 py-2.5 rounded-lg drop-shadow-md">
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
            filename: 'anwesenheitslist',
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
        this.$store.commit("setViewname","Liste exportieren")
    },
    watch: {
        selectedGroup() {
            document.title = 'Exportiere Liste für ' + this.selectedGroup.name + ' - Attend'
        }
    }
};
</script>
  