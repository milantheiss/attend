<template>
    <div class="relative container">
        <p>{{authStore.user.username }}</p>
    </div>
</template>
  
<script>
import { useAuthStore } from "@/store/authStore";
import { useDataStore } from "@/store/dataStore";

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
        }
    },
    components: {
    },
    methods: {
    },
    async created() {
        document.title = 'Wähle eine Gruppe - Attend'
        this.dataStore.viewname = "Benachrichtigungen"
    },
    watch: {
    }
};
</script>
  