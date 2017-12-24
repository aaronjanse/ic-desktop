<template>
  <div>
    <div class="form-group">
      <input v-model="school" type="text" class="form-control" id="school" placeholder="School code">
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
  export default {
    name: 'Login',
    data () {
      return {
        school: '',
        username: '',
        password: '',
        student: {}
      }
    }
  }
</script>

<style lang="sass">

</style>
