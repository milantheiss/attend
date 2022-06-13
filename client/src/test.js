function convertWeekdaytoNumber(dayString) {
    const arr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    let i = 0

    while (dayString !== arr[i]) {
        i++
    }

    return i
}

function getDateOfNextTraining(startdate, weekdays) {
    const weekdayOfStartdate = startdate.getDay()

    const weekdayOfNextTraining = getSoonestWeekdayInFuture(startdate, weekdays)

    const result = new Date(startdate)
    result.setDate(startdate.getDate() + (weekdayOfNextTraining - weekdayOfStartdate))

    return result
}

function getSoonestWeekdayInFuture(referenceWeekday, weekdays) {

    let min = convertWeekdaytoNumber(weekdays[0])
    let i = 1

    if ((min - referenceWeekday.getDay()) === 0) {
        try {
            min = convertWeekdaytoNumber(weekdays[1])
            i = 2
        } catch (e) {
            return convertWeekdaytoNumber(weekdays[0])
        }
    }

    for (; i < weekdays.length; i++) {
        if ((convertWeekdaytoNumber(weekdays[i]) - referenceWeekday.getDay()) < (min - referenceWeekday.getDay()) && (convertWeekdaytoNumber(weekdays[i]) - referenceWeekday.getDay()) > 0) {
            min = convertWeekdaytoNumber(weekdays[i])
        }
    }

    return min
}

function getSoonestWeekdayInPast(referenceWeekday, weekdays) {

    let min = convertWeekdaytoNumber(weekdays[0])

    for (let i = 1; i < weekdays.length; i++) {
        if ((convertWeekdaytoNumber(weekdays[i]) - referenceWeekday.getDay()) > (min - referenceWeekday.getDay())) {
            min = convertWeekdaytoNumber(weekdays[i])
        }
    }

    return min
}

function getDateOfTraining(startdate, weekdays, OfNextTraining = true) {
    const weekdayOfStartdate = startdate.getDay()

    const weekdayOfTraining = OfNextTraining ? getSoonestWeekdayInFuture(startdate, weekdays) : getSoonestWeekdayInPast(startdate, weekdays)

    const result = new Date(startdate)

    if (OfNextTraining) result.setDate(startdate.getDate() + calculateDifferenceForwards(weekdayOfStartdate, weekdayOfTraining))
    else result.setDate(startdate.getDate() + calculateDifferenceBackwards(weekdayOfStartdate, weekdayOfTraining))

    return result
}

//TODO Implement Function to Subtract Days using a wrap around SA -> DI = 3

//    'So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'

function calculateDifferenceForwards(start, end) {
    if (start > end) {
        return 6 - start + 1 + end
    }
    return end - start
}

function calculateDifferenceBackwards(start, end) {
    if (start > end) {
        return end - start
    }
    return 0 - start - (6 - end + 1)
}

const weekdays = ['So', 'Di']

const testDate = new Date("2022-06-18T20:04:36.202Z")

console.log(getDateOfTraining(testDate, weekdays, false))

