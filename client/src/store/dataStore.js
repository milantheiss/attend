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
    reset() {
      this.viewname = ''
      this.invoiceData = {}
      this.notifications = []
    }
  },
  getters: {
    getCountOfUnreadNotifications: (state) => {
      const auth = useAuthStore()
      if (auth.user === null || typeof auth.user === "undefined") return 0

      return state.notifications?.filter(notification => !notification.recipients.find((r) => r.userID === auth.user?._id).read).length
    }
  }
})