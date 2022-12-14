<template>
    <div class="grid place-items-end">
        <div class="color-gray-300" @click="toggleShowContent">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6" v-if="!showContent">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                stroke="currentColor" class="w-6 h-6" v-if="showContent">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
        </div>
        <div>
            <slot v-if="showContent"></slot>
        </div>
    </div>
</template>
  
<script>

import { ref, watch } from 'vue';

export default {
    name: "CollapsibleContainer",
    setup(props) {
        const modal = ref(null);
        const showContent = ref(false);

        watch(
            () => props.show,
            show => {
                showContent.value = show;
            },
        );

        return {
            showContent,
            modal
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        toggleShowContent() {
            console.log("Show Content");
            this.showContent = !this.showContent
        }
    }
};
</script>