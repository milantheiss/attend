<template>
  <div>
    <p class="preset_text">Abteilung:</p>
    <p class="generated_text">{{group.department.name}}</p>

    <p class="preset_text">Trainer:</p>
    <p class="generated_text" v-for="trainer in group.trainer" :key="trainer.name">{{ trainer.name }}</p>

    <p class="preset_text">Assistent:</p>
    <p class="generated_text" v-for="assistent in group.assistent" :key="assistent.name">{{ assistent.name }}</p>

    <p class="preset_text">Zeiten:</p>
    <!--TODO IDK ob key funktioniert-->
    <p class="generated_text" v-for="time in group.times" :key="time">{{getTime(time)}}</p>

    <p class="preset_text">Sportstätte:</p>
    <p class="generated_text" >{{group.department.name}}</p>
  </div>
</template>

<script>
export default {
  name: "GroupInfo",
  props: {
    group: {
      type: Object,
      default(){
        return {

        }
      },
      required: true,
    }
  },
  methods: {
    getTime(time){
      if(time.day !== "")
      {
        let shortendday = time.day.charAt(0) + time.day.charAt(1) + "."
        let concattimes = time.starttime + " - " + time.endtime + " Uhr"
        return [shortendday, concattimes].join(' ')
      }
      else {
        return ""
      }
    }
  }
}
</script>

<style scoped>

</style>
