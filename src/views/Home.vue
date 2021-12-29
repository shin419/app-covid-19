<template>
  <div class="pa-4">
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
        max-width="80%"
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
            <div class="col-md-5 col-12" v-if="country && getCountries[country.Country]">
              <div class="row justify-center">
                <v-img
                    max-width="150"
                    :src="getCountries[country.Country].coatOfArms.png"
                ></v-img>
              </div>
              <div class="font-weight-bold">
                <p class="text-center mt-6 font-weight-bold">{{country.Country}}</p>
                <p class="text-center">Population: {{formatNumber(getCountries[country.Country].population)}}</p>
                <p class="text-center">Capital: {{getCountries[country.Country].capital && getCountries[country.Country].capital[0]}}</p>
                <p class="text-center">Region: {{getCountries[country.Country].region}}</p>
                <p class="text-center">Subregion: {{getCountries[country.Country].subregion}}</p>
              </div>
            </div>
            <div class="col-md-7 col-12">
              <v-card class="text-center">
                <div class="row justify-end pr-5 pt-2">
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
                <v-card-text>
                  <v-sheet color="rgba(0, 0, 0, .12)">
                    <v-sparkline
                        :value="value"
                        :gradient="gradient"
                        :smooth="radius || false"
                        :padding="padding"
                        :line-width="width"
                        :stroke-linecap="lineCap"
                        :gradient-direction="gradientDirection"
                        :fill="fill"
                        :type="type"
                        :auto-line-width="autoLineWidth"
                        auto-draw
                        height="200"
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
  ['#f72047', '#ffd200', '#1feaea'],
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
    menu: false
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
              if (!obTime) {
                this.dialog.country = true
              }
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
    selectItem (item) {
      this.country = item
      this.getDetailCountry()
    },
    formatNumber(value) {
      const val = (value / 1).toFixed(0).replace(',', ',')
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    },
    getData() {
      axios.get('https://api.covid19api.com/summary')
          .then((res) => {
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
