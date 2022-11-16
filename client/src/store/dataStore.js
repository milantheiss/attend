import { defineStore } from "pinia";

export const useDataStore = defineStore('dateStore', {
  state: () => ({
    selectedGroupID: undefined,
    viewname: ''
  })
})