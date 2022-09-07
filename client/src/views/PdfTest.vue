<template>
    <div>
        <p>Downloading PDF...</p>
    </div>
</template>
  
<script>
import {createListe} from "@/util/generatePdf"
import {fetchAttendanceByDateRange} from '@/util/fetchOperations'

export default {
    name: "PdfTest",
    data() {
        return {
            group: {
                name: "LA U12",
                participants: [
                    {
                        firstname: "Paula",
                        lastname: "Reichert",
                        birthday: new Date("2012-09-21"),
                        _id: 1
                    },
                    {
                        firstname: "Lynn",
                        lastname: "Feuerbach",
                        birthday: new Date("2011-07-07"),
                        _id: 2
                    },
                    {
                        firstname: "Marlene",
                        lastname: "Rübsamen",
                        birthday: new Date("2013-01-01"),
                        _id: 3
                    },
                    {
                        firstname: "Anna",
                        lastname: "Aschilles",
                        birthday: new Date("2013-01-01"),
                        _id: 4
                    },
                    {
                        firstname: "Mia",
                        lastname: "van der Linden",
                        birthday: new Date("2011-01-01"),
                        _id: 5
                    }
                ],
                trainer: [
                    {
                        name: "Milan Theiß"
                    }
                ],
                assistent: [
                    {
                        name: "Mika Stöveken"
                    }
                ],
                times: [
                    {
                        day: "Montag",
                        starttime: "18:00",
                        endtime: "19:30"
                    },
                    {
                        day: "Donnerstag",
                        starttime: "18:00",
                        endtime: "19:30"
                    }
                ],
                venue: "Sportplatz",
                department: {
                    name: "Leichtathletik"
                }
            }
        }
    },
    methods: {

    },
    async created() {
        console.log("Creating PDF...")
        const attendancelist = await fetchAttendanceByDateRange("62a2022bc0176cd5bb8cfe80", new Date('2022-08-01'), new Date('2022-08-31'))
        console.log(attendancelist)
        await createListe(this.group, attendancelist, 'liste.pdf')
    }
};
</script>
  