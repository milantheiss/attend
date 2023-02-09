<template>
    <div class="relative container">
        <!--Toolbar toggle-->
        <div class="flex justify-between items-center w-full mb-4">
            <Transition>
                <span class="w-8 h-8 ml-3 shrink-0" @click="refreshNotifications" ref="refreshIcon"
                    :class="spin ? 'animate-refreshSpin' : ''" @animationend="spin = false">
                    <!--Refresh Icon-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </span>
            </Transition>
            <p class="text-dark-grey text-base sm:text-lg font-normal w-full text-right hidden ty:block align-middle ml-3 mt-1">Sortieren: </p>
            <span class="mx-3 w-[40rem] sm:w-64">
                <select v-model="sortBy" class="block
                        w-full
                        pl-2 pb-0.5 
                        text-black text-lg md:text-xl align-middle
                        focus:ring-0 focus:border-dark-grey
                        bg-inherit"
                    :class="showError ? 'border-2 rounded-lg border-special-red' : 'border-0 border-b-2 border-gray-300 rounded-none'"
                    style="background-position: right 0.1rem center;padding-right: 1.9rem;">
                    <option value="date" default>Datum</option>
                    <option value="read">Ungelesen</option>
                    <option value="title">Betreff</option>
                </select>
            </span>
            <span class="mr-[0.372rem]"
                v-show="typeof dataStore.notifications !== 'undefined' && dataStore.notifications?.length !== 0">
                <!--Horizontal Dots-->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" v-show="!showToolbar" @click="showToolbar = true" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <!--X in Circle-->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" v-show="showToolbar" @click="showToolbar = false" class="w-8 h-8">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        </div>

        <!--Toolbar-->
        <transition enter-active-class="transition ease-in-out duration-500" enter-from-class="-translate-y-8 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in-out duration-500"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-7 opacity-0">
            <div class="flex justify-between items-center w-full mb-4" v-show="showToolbar">
                <span class="flex ml-4">
                    <div class="bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 p-1.5 rounded-lg mr-6"
                        @click="deleteSelected">
                        <!--Trashcan icon-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="#ffffff" class="w-9 h-9">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>
                    <div class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 p-1.5 rounded-lg"
                        @click="setSelectedAsRead">
                        <!--Read icon-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="#ffffff" class="w-9 h-9">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
                        </svg>
                    </div>
                </span>
                <!--Select all-->
                <CheckboxInput class="mr-2" v-model="selectAll"></CheckboxInput>
            </div>
        </transition>

        <!--NotificationCard-->
        <div class="flex justify-start items-center bg-white rounded-lg drop-shadow-md p-1 mb-2"
            v-for="(notification, index) in dataStore.notifications" :key="notification.id">
            <div class="flex flex-col w-full">
                <div class="flex items-center w-full" @click="{
                    if(!showToolbar) toggleNotification(index);
                }">
                    <!--New Notification Dot ~ Blauer Pulsierender Punkt-->
                    <div class="flex h-4 w-4 ml-2.5 mr-1j"
                        v-show="!dataStore.notifications[index].recipients.find((r) => r.userID === authStore.user._id).read">
                        <div
                            class="animate-[ping_1.5s_ease-in_infinite] absolute inline-flex h-4 w-4 rounded-full bg-standard-gradient-1 opacity-75">
                        </div>
                        <div class="relative inline-flex rounded-full h-4 w-4 bg-standard-gradient-2"></div>
                    </div>
                    <div class="flex flex-col w-full mx-2">
                        <p class="text-xl font-normal text-black">{{ notification.title }}</p>
                        <p class="text-xl font-light text-dark-grey -mt-1">{{
                            new Date(notification.date).toLocaleDateString('de-DE', {
                                year: 'numeric', month:
                                    'numeric', day: 'numeric'
                            })
                        }}</p>
                    </div>
                    <transition enter-active-class="transition ease-in-out duration-700" enter-from-class="opacity-0"
                        enter-to-class="opacity-100" leave-active-class="transition ease-in-out duration-500"
                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <CheckboxInput class="mr-1 " v-if="showToolbar" @click="true"
                            v-model="localNotifications[index].selected"></CheckboxInput>
                    </transition>
                </div>
                <p class="text-xl font-normal text-[#3f3f3f] mt-2 ml-2"
                    v-show="localNotifications[index]?.show && !localNotifications[index]?.selected">{{
                        notification.message
                    }}</p>
                <!--Wird angezeigt, wenn ein existierender Teilnehmer bearbeitet werden soll-->
                <span class="flex justify-end items-center mt-5 mr-2 mb-2"
                    v-show="localNotifications[index]?.show && !localNotifications[index]?.selected">
                    <div class="bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 p-1.5 rounded-lg mr-6"
                        @click="onClickDelete(notification.id)">
                        <!--Trashcan icon-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="#ffffff" class="w-9 h-9">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>
                    <div class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 p-1.5 rounded-lg"
                        @click="onClickUnread(notification.id)">
                        <!--Unread icon-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="#ffffff" class="w-9 h-9">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>

                    </div>
                </span>
            </div>
        </div>
        <!--TODO Style den Text-->
        <p v-show="typeof dataStore.notifications === 'undefined' || dataStore.notifications?.length === 0"
            class="text-xl md:text-2xl font-normal text-gray-500 text-center">Keine
            Benachrichtigungen</p>
    </div>
