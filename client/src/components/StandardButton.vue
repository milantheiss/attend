<template>
    <button class="flex justify-center items-center 
        px-3.5 md:px-7 py-3 
        rounded-[20px] text-white 
        bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 
        drop-shadow-md">
        <p class="font-medium">
            <slot></slot>
        </p>
    </button>
</template>

<script>
export default {
    name: "StandardButton",
    props: {
        stylingOverwrite: {
            type: String,
            default: ""
        }
    }
};
</script>