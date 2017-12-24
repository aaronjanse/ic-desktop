<template>
  <div>
    <div class="card" v-for="(section, key) in course.sections" v-bind:key="key">
      <h4 class="card-header">{{ section.name }} <span class="badge badge-primary">{{ section.weight * 100 }}%</span></h4>
      <div class="card-body">
        ...
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
  padding: 1rem

.card
  margin-bottom: 10px
</style>

