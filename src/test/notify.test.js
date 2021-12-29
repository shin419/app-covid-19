import Notify from '../components/notify'
import Vue from 'vue'

describe('notify.test.js', () => {
    let vm, cmp
    beforeEach(() => {
        cmp = Vue.extend(Notify)
        vm = new cmp({
            propsData: {
                snackbar: {
                    notify: false,
                    val: 'demo notify'
                }
            }
        })
    })

    it('equals snackbar to { notify: false, val: demo notify }', () => {
        expect(vm.snackbar).toEqual({
            notify: false,
            val: 'demo notify'
        })
    })
})
