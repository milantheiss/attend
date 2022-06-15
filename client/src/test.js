const sessions = {
    group: {
        name: "LA U12",
        _id: "62a2022bc0176cd5bb8cfe80"
    },
    trainingssession: [
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
}

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

console.log("-----------------------------------------------------------")

for (let i = 0; i < sessions.trainingssession.length; i++) {
    if (sessions.trainingssession[i].date === update.date) {
        sessions.trainingssession[i] = update
    }
}

console.log(sessions.trainingssession[1])
