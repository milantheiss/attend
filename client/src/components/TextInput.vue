<template>
    <input class="block
                        w-full
                        px-1.5 bg-inherit
                        text-lg md:text-xl
                        focus:ring-0 focus:border-standard-gradient-1
                        focus:transition-none
                        ease-in-out duration-200"
        :class="showError ? 'border-2 rounded-lg border-special-red': 'border-0 border-b-2 border-[#9ea3ae] rounded-none'"
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
            this.$emit('onChange', this.input)
        },
        modelValue(newVal) {
            this.input = newVal
        }
    },
    expose: ["input"]
};
</script>
<style scoped>
input{
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
    line-height: 0rem;
}
</style>