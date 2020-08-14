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
    </div>
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
      minDate: '2018-09-01',
    };
  },
  methods: {},
  computed: {
      years() {
        const maxYear = this.data.max_date === 'today' ? parseInt(moment().format('YYYY')) : parseInt(moment(this.data.max_date).format('YYYY'))
        const minYear = parseInt(moment(this.minDate).format('YYYY'))
        const diff = maxYear - minYear + 1

        return Array.from({length: diff}, (v, i) => maxYear - diff + i + 1 + '').reverse()
      },
      months() {
        if (parseInt(this.selectedYear) === moment(this.minDate).year()) {
          return moment.months().slice(moment(this.minDate).month())
        } else {
          return moment.months()
        }
      },
      days() {
        if (this.selectedYear && this.selectedMonth) {
          let dayCount = moment(`${this.selectedMonth}-${this.selectedYear}`, 'MMMM-YYYY').daysInMonth() + 1
          return [...Array(dayCount).keys()].slice(1)
        } else if (this.selectedMonth) {
          let dayCount = moment(this.selectedMonth, 'MMMM').daysInMonth() + 1
          return [...Array(dayCount).keys()].slice(1)
        } else {
          return [...Array(32).keys()].map(x => x.toString()).slice(1)
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
