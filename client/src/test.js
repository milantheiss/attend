const sessions = [
    {
        date: "2022-06-13T23:00:00.000Z",
        participants: [
            {
                firstname: "Paula",
                lastname: "Reichert",
                _id: "62a20277c0176cd5bb8cfe84",
                attended: true
            },
            {
                firstname: "Lynn",
                lastname: "Feuerbach",
                _id: "62a20286c0176cd5bb8cfe87",
                attended: true
            }
        ]
    },
    {
        date: "2022-06-09T23:00:00.000Z",
        participants: [
            {
                firstname: "Paula",
                lastname: "Reichert",
                _id: "62a20277c0176cd5bb8cfe84",
                attended: true
            },
            {
                firstname: "Lynn",
                lastname: "Feuerbach",
                _id: "62a20286c0176cd5bb8cfe87",
                attended: false
            }
        ]
    }
]

const update = {
    date: "2022-06-09T23:00:00.000Z",
    participants: [
        {
            firstname: "Milan",
            lastname: "Reichert",
            _id: "62a20277c0176cd5bb8cfe84",
            attended: true
        },
        {
            firstname: "Lynn",
            lastname: "Feuerbach",
            _id: "62a20286c0176cd5bb8cfe87",
            attended: false
        }
    ]
}

console.log(sessions)

for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].date === update.date){
        sessions[i] = update
    }
}

console.log(sessions[1])
