<template>
  <div class="container-fluid" style="margin-top: 10px">
    <div class="row">
      <div class="col-4">
        <div class="list-group">
          <router-link class="list-group-item list-group-item-action" active-class="active" :to="{ path: '/grades/' + key }" v-for="(course, key) in courses" v-bind:key="course.name">{{ course.name }}</router-link>
        </div>
      </div>
      <div class="col-8">
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
