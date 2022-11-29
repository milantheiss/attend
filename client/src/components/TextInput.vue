<template>
    <input class="block
                        w-full
                        px-1.5 py-0.5
                        text-inherit text-lg md:text-xl
                        focus:ring-0 focus:border-dark-grey
                        bg-inherit"
        :class="showError ? 'border-2 rounded-lg border-special-red': 'border-0 border-b-2 border-gray-300 rounded-none'"
        :type="type" :name="name" v-model="input" :placeholder="placeholder" />
</template>

<script>
export default {
    name: "TextInput",
    data() {
        return {
            input: this.modelValue,
        };
    },
    props: {
        modelValue: String,
        placeholder: {
            type: String,
            default: "Eingabe"
        },
        name: String,
        showError: Boolean,
        type: {
            type: String,
            required: false,
            default: 'text'
        }
    },
    emits: ['update:modelValue', 'onChange', 'on'],
    watch: {
        input() {
            this.$emit('update:modelValue', this.input)
        },
        modelValue(newVal) {
            this.input = newVal
        }
    }
};
</script>