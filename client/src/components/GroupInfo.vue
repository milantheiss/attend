<template>
  <div class="px-3" v-if="typeof group !== 'undefined'">
    <div class="flex justify-between items-center" v-if="typeof group.department.name !== 'undefined'">
      <div>
        <p class="text-gray-700 font-light text-base md:text-lg">Abteilung:</p>
      </div>
      <div>
        <p class="text-base md:text-lg text-right" :class="group.department.name === '. . .' ? 'pr-0.5' : ''">
          {{ group.department.name }}</p>
      </div>
    </div>

    <div class="flex justify-between items-center" v-if="group.trainers.filter(val => val.role === 'trainer').length.length !== 0">
      <div>
        <p class="text-gray-700 font-light text-base md:text-lg">Trainer:</p>
      </div>
      <div>
        <p class="text-base text-right md:text-lg" :class="group.department.name === '. . .' ? 'pr-0.5' : ''"
          v-for="trainer in group.trainers.filter(val => val.role === 'trainer')" :key="trainer.name">{{ trainer.firstname }} {{ trainer.lastname}}</p>
      </div>
    </div>

    <div class="flex justify-between items-center" v-if="group.trainers.filter(val => val.role === 'assistant').length !== 0">
      <div>
        <p class="text-gray-700 font-light text-base md:text-lg">Assistent:</p>
      </div>
      <div>
        <p class="text-base md:text-lg text-right" :class="group.department.name === '. . .' ? 'pr-0.5' : ''"
          v-for="assistant in group.trainers.filter(val => val.role === 'assistant')" :key="assistant.name">{{ assistant.firstname }} {{ assistant.lastname}}</p>
      </div>
    </div>

    <div class="flex justify-between items-center" v-if="group.times.length !== 0">
      <div>
        <p class="text-gray-700 font-light text-base md:text-lg">Zeiten:</p>
      </div>
      <div>
        <p class="text-base md:text-lg text-right" :class="group.department.name === '. . .' ? 'pr-0.5' : ''"
          v-for="time in group.times" :key="time">{{ getTime(time) }}</p>
      </div>
    </div>

    <div class="flex justify-between items-center" v-if="typeof group.venue !== 'undefined'">
      <div>
        <p class="text-gray-700 font-light text-base md:text-lg">Sportstätte:</p>
      </div>
      <div>
        <p class="text-base md:text-lg text-right" :class="group.department.name === '. . .' ? 'pr-0.5' : ''"
          :key="group.venue">{{ group.venue }}</p>
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
          trainers:
            [
              {
                firstname: ". . .",
                role: "trainer"
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
      required: false,
    }
  },
  methods: {
    getTime(time) {
      if (time.day !== ". . .") {
        let shortendday = time.day.charAt(0) + time.day.charAt(1) + "."
        let concattimes = time.starttime + " - " + time.endtime + " Uhr"
        return [shortendday, concattimes].join(' ')
      }
      else {
        return ". . ."
      }
    }
  },
  created() {
    console.log(this.group);
  }
}
</script>
