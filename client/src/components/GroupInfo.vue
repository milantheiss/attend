<template>
  <div class="bg-white px-3 py-1.5 rounded-lg drop-shadow-md">
    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Abteilung:</p>
      </div>
      <div v-if="typeof group !== 'undefined'">
        <p class="text-base md:text-lg text-right" :class="group.trainer.name === '. . .' ? 'pr-0.5' : ''">{{group.department.name}}</p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Trainer:</p>
      </div>
      <div v-if="typeof group !== 'undefined'" >
        <p class="text-base text-right md:text-lg" :class="group.trainer.name === '. . .' ? 'pr-0.5' : ''" :key="group.trainer.name">{{ group.trainer.name }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Assistent:</p>
      </div>
      <div v-if="typeof group !== 'undefined'">
        <p class="text-base md:text-lg text-right" :class="group.trainer.name === '. . .' ? 'pr-0.5' : ''" v-for="assistent in group.assistent" :key="assistent.name">{{ assistent.name }}</p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Zeiten:</p>
      </div >
      <div v-if="typeof group !== 'undefined'">
        <p class="text-base md:text-lg text-right" :class="group.trainer.name === '. . .' ? 'pr-0.5' : ''" v-for="time in group.times" :key="time">{{getTime(time)}}</p>
      </div>
    </div>

    <div class="grid grid-cols-2">
      <div>
        <p class="text-gray-700 font-light text-normal text-base md:text-lg">Sportstätte:</p>
      </div>
      <div v-if="typeof group !== 'undefined'">
        <p class="text-base md:text-lg text-right" :class="group.trainer.name === '. . .' ? 'pr-0.5' : ''" :key="group.venue">{{ group.venue }}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupInfo",
  props: {
    group: {
      type: Object,
      default() {
        return {
        trainer: 
          {
            name: ". . ."
          }
        ,
        assistent: [
          {
            name: ". . ."
          }
        ],
        times: [{
          day: ". . ."
        }],
        venue: ". . .",
        department: {
          name: ". . ."
        }
        }
      },
      required: true,
    }
  },
  methods: {
    getTime(time){
      if(time.day !== ". . .")
      {
        let shortendday = time.day.charAt(0) + time.day.charAt(1) + "."
        let concattimes = time.starttime + " - " + time.endtime + " Uhr"
        return [shortendday, concattimes].join(' ')
      }
      else {
        return ". . ."
      }
    }
  }
}
</script>

<style scoped>

</style>
