<template>
  <select v-model="selected" class="block
                        w-full
                        pl-2 pb-0.5 
                        text-lg md:text-xl
                        focus:ring-0 focus:border-standard-gradient-1
                        bg-inherit"
    :class="showError ? 'border-2 rounded-lg border-special-red' : 'border-0 border-b-2 border-[#9ea3ae] rounded-none'"
    style="background-position: right 0.1rem center;padding-right: 1.9rem;" @change="$emit('change', selected)">
    <option disabled :value="defaultValue" hidden>{{ defaultValue }}</option>
    <option v-for="element in computedOptions" :key="element._id" :value="element">
      {{ element.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: "SelectList",
  data() {
    return {
      selected: this.defaultValue
    };
  },
  emits: ['update:modelValue', 'onChange', 'on', 'change'],
  props: {
    modelValue: Object,
    defaultValue: {
      type: String,
      default: "Wähle",
    },
    options: Array,
    showError: Boolean,
    sortAlphabetically: {
      type: Boolean,
      default: false
    },
  },
  watch: {
    selected() {
      this.$emit("update:modelValue", this.selected);
    },
    modelValue(newVal) {
      // Wenn nur ein Element in der Liste ist, dann wird dieses automatisch ausgewählt
      if (this.computedOptions.length === 1) {
        this.selected = this.computedOptions[0]
      } else {
        this.selected = newVal;
      }
    }
  },
  computed: {
    computedOptions() {
      if (this.sortAlphabetically) {
        let options = this.options;
        options.sort((a, b) => a.name.localeCompare(b.name));
        return options
      } else {
        return this.options;
      }
    }
  },
  created() {
    if (typeof this.modelValue === 'undefined' || Object.keys(this.modelValue).length === 0) {
      this.selected = this.defaultValue;
    } else {
      this.selected = this.modelValue;
    }
  }
};
</script>

<style scoped></style>
