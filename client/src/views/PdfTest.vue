<template>
    <div>
        <p>Downloading PDF...</p>
    </div>
</template>
  
<script>
import {createListe} from "@/util/generatePdf"

export default {
    name: "PdfTest",
    data() {
        return {
            testListe: {
                dates: [
                    new Date("2022-08-15T00:00:00.000Z"),
                    new Date("2022-08-18T00:00:00.000Z"),
                    new Date("2022-08-22T00:00:00.000Z")
                ],
                participants: [
                    {
                        _id: 4,
                        firstname: 'Anna',
                        lastname: 'Aschilles',
                        attendence: [
                            { date: new Date("2022-08-15T00:00:00.000Z"), attended: true },
                            { date: new Date("2022-08-22T00:00:00.000Z"), attended: false },
                            { date: new Date("2022-08-18T00:00:00.000Z"), attended: true }
                        ]
                    },
                    {
                        _id: 2,
                        firstname: 'Lynn',
                        lastname: 'Feuerbach',
                        attendence: [
                            { date: new Date("2022-08-15T00:00:00.000Z"), attended: true },
                            { date: new Date("2022-08-22T00:00:00.000Z"), attended: false },
                            { date: new Date("2022-08-18T00:00:00.000Z"), attended: true }
                        ]
                    },
                    {
                        _id: 6,
                        firstname: 'Johanna',
                        lastname: 'Habenicht',
                        attendence: [
                            { date: new Date("2022-08-15T00:00:00.000Z"), attended: true },
                            { date: new Date("2022-08-22T00:00:00.000Z"), attended: false },
                            { date: new Date("2022-08-18T00:00:00.000Z"), attended: true }
                        ]
                    },
                    {
                        _id: 1,
                        firstname: 'Paula',
                        lastname: 'Reichert',
                        attendence: [
                            { date: new Date("2022-08-15T00:00:00.000Z"), attended: true },
                            { date: new Date("2022-08-22T00:00:00.000Z"), attended: false },
                            { date: new Date("2022-08-18T00:00:00.000Z"), attended: true }
                        ]
                    },
                    {
                        _id: 3,
                        firstname: 'Marlene',
                        lastname: 'Rübsamen',
                        attendence: [
                            { date: new Date("2022-08-15T00:00:00.000Z"), attended: true },
                            { date: new Date("2022-08-22T00:00:00.000Z"), attended: false },
                            { date: new Date("2022-08-18T00:00:00.000Z"), attended: true }
                        ]
                    },
                    {
                        _id: 5,
                        firstname: 'Mia',
                        lastname: 'van der Linden',
                        attendence: [
                            { date: new Date("2022-08-15T00:00:00.000Z"), attended: true },
                            { date: new Date("2022-08-22T00:00:00.000Z"), attended: false },
                            { date: new Date("2022-08-18T00:00:00.000Z"), attended: true }
                        ]
                    }
                ]
            },
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
        await createListe(this.group, this.testListe, 'liste.pdf')
    }
};
</script>
  