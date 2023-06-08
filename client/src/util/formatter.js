class Dateprocessor {
    /**
     * Konvertiert einen gegebenen String in die Zahl des Tages. --> entspricht getDay()
     * @param {*} dayString Tag ausgeschrieben. String muss mindestens die ersten zwei Buchstaben des Tages sein.
     * @returns Tag als eine Zahl
     */
    static convertWeekdaytoNumber(dayString) {
        const arr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
        let i = 0

        while (dayString.substring(0, 2) !== arr[i]) {
            i++
        }

        return i
    }

    /**
     * Berechnet den zeitlich in der Zukunft am nächsten liegenden Tag 
     * @param {*} referenceWeekday Startpunkt der Berechnung. Von diesem Tag wird der nächst gelegenen Tag gesucht
     * @param {*} weekdays Array mit allen Trainingstagen
     * @returns Nächst gelegenen Tag als Zahl
     */
    static getSoonestWeekdayInFuture(referenceWeekday, weekdays) {
        let min = this.convertWeekdaytoNumber(weekdays[0])
        let i = 1

        if ((min - referenceWeekday.getDay()) === 0) {
            // Wenn weekdays[0] der gleiche Wochentag wie min ist, wird [0] übersprungen und mit [1] weitergemacht 
            try {
                min = this.convertWeekdaytoNumber(weekdays[1])
                i = 2
            } catch (e) {
                // Wenn weekdays nur ein Element enthält
                return this.convertWeekdaytoNumber(weekdays[0])
            }
        }

        for (; i < weekdays.length; i++) {
            // Iteriert durch weekdays. Wenn Starttag zu weekday[i] näher ist (<) als Starttag zu min
            if (this.calculateDifferenceForwards(referenceWeekday.getDay(), this.convertWeekdaytoNumber(weekdays[i])) < this.calculateDifferenceForwards(referenceWeekday.getDay(), min) && this.calculateDifferenceForwards(referenceWeekday.getDay(), this.convertWeekdaytoNumber(weekdays[i])) !== 0) {
                min = this.convertWeekdaytoNumber(weekdays[i])
            }
        }

        return min
    }

    /**
     * Berechnet den zeitlich in der Vergangenheit am nächsten liegenden Tag
     * @param {*} referenceWeekday Startpunkt der Berechnung. Von diesem Tag wird der nächst gelegenen Tag gesucht
     * @param {*} weekdays Array mit allen Trainingstagen
     * @returns Nächst gelegenen Tag als Zahl
     */
    static getSoonestWeekdayInPast(referenceWeekday, weekdays) {
        let min = this.convertWeekdaytoNumber(weekdays[0])
        let i = 1

        if (this.calculateDifferenceBackwards(referenceWeekday.getDay(), min) === 0) {
            // Wenn weekdays[0] der gleiche Wochentag wie min ist, wird [0] übersprungen und mit [1] weitergemacht 
            try {
                min = this.convertWeekdaytoNumber(weekdays[1])
                i = 2
            } catch (e) {
                return this.convertWeekdaytoNumber(weekdays[0])
            }
        }

        for (; i < weekdays.length; i++) {
            // Iteriert durch weekdays. Wenn Starttag zu weekday[i] näher ist (>) als Starttag zu min --> calculateDifferenceBackwards gibt negative Zahl zurück
            // Und wenn weekdays[0] der gleiche Wochentag wie referenceWeekday ist
            // wird weekday[i] zu neuem min
            if (this.calculateDifferenceBackwards(referenceWeekday.getDay(), this.convertWeekdaytoNumber(weekdays[i])) > this.calculateDifferenceBackwards(referenceWeekday.getDay(), min) && this.calculateDifferenceBackwards(referenceWeekday.getDay(), this.convertWeekdaytoNumber(weekdays[i])) !== 0) {
                min = this.convertWeekdaytoNumber(weekdays[i])
            }
        }

        return min
    }

    static calculateDifferenceForwards(start, end) {
        if (start > end || start === end) {
            //In if muss start === end berücksichtigt werden, da return sonst 0 für diesen Case
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

/**
 * Berechnet Datum den nächsten Trainings
 * @param {String} startdate 
 * @param {Array} weekdays 
 * @param {Boolean} OfNextTraining 
 * @returns {Date} Datum des nächsten Trainings
 */
function getDateOfTraining(startdate, weekdays, OfNextTraining = true) {
    startdate = new Date(startdate)

    const weekdayOfTraining = OfNextTraining ? Dateprocessor.getSoonestWeekdayInFuture(startdate, weekdays) : Dateprocessor.getSoonestWeekdayInPast(startdate, weekdays)

    const result = new Date(startdate)

    if (OfNextTraining) result.setDate(startdate.getDate() + Dateprocessor.calculateDifferenceForwards(startdate.getDay(), weekdayOfTraining))
    else result.setDate(startdate.getDate() + Dateprocessor.calculateDifferenceBackwards(startdate.getDay(), weekdayOfTraining))

    return result
}

//WARNING Wird nirgends wo genutzt. Ist Disabled
// eslint-disable-next-line no-unused-vars
function getFormattedDateString(date) {
    const arr = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();
    const weekday = arr[date.getDay()] + '.'
    const ddmmyyyy = [(dd > 9 ? '' : '0') + dd, (mm > 9 ? '' : '0') + mm, date.getFullYear()
    ].join('.')

    return [weekday, ddmmyyyy].join(' ');
}

/**
 * Nimmt ein Date an und stringified es im Format YYYY-MM-DD
 * @param {Date} date 
 * @returns {String} Das Datum im Format YYYY-MM-DD
 */
function getShortenedJSONDate(date) {
    date = new Date(date)
    return date.toJSON().substring(0, 10)
}

/**
 * Checkt ob nächstes Training heute ist.
 * @param {Array} weekdays 
 * @returns {Boolean} Ob nächstes Training heute ist.
 */
function isClosestTrainingToday(weekdays){
    for (const weekday of weekdays) {
        if ((Dateprocessor.convertWeekdaytoNumber(weekday) - new Date().getDay()) === 0){
            return true
        }
    }
    return false
}

export{
    getDateOfTraining,
    getShortenedJSONDate,
    isClosestTrainingToday
}
