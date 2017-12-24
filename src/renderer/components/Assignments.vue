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
              <th scope="col">Course</th>
              <th scope="col">Assignment</th>
              <th scope="col">Score</th>
              <th scope="col">Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(assignment, key) in section.assignments" v-bind:key="key">
              <td>{{ course.name }}</td>
              <td>{{ assignment.name }}</td>
              <td>{{ assignment.ptsReceived }} / {{ assignment.ptsPossible }}</td>
              <td>{{ Math.floor(assignment.ptsReceived / assignment.ptsPossible * 100) }}%</td>
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
</style>

