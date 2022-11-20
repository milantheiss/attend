import { defineStore } from "pinia";

export const useDataStore = defineStore('dateStore', {
  state: () => ({
    //Seitenname, der zwischen dem Menu und dem Avatar angezeigt wird.
    viewname: ''
  })
})