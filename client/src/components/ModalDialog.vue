<template>
    <teleport to="body">
        <transition enter-active-class="transition ease-out duration-200 transform" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150 transform"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <!--Backdrop-->
            <div ref="modal-backdrop" class="fixed z-30 inset-0 overflow-y-auto bg-black bg-opacity-50" v-if="showModal">
                <!--Elementfenster-->
                <div class="flex pt-[104px] md:pt-[128px] mx-3.5 md:mx-7">
                    <div class="container mx-auto flex flex-col gap-4 w-full md:max-w-medium-width px-3.5 md:px-7 py-4 bg-white rounded-xl drop-shadow-md text-lg md:text-xl"
                        role="dialog" ref="modal" aria-modal="true" aria-labelledby="modal-headline">
                        <!--Header-->
                        <div class="text-left font-bold" v-show="hasHeader">
                            <slot name="header"></slot>
                        </div>
                        <!--Subheader-->
                        <div class="text-left font-normal" v-show="hasSubheader">
                            <slot name="subheader"></slot>
                        </div>
                        <!--Content-->
                        <div class="text-left" v-show="hasContent">
                            <slot name="content"></slot>
                        </div>
                        <!--Footer-->
                        <div class="text-left font-semibold mt-4" v-show="hasFooter">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import useClickOutside from '@/util/useClickOutside';

const modal = ref(null);
const { onClickOutside } = useClickOutside();
const showModal = ref(false);

// eslint-disable-next-line no-undef
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
    },
    disableClickOutside: {
        type: Boolean,
        default: false,
    }
});

// eslint-disable-next-line no-undef
const emit = defineEmits(['onOpen', 'onClose', 'onClickOutside']);

function closeModal() {
    showModal.value = false;
}

onClickOutside(modal, () => {
    if (showModal.value === true && !props.disableClickOutside) {
        closeModal();
        emit('onClickOutside');
    }
});

onMounted(() => {
    showModal.value = props.show;
});

watch(
    () => props.show,
    newVal => {
        showModal.value = newVal;
    }
);

watch(
    showModal,
    newVal => {
        if(newVal) {
            emit('onOpen')
        } else if(!newVal) {
            emit('onClose')
        }
    }
)
</script>