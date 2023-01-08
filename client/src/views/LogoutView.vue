<template>
  <div>
    <!--Einfache Nachricht. Sollte nur für ein Bruchteil einer Sekunde sichtbar sein.-->
    <p>Logging you off...</p>
  </div>
</template>

<script>
import { useAuthStore } from '@/store/authStore.js';
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
