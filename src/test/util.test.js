import util from '../util'
import date from "moment";

describe("App.test.js", () => {
    it('should be 1.000 if 1000', () => {
        var isFormat = util.formatNumber(1000)
        expect(isFormat).toEqual('1.000');
    });
    it('if Import 1 and true = { from: 2021-12-27, to: newDay }', () => {
        var time = util.resTime(1, true)
        let newDay = date().format('YYYY-MM-DD')
        expect(time).toEqual({ from: '2021-12-27', to: newDay });
    });
});
