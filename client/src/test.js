function formattedString(date){
    console.log(date.getDate())
    date = new Date(date)
    const mm = date.getMonth() + 1; // getMonth() is zero-based
    const dd = date.getDate();
    const ddmmyyyy = [date.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('-')

    return new Date(ddmmyyyy);
}

const input = '2022-09-05T01:00:00.000+02:00'

console.log(formattedString(new Date(input)))
//const test = new Date(input.toLocaleString('de-DE', {timeZone: 'Europe/Berlin'}))
const test = new Date(input).toLocaleDateString('ko-DE', {timeZone: 'Europe/Berlin', year: 'numeric', month: 'numeric', day: 'numeric'})
const test2 = new Date(input)

console.log(test)
console.log(test2)