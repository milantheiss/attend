<template>
    <teleport to="body">
        <transition enter-active-class="transition ease-out duration-200 transform" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-150 transform"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <!--Backdrop-->
            <div ref="modal-backdrop" class="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50"
                v-if="showModal">
                <!--Elementfenster-->
                <div class="flex items-start justify-center min-h-screen pt-8 md:pt-24 text-center">
                    <div class="w-5/6 md:max-w-medium-width p-5 bg-white rounded-lg overflow-hidden drop-shadow-md text-black"
                        role="dialog" ref="modal" aria-modal="true" aria-labelledby="modal-headline">
                        <!--Header-->
                        <div class="text-left font-bold text-xl md:text-2xl text-gray-700">
                            <slot name="header"></slot>
                        </div>
                        <!--Subheader-->
                        <div class="text-left font-normal text-base md:text-lg text-gray-500">
                            <slot name="subheader"></slot>
                        </div>
                        <!--Content-->
                        <div class="text-left font-normal text-base md:text-lg text-black my-4">
                            <slot name="content"></slot>
                        </div>
                        <!--Footer-->
                        <div class="text-left font-semibold text-base md:text-lg text-black">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>

<script>
import { ref, watch } from 'vue';
import useClickOutside from '@/util/useClickOutside';

export default {
    name: 'ModalDialog',
    setup(props) {
        const modal = ref(null);
        const { onClickOutside } = useClickOutside();
        const showModal = ref(false);

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

        return {
            showModal,
            modal
        };
    },
    props: {
        show: {
            type: Boolean,
            default: false,
        },
    }
};
</script>