<template>
    <div class="relative container flex flex-col gap-4">
        <!--Toolbar toggle-->
        <div class="flex justify-between items-center w-full px-3.5 md:px-7">
            <Transition>
                <span class="w-8 h-8 shrink-0" @click="refreshNotifications" ref="refreshIcon"
                    :class="spin ? 'animate-refreshSpin' : ''" @animationend="spin = false">
                    <!--Refresh Icon-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                </span>
            </Transition>
            <div class="flex items-center gap-3.5">
                <select v-model="sortBy" class="pl-2 pb-0.5 text-black text-lg md:text-xl
                                                            focus:ring-0 focus:border-standard-gradient-1
                                                            bg-inherit"
                    :class="showError ? 'border-2 rounded-lg border-special-red' : 'border-0 border-b-2 border-light-gray rounded-none'"
                    style="background-position: right 0.1rem center;padding-right: 1.9rem;">
                    <option value="date"  default>Datum</option>
                    <option value="unread">Ungelesen</option>
                    <option value="title">Betreff</option>
                </select>
                <span class="-mr-[3px]"
                    v-show="typeof dataStore.notifications !== 'undefined' && dataStore.notifications?.length !== 0">
                    <!--Horizontal Dots-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" v-show="!showToolbar" @click="showToolbar = true" class="w-10 h-10">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <!--X in Circle-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" v-show="showToolbar" @click="showToolbar = false" class="w-10 h-10">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
            </div>
        </div>

        <!--Toolbar-->
        <transition enter-active-class="transition ease-in-out duration-500" enter-from-class="-translate-y-2 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in-out duration-500"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-2 opacity-0">
            <div class="flex justify-between items-center w-full px-3.5 md:px-7" v-show="showToolbar && dataStore.notifications?.length !== 0">
                <button @click="deleteSelected"
                    class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-full drop-shadow-md px-5 md:px-7 py-2">
                    <p class="font-medium font-base md:text-lg">Löschen</p>
                </button>
                <!--Select all-->
                <CheckboxInput  v-model="selectAll"></CheckboxInput>
            </div>
        </transition>

        <!--NotificationCard-->
        <div class="flex flex-col gap-4">
            <div class="bg-white rounded-xl drop-shadow-md px-3.5 md:px-7 py-4 cursor-pointer w-full flex flex-col gap-4"
                v-for="(notification, index) in dataStore.notifications" :key="notification._id">
                <div class="flex justify-between items-center gap-3.5" @click.self="{ toggleNotification(index); }">
                    <!--New Notification Dot ~ Blauer Pulsierender Punkt-->
                    <div class="flex h-4 w-4" @click.self="{ toggleNotification(index); }"
                        v-show="!dataStore.notifications[index].recipients.find((r) => r.userID === authStore.user._id).read">
                        <div
                            class="animate-[ping_1.5s_ease-in_infinite] absolute inline-flex h-4 w-4 rounded-full bg-standard-gradient-2 opacity-75">
                        </div>
                        <div class="relative inline-flex rounded-full h-4 w-4 bg-standard-gradient-1"></div>
                    </div>

                    <div class="flex flex-col w-full" @click.self="{ toggleNotification(index); }">
                        <p class="font-medium flex justify-between items-center gap-2" @click.self="{ toggleNotification(index); }">{{
                            notification.title }}
                        <span class="cursor-pointer" @click.self="{ toggleNotification(index); }" v-show="!showToolbar">
                            <!--Chevron Down-->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                stroke="currentColor" class="w-7 h-7" v-show="!localNotifications[index]?.show" @click.self="{ toggleNotification(index); }">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" @click.self="{ toggleNotification(index); }"/>
                            </svg>
                            <!--Chevron Up-->
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                                stroke="currentColor" class="w-7 h-7" v-show="localNotifications[index]?.show" @click.self="{ toggleNotification(index); }">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" @click.self="{ toggleNotification(index); }"/>
                            </svg>
                        </span>
                        </p>
                        <p class="text-light-gray" @click.self="{ toggleNotification(index); }">{{
                            new Date(notification.date).toLocaleString('de-DE', {
                                year: 'numeric', month:
                                    '2-digit', day: '2-digit', timeZone: "CET", hour: '2-digit', minute: '2-digit'
                            })
                        }}</p>
                    </div>



                    <transition enter-active-class="transition ease-in-out duration-700" enter-from-class="opacity-0"
                        enter-to-class="opacity-100" leave-active-class="transition ease-in-out duration-500"
                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <CheckboxInput  v-show="showToolbar" @click.stop="true"
                            v-model="localNotifications[index].selected"></CheckboxInput>
                    </transition>
                </div>

                <div class="notificationMessage cursor-text" v-if="localNotifications[index]?.show"
                    v-html="$resolveMarkdown(notification.message)">
                </div>
                <button @click="onClickDelete(notification._id)" v-if="localNotifications[index]?.show"
                    class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-fit px-8 py-3 mx-auto">
                    <p class="font-medium font-base md:text-lg">Löschen</p>
                </button>
            </div>
        </div>

        <p v-show="typeof dataStore.notifications === 'undefined' || dataStore.notifications?.length === 0"
            class="font-medium text-light-gray text-center">Keine
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
                const res = await setNotificationAsRead(notification._id)
                this.dataStore.notifications[index].recipients = res.recipients
            }
            this.localNotifications[index].show = !this.localNotifications[index].show
        },

        setupLocalNotifications() {
            const oldShow = this.localNotifications
            this.localNotifications = []
            for (const notification of this.dataStore.notifications) {
                const oldNotification = oldShow.find((n) => n._id === notification._id)
                if (oldNotification) {
                    this.localNotifications.push(oldNotification)
                } else {
                    this.localNotifications.push({
                        id: notification._id,
                        show: false,
                        selected: false
                    })
                }
            }

            // this.sortNotifications()
        },

        async deleteSelected() {
            const selectedNotification = this.localNotifications.filter((n) => n.selected)

            const res = await deleteManyNotifications(selectedNotification.map((n) => n._id))

            if (res.status === 200) {
                this.localNotifications.filter((n) => n.selected).forEach((n) => {
                    this.dataStore.notifications = this.dataStore.notifications.filter((n2) => n2._id !== n._id)
                })
                this.localNotifications = this.localNotifications.filter((n) => !n.selected)
            }

            this.selectAll = false
        },

        async setSelectedAsRead() {
            const selectedNotification = this.localNotifications.filter((n) => n.selected)


            const res = await setManyNotificationsAsRead(selectedNotification.map((n) => n._id))

            if (res.status === 200) {
                this.localNotifications.filter((n) => n.selected).forEach((n) => {
                    this.dataStore.notifications.find((n2) => n2._id === n._id).recipients.find((r) => r.userID === this.authStore.user._id).read = true
                    n.selected = false
                })
            }

            this.selectAll = false
        },

        async onClickDelete(notificationID) {
            const res = await deleteNotification(notificationID)

            if (res.status === 200) {
                this.dataStore.notifications = this.dataStore.notifications.filter((n2) => n2._id !== notificationID)
                this.localNotifications = this.localNotifications.filter((n) => n._id !== notificationID)
            }

        },

        async onClickUnread(notificationID) {
            const res = await setNotificationAsUnread(notificationID)

            if (res.status === 200) {
                this.dataStore.notifications.find((n2) => n2._id === notificationID).recipients.find((r) => r.userID === this.authStore.user._id).read = false
            }
        },

        async refreshNotifications() {
            this.spin = true
            await this.dataStore.getNotifications()
            this.sortNotifications()
        },

        sortNotifications() {
            this.dataStore.notifications.sort((a, b) => {
                if (this.sortBy === "date") {
                    return new Date(b.date) - new Date(a.date)
                } else if (this.sortBy === "title") {
                    return a.title.localeCompare(b.title)
                } else if (this.sortBy === "unread") {
                    const aRead = a.recipients.find((r) => r.userID === this.authStore.user._id).read
                    const bRead = b.recipients.find((r) => r.userID === this.authStore.user._id).read

                    if (aRead && bRead) {
                        return 0
                    } else if (aRead && !bRead) {
                        return 1
                    } else if (!aRead && bRead) {
                        return -1
                    }
                }
            })

            // Passt LocalNOtifications entsprechend der neuen Sortierung an
            this.setupLocalNotifications()
        }
    },
    async created() {
        document.title = 'Wähle eine Gruppe - Attend'
        this.dataStore.viewname = "Benachrichtigungen"

        this.sortNotifications()
    },
    watch: {
        "dataStore.notifications"() {
            this.sortNotifications()
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

<style scoped>
.notificationMessage :deep(a) {
    color: #3B82F6;
}

.notificationMessage :deep(a)::after {
    content: "↗️";
}

option:checked,
option:hover,
option::selection {
    color: white;
    background: #5864e0;
}
</style>    