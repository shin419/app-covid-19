<template>
  <div class="pa-4">
    <h1 class="text-center font-weight-bold pb-4">Covid-19</h1>
    <div class="row justify-center text-center">
      <div class="col-12 col-sm-3 font-weight-bold">
        <div class="pb-2">New Confirmed</div>
        <div class="red--text">+ {{formatNumber(global.NewConfirmed)}}</div>
        <div>{{formatNumber(global.TotalConfirmed)}}</div>
      </div>
      <v-divider vertical></v-divider>
      <div class="col-12 col-sm-3 font-weight-bold">
        <div class="pb-2">New Deaths</div>
        <div>{{formatNumber(global.NewDeaths)}}</div>
        <div>{{formatNumber(global.TotalDeaths)}}</div>
      </div>
      <v-divider vertical></v-divider>
      <div class="col-12 col-sm-3 font-weight-bold">
        <div class="pb-2">New Recovered</div>
        <div class="green--text">{{formatNumber(global.NewRecovered)}}</div>
        <div>{{formatNumber(global.TotalRecovered)}}</div>
      </div>
    </div>
    <v-data-table
        :headers="headers"
        :items="countriesCovid"
        :items-per-page="10"
        item-key="ID"
        :search="search"
        show-select
        v-model="selected"
        :single-select="false"
        @click:row="selectItem($event)"
    >
      <template v-slot:item.Country="{ item }">
        {{ item.Country }}
      </template>
      <template v-slot:item.TotalConfirmed="{ item }">
        {{ formatNumber(item.TotalConfirmed) }}
      </template>
      <template v-slot:item.NewConfirmed="{ item }">
        <p class="red--text">+ {{ formatNumber(item.NewConfirmed) }}</p>
      </template>
      <template v-slot:item.TotalDeaths="{ item }">
        {{ formatNumber(item.TotalDeaths) }}
      </template>
      <template v-slot:item.TotalRecovered="{ item }">
        {{ formatNumber(item.TotalRecovered) }}
      </template>
      <template v-slot:top>
        <v-row class="my-4" align="center">
          <v-text-field
              v-model="search"
              label="Search"
              class="mx-4"
              filled
              rounded
              dense
              append-icon="mdi-magnify"
              single-line
              hide-details
          ></v-text-field>
          <v-btn
              v-if="selected.length"
              @click="removeCountry"
              class="mx-2"
              fab dark small color="red">
            <v-icon dark>
              mdi-delete
            </v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-table>
    <v-dialog
        v-model="dialog.country"
        max-width="85%"
    >
      <v-card>
        <v-card-title>
          <span>Covid-19</span>
          <v-spacer></v-spacer>
          <v-btn
              color="primary" text
              @click="dialog.country = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-actions>
          <v-row style="margin: 0">
            <div class="text-center col-12 font-weight-bold" style="padding: 0 0 5px 0 ">TODAY</div>
            <div style="padding: 0 0 5px 0" class="row col-12 justify-center text-center mb-3">
              <div class="col-12 col-sm-4 font-weight-bold">
                <div class="pb-2">New Confirmed</div>
                <div class="red--text">+ {{formatNumber(country.NewConfirmed)}}</div>
                <div>{{formatNumber(country.TotalConfirmed)}}</div>
              </div>
              <v-divider vertical></v-divider>
              <div class="col-12 col-sm-4 font-weight-bold">
                <div class="pb-2">New Deaths</div>
                <div>{{formatNumber(country.NewDeaths)}}</div>
                <div>{{formatNumber(country.TotalDeaths)}}</div>
              </div>
              <v-divider vertical></v-divider>
              <div class="col-12 col-sm-4 font-weight-bold">
                <div class="pb-2">New Recovered</div>
                <div class="green--text">{{formatNumber(country.NewRecovered)}}</div>
                <div>{{formatNumber(country.TotalRecovered)}}</div>
              </div>
            </div>
            <div class="col-md-5 col-12" v-if="country && detailCountry">
              <div class="row justify-center">
                <v-img
                    max-width="150"
                    max-height="150"
                    :src="detailCountry.coatOfArms.png"
                ></v-img>
              </div>
              <div class="font-weight-bold">
                <p class="text-center mt-6 font-weight-bold">{{country.Country}}</p>
                <p class="text-center">Population: {{formatNumber(detailCountry.population)}}</p>
                <p class="text-center">Capital: {{detailCountry.capital && detailCountry.capital[0]}}</p>
                <p class="text-center">Region: {{detailCountry.region}}</p>
                <p class="text-center">Subregion: {{detailCountry.subregion}}</p>
              </div>
            </div>
            <div class="col-md-7 col-12">
              <v-card class="text-center">
                <div class="row justify-end pr-6 pt-3">
                  <div class="mt-1">
                    <v-menu :offset-y="true" v-model="menu" :close-on-content-click="false">
                      <template v-slot:activator="{ attrs, on }">
                        <v-btn color="primary" text v-bind="attrs" v-on="on">
                          <v-icon>mdi-calendar</v-icon>
                        </v-btn>
                      </template>
                      <v-date-picker
                          v-model="dates"
                          range
                      ></v-date-picker>
                      <v-list>
                        <v-list-item>
                          <v-btn color="primary" @click="getDetailCountry(dates, true); menu = false">
                            Sort
                          </v-btn>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>
                  <v-select class="col-6"
                            item-text="label"
                            item-value="value" v-model="time" :items="times" solo dense @change="changeTime"></v-select>
                </div>
                <v-card-text style="padding: 0" class="px-3 pb-3">
                  <v-sheet color="rgba(48,150,54,0.12)">
                    <v-sparkline
                        :fill="fill"
                        :line-width="width"
                        :padding="padding"
                        :smooth="radius || false"
                        :value="value"
                        auto-draw
                        height="150"
                    ></v-sparkline>
                  </v-sheet>
                </v-card-text>
              </v-card>
            </div>
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <notify :snackbar="snackbar" />
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import {mapGetters} from "vuex";
import notify from "@/components/notify.vue";
import date from 'moment'
const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', 'rgba(48,150,54,0.12)'],
]
export default Vue.extend({
  name: 'Home',
  components: { notify },
  data: () => ({
    headers: [
      {text: 'Countries', value: 'Country', sortable: false},
      { text: 'Total Confirmed', value: 'TotalConfirmed', align: 'right', sortable: true },
      { text: 'New Confirmed', value: 'NewConfirmed', align: 'right', sortable: true },
      { text: 'Total Deaths', value: 'TotalDeaths', align: 'right', sortable: true },
      { text: 'Total Recovered', value: 'TotalRecovered', align: 'right', sortable: true },
    ],
    countries: [],
    selected: [],
    search: '',
    dialog: { country: false },
    snackbar: { notify: false, val: "Delete successfully." },
    country: {},
    value: [],
    width: 2,
    radius: 10,
    padding: 8,
    lineCap: 'round',
    gradient: gradients[5],
    gradientDirection: 'top',
    gradients,
    fill: false,
    type: 'trend',
    autoLineWidth: false,
    times: [
      {value: 0, label: 'Full time'},
      {value: 7, label: '7 days ago'},
      {value: 14, label: '14 days ago'},
      {value: 30, label: '30 days ago'}
    ],
    time: {value: 0, label: 'Full time'},
    dates: [],
    menu: false,
    detailCountry: null,
    global: {}
  }),
  computed: {
    ...mapGetters(['getCountries', 'getCountryHide']),
    countriesCovid () {
      let arr = []
      arr = this.countries.filter((country) => !this.getCountryHide.includes(country.ID))
      return arr
    }
  },
  methods: {
    async changeTime() {
      let obTime = await this.selectName(this.time)
      this.getDetailCountry(obTime)
    },
    removeCountry () {
      let IDs = this.selected.map((select) =>  (select.ID))
      this.$store.dispatch('setCountryHide', IDs)
      this.snackbar.notify = true
    },
    async getDetailCountry(obTime, check) {
      const country = this.country
      let uri = `https://api.covid19api.com/country/${country.Slug}`
      if (check) {
        uri = `https://api.covid19api.com/country/${country.Slug}?from=${obTime[0]}&to=${obTime[1]}`
      } else if (obTime) {
        uri = `https://api.covid19api.com/country/${country.Slug}?from=${obTime.from}&to=${obTime.to}`
      }
      axios.get(uri)
          .then((res) => {
            if (res.status === 200) {
              let data = res.data || []
              this.value = data.map((item) => (item.Confirmed))
              this.dialog.country = true
            }
          })
          .catch((e) => {
            console.log(e)
          })
    },
    selectName (day) {
      let dayStart = ''
      let dayEnd = ''
      let timeStart = date().subtract(day, 'days')
      dayStart = date(timeStart).format('YYYY-MM-DD')
      dayEnd = date().format('YYYY-MM-DD')
      return { from: dayStart, to: dayEnd }
    },
    async selectItem(item) {
      this.country = item
      this.getCountry(item.Country)
      let obTime = null
      if (item.Slug === 'united-states') {
        obTime = await this.selectName(7)
        this.time = 7
      } else {
        this.time = 0
      }
      this.getDetailCountry(obTime)
    },
    formatNumber(value) {
      value = value || 0
      const val = (value / 1).toFixed(0).replace(',', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    getCountry(name) {
      axios.get('https://restcountries.com/v3.1/name/' + name)
          .then((res) => {
            if (res.status === 200) {
              let country = res.data || []
              this.detailCountry = country[0]
            }
          })
          .catch((e) => {
            console.log(e)
          })
    },
    getData() {
      axios.get('https://api.covid19api.com/summary')
          .then((res) => {
            this.global = (res.data && res.data.Global) || {}
            let countries = (res.data && res.data.Countries) || []
            this.countries = countries.sort((a, b) => (b.TotalConfirmed - a.TotalConfirmed))
          })
          .catch((e) => {
            console.log(e)
          })
    }
  },
  created() {
    this.getData()
  }
})
</script>
<style scoped>
p {
  padding: 0;
  margin: 0;
}
</style>
