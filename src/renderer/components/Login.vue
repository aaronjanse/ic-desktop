<template>
  <div style="margin: 20px">
    <div class="form-group">
      <input v-model="school" type="text" class="form-control" id="school" placeholder="IC url">
      <small class="form-text text-muted"><strong>What's this?</strong> Enter the URL where you usually access Infinite Campus</small>
      <small class="form-text text-muted"><strong>Example:</strong> <code>https://yourdistrict.infinitecampus.org/campus/yourdistrict.jsp</code></small>
    </div>
    <div class="form-group">
      <input v-model="username" type="text" class="form-control" id="username" placeholder="Username">
    </div>
    <div class="form-group">
      <input v-model="password" type="password" class="form-control" id="password" placeholder="Password">
    </div>
    <button type="submit" class="btn btn-primary" @click="signIn()">Sign in</button>
  </div>
</template>

<script>
  import Student from '@/../util/Student'
  export default {
    name: 'Login',
    data () {
      return {
        school: '',
        username: '',
        password: '',
        student: {}
      }
    },
    methods: {
      signIn () {
        const student = new Student(this.username, this.password, this.school)
        student.login().then(() => {
          student.getClasses().then(classes => {
            console.log(classes)
          })
          student.getRecentAssignments().then(recentAssignments => {
            console.log(recentAssignments)
          })
        })
        this.$store.commit('setStudent', student)
        this.$router.replace('/recent')
      }
    }
  }
</script>

<style lang="sass">

</style>
