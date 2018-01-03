<template>
  <div class="" style="margin-top: 10px">
    <div class="row">
      <div class="col-3">
        <div class="list-group">
          <router-link class="list-group-item list-group-item-action" active-class="active" :to="{ path: '/grades/' + key }" v-for="(course, key) in courses" v-bind:key="course.name">
            {{ course.name | formatCourseName }}
            <span class="badge badge-primary badge-pill pull-right course-letter-grade text-left" :class="{ 'badge-light': $route.params.id == key }">
              {{course.letterGrade}}
            </span>
            <span class="badge badge-primary badge-pill pull-right course-percent-grade text-right" :class="{ 'badge-light': $route.params.id == key }">
              {{ course.grade | formatAsPercentage }}
            </span>
            <i class="fa fa-lock pull-right finialized-icon" title="Finalized" v-bind:style="{visibility: course.isFinalized ? 'visible' : 'hidden'}"></i>
         </router-link>
        </div>
      </div>
      <div class="col-9">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Grades',
    computed: {
      student () {
        return this.$store.state.Student.student
      },
      courses () {
        return this.$store.state.Student.courses
      }
    }
  }
</script>

<style lang="sass" scoped>
.list-group
  font-size: 0.7rem

.course-percent-grade
  width: 5.5em

.course-letter-grade
  width: 2.5em
  margin-left: 0.75em

.finialized-icon
  margin-right: 0.75em
</style>

