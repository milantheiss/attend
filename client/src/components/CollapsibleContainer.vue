<template>
    <div class="grid grid-cols-1 place-items-end w-full">
        <div class="flex justify-between items-center w-full" :class="{ 'mb-4': showContent }">
            <header class="flex items-center w-full cursor-pointer justify-between"
                @click="enableClickOnHeader ? toggleShowContent() : undefined">
                <div class="flex">
                    <slot name="header"></slot>
                </div>
                <div class="color-gray-300 mt-0.5 w-fit justify-items-end" @click="enableClickOnHeader ? undefined : toggleShowContent()">
                    <!--Chevron Down-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                        stroke="currentColor" class="w-7 h-7" v-if="!showContent">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                    <!--Chevron Up-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                        stroke="currentColor" class="w-7 h-7" v-if="showContent">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                </div>
            </header>
        </div>
        <transition enter-active-class="transition ease-in-out duration-[150ms]" enter-from-class="-translate-y-5 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in duration-[150ms]"
            leave-from-class="opacity-100 mt-4" leave-to-class="-translate-y-2 opacity-0 mt-4">
            <content class="container truncate" v-if="showContent">
                <slot name="content"></slot>
            </content>
        </transition>
    </div>
</template>
  
<script>
import { ref, watch } from 'vue';

export default {
    name: "CollapsibleContainer",
    setup(props, context) {
        const showContent = ref(props.show);

        watch(
            () => props.show,
            show => {
                showContent.value = show;
            },
        );

        context.expose({
            showContent
        });

        return {
            showContent
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        enableClickOnHeader: {
            type: Boolean,
            default: true,
            required: false
        },
    },
    methods: {
        toggleShowContent() {
            this.showContent = !this.showContent
        }
    },
    expose: ['toggleShowContent']
};
</script>