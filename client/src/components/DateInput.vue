
<template>
    <input class='block
        w-full
        px-1.5 py-0.5
        text-inherit font-medium text-lg md:text-xl
        focus:ring-0 focus:border-dark-grey
        bg-inherit text-left'
        :class="showError ? 'border-2 rounded-lg border-special-red' : 'border-0 border-b-2 border-gray-300 rounded-none'"
        type='date' :name="name" v-model="input" :max='max' :min='min' />
</template>

<script>
export default {
    name: "DateInput",
    data() {
        return {
            input: this.modelValue
        };
    },
    props: {
        modelValue: String,
        name: String,
        showError: Boolean,
        max: String,
        min: String
    },
    emits: ['update:modelValue', 'onChange', 'on'],
    watch: {
        input() {
            this.$emit('update:modelValue', this.input)
        }
    }
};
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
    opacity: 0;
}   
input[type="date"] {
    background-image: url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27 stroke-width=%271.5%27 stroke=%27currentColor%27 class=%27w-6 h-6%27> <path stroke-linecap=%27round%27 stroke-linejoin=%27round%27 d=%27M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5%27 /%3e %3c/svg%3e");
    background-repeat: no-repeat;
    background-size: 1.5rem 1.5rem;
    background-position: right 0.5rem center;
}
</style>