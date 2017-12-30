<template>
  <div>
    <div class="card" v-for="(section, key) in course.sections" v-bind:key="key">
      <h4 class="card-header">{{ section.name }}
        <span class="badge badge-primary section-weight">weight of {{ section.weight }}</span>
        <span class="badge badge-success section-grade">{{ section.grade | formatAsPercentage }}</span>
      </h4>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="assignment-column">Assignment</th>
              <th scope="col" class="received-column">Received</th>
              <th scope="col" class="possible-column">Possible</th>
              <th scope="col" class="percent-column">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assignment, key) in section.assignments" v-bind:key="key">
              <td class="assignment-column">{{ assignment.name }}</td>
              <td class="received-column">{{ assignment.ptsReceived }}</td>
              <td class="possible-column">{{ assignment.ptsPossible }}</td>
              <td class="percent-column">{{ assignment.grade | formatAsPercentage }}</td>
            </tr>
            <tr class="table-warning totals-row">
              <td class="assignment-column">Totals</td>
              <td class="received-column">{{ section.ptsReceived }}</td>
              <td class="possible-column">{{ section.ptsPossible }}</td>
              <td class="percent-column">{{ section.grade | formatAsPercentage }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Assignments',
    computed: {
      course () {
        return this.$store.state.Student.courses[this.$route.params.id]
      }
    }
  }
</script>

<style lang="sass" scoped>
.card-header, .card-body
  font-size: 0.8rem

.card-body
  padding: 0rem

.card
  margin-bottom: 10px

.received-column, .possible-column, .percent-column
  text-align: right

.assignment-column
  width: 60%

.possible-column
  width: 10%

.received-column
  width: 10%

.percent-column
  width: 20%

.section-grade
  position: absolute
  left: 82%

.totals-row > td
  font-weight: bold
</style>

