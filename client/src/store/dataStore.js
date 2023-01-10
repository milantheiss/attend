import { defineStore } from "pinia";
import { getNotifications } from "@/util/fetchOperations";

export const useDataStore = defineStore('dateStore', {
  state: () => ({
    //Seitenname, der zwischen dem Menu und dem Avatar angezeigt wird.
    viewname: '',
    showPatchNotesDialog: false,
    invoiceData: {},
    notifications: [],
  }),
  actions: {
    async readPatchNotes() {
      await fetch([process.env.VUE_APP_API_URL, 'patchNotes', "markAsRead"].join('/'), {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        credentials: 'include',
        mode: 'cors'
      })
      this.showPatchNotesDialog = false
    },
    async getNotifications() {
      const res = await getNotifications()
      this.notifications = res
    },
  }
})