let countryHide = localStorage.getItem('countryHide')
countryHide = countryHide && countryHide !== null ? JSON.parse(countryHide) : []
const home = {
    state: {
        country: {},
        countryHide: countryHide
    },
    mutations: {
        SET_COUNTRIES (state, countries) {
            const country = {}
            countries.forEach((ct) => {
                country[ct.name.common] = ct
            })
            state.country = country
        },
        SET_COUNTRYHIDE (state, countries) {
            state.countryHide = state.countryHide.concat(countries)
            localStorage.setItem('countryHide', JSON.stringify(state.countryHide))
        }
    },
    actions: {
        setCountries (context, countries) {
            context.commit('SET_COUNTRIES', countries)
        },
        setCountryHide (context, countries) {
            context.commit('SET_COUNTRYHIDE', countries)
        }
    },
    getters: {
        getCountries: (state) => {
            return state.country
        },
        getCountryHide: (state) => {
            return state.countryHide
        }
    }
}

export default home
