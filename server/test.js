const arr = [
    {
        date: new Date('2022-06-09'),
        id: 1
    },
    {
        date: new Date('2022-06-15'),
        id: 2
    }
]

const session = arr.find(element => element.date.toJSON() === new Date('2022-06-09T00:00:00.000+00:00').toJSON())

console.log(session)