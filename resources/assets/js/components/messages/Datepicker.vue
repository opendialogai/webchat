<template>
  <div class="od-datepicker">
    <div class="od-datepicker__wrapper">
      <select v-model="selectedDay" :required="data.days_required" class="od-datepicker__dropdown">
        <option :value="null">- Day -</option>
        <option v-for="(day, i) in days" :key="i" :value="day">{{day}}</option>
      </select>
      <select v-model="selectedMonth" :required="data.month_required" class="od-datepicker__dropdown">
        <option :value="null">- Month -</option>
        <option v-for="(month, i) in months" :key="i" :value="month">{{month}}</option>
      </select>
      <select v-model="selectedYear" :required="data.year_required" class="od-datepicker__dropdown">
        <option :value="null">- Year -</option>
        <option v-for="(year, i) in years" :key="i" :value="year">{{year}}</option>
      </select>
      {{valid}}
    </div>
    <button class="od-datepicker__submit" @click="submit()">{{data.submit_text}}</button>
  </div>
</template>

<script>
import moment from 'moment';

export default {
  props: {
    data: {
      type: Object,
      required: true
    },
    message: {
      type: Object,
      required: true
    },
    onButtonClick: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      selectedDay: null,
      selectedMonth: null,
      selectedYear: null,
      minDate: moment('2020-02-20', 'YYYY-MM-DD'),
      //minDate: this.data.min_date === 'today' ? moment() : moment(this.data.min_date, 'YYYY-MM-DD'),
      maxDate: this.data.max_date === 'today' ? moment() : moment(this.data.max_date, 'YYYY-MM-DD'),
      dayRequired: true
    };
  },
  methods: {
    submit() {
      const date = moment([this.selectedYear, moment(this.selectedMonth, 'MMMM').month(), this.selectedDay]).format('YYYY-MM-DD')
      console.log('submit', date)
    },
    constructDayArray() {
      let arr = []

        if (this.selectedYear && this.selectedMonth) {
          let dayCount = moment(`${this.selectedMonth}-${this.selectedYear}`, 'MMMM-YYYY').daysInMonth() + 1
          arr = [...Array(dayCount).keys()].slice(1)
        } else if (this.selectedMonth) {
          let dayCount = moment(this.selectedMonth, 'MMMM').daysInMonth() + 1
          arr = [...Array(dayCount).keys()].slice(1)
        } else {
          arr = [...Array(32).keys()].slice(1)
        }

        return arr
    }
  },
  computed: {
      years() {
        const maxYear = this.maxDate.year()
        const minYear = this.minDate.year()
        const diff = maxYear - minYear + 1

        return Array.from({length: diff}, (v, i) => maxYear - diff + i + 1 + '').reverse()
      },
      months() {
        let months = []

        if (parseInt(this.selectedYear) === this.minDate.year() 
          && parseInt(this.selectedYear) === this.maxDate.year()) {
          months = moment.months().slice(this.minDate.month(), this.maxDate.month() + 1)
          return months
        } 

        if (parseInt(this.selectedYear) === this.minDate.year()) {
          months = moment.months().slice(this.minDate.month())
          return months
        } 
        
        if (parseInt(this.selectedYear) === this.maxDate.year()) {
          months = moment.months().slice(0, this.maxDate.month() + 1)
          return months
        }

        return moment.months()
      },
      days() {
        let arr = this.constructDayArray()

        if (moment(this.selectedMonth, 'MMMM').month() === this.maxDate.month() && parseInt(this.selectedYear) === this.maxDate.year()) {
          arr = arr.slice(0, this.maxDate.date())
        }

        if (moment(this.selectedMonth, 'MMMM').month() === this.minDate.month() && parseInt(this.selectedYear) === this.minDate.year()) {
          arr = arr.slice(this.minDate.date() -1, arr.length)
        }

        if (!arr.includes(this.selectedDay)) {
          this.selectedDay = null
        }

        return arr
      },
      valid() {
        if (this.dayRequired || this.selectedDay !== null) {
          return moment([this.selectedYear, moment(this.selectedMonth, 'MMMM').month(), this.selectedDay]).isValid()
        } else if (this.data.month_required) {
          return (this.selectedMonth !== null && this.selectedYear !== null)
        } else {
          return this.selectedYear !== null
        }
      }
  }
};
</script>

<style lang="scss">
@import '../../../sass/0-globals/_vars.scss';

.od-datepicker {

}
</style>
