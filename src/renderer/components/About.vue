<template>
  <div>
    <h3>About ic-desktop</h3>

    <p>ic-desktop is an open-source desktop client for the grade management website InfiniteCampus.</p>

    <p>Source code can be found at
      <i class="fa fa-github" aria-hidden="true"></i>
      <a href="https://github.com/aaronduino/ic-desktop" target="_blank">aaronduino/ic-desktop</a>
    </p>

    <p>Authors (in no particular order):</p>
    <ul>
      <li v-for="(author) in authors" v-bind:key="author">{{ author }}</li>
    </ul>

    <pre class="fixed-bottom">
    Version: {{ info }}
    Platform: {{ platform }}</pre>
  </div>
</template>

<script>
  export default {
    name: 'About',
    data: () => ({
      authors: Math.random() > 0.5 ? ['Aaron Janse', 'Jason Evans'] : ['Jason Evans', 'Aaron Janse'],
      info: process.env.npm_package_version,
      platform: require('os').platform()
    })
  }
</script>

<style lang="sass" scoped>
</style>
