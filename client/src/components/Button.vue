<template>
  <button @click="onClick()" class="inline-flex items-center px-3 py-1.5 rounded-md drop-shadow-md">
    <img :src="imgsrc" alt="eye icon" v-show="showIMG" class="w-6 mr-2">
    <p class="font-medium md:text-xl">{{ text }}</p>
  </button>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Button",
  props: {
    text: String,
    imgsrc: String
  },
  data(){
    return{
      showIMG: Boolean
    }
  },
  methods: {
    onClick() {
      this.$emit("btn-click");
    }
  },
  created() {
    this.showIMG = typeof this.imgsrc !== "undefined"
  },

  watch: {
    imgscr(){
      this.showIMG = typeof this.imgsrc !== "undefined"
    }
  }
};
</script>
