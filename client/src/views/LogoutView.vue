<template>
  <div>
    <p>Logging you off...</p>
  </div>
</template>

<script>
import { mapActions } from "vuex";
export default {
  name: "LogoutView",
  components: {},
  methods: {
    ...mapActions(["LogOut"]),
    async logout() {
      await this.LogOut();
      this.$router.push('/login')
    }
  },
  created() {
    this.logout()
  }
};
</script>
