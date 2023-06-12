<template>
  <div class="container w-full mx-auto">
    <!--Einfache Nachricht. Sollte nur für ein Bruchteil einer Sekunde sichtbar sein.-->
    <p class="mx-3.5 md:mx-7 font-medium">Logging you off...</p>
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
  async mounted() {
    await this.logout()
  }
};
</script>
