<template>
  <div>
    <h1>Recent</h1>
    {{ recent }}
  </div>
</template>

<script>
  export default {
    name: 'Recent',
    data () {
      return {
        recent: null
      }
    },
    computed: {
      student () {
        return this.$store.state.Student.student
      }
    },
    mounted () {
      // ...
    }
  }
</script>
