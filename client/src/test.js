const times = [
    {
        day: "Dienstag",
        starttime: "18:00",
        endtime: "19:30"
    },
    {
        day: "Donnerstag",
        starttime: "18:00",
        endtime: "19:30"
    }
]

function getWeekdays(){
    let temp = []
    for (const time of times) {
        temp.push(time.day.slice(0, 2))
    }
    return temp
}

console.log(getWeekdays())
