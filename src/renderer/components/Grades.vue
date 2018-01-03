<template>
  <div class="" style="margin-top: 10px">
    <div class="row">
      <div class="col-3">
        <div class="list-group">
          <router-link class="list-group-item list-group-item-action" active-class="active" :to="{ path: '/grades/' + key }" v-for="(course, key) in courses" v-bind:key="course.name">
            {{ course.name | formatCourseName }}
            <span class="badge badge-primary badge-pill course-letter-grade text-left" :class="{ 'badge-light': $route.params.id == key }">
              {{course.letterGrade}}
            </span>
            <span class="badge badge-primary badge-pill course-percent-grade text-right" :class="{ 'badge-light': $route.params.id == key }">
              {{ course.grade | formatAsPercentage }}
            </span>
            <i class="fa fa-lock finialized-icon" title="Finalized" v-bind:style="{visibility: course.isFinalized ? 'visible' : 'hidden'}"></i>
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
  position: absolute
  right: 4.25em

.course-letter-grade
  max-width: 2.5em
  position: absolute
  left: calc(100% - 3.5em)

.finialized-icon
  position: absolute
  left: calc(100% - 8.5em)
</style>

