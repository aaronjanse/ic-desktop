<template>
  <div class="" style="margin-top: 10px">
    <div class="row">
      <div class="col-3">
        <div class="list-group">
          <router-link class="list-group-item list-group-item-action" active-class="active" :to="{ path: '/grades/' + key }" v-for="(course, key) in courses" v-bind:key="course.name">
            {{ course.name | formatCourseName }}
            <span class="badge badge-primary badge-pill pull-right" :class="{ 'badge-light': $route.params.id == key }">{{ course.grade | formatAsPercentage }}</span>
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
</style>

