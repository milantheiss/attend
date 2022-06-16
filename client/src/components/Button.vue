<template>
  <button @click="onClick()" class="btn">
    {{ text }}
  </button>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Button",
  props: {
    text: String
  },
  methods: {
    onClick() {
      this.$emit("btn-click");
    },
  },
};
</script>
