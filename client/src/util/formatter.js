class Dateprocessor {
    static convertWeekdaytoNumber(dayString) {
        console.log(dayString)

        const arr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
        let i = 0

        while ([dayString.charAt(0), dayString.charAt(1)].join('') !== arr[i]) {
            i++
        }

        return i
    }

    static getSoonestWeekdayInFuture(referenceWeekday, weekdays) {

        let min = this.convertWeekdaytoNumber(weekdays[0])
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

    static getSoonestWeekdayInPast(referenceWeekday, weekdays) {
        let min = this.convertWeekdaytoNumber(weekdays[0])
        let i = 1

        //QUESTION Warum wird das gemacht?
        if ((min - referenceWeekday.getDay()) === 0) {
            try {
                min = this.convertWeekdaytoNumber(weekdays[1])
                i = 2
            } catch (e) {
                return this.convertWeekdaytoNumber(weekdays[0])
            }
        }

        for (; i < weekdays.length; i++) {
            console.log("For schleife")
            if (this.calculateDifferenceBackwards(weekdays[i], referenceWeekday.getDay()) > this.calculateDifferenceBackwards(min, referenceWeekday.getDay()) && this.calculateDifferenceBackwards(weekdays[i], referenceWeekday.getDay()) > 0) {
                min = this.convertWeekdaytoNumber(weekdays[i])
            }
            console.log("min",min)
        }

        return min
    }

    static calculateDifferenceForwards(start, end) {
        if (start > end) {
            return 6 - start + 1 + end
        }
        return end - start
    }

    static calculateDifferenceBackwards(start, end) {
        if (start > end) {
            return end - start
        }
        return 0 - start - (6 - end + 1)
    }

}

function getDateOfTraining(startdate, weekdays, OfNextTraining = true) {
    startdate = new Date(startdate)
    const weekdayOfStartdate = startdate.getDay()

    const weekdayOfTraining = OfNextTraining ? Dateprocessor.getSoonestWeekdayInFuture(startdate, weekdays) : Dateprocessor.getSoonestWeekdayInPast(startdate, weekdays)

    const result = new Date(startdate)

    if (OfNextTraining) result.setDate(startdate.getDate() + Dateprocessor.calculateDifferenceForwards(weekdayOfStartdate, weekdayOfTraining))
    else result.setDate(startdate.getDate() + Dateprocessor.calculateDifferenceBackwards(weekdayOfStartdate, weekdayOfTraining))

    console.log(weekdayOfStartdate)
    console.log(weekdayOfTraining)
    console.log(Dateprocessor.calculateDifferenceForwards(weekdayOfStartdate, weekdayOfTraining))

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

function getShortenedJSONDate(date) {
    return date.toJSON().substring(0, 10)
}

function isClosestTrainingToday(weekdays){
    for (const weekday of weekdays) {
        if ((Dateprocessor.convertWeekdaytoNumber(weekday) - new Date(Date.now()).getDay()) === 0){
            return true
        }
    }
    return false
}

module.exports = {
    getDateOfTraining,
    getFormatedDateString,
    getShortenedJSONDate,
    isClosestTrainingToday
}
