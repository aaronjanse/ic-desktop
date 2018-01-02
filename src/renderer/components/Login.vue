<template>
  <div style="margin: 20px">
    <div class="alert alert-danger" v-if="error">{{ error }}</div>
    <div class="form-group">
      <input v-model="school" type="text" class="form-control" id="school" placeholder="IC url" @keyup.enter="signIn()">
      <small class="form-text text-muted"><strong>What's this?</strong> Enter the URL where you usually access Infinite Campus</small>
      <small class="form-text text-muted"><strong>Example:</strong> <code>https://yourdistrict.infinitecampus.org/campus/yourdistrict.jsp</code></small>
    </div>
    <div class="form-group">
      <input v-model="username" type="text" class="form-control" id="username" placeholder="Username" @keyup.enter="signIn()">
    </div>
    <div class="form-group">
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Password" @keyup.enter="signIn()">
    </div>
    <button type="submit" class="btn btn-primary" :class="{disabled: inProgress}" @click="signIn()">
      <span v-if="!inProgress">Sign in</span>
      <span v-else><i class="fa fa-refresh fa-spin"></i> Signing in</span>
    </button>
  </div>
</template>

<script>
  import Student from '@/../util/Student'
  export default {
    name: 'Login',
    data () {
      return {
        school: localStorage.getItem('url'),
        username: '',
        password: '',
        student: {},
        inProgress: false,
        error: false
      }
    },
    methods: {
      signIn () {
        const student = new Student(this.username, this.password, this.school)
        this.inProgress = true
        this.error = false
        student.login().then(() => {
          student.getClasses().then(classes => {
            this.$store.commit('setCourses', classes)
          })
          student.getRecentAssignments().then(recentAssignments => {
            this.$store.commit('setRecentAssignments', recentAssignments)
          })
          student.getCalendar().then(attendance => {
            console.log(attendance)
          })

          this.$store.commit('setStudent', student)
          this.$router.replace('/recent')

          localStorage.setItem('url', this.school)

          this.inProgress = false
        }).catch(err => {
          if (err.value === 'incorrect username') {
            this.error = 'An error occured signing you in: incorrect username'
          } else if (err.value === 'incorrect password') {
            this.error = 'An error occured signing you in: incorrect password'
          } else if (err.value === 'unknown') {
            this.error = 'An error occured signing you in.'
          } else {
            this.error = 'An unrecognized error occured signing you in.'
            console.error(err)
          }

          this.inProgress = false
        })
      }
    }
  }
</script>

<style lang="sass">

</style>
