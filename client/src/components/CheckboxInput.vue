<template>
    <input type="checkbox" :name="name" v-model="input" :placeholder="placeholder" />
</template>

<script>
export default {
    name: "CheckboxInput",
    data() {
        return {
            input: this.modelValue,
        };
    },
    props: {
        modelValue: Boolean,
        placeholder: {
            type: String,
            default: "Eingabe"
        },
        name: String,
    },
    emits: ['update:modelValue', 'onChange', 'on'],
    watch: {
        input() {
            this.$emit('update:modelValue', this.input)
        },
        modelValue() {
            this.input = this.modelValue
        }
    }
};
</script>
<style scoped>
input[type="checkbox"] {
    appearance: none;
    background-color: rgba(187, 33, 33, 0);
    margin: 0;
    font: inherit;
    color: currentColor;
    width: 1.5em;
    height: 1.5em;
    border: 0.15em solid currentColor;
    border-radius: 0.15em;
    transform: translateY(-0.075em);
    display: grid;
    place-content: center;
}

input[type="checkbox"]::before {
    content: "";
    width: 0.8em;
    height: 0.8em;
    transform: scale(0);
    transition: 75ms transform ease-in-out;
    box-shadow: inset 1em 1em var(--form-control-color);

    background-color: #00D7FF;
    transform-origin: center;
}

input[type="checkbox"]:checked::before {
    transform: scale(1);
}
</style>