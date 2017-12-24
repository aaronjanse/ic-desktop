<template>
  <div id="app">
    <div id="main">
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs" v-if="!student">
            <li class="nav-item">
              <a class="nav-link active" href="#">Sign in</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About</a>
            </li>
          </ul>
          <ul class="nav nav-tabs card-header-tabs" v-else>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="recent">Recent</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="grades">Grades</router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" active-class="active" to="attendance">Attendance</router-link>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#" @click="signOut()">Sign out</a>
            </li>
          </ul>
        </div>
        <div class="card-body">
          <router-view/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  computed: {
    student () {
      return this.$store.state.Student.student
    }
  },
  methods: {
    signOut () {
      this.$store.commit('setStudent', null)
      this.$router.replace('/')
    }
  }
}
</script>

<style lang="sass">
@import "~bootstrap/scss/bootstrap"

/* Customize container */
@media (min-width: 768px)
  .container
    max-width: 730px

.card
  border-radius: 0px
  border: none
</style>
