<template>
    <div class="flex items-center justify-center">
        <!--Icon Length Ascending-->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-6 h-6" v-show="props.index === 0">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" />
        </svg>
        <!--Icon Length Descending-->
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
            class="w-6 h-6" v-show="props.index === 1">
            <path stroke-linecap="round" stroke-linejoin="round"
                d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m5.25-.75L17.25 9m0 0L21 12.75M17.25 9v12" />
        </svg>
    </div>
</template>
<script setup>
    // eslint-disable-next-line no-undef
    const props = defineProps({
        index: {
            type: Number,
            default: 0,
            validator: (value) => {
                return value >= 0 && value <= 1
            }
        }
    })
</script>