<template>
  <td :class="cl">
    <span v-if="!calculatorMode">{{ value }}</span>
    <input v-else type="text" class="form-control" v-model="mutableValue">
  </td>
</template>

<script>
  export default {
    name: 'MutableValue',
    props: ['cl', 'value'],
    data () {
      return {
        mutableValue: this.value
      }
    },
    computed: {
      calculatorMode () {
        return this.$store.state.Settings.calculatorMode
      }
    }
  }
</script>

<style lang="sass" scoped>
.received, .possible, .percent, .weight
  text-align: right

.assignment
  width: 45%

.worth
  width: 10%

.weight
  width: 10%

.possible
  width: 10%

.received
  width: 10%

.percent
  width: 15%
</style>

