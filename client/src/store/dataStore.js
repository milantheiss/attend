import { defineStore } from "pinia";

export const useDataStore = defineStore('dateStore', {
  state: () => ({
    viewname: ''
  })
})