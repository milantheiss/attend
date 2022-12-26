<template>
    <div class="mb-4">
        <transition enter-active-class="transition-opacity ease-in-out delay-400 duration-500 transform " enter-from-class="opacity-0"
        enter-to-class="opacity-100">
            <div @click="showPanel = true"
                class="px-3.5 py-3 rounded-lg drop-shadow-md font-normal text-lg md:text-xl text-black bg-gradient-to-tr from-unchecked-gradient-1 to-unchecked-gradient-2 "
                v-if="!showPanel">
                <div class="flex items-center justify-between">
                    <h3>{{ new Date(modelValue.date).toLocaleDateString("de-DE", {weekday: "short", year: "numeric", month: "short", day: "numeric"}) }}</h3>
                    <!--Chevron Down-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-6 h-6">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>
        </transition>
        <div class="h-fit">
            <transition enter-active-class="transition ease-in-out duration-500 delay-75 overflow-hidden" enter-from-class="-translate-y-5 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in-out duration-500 overflow-hidden"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-12 opacity-25">
                <div v-if="showPanel" class="bg-white px-3.5 py-3 rounded-lg drop-shadow-md font-normal text-lg md:text-xl text-black overflow-hidden">
                    <!--Chevron Up-->
                    <div class="flex justify-between items-center mb-6">
                        <h3>{{ new Date(modelValue.date).toLocaleDateString("de-DE", {weekday: "short", year: "numeric", month: "short", day: "numeric"}) }}</h3>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"
                            class="w-6 h-6" @click="showPanel = false">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                        </svg>
                    </div>
                    <div class="flex justify-between items-center mb-3">
                            <p class="text-gray-700 font-light text-base md:text-lg w-full">Beginn: </p>
                            <TimeInput class="text-black font-normal text-base md:text-lg text-right" v-model="session.starttime" min="00:00" :max="session.endtime" :show-error="typeof session.starttime === 'undefined'"></TimeInput>
                    </div>
                    <div class="flex justify-between items-center mb-3">
                            <p class="text-gray-700 font-light text-base md:text-lg w-full">Ende: </p>
                            <TimeInput class="text-black font-normal text-base md:text-lg text-right" v-model="session.endtime" :min="session.starttime" max="23:59" :show-error="typeof session.endtime === 'undefined'"></TimeInput>
                    </div>
                    <div class="flex justify-between items-center mb-3">
                            <p class="text-gray-700 font-light text-base md:text-lg w-full">Stundenanzahl: </p>
                            <p class="text-black font-bold text-base md:text-lg text-right">{{ readableTotalHours }}</p>
                    </div>
                    <div class="flex justify-end pt-3">
                        <button @click="onClickOnRemove()"
                        class="text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 px-1.5 ty:px-3 sm:px-4 md:px-4 py-1.5 rounded-lg drop-shadow-md">
                            <p class="font-medium text-base md:text-lg">Entfernen</p>
                        </button>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
    
<script>
import TimeInput from './TimeInput.vue';
import { ref, watch } from 'vue';

export default {
    name: "TrainingssessionItem",
    setup(props) {
        const showPanel = ref(props.show);

        watch(
            () => props.show,
            show => {
                showPanel.value = show;
            },
        );

        return {
            showPanel
        };
    },
    data() {
        return {
            session: this.modelValue
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
        modelValue: Object,
    },
    emits: ['update:modelValue', 'onChange', 'on', "onClickOnRemove"],
    methods: {
        onClickOnRemove() {
            //Entfernt Trainingssession 
            this.$emit('onClickOnRemove', this.session)
        }
    },
    components: {
        TimeInput
    },
    watch: {
        session() {
            console.log("🚀 ~ file: TrainingssessionItem.vue:62 ~ sessio", this.session)
            this.$emit('update:modelValue', this.session)
        },
        modelValue(newVal) {
            this.session = newVal
        },
        "session.starttime"(){
            this.session.faultyTimes = typeof this.session.starttime === 'undefined' && typeof this.session.endtime === 'undefined'
        },
        "session.endtime"(){
            this.session.faultyTimes = typeof this.session.starttime === 'undefined' && typeof this.session.endtime === 'undefined'
        }
    },
    computed: {
        totalHours() {
            const startingTime = Number(this.session.starttime?.split(":")[0]) + Number(this.session.starttime?.split(":")[1] / 60) || 0;

            const endingTime = Number(this.session.endtime?.split(":")[0]) + Number(this.session.endtime?.split(":")[1] / 60) || 0;

            return endingTime - startingTime
        },
        readableTotalHours() {
            const hh = Math.trunc(this.totalHours )
            const mm = Math.round(60 * (this.totalHours - hh))
            return `${hh} Std ${mm} Min`
        }
    },
    created(){
        this.showPanel = this.session.faultyTimes || false
    }
};
</script>
    
<style scoped>

</style>
    