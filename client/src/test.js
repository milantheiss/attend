

const weekdaysSAD = ['Do']

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
            min = this.convertWeekdaytoNumber(weekdays[1])
            i = 2
        } catch (e) {
            return this.convertWeekdaytoNumber(weekdays[0])
        }
    }

    for (; i < weekdays.length; i++) {
        if (this.calculateDifferenceBackwards(weekdays[i], referenceWeekday.getDay()) < this.calculateDifferenceBackwards(min, referenceWeekday.getDay()) && this.calculateDifferenceBackwards(weekdays[i], referenceWeekday.getDay()) > 0) {
            min = this.convertWeekdaytoNumber(weekdays[i])
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

const startdate = new Date(Date.now)

const result = new Date(startdate)


result.setDate(startdate.getDate() + calculateDifferenceForwards(5, 4))

console.log(result)