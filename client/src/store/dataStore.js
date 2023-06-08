import { defineStore } from "pinia";
import { getNotifications } from "@/util/fetchOperations";
import { useAuthStore } from "@/store/authStore";

export const useDataStore = defineStore('dateStore', {
  state: () => ({
    //Seitenname, der zwischen dem Menu und dem Avatar angezeigt wird.
    viewname: '',
    invoiceData: {},
    notifications: [],
  }),
  actions: {
    async getNotifications() {
      const res = await getNotifications()
      this.notifications = res
    },
    getCountOfUnreadNotifications() {
      const auth = useAuthStore()
      if(auth.user === null || typeof auth.user === "undefined") return 0
      return this.notifications.filter(notification => !notification.recipients.find((r) => r.userID === auth.user?._id).read).length
    }
  }
})