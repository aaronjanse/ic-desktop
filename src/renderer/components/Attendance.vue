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
        <div class="col border" v-for="colNum in 7" v-bind:key="colNum" v-bind:class="{'bg-light': shouldShade(rowNum, colNum)}">
          <div class="day">
            <span v-if="calcDayNum(rowNum, colNum)">{{ calcDayNum(rowNum, colNum) }}</span>
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
      shouldShade: function (row, col) {
        const day = this.calcDayNum(row, col)
        const month = this.monthIdx + 1
        const year = this.year

        if (day === null) {
          return true
        }

        const date = moment(`${year}-${month}-${day}`, 'YYYY-M-D')

        if ([0, 6].indexOf(date.day()) !== -1) {
          return true
        }

        if (date.isBefore(this.calendarData.firstDate)) {
          return true
        }

        if (date.isAfter(this.calendarData.lastDate)) {
          return true
        }

        const dateStr = date.format('YYYY-MM-DD')

        if (this.calendarData.nonInstructionalDays.indexOf(dateStr) !== -1) {
          return true
        }

        return false
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
.day
  height: 4em

.previous-month
  position: absolute
  left: 30%

.next-month
  position: absolute
  right: 30%
</style>
