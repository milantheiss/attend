<template>
    <input class='block
        text-lg md:text-xl
        focus:ring-0 focus:border-dark-grey
        w-[49px] md:w-[54px]
        bg-inherit text-left'
        :class="showError ? 'border-2 rounded-lg border-special-red' : 'border-0 border-b-2 border-gray-300 rounded-none'"
        type='number' :name="name" v-model="input" :max='new Date().getFullYear()' :min='2010' step="1" />
</template>

<script>
export default {
    name: "YearInput",
    data() {
        return {
            input: this.modelValue,
            maxInput: this.max || new Date().getFullYear(),
            minInput: this.min || 2022
        };
    },
    props: {
        modelValue: Number,
        default: Number,
        name: String,
        showError: Boolean,
        max: Number,
        min: Number
    },
    created() {
        if (typeof this.modelValue === "undefined" || this.modelValue === null || this.modelValue === "") {
            this.input = this.default
        }
    },
    emits: ['update:modelValue', 'onChange', 'on'],
    watch: {
        input(newVal) {
            if (newVal.toString().length >= 4) {
                if (newVal > this.maxInput) {
                    console.error(`Input is greater than max (${this.maxInput} is the max value)`)
                    this.input = this.maxInput
                } else if (newVal < this.minInput) {
                    console.error(`Input is greater than min (${this.minInput} is the min value)`)
                    this.input = this.minInput
                }

                this.$emit('update:modelValue', Number(this.input))
            }
        },
        modelValue(newVal) {
            this.input = newVal
        }
    }
};
</script>

<style scoped> input {
     padding: 0;
     padding-bottom: 1px;
     padding-left: 4px;
     padding-right: 4px;
 }

 input::-webkit-inner-spin-button,
 input::-webkit-outer-spin-button {
     display: none;
 }

 input[type=number] {
     -moz-appearance: textfield;
 }
</style>