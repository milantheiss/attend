<template>
    <div class="relative container">
        <!--TODO Tool Bar hinzufügen-->

        <div class="flex justify-end items-center w-full mb-4">
            <span class="w-8 h-8 mr-[0.372rem]">
                <!--Horizontal Dots-->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" v-show="!showToolbar" @click="showToolbar = true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <!--X in Circle-->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                    stroke="currentColor" v-show="showToolbar" @click="showToolbar = false">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </span>
        </div>
        <transition enter-active-class="transition ease-in-out duration-500" enter-from-class="-translate-y-8 opacity-0"
            enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in-out duration-500"
            leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-7 opacity-0">
            <div class="flex justify-between items-center w-full mb-4" v-show="showToolbar">
                <span class="flex ml-4">
                    <div class="bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 p-1.5 rounded-lg mr-6">
                        <!--Trashcan icon-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="#ffffff" class="w-9 h-9">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                        </svg>
                    </div>
                    <div class="bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 p-1.5 rounded-lg">
                        <!--Read icon-->
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                            stroke="#ffffff" class="w-9 h-9">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
                        </svg>
                    </div>
                </span>
                <CheckboxInput class="mr-2"></CheckboxInput>
            </div>
        </transition>
        <div class="flex justify-start items-center bg-white rounded-lg drop-shadow-md p-1"
            v-for="(notification, index) in dataStore.notifications" :key="notification.id">
            <div class="flex flex-col w-full">
                <div class="flex items-center w-full" @click="{
                    if(!showToolbar) toggleNotification(index);
                }">
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
                    <transition enter-active-class="transition ease-in-out duration-700"
                        enter-from-class="opacity-0" enter-to-class="opacity-100"
                        leave-active-class="transition ease-in-out duration-500"
                        leave-from-class="opacity-100" leave-to-class="opacity-0">
                        <CheckboxInput class="mr-1 " v-show="showToolbar" @click="true"></CheckboxInput>
                    </transition>
                        <!--TODO Selector hinzufügen-->
                </div>
                <p class="text-xl font-normal text-[#3f3f3f] mt-2 ml-2" v-show="show[index]">{{ notification.message }}
                </p>
                <!--TODO Delete & Unread Btn hinzufügen-->
            </div>
        </div>
    </div>
</template>

<script>
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";
import { setNotificationAsRead } from "@/util/fetchOperations.js";
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
            show: [],
            showToolbar: false,
        }
    },
    components: {
        CheckboxInput
    },
    methods: {
        async toggleNotification(index) {
            if (!this.show[index]) {
                const notification = this.dataStore.notifications[index]
                const res = await setNotificationAsRead(notification.id)
                console.log("🚀 ~ file: ProfileView.vue:56 ~ toggleNotification ~ res", res)
                this.dataStore.notifications[index].recipients = res.recipients
            }
            this.show[index] = !this.show[index]
        }
    },
    async created() {
        document.title = 'Wähle eine Gruppe - Attend'
        this.dataStore.viewname = "Benachrichtigungen"
    },
    watch: {
        "dataStore.notifications"() {
            const oldShow = this.show
            this.show = []
            for (const notification of this.dataStore.notifications) {
                const oldNotification = oldShow.find((n) => n.id === notification.id)
                if (oldNotification) {
                    this.show.push(oldNotification)
                } else {
                    this.show.push({
                        id: notification.id,
                        show: false
                    })
                }
                this.show.push(oldNotification)
            }
        }
    }
};
</script>
