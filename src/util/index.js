import date from "moment";

export default {
    resTime (day, isTest) {
        let newDate = isTest ? new Date('2021-12-28') : new Date()
        let timeStart = date(newDate).subtract(day, 'days')
        let dayStart = date(timeStart).format('YYYY-MM-DD')
        let dayEnd = date().format('YYYY-MM-DD')
        return { from: dayStart, to: dayEnd }
    },
    formatNumber(number) {
        number = number || 0
        const val = (number / 1).toFixed(0).replace(',', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    }
}
