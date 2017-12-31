<template>
  <div>
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
        <tr v-for="(assignment, key) in recent" v-bind:key="key">
          <td>{{ assignment.className | formatCourseName }}</td>
          <td>{{ assignment.assignment.name }}</td>
          <td>{{ assignment.assignment.ptsReceived }} / {{ assignment.assignment.ptsPossible }}</td>
          <td class="percentage">{{ assignment.assignment.grade | formatAsPercentage}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  export default {
    name: 'Recent',
    computed: {
      student () {
        return this.$store.state.Student.student
      },
      recent () {
        return this.$store.state.Student.recent
      }
    }
  }
</script>

<style lang="sass" scoped>
.percentage
  text-align: right
</style>
