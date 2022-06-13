<template>
  <div @dblclick="onDBclick" :class="this.activated ? 'activated':''">
    <h3>{{ participant.firstname }} {{ participant.lastname }}</h3>
  </div>
</template>

<script>
export default {
  name: "TeilnehmerItem",
  data(){
    return{
      activated: false
    }
  },
  props: {
    participant: Object,
  },
  methods: {
    onDBclick() {
      this.activated = !this.activated
    },
  },
};
</script>

<style scoped>
div{
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  width: 50%;
  padding: 2px;
  text-align: center;
  background: gainsboro;
}
.activated{
  background: #42b983;
}
</style>
