const sessionBody = {
    participants: [
    {
        attended: false
    },
    {
        attended: true
    }
]}

let deleteList = true

sessionBody.participants.forEach(participant => {
    if (participant.attended) {
        console.log(participant.attended)
        deleteList =  false
    }
})

if (deleteList) {
    console.log('delete')
}