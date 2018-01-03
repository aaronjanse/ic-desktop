<template>
  <div>
    <h3 class="text-center">
      January
      <i class="fa fa-angle-left fa-border last-month"></i>
      <i class="fa fa-angle-right fa-border next-month"></i>
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
      <div class="row" v-for="rowNum in 5" v-bind:key="rowNum">
        <div class="col border" v-for="colNum in 7" v-bind:key="colNum" v-bind:class="{'bg-light': colNum === 1 || colNum == 7 || (rowNum - 1) * 7 + colNum > 31}">
          <div class="day">
            <span>{{ (rowNum - 1) * 7 + colNum }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Attendance'
  }
</script>

<style lang="sass" scoped>
.day
  height: 4em

.last-month
  position: absolute
  left: 30%

.next-month
  position: absolute
  right: 30%
</style>
