<template>
  <div>
      <p>Your now logged out</p>
  </div>
</template>

<script>

export default {
  name: "LogoutView",
  components: {},
  mounted() {
    this.$store.dispatch('LogOut')
    this.$router.push('/login')
  }
};
</script>
