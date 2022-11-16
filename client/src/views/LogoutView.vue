<template>
  <div>
    <p>Logging you off...</p>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/authStore';
export default {
  name: "LogoutView",
  setup() {
    const auth = useAuthStore()
    return {
      auth
    }
  },
  methods: {
    async logout() {
      await this.auth.logOut();
      this.$router.push('/login')
    }
  },
  created() {
    this.logout()
  }
};
</script>
