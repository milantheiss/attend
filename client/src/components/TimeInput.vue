<template>
    <input class='block
        w-[100px] md:w-[128px]
        pl-1 py-0.5
        font-medium
        focus:ring-0 focus:border-standard-gradient-1
        bg-inherit text-left'
        :class="showError ? 'border-2 rounded-lg border-special-red' : 'border-0 border-b-2 border-[#9ea3ae] rounded-none'"
        type='time' :name="name" v-model="input" :max='max' :min='min' @change="$emit('change')"/>
</template>

<script>
export default {
    name: "TimeInput",
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
    emits: ['update:modelValue', 'onChange', 'on', 'change'],
    watch: {
        input(newVal, oldVal) {
            //WARNING ES ist kein Midnight Wraparound möglich
            if (typeof newVal !== "undefined" && newVal !== null && newVal !== "") {                
                if(Number(newVal.split(":")[0]) + Number(newVal.split(":")[1] / 60) > Number(this.max?.split(":")[0]) + Number(this.max?.split(":")[1] / 60)) {
                    console.error(`Input is greater than max (${this.max} is the max value)`)
                    this.input = oldVal
                } else {
                    if(Number(newVal.split(":")[0]) + Number(newVal.split(":")[1] / 60) < Number(this.min?.split(":")[0]) + Number(this.min?.split(":")[1] / 60)) {
                        console.error(`Input is greater than min (${this.min} is the min value)`)
                        this.input = oldVal
                    } else {
                        this.$emit('update:modelValue', this.input)
                        this.$emit('onChange', this.input)
                    }
                }
            }
        },
        modelValue(newVal) {
            this.input = newVal
        }
    }
};
</script>

<style scoped>
input[type="time"]::-webkit-calendar-picker-indicator {
    display: block;
    opacity: 0;
}

input::-webkit-inner-spin-button,
input::-webkit-clear-button {
    display: block;
    opacity: 0;
}

input[type="time"] {
    background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%20class%3D%22w-6%20h-6%22%3E%0A%20%20%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M12%206v6h4.5m4.5%200a9%209%200%2011-18%200%209%209%200%200118%200z%22%20%2F%3E%0A%3C%2Fsvg%3E%0A");
    background-repeat: no-repeat;
    background-size: 1.5rem 1.5rem;
    background-position: right 0.25rem center;

    cursor: pointer;
}

input::-webkit-date-and-time-value {
    text-align: left;
}
</style>