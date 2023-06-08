<template>
  <div class="container mx-auto flex flex-col gap-4 items-center">
    <p class="font-medium text-xl md:text-2xl">Diese Seite existiert nicht...</p>
    <StandardButton @click="$router.back()">Zurück</StandardButton>
  </div>
</template>
    
<script>
import StandardButton from '@/components/StandardButton.vue';

export default {
  name: "NotFoundView",
  components: { StandardButton }
}
</script>
  