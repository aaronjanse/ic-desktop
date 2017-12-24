<template>
  <div>
    <div class="card" v-for="(section, key) in course.sections" v-bind:key="key">
      <h4 class="card-header">{{ section.name }}
        <span class="badge badge-primary">{{ section.weight * 100 }}%</span>
      </h4>
      <div class="card-body">
        <table class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="assignment-column">Assignment</th>
              <th scope="col" class="pts-column">Score</th>
              <th scope="col" class="percent-column">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assignment, key) in section.assignments" v-bind:key="key">
              <td class="assignment-column">{{ assignment.name }}</td>
              <td class="pts-column">{{ assignment.ptsReceived }} / {{ assignment.ptsPossible }}</td>
              <td class="percent-column">{{ Math.floor(assignment.ptsReceived / assignment.ptsPossible * 100) }}%</td>
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

.assignment-column
  width: 55%

.pts-column
  width: 25%

.percent-column
  width: 20%
</style>

