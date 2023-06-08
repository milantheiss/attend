<template>
  <div class="container mx-auto flex flex-col gap-4 items-center">
    <p class="font-medium text-xl md:text-2xl">Der Server reagiert nicht...</p>
    <p class="text-light-gray text-lg md:text-xl">Bitte versuche es später erneut.</p>
    <StandardButton @click="$router.back()">Zurück</StandardButton>
  </div>
</template>
    
<script>
import StandardButton from '@/components/StandardButton.vue';

export default {
  name: "ServerDownView",
  components: { StandardButton }
}
</script>
  