</template>

<script>
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { setNotificationAsRead, deleteManyNotifications, setManyNotificationsAsRead, deleteNotification, setNotificationAsUnread } from "@/util/fetchOperations.js";
import CheckboxInput from "@/components/CheckboxInput.vue";

export default {
    name: "ProfileView",
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
            localNotifications: [],
            showToolbar: false,
            selectAll: false,
            spin: false,
            sortBy: "date"
        }
    },
    components: {
        CheckboxInput
    },
    methods: {
        async toggleNotification(index) {
            if (!this.dataStore.notifications[index].recipients.find((r) => r.userID === this.authStore.user._id).read && !this.localNotifications[index].show) {
                const notification = this.dataStore.notifications[index]
                const res = await setNotificationAsRead(notification.id)
                this.dataStore.notifications[index].recipients = res.recipients
            }
            this.localNotifications[index].show = !this.localNotifications[index].show
        },

        setupLocalNotifications() {
            const oldShow = this.localNotifications
            this.localNotifications = []
            for (const notification of this.dataStore.notifications) {
                const oldNotification = oldShow.find((n) => n.id === notification.id)
                if (oldNotification) {
                    this.localNotifications.push(oldNotification)
                } else {
                    this.localNotifications.push({
                        id: notification.id,
                        show: false,
                        selected: false
                    })
                }
            }

            this.sortNotifications()
        },

        async deleteSelected() {
            const selectedNotification = this.localNotifications.filter((n) => n.selected)

            const res = await deleteManyNotifications(selectedNotification.map((n) => n.id))

            if (res.status === 200) {
                this.localNotifications.filter((n) => n.selected).forEach((n) => {
                    this.dataStore.notifications = this.dataStore.notifications.filter((n2) => n2.id !== n.id)
                })
                this.localNotifications = this.localNotifications.filter((n) => !n.selected)
            }
            //TODO Call Backend mit Array von ids
        },

        async setSelectedAsRead() {
            const selectedNotification = this.localNotifications.filter((n) => n.selected)


            const res = await setManyNotificationsAsRead(selectedNotification.map((n) => n.id))

            if (res.status === 200) {
                this.localNotifications.filter((n) => n.selected).forEach((n) => {
                    this.dataStore.notifications.find((n2) => n2.id === n.id).recipients.find((r) => r.userID === this.authStore.user._id).read = true
                    n.selected = false
                })
            }
            //TODO Call Backend mit Array von ids
        },

        async onClickDelete(notificationID) {
            const res = await deleteNotification(notificationID)

            if (res.status === 200) {
                this.dataStore.notifications = this.dataStore.notifications.filter((n2) => n2.id !== notificationID)
                this.localNotifications = this.localNotifications.filter((n) => n.id !== notificationID)
            }
        },

        async onClickUnread(notificationID) {
            const res = await setNotificationAsUnread(notificationID)

            if (res.status === 200) {
                this.dataStore.notifications.find((n2) => n2.id === notificationID).recipients.find((r) => r.userID === this.authStore.user._id).read = false
            }
        },

        async refreshNotifications() {
            this.spin = true
            await this.dataStore.getNotifications()
            this.setupLocalNotifications()
        },

        sortNotifications() {
            //TODO Fix dass Notifications sortiert werden
            //Verschieben in setupLocalNotifications?
            this.dataStore.notifications.sort((a, b) => {
                if (this.sortBy === "date") {
                    return new Date(b.date) - new Date(a.date)
                } else if (this.sortBy === "title") {
                    return a.title.localeCompare(b.title)
                } else if (this.sortBy === "unread") {
                    if (a.read && b.read) {
                        return 0
                    } else if (a.read && !b.read) {
                        return 1
                    } else if (!a.read && b.read) {
                        return -1
                    }
                }
            })

            this.setupLocalNotifications()
        }
    },
    async created() {
        document.title = 'Wähle eine Gruppe - Attend'
        this.dataStore.viewname = "Benachrichtigungen"

        this.setupLocalNotifications()
    },
    watch: {
        "dataStore.notifications"() {
            this.setupLocalNotifications()
        },
        selectAll() {
            for (const notification of this.localNotifications) {
                notification.selected = this.selectAll
            }
        },
        sortBy() {
            this.sortNotifications()
        }
    }
};
</script>
