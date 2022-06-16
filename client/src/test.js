const test = {
    name: "test",
    array: [
        {
            date: new Date("2022-06-13"),
            attended: false
        },
        {
            date: new Date("2022-06-12"),
            attended: true
        },
        {
            date: new Date("2022-06-11"),
            attended: false
        }
    ]
}

let sessions = test.array
const date = new Date("2022-06-12")

for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].date.getMonth() === date.getMonth() && sessions[i].date.getDate() === date.getDate() && sessions[i].date.getFullYear() === date.getFullYear()){
        sessions.splice(i, 1)
    }
}

console.log(sessions)
