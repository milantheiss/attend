<template>
    <div class="grid grid-cols-1 place-items-end w-full">
        <div class="flex justify-between items-center mb-4 w-full">
            <header class="flex items-center w-full">
                <slot name="header"></slot>
            </header>
            <div class="color-gray-300 mt-0.5 w-fit justify-items-end" @click="toggleShowContent">
                <!--Chevron Down-->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-6 h-6" v-if="!showContent">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
                <!--Chevron Up-->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" class="w-6 h-6" v-if="showContent">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
            </div>
        </div>
        <transition enter-active-class="transition ease-in-out duration-50" enter-from-class="-translate-y-5 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition ease-in-out duration-100 transform"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-5 opacity-25">
                <content class="container truncate" v-show="showContent">
                    <slot name="content"></slot>
                </content>
        </transition>
    </div>
</template>
  
<script>
import { ref, watch } from 'vue';

export default {
    name: "CollapsibleContainer",
    setup(props) {
        const showContent = ref(props.show);

        watch(
            () => props.show,
            show => {
                showContent.value = show;
            },
        );

        return {
            showContent
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
            this.showContent = !this.showContent
        }
    }
};
</script>