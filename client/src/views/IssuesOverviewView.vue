<template>
  <div class="relative container flex flex-col gap-4">

    <!-- Header -->

    <div class="flex justify-between items-center w-full px-3.5 md:px-7">

      <!-- Refresh Button -->
      <Transition>
        <span class="w-8 h-8 shrink-0" @click="refreshIssues" ref="refreshIcon" :class="spin ? 'animate-refreshSpin' : ''"
          @animationend="spin = false">
          <!--Refresh Icon-->
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </span>
      </Transition>

      <div class="flex items-center gap-3.5">
        <!-- Sortiermode Selector -->
        <select v-model="sortKey"
          class="pl-2 pb-0.5 text-black text-lg md:text-xl
                                                          focus:ring-0 focus:border-standard-gradient-1
                                                          bg-inherit border-0 border-b-2 border-light-gray rounded-none"
          style="background-position: right 0.1rem center;padding-right: 1.9rem;">
          <option value="date" default>Datum</option>
          <option value="title">Betreff</option>
        </select>
      </div>
    </div>

    <!-- Issue Card-->

    <!-- INFO Muss in zwei Divs aufgeteilt sein, ansonsten scrollt Tabelle durch Header durch und kann über Header gesehen werden -->
    <div class="h-fit max-h-[60vh] overflow-y-auto block pb-4">

      <div class="flex flex-col gap-4">
        <IssueCard v-for="i in issues" :key="i._id" :issue="i" @resolved="refreshIssues"></IssueCard>
      </div>

    </div>

    <p v-show="issues.length === 0" class="font-medium text-light-gray text-center">Keine
      Konflikte</p>
  </div>
</template>

<script>
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import IssueCard from "@/components/IssueCard.vue";
import { getIssues } from "@/util/fetchOperations";

export default {
  name: "IssuesOverviewView",
  setup() {
    const dataStore = useDataStore()
    const authStore = useAuthStore()
    return {
      dataStore,
      authStore
    }
  },
  data() {
    return {
      issues: [],
      spin: false,
      sortKey: "date"
    }
  },
  components: {
    IssueCard
  },
  methods: {

    async refreshIssues() {
      this.spin = true
      const res = await getIssues()

      if (res.ok) {
        this.issues = res.body
      } else {
        this.issues = []
      }
    },
  },

  async created() {
    document.title = 'Konflikte - Attend'
    this.dataStore.viewname = "Konflikte"
  },

  async mounted() {
    const res = await getIssues()

    if (res.ok) {
      this.issues = res.body
    } else {
      this.issues = []
    }
  },

  watch: {
    sortBy: {
      handler() {
        return this.issues.sort((a, b) => {
          if (this.sortBy === "date") {
            return new Date(b.date) - new Date(a.date)
          } else if (this.sortBy === "title") {
            return a.title.localeCompare(b.title)
          }
        })
      }
    }
  }
}
</script>
<style>
option:checked,
option:hover,
option::selection {
  color: white;
  background: #5864e0;
}
</style>    