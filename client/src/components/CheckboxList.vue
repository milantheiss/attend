<template>
    <div class="w-inherit">
        <!--TODO Styling-->
        <div v-for="element of formattedList" :key="element.text" class="flex items-center justify-between mb-2 truncate">
            <p class="font-medium text-lg truncate text-right">{{element.text}}</p>
            <CheckboxInput v-model="element.checked" class="color-standard-gradient-1"></CheckboxInput>
        </div>
    </div>
</template>
  
<script>
import CheckboxInput from "@/components/CheckboxInput.vue"

export default {
    name: "CheckboxList",
    emits: ['update:modelValue', 'onChange', 'on'],
    components:{
        CheckboxInput
    },
    data(){
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
            if (this.sortByFirstName) {
                list.sort((a, b) => a.firstname.localeCompare(b.firstname))
            } else if (this.sortByLastName) {
                list.sort((a, b) => a.lastname.localeCompare(b.lastname))
            }

            return list
        },

        formatList(list){
            console.log(list);
            if (this.sortAlphabetically){
                list = this._sortAlphabetically(list)
            }
            return list.map(val => val = {text: val, checked: false})
        }
    },
    watch: {
        modelValue(newVal) {
            this.formattedList = this.formatList(newVal)
        }
    },
    created() {
        if (typeof this.modelValue !== 'undefined') {
            this.formattedList = this.formatList(this.modelValue)
        }
    }
};
</script>