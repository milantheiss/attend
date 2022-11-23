<template>
    <button type="button" @click="showModal = !showModal">Toggle Prompt</button>
    <ModalDialog :show="showModal">
        <template #header>
            <div v-html="header"></div>
            <h2>Hallo Tim</h2>
        </template>
        <template #content>
            <div v-html="text"></div>
        </template>
        <template #footer><button @click="showModal = false"
                class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-6 ty:px-10 sm:px-12 py-1.5 rounded-lg drop-shadow-md">
                <p class="font-medium text-base md:text-lg">OK</p>
            </button></template>
    </ModalDialog>
</template>

<script>
import ModalDialog from '@/components/ModalDialog.vue';
import { ref } from 'vue';

export default {
    name: "TestView",
    components: { ModalDialog },
    setup() {
        const showModal = ref(false);
        return {
            showModal,
        };
    },
    data() {
        return {
            header: "<h1>Das ist die Überschrift!</h1>",
            text: '<p>Hallo das ist ein <span class="text-red-500 font-bold">Test</span></p>'
        }
    },
    methods: {
    }
}
</script>