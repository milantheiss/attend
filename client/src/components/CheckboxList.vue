<template>
    <div>
        <div v-for="element of formattedList" :key="element.text" class="flex items-center justify-between">
            <p class="font-medium text-lg truncate">{{ element.text }}</p>
            <CheckboxInput v-model="element.checked" class="color-standard-gradient-1 ml-6"></CheckboxInput>
        </div>
    </div>
</template>
  
<script>
import CheckboxInput from "@/components/CheckboxInput.vue"

export default {
    name: "CheckboxList",
    emits: ['update:modelValue', 'onChange', 'on'],
    components: {
        CheckboxInput
    },
    data() {
        return {
            formattedList: []
        }
    },
    props: {
        sortAlphabetically: {
            type: Boolean,
            default: false
        },
        modelValue: String.Array
    },
    methods: {
        _sortAlphabetically(list) {
            list.sort((a, b) => a.localeCompare(b))

            return list
        },

        formatList(list) {
            console.log(list);
            if (this.sortAlphabetically) {
                list = this._sortAlphabetically(list)
            }
            return list.map(val => val = { text: val, checked: false })
        }
    },
    watch: {
        modelValue(newVal) {
            this.formattedList = this.formatList(newVal)
        },
        input() {
            this.$emit('update:modelValue', this.input)
        },
    },
    created() {
        if (typeof this.modelValue !== 'undefined') {
            this.formattedList = this.formatList(this.modelValue)
        }
    }
};
</script>