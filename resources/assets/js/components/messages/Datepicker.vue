<template>
  <div class="od-datepicker">
    <input type="date" class="od-datepicker__mobile-picker" :min="minStr" :max="maxStr" @change="dateSelected($event.target.value)">
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
    <button class="od-datepicker__submit" :disabled="!valid" @click="submit()">{{data.submit_text}}</button>
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
      minDate: this.data.min_date === 'today' ? moment() : moment(this.data.min_date, 'YYYY-MM-DD'),
      maxDate: this.data.max_date === 'today' ? moment() : moment(this.data.max_date, 'YYYY-MM-DD'),
      selectedDate: null
    };
  },
  methods: {
    submit() {
      const date = moment([this.selectedYear, moment(this.selectedMonth, 'MMMM').month(), this.selectedDay])

      if (!this.valid) {
        return
      }

      if (!date.isValid()) {
        this.message.data.callback_value = this.callbackVal
        this.message.data.callback_text = `${this.selectedDay ? this.selectedDay : ''} ${this.selectedMonth ? this.selectedMonth : ''} ${this.selectedYear ? this.selectedYear : ''}`
      } else {
        this.message.data.callback_value = date.format('YYYY-MM-DD')
        this.message.data.callback_text = date.format('MMMM Do YYYY')
      }

      this.onButtonClick(false, this.message.data)
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
    },
    dateSelected(val) {
      const date = moment(val, 'YYYY-MM-DD')
      this.selectedDay = date.date()
      this.selectedMonth = date.format('MMMM')
      this.selectedYear = date.year()
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

      if (!arr.includes(parseInt(this.selectedDay))) {
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
    },
    minStr() {
      return this.minDate.format('YYYY-MM-DD')
    },
    maxStr() {
      return this.maxDate.format('YYYY-MM-DD')
    },
    callbackVal() {
      return `${this.selectedYear}${this.selectedMonth ? '-'+moment(this.selectedMonth, 'MMMM').format('MM') : ''}${this.selectedMonth && this.selectedDay ? '-'+this.selectedDay : ''}`
    }
  }
};
</script>

<style lang="scss">
@import '../../../sass/0-globals/_vars.scss';

.od-datepicker {
  align-items: center;
  background-color: var(--od-user-input-background);
  min-height: 55px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  width: 100%;
  max-width: 700px;
  margin: 0 auto;

  .od-datepicker__mobile-picker {
    @media (min-width: $media-med) {
      display: none;
    }
  }

  .od-datepicker__wrapper {
    pointer-events: none;
    visibility: hidden;

    @media (min-width: $media-med) {
      pointer-events: all;
      visibility: visible;
    }
  }

  .od-datepicker__submit {
    background-color: var(--od-button-background);
    border: none;
    color: var(--od-button-text);
    width: auto;
    height: 50px;
    padding: 2px 20px;
    border-radius: 34.5px;
    transition: 0.4s;
    font-size: 18px;
    margin-top: 16px;

    &:hover {
        background-color: var(--od-button-hover-background);
    }

    &:active,
    &:focus {
        outline: none;
        border: none;
    }

    &:disabled {
      background-color: #c8c8c8;
    }
  }
}
</style>
