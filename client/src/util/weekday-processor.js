function convertWeekdaytoNumber(dayString) {
    const arr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    let i = 0

    while ([dayString.charAt(0), dayString.charAt(1)].join('') !== arr[i]) {
        i++
    }

    return i
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
        if ((convertWeekdaytoNumber(weekdays[i]) - referenceWeekday.getDay()) > (min - referenceWeekday.getDay()) && (convertWeekdaytoNumber(weekdays[i]) - referenceWeekday.getDay()) > 0)
        {
            min = convertWeekdaytoNumber(weekdays[i])
        }
    }

    return min
}

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

function getDateOfTraining(startdate, weekdays, OfNextTraining = true) {
    const weekdayOfStartdate = startdate.getDay()

    const weekdayOfTraining = OfNextTraining ? getSoonestWeekdayInFuture(startdate, weekdays) : getSoonestWeekdayInPast(startdate, weekdays)

    const result = new Date(startdate)

    if (OfNextTraining) result.setDate(startdate.getDate() + calculateDifferenceForwards(weekdayOfStartdate, weekdayOfTraining))
    else result.setDate(startdate.getDate() + calculateDifferenceBackwards(weekdayOfStartdate, weekdayOfTraining))

    console.log(result)

    return result
}

function getFormatedDateString(date) {
    const arr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();
    const weekday = arr[date.getDay()] + '.'
    const ddmmyyyy = [(dd > 9 ? '' : '0') + dd, (mm > 9 ? '' : '0') + mm, date.getFullYear()
    ].join('.')

    return [weekday, ddmmyyyy].join(' ');
}

module.exports = {
    getDateOfTraining,
    getFormatedDateString
}
