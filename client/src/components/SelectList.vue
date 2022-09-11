<template>
  <select @change="onChange" v-model="selected">
    <option disabled value="">{{ defaultValue }}</option>
    <option v-for="element in options" :key="element._id" :value="element._id">
      {{ element.name }}
    </option>
  </select>
</template>

<script>
export default {
  name: "SelectList",
  data() {
    return {
      selected: "",
    };
  },
  props: {
    defaultValue: {
      type: String,
      default: "Select",
    },
    options: Array,
  },
  methods: {
    onChange() {
      this.$emit("new-selected-value", this.selected);
    },
  },
};
</script>

<style scoped></style>
