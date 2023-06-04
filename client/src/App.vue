<template>
	<div class="mx-3.5 md:mx-7 font-ubuntu text-[#111827] md:text-xl text-lg">

		<!--Navbar: Wird angezeigt, wenn Session Authenticated-->
		<nav class="container mx-auto mt-6 md:mt-12 mb-6 md:max-w-medium-width px-3.5 md:px-7"
			v-if="auth.authenticated">
			<div class="flex justify-between items-center">
				<!--Menu Icon-->
				<button @click="showMenu = !showMenu" class="pr-2 py-2 -mr-2 -mx-1">
					<span>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
							stroke="currentColor" class="w-10 h-10" v-show="!showMenu">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
						</svg>
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
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
						<svg xmlns="http://www.w3.org/2000/svg" width="188.262" height="189.375" viewBox="0 0 49.811 50.106"
							class="text-white w-14 h-14  md:w-14 md:h-14 p-3 md:p-4">
							<g fill="none" stroke="#ffffff" stroke-width="6.649" transform="translate(-93.826 -82.631)">
								<ellipse cx="118.732" cy="96.016" rx="10.439" ry="10.061" />
								<path stroke-linecap="round"
									d="M97.15 129.409c3.931-6.868 11.266-10.902 21.582-10.902 10.318 0 17.652 4.12 21.58 10.905" />
							</g>
						</svg>
					</div>
				</router-link>
			</div>

			<!--Navbar Links: Werden angezeigt, wenn auf Menu Icon geklickt wird.-->
			<transition enter-active-class="transition ease-in-out duration-700" enter-from-class="-translate-y-4 opacity-0"
				enter-to-class="translate-y-0 opacity-100" leave-active-class="transition ease-in-out duration-300"
				leave-from-class="translate-y-0 opacity-100" leave-to-class="-translate-y-4 opacity-0">
				<div class="flex flex-col gap-2" v-show="showMenu">
					<router-link @click="showMenu = !showMenu" to="/attendancelist"
						class="text-left font-medium md:text-2xl text-xl flex items-center group"
						v-show="auth.user?.lengthAccessibleGroups > 0">
						Anwesenheitsliste
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
							stroke="currentColor"
							class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
						</svg>
					</router-link>
					<router-link @click="showMenu = !showMenu" to="/invoices" v-show="auth.user?.lengthAccessibleGroups > 0 || auth.user?.roles.includes('admin') || auth.user?.roles.includes('staff') || auth.user?.roles.includes('head')"
						class="text-left font-medium md:text-2xl text-xl flex items-center group">
						Abrechnungen
						<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
							stroke="currentColor"
							class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
						</svg>
					</router-link>
					<div class="text-left font-medium md:text-2xl text-xl items-start flex flex-col" v-show="auth.user?.roles.includes('admin') || auth.user?.roles.includes('staff')">
						Verwaltung
						<div class="indent-8 flex flex-col gap-1">
							<router-link @click="showMenu = !showMenu" to="/administration/groups"
								class="flex items-center group">
								Gruppen
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
									stroke="currentColor"
									class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
								</svg>
							</router-link>
							<router-link @click="showMenu = !showMenu" to="/administration/members"
								class="flex items-center group">
								Mitglieder
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
									stroke="currentColor"
									class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
								</svg>
							</router-link>
							<router-link @click="showMenu = !showMenu" to="/administration/users"
								class="flex items-center group" v-show="auth.user?.roles.includes('admin')">
								Benutzer
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
									stroke="currentColor"
									class="w-6 h-6 ml-2 -translate-x-3 transition duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:translate-x-0">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
								</svg>
							</router-link>
						</div>
					</div>
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
						class="flex items-center mx-auto text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 px-6 ty:px-10 sm:px-12 py-1.5 rounded-xl drop-shadow-md">
						<p class="font-medium text-base md:text-lg">Gelesen</p>
					</button></template>
			</ModalDialog>
		</div>

		<!--Seiten Inhalte: Router reguliert, welche Seite angezeigt wird.-->
		<router-view class="font-normal md:max-w-medium-width mx-auto h-fit max-h-[90vh] overflow-auto w-full no-scrollbar pb-5" v-slot="{ Component }">
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
<style>
/* Firefox */
* {
	scroll-padding-left: 5px;
	scrollbar-width: thin;
	scrollbar-color: #ffffff00 #E8EBED;
}

/* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
	width: 6px;
}

*::-webkit-scrollbar-track {
	background: #ffffff00;
	border-radius: 2px;
}

*::-webkit-scrollbar-thumb {
	background-color: #6B7280;
	border-radius: 10px;
	border: 3px solid #6B7280;
}

/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}
</style>