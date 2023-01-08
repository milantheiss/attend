<template>
    <div class="relative container">
        <div class="flex justify-start items-center bg-white rounded-lg drop-shadow-md p-1"
            v-for="(notification, index) in dataStore.notifications" :key="notification.id">
            <div class="flex h-4 w-4 ml-1.5">
                <div
                    class="animate-[ping_1.5s_ease-in_infinite] absolute inline-flex h-4 w-4 rounded-full bg-standard-gradient-1 opacity-75">
                </div>
                <div class="relative inline-flex rounded-full h-4 w-4 bg-standard-gradient-2"></div>
            </div>
            <div class="flex flex-col ml-4">
                <div class="flex flex-col" @click="show[index] = !show[index]">
                    <p class="text-xl font-normal text-black">{{ notification.title }}</p>
                    <p class="text-xl font-light text-dark-grey -mt-1">{{
                        new Date(notification.date).toLocaleDateString('de-DE', {
                            year: 'numeric', month:
                                'numeric', day: 'numeric'
                        })
                    }}</p>
                </div>
                <p class="text-xl font-normal text-[#292929] mt-2" v-show="show[index]">{{ notification.message }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import { useDataStore } from "@/store/dataStore";
import { useAuthStore } from "@/store/authStore";

export default {
    name: "ExportPdf",
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
            show: []
        }
    },
    components: {
    },
    methods: {
        toggleNotification(index) {
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
                const oldNotification = oldShow.find((n) => n.name === notification.name)
                this.show.push(oldNotification)
            }
        }
    }
};
</script>
