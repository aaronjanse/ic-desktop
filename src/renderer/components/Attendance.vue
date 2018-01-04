<template>
  <div>
    <h3 class="text-center">
      {{ monthName }} {{ year }}
      <i class="fa fa-angle-left fa-border previous-month" v-on:click="() => {incrementMonth(-1)}"></i>
      <i class="fa fa-angle-right fa-border next-month" v-on:click="() => {incrementMonth(1)}"></i>
    </h3>
    <div class="container">
      <div class="row">
        <div class="col">Sunday</div>
        <div class="col">Monday</div>
        <div class="col">Tuesday</div>
        <div class="col">Wednesday</div>
        <div class="col">Thursday</div>
        <div class="col">Friday</div>
        <div class="col">Saturday</div>
      </div>
      <div class="row" v-for="rowNum in 6" v-bind:key="rowNum">
        <div class="col border" v-for="colNum in 7" v-bind:key="colNum" v-bind:class="calcClass(rowNum, colNum)">
          <div class="day">
            <span v-if="calcDayNum(rowNum, colNum)">{{ calcDayNum(rowNum, colNum) }}</span>
            <span class="attendance-indicator">{{ getNotes(rowNum, colNum) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  const moment = require('moment')
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  export default {
    name: 'Attendance',
    data: () => ({
      year: moment().year(),
      monthIdx: moment().month()
    }),
    methods: {
      incrementMonth: function (increment) {
        this.monthIdx += increment

        if (this.monthIdx < 0) {
          this.year -= 1
        }
        if (this.monthIdx > 11) {
          this.year += 1
        }

        this.monthIdx = (this.monthIdx + 12) % 12
      },
      calcDayNum: function (row, col) {
        const num = ((row - 1) * 7 + col) - moment(`${this.year}-${this.monthIdx + 1}-1`, 'YYYY-M-D').day()

        const thisMonth = moment(`${this.year}-${this.monthIdx + 1}`, 'YYYY-M')
        if (num <= 0 || num > thisMonth.daysInMonth()) {
          return null
        }

        return num
      },
      calcClass: function (row, col) {
        const day = this.calcDayNum(row, col)
        const month = this.monthIdx + 1
        const year = this.year

        if (day === null) {
          return 'null-day'
        }

        const date = moment(`${year}-${month}-${day}`, 'YYYY-M-D')

        if ([0, 6].indexOf(date.day()) !== -1) {
          return 'weekend-day'
        }

        if (date.isBefore(this.calendarData.firstDate)) {
          return 'outside-schoolyear-day'
        }

        if (date.isAfter(this.calendarData.lastDate)) {
          return 'outside-schoolyear-day'
        }

        const dateStr = date.format('YYYY-MM-DD')

        if (this.calendarData.nonInstructionalDays.indexOf(dateStr) !== -1) {
          return 'no-school-day'
        }

        return 'normal-day'
      },
      getNotes: function (row, col) {
        const day = this.calcDayNum(row, col)
        const month = this.monthIdx + 1
        const year = this.year

        if (day === null) {
          return ''
        }

        const date = moment(`${year}-${month}-${day}`, 'YYYY-M-D')
        if ([0, 6].indexOf(date.day()) !== -1) {
          return ''
        }

        const dateStr = date.format('YYYY-MM-DD')

        if (this.calendarData.nonInstructionalDays.indexOf(dateStr) !== -1) {
          return ''
        }

        if (dateStr in this.calendarData.daysAbsent) {
          const code = this.calendarData.daysAbsent[dateStr]
          return code
        }

        return ''
      }
    },
    computed: {
      monthName: function () {
        return months[this.monthIdx]
      },
      calendarData: function () {
        return this.$store.state.Student.calendarData
      }
    }
  }
</script>

<style lang="sass" scoped>
.null-day
  background-color: white

.outside-schoolyear-day
  background-color: white

.weekend-day
  background-color: white

.no-school-day
  background-color: white

.normal-day
  background-color: rgb(248, 251, 254)

.attendance-indicator
  position: absolute
  bottom: 0
  right: 0.5em
  color: red

.day
  height: 4em

.previous-month
  position: absolute
  left: 30%

.next-month
  position: absolute
  right: 30%

.next-month:hover, .previous-month:hover
  background-color: #fdfdfd

.next-month:active, .previous-month:active
  background-color: #f1f1f1
</style>
