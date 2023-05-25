<template>
  <select v-model="selected" class="block
                        w-full
                        pl-2 pb-0.5 
                        text-black text-lg md:text-xl
                        focus:ring-0 focus:border-standard-gradient-1
                        bg-inherit"
    :class="showError ? 'border-2 rounded-lg border-special-red' : 'border-0 border-b-2 border-[#9ea3ae] rounded-none'"
    style="background-position: right 0.1rem center;padding-right: 1.9rem;">
    <option disabled :value="defaultValue">{{ defaultValue }}</option>
    <option v-for="element in options" :key="element.id" :value="element">
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
  emits: ['update:modelValue', 'onChange', 'on'],
  props: {
    modelValue: Object,
    defaultValue: {
      type: String,
      default: "Wähle",
    },
    options: Array,
    showError: Boolean
  },
  watch: {
    selected() {
      this.$emit("update:modelValue", this.selected);
    },
    modelValue(newVal) {
      if (this.options.length === 1) {
        this.selected = this.options[0]
      } else {
        this.selected = newVal;
      }
    }
  }
};
</script>

<style scoped>

</style>
