import home from '../../views/Home'
import Vue from 'vue'
import util from "../../util";

describe('notify.test.js', () => {
    let vm, cmp
    beforeEach(() => {
        cmp = Vue.extend(home)
        vm = new cmp()
    })

    it('should be 1.000 if 1000', () => {
        let isFormat = vm.formatNumber(1000)
        expect(isFormat).toEqual('1.000')
    })
    it('time', () => {
        expect(vm.times).toEqual([
            {value: 0, label: 'Full time'},
            {value: 7, label: '7 days ago'},
            {value: 14, label: '14 days ago'},
            {value: 30, label: '30 days ago'}
        ])
    })
    it('header', () => {
        expect(vm.headers).toEqual([
            {text: 'Countries', value: 'Country', sortable: false},
            { text: 'Total Confirmed', value: 'TotalConfirmed', align: 'right', sortable: true },
            { text: 'New Confirmed', value: 'NewConfirmed', align: 'right', sortable: true },
            { text: 'Total Deaths', value: 'TotalDeaths', align: 'right', sortable: true },
            { text: 'Total Recovered', value: 'TotalRecovered', align: 'right', sortable: true },
        ])
    })
})
