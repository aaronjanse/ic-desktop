<template>
  <div id="app">
    <div id="main">
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs">
            <li class="nav-item">
              <a class="nav-link active" href="#">Sign in</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="#">About</a>
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
  name: 'app'
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
