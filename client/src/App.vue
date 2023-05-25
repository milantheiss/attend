<template>
	<div class="mb-40 mx-3.5 md:mx-7 font-ubuntu text-[#111827] md:text-xl text-lg">
		<!--Navbar: Wird angezeigt, wenn Session Authenticated-->
		<nav class="relative container mx-auto mt-6 md:mt-12 mb-8 md:mb-12 md:max-w-medium-width px-3.5 md:px-7"
			v-if="auth.authenticated">
			<div class="flex justify-between items-center">
				<!--Menu Icon-->
				<button @click="showMenu = !showMenu" class="pr-2 py-2 -mr-2 -mx-1">
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
							stroke="currentColor" class="w-10 h-10" v-show="!showMenu">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
							stroke="currentColor" class="w-10 h-10" v-show="showMenu">
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
						</svg>
					</span>
				</button>

				<!--Seitentitel-->
				<h2 class="font-semibold text-xl sm:text-2xl md:text-3xl truncate mx-2">{{ dataStore.viewname }}</h2>

				<!--Profile Avatar-->
				<!--TODO Custom Avatar jenach User-->

				<router-link @click="showMenu = false" to="/profile">
					<div class="absolute -top-1 right-1 md:right-5 z-10 w-6 h-6 bg-delete-gradient-1 rounded-full flex justify-center items-center text-center shadow-lg text-white text-sm font-bold"
						v-if="dataStore.getCountOfUnreadNotifications() > 0">
						{{ dataStore.getCountOfUnreadNotifications() }}
					</div>
					<div
						class="rounded-full bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 z-0 drop-shadow-md">
						<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 49.548 47.707"
							class="text-white w-14 h-14  md:w-14 md:h-14 p-3 md:p-4">
							<g fill="none" stroke="currentColor" stroke-width="6.649"
								transform="translate(-93.958 -82.631)">
								<ellipse cx="118.732" cy="96.016" rx="10.439" ry="10.061" />
								<path
									d="M97.15 129.409a22.145 17.563 0 0 1 21.581-13.623 22.145 17.563 0 0 1 21.582 13.626" />
							</g>
						</svg>
					</div>
				</router-link>
			</div>

			<!--Navbar Links: Werden angezeigt, wenn auf Menu Icon geklickt wird.-->
			<transition enter-active-class="transition ease-in-out duration-700" enter-from-class="-translate-y-9 opacity-0"
				enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in-out duration-300"
				leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-5 opacity-0">
				<div class="flex flex-col gap-2" v-show="showMenu">
					<router-link @click="showMenu = !showMenu" to="/attendancelist"
						class="text-left font-medium md:text-2xl text-xl flex items-center group"
						v-if="auth.user?.lengthAccessibleGroups > 0">
						Anwesenheitsliste
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
							stroke="currentColor"
							class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
						</svg>
					</router-link>
					<router-link @click="showMenu = !showMenu" to="/createInvoice"
						class="text-left font-medium md:text-2xl text-xl flex items-center group"
						v-if="auth.user?.lengthAccessibleGroups > 0">
						Abrechnung erstellen
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
							stroke="currentColor"
							class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
						</svg>
					</router-link>
					<router-link @click="showMenu = !showMenu" to="/editgroup"
						class="text-left font-medium md:text-2xl text-xl flex items-center group"
						v-if="auth.user?.lengthAccessibleGroups > 0">
						Gruppe bearbeiten
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
							stroke="currentColor"
							class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
						</svg>
					</router-link>
					<router-link @click="showMenu = !showMenu" to="/exportpdf"
						class="text-left font-medium md:text-2xl text-xl flex items-center group"
						v-if="auth.user?.lengthAccessibleGroups > 0">
						Liste exportieren
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
							stroke="currentColor"
							class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
						</svg>
					</router-link>
					<router-link @click="showMenu = !showMenu" to="/logout"
						class="text-left font-medium md:text-2xl text-xl flex items-center group">
						Logout
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
							stroke="currentColor"
							class="w-7 h-7 ml-2 -translate-x-2 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
						</svg>

					</router-link>
					<p class="text-center font-light text-base md:text-lg mx-auto">Erstellt von Milan Theiß - Version
						0.1.4</p>
				</div>
			</transition>
		</nav>

		<!-- Patch Notes Dialog -->
		<div v-if="dataStore.showPatchNotesDialog">
			<ModalDialog :show="showPatchNotes">
				<template #header>
					<div v-html="patchNotes.title"></div>
				</template>
				<template #subheader>
					<p>{{ new Date(patchNotes.date).toLocaleDateString() }}</p>
				</template>
				<template #content>
					<div v-html="patchNotes.text"></div>
				</template>
				<template #footer><button @click="dataStore.readPatchNotes()"
						class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-6 ty:px-10 sm:px-12 py-1.5 rounded-lg drop-shadow-md">
						<p class="font-medium text-base md:text-lg">Gelesen</p>
					</button></template>
			</ModalDialog>
		</div>

		<!--Seiten Inhalte: Router reguliert, welche Seite angezeigt wird.-->
		<router-view class="font-normal md:max-w-medium-width mx-auto" v-slot="{ Component }">
			<transition enter-active-class="transition ease-in-out duration-[200ms] delay-[240ms]"
				enter-from-class="opacity-0 translate-y-5" enter-to-class="opacity-100 translate-y-0"
				leave-active-class="transition ease-in-out duration-[200ms]" leave-from-class="opacity-100 translate-y-0"
				leave-to-class="opacity-0 -translate-y-5">
				<component :is="Component" />
			</transition>
		</router-view>
	</div>
</template>

<script>
import { useAuthStore } from "./store/authStore";
import { useDataStore } from "./store/dataStore";
import { getLastPatchNotes } from "@/util/fetchOperations";
import ModalDialog from "./components/ModalDialog.vue";
import { ref } from "vue";

export default {
	setup() {
		document.title = "Attend";
		const dataStore = useDataStore();
		const auth = useAuthStore();
		const showPatchNotes = ref(dataStore.showPatchNotesDialog);
		return {
			dataStore,
			auth,
			showPatchNotes,
		};
	},
	data() {
		return {
			showMenu: false,
			patchNotes: {
				title: "Patchnotes",
				text: "Was wurde geändert.",
			},
		};
	},
	watch: {
		async "dataStore.showPatchNotesDialog"(newVal) {
			if (newVal) {
				this.patchNotes = await getLastPatchNotes();
			}
			this.showPatchNotes = newVal;
		},
	},
	components: { ModalDialog },
};
</script>
