<template>
    <button
        class="flex justify-center items-center drop-shadow-md px-3.5 md:px-7 py-3 rounded-[20px]" :class="stylingOverwrite === '' ? 'text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 hover:shadow-lg':''">
        <p class="font-medium"><slot></slot></p>
    </button>
</template>

<script>
export default {
    name: "Button",
    props: {
        stylingOverwrite: {
            type: String,
            default: ""
        }
    }
};
</script>