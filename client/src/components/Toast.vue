<template>
    <div class="p-2 px-3.5 md:px-7 rounded-full flex gap-2 justify-between items-center my-2"
        :class="{ 'bg-green-500': type === 'success', 'bg-red-500': type === 'error', 'bg-sky-500': type === 'info', 'bg-yellow-500': type === 'warning' }" @click="close"
        v-if="show">

        <div class="flex gap-2 items-center">
            <!-- Checkmark -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white" v-if="type === 'success'">
                <path fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                    clip-rule="evenodd" />
            </svg>

            <!-- Error -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white" v-if="type === 'error'">
                <path fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd" />
            </svg>

            <!-- Warning -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-black" v-if="type === 'warning'">
                <path fill-rule="evenodd"
                    d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd" />
            </svg>

            <!-- Info -->
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-8 h-8 text-white" v-if="type === 'info'">
                <path fill-rule="evenodd"
                    d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                    clip-rule="evenodd" />
            </svg>


            <p class="font-medium" :class="{'text-white': type !== 'warning', 'text-black': type === 'warning'}">{{ message }}</p>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"
            class="w-8 h-8" :class="{'text-white': type !== 'warning', 'text-black': type === 'warning'}" >
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>

    </div>
</template>

<script>
export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: "Toast",
    data() {
        return {
            show: false,
            type: "info",
            message: "",
            timeout: null
        }
    },
    props: {
        toastDuration: {
            type: Number,
            default: 3000
        },
        toastMessage: {
            type: String,
            default: ""
        },
        toastType: {
            type: String,
            default: "info"
        }
    },
    methods: {
        trigger(duration = this.toastDuration, type = this.toastMessage, message = this.toastMessage) {
            this.duration = duration;
            this.type = type;
            this.message = message;

            this.show = true;
            this.$emit("update:show", true);

            console.log("triggered toast");
            this.timeout = setTimeout(() => {
                this.$emit("update:show", false);
                this.show = false;
            }, duration);
        },
        open() {
            this.show = true;
            this.$emit("update:show", true);
        },
        close() {
            if (this.timeout) clearTimeout(this.timeout)

            this.show = false;
            this.$emit("update:show", false);
        }
    },
    emits: ["update:show"],
    expose: ["trigger", "open", "close"]
}
</script>