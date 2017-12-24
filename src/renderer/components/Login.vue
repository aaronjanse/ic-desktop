<template>
  <div>
    <div class="form-group">
      <input v-model="school" type="text" class="form-control" id="school" placeholder="IC url">
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
        this.$store.commit('setStudent', student)
      }
    }
  }
</script>

<style lang="sass">

</style>
