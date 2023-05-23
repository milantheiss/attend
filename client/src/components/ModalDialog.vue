<template>
    <teleport to="body">
        <transition enter-active-class="transition ease-out duration-200 transform" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150 transform"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <!--Backdrop-->
            <div ref="modal-backdrop" class="fixed z-30 inset-0 overflow-y-auto bg-black bg-opacity-50" v-if="showModal">
                <!--Elementfenster-->
                <div class="flex items-start justify-center min-h-screen pt-8 md:pt-24 text-center">
                    <div class="w-5/6 md:max-w-medium-width p-5 bg-white rounded-lg overflow-hidden drop-shadow-md "
                        role="dialog" ref="modal" aria-modal="true" aria-labelledby="modal-headline">
                        <!--Header-->
                        <div class="text-left font-bold text-gray-700" v-show="hasHeader">
                            <slot name="header"></slot>
                        </div>
                        <!--Subheader-->
                        <div class="text-left font-normal text-gray-500" v-show="hasSubheader">
                            <slot name="subheader"></slot>
                        </div>
                        <!--Content-->
                        <div class="text-left my-4" v-show="hasContent">
                            <slot name="content"></slot>
                        </div>
                        <!--Footer-->
                        <div class="text-left font-semibold" v-show="hasFooter">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { ref, watch, defineProps } from 'vue';
import useClickOutside from '@/util/useClickOutside';

const modal = ref(null);
const { onClickOutside } = useClickOutside();
const showModal = ref(false);

const props = defineProps({
    show: {
        type: Boolean,
        default: false,
    },
    hasHeader: {
        type: Boolean,
        default: true,
    },
    hasSubheader: {
        type: Boolean,
        default: true,
    },
    hasContent: {
        type: Boolean,
        default: true,
    },
    hasFooter: {
        type: Boolean,
        default: true,
    }
});

function closeModal() {
    showModal.value = false;
}

onClickOutside(modal, () => {
    if (showModal.value === true) {
        closeModal();
    }
});


watch(
    () => props.show,
    show => {
        showModal.value = show;
    },
);
</script>