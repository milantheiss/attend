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
    emits: ["selectedElements"],
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
        list: String.Array,
        default: {
            type: Boolean,
            default: false
        }
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
            return list.map(val => val = { text: val, checked: this.default })
        }
    },
    watch: {
        list(newVal) {
            this.formattedList = this.formatList(newVal)
        }
    },
    created() {
        if (typeof this.list !== 'undefined') {
            this.formattedList = this.formatList(this.list)
        }
    },
    computed: {
        selectedElements(){
            return (this.formattedList.filter(val => val.checked)).map(val => val.text)
        }
    }
};
</script>