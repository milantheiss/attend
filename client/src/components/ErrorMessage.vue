<template>
    <div class="flex items-center gap-4" v-if="show">
        <!--Error Icon-->
        <span >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                class="w-8 h-8 text-special-red">
                <path stroke-linecap="round" stroke-linejoin="round"
                    d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
        </span>
        <p class="text-special-red font-medium">{{message}}</p>
    </div>
</template>
  
<script>

export default {
    name: "ErrorMessage",
    props: {
        message: {
            type: String,
            required: true
        },
        show: {
            type: Boolean,
            required: true
        }
    }
}
</script>
  
<style scoped>

</style>
  