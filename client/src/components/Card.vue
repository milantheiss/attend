<template>
    <div >
        <transition enter-active-class="transition-opacity ease-in-out delay-400 duration-500 transform "
            enter-from-class="opacity-0" enter-to-class="opacity-100">
            <div @click="togglePanel"
                class="px-3.5 py-3 rounded-xl drop-shadow-md font-normal text-lg md:text-xl text-black bg-gradient-to-tr from-unchecked-gradient-1 to-unchecked-gradient-2 "
                v-if="!showPanel">
                <div class="flex items-center justify-between">
                    <slot name="header"></slot>
                    <!--Chevron Down-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
        </transition>
        <div class="h-fit">
            <transition enter-active-class="transition ease-in-out duration-500 delay-75 overflow-hidden"
                enter-from-class="-translate-y-5 opacity-0" enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition ease-in-out duration-500 overflow-hidden"
                leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-12 opacity-25">
                <slot v-if="showPanel" name="content"></slot>
            </transition>
        </div>
    </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
    name: "TrainingssessionCard",
    setup(props) {
        const showPanel = ref(props.show);

        watch(
            () => props.show,
            show => {
                showPanel.value = show;
            },
        );

        const togglePanel = () => {
            showPanel.value = !showPanel.value;
        };

        return {
            showPanel,
            togglePanel
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['cardState'],
    watch: {
        showPanel: function (newVal) {
            this.$emit('cardState', newVal);
        }
    },
    expose: ['togglePanel']
};
</script>

<style scoped>

</style>
