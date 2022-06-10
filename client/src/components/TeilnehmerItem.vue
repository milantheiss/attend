<template>
  <div @dblclick="onDBclick">
    <h3>{{ participant.firstname }} {{ participant.lastname }}</h3>
  </div>
</template>

<script>
export default {
  name: "TeilnehmerItem",
  props: {
    participant: Object,
  },
  methods: {
    onDBclick() {
      console.log("Name clicked");
    },
  },
};
</script>

<style scoped></style>
