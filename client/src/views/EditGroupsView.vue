<template>
  <div>
    <div class="container mx-auto flex flex-col gap-4 mb-20">
      <div class="flex flex-col gap-4 px-3.5 md:px-7">
        <div class="flex gap-4 justify-end items-center ">
          <button @click="showCreateGroupModal = true"
            class="hidden ty:flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-fit px-3.5 md:px-7 py-3.5 z-10">
            <p class="font-medium font-base md:text-lg">Neue Gruppe</p>
          </button>
          <button @click="showCreateGroupModal = true"
            class="flex ty:hidden justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md w-fit h-fit p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
              class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
          <button @click="showSearchBar = !showSearchBar"
            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md w-fit h-fit p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>
        </div>
        <transition enter-active-class="transition ease-linear duration-200" enter-from-class="-translate-y-9"
          enter-to-class="translate-y-0" leave-active-class="transition ease-linear duration-200"
          leave-from-class="translate-y-0" leave-to-class="-translate-y-9">
          <div class="flex items-center gap-4" v-show="showSearchBar">
            <TextInput name="searchbar" placeholder="Suche..." @onChange="(str) => search(str)" ref="searchBar">
            </TextInput>
            <div class="px-3.5 py-3.5"
              @click="() => { if ($refs.searchBar.input === '') showSearchBar = false; $refs.searchBar.input = ''; }">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </transition>
      </div>
      <CollapsibleContainer v-for="(department, index) in departments" :key="department._id"
        class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col" :show="index === 0">
        <template #header>
          <p class="font-medium">{{ department.name }}</p>
        </template>
        <template #content>
          <div class="h-fit max-h-[55vh] overflow-y-auto block">
            <table class="table-auto w-full text-left">
              <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
                <tr>
                  <th scope="col" class="pb-2.5 font-medium" @click="index = (indexSort + 1) % 2">
                    <span class="flex items-center gap-1">
                      <SortIcon :index="indexSort"></SortIcon>
                      Gruppenbezeichnung
                    </span>
                  </th>
                  <th scope="col" class="pb-2.5 font-medium"></th>
                </tr>
              </thead>
              <tbody class="overscroll-y-scroll">
                <tr v-for="group in searchResults.filter(g => g.department._id === department._id)" :key="group._id"
                  @click="openEditGroup(group._id)" class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                  <!--Gruppenbezeichnung-->
                  <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                    <p class="">{{ group.name }}</p>
                  </td>

                  <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 justify-items-end">
                    <!--Arrow Right-->
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                      stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto">
                      <path stroke-linecap="round" stroke-linejoin="round"
                        d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                    </svg>
                  </td>
                </tr>
              </tbody>
            </table>
            <p v-show="typeof searchResults.filter(g => g.department._id === department._id) === 'undefined' || searchResults.filter(g => g.department._id === department._id)?.length === 0"
              class="font-medium text-gray-500 text-center pt-2.5">Keine Gruppen gefunden</p>
          </div>
        </template>
      </CollapsibleContainer>
    </div>

    <!-- Create New Group Modal -->
    <ModalDialog :show="showCreateGroupModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Neue Gruppe</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">
          <!--Gruppenbezeichnung-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="name" class="font-medium">Name:</label>
            <TextInput name="name" v-model="newGroup.name" placeholder="Gruppenbezeichnung"
              :showError="error.cause.nameInput" class="md:w-96"></TextInput>
          </div>

          <!--Abteilung-->
          <div class="w-full flex items-center justify-between gap-4">
            <!--Dropdown Selector aus allen Departments-->
            <p class="font-medium">Abteilung:</p>
            <SelectList v-model="newGroup.department" :options="departments" :showError="error.cause.departmentInput"
              class="md:w-96 text-black" :sortAlphabetically="true"></SelectList>
          </div>

          <!--Zeiten der Gruppe -->
          <div class="w-full flex items-center justify-between gap-4">
            <CollapsibleContainer :show="true" class="w-full">
              <template #header>
                <p class="font-medium">Zeiten</p>
              </template>
              <template #content>
                <table class="table-auto w-full mb-2">
                  <thead class="border-b border-[#D1D5DB] text-left">
                    <tr>
                      <th class="pb-1.5 font-medium">Tag</th>
                      <th class="pb-1.5 font-medium  px-2.5">Start</th>
                      <th class="pb-1.5 font-medium">Ende</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-[#E5E7EB] last:border-0 group"
                      v-for="(time, index) in newGroup.times.sort((a, b) => sorter[b] - sorter[a])" :key="index">
                      <td class="py-2 group-last:pt-2 group-last:pb-0">
                        <!--Selector Day-->
                        <select v-model="time.day"
                          class="block md:hidden w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium ">
                          <option value="Montag">Mo.</option>
                          <option value="Dienstag">Di.</option>
                          <option value="Mittwoch">Mi.</option>
                          <option value="Donnerstag">Do.</option>
                          <option value="Freitag">Fr.</option>
                          <option value="Samstag">Sa.</option>
                          <option value="Sonntag">So.</option>
                        </select>
                        <select v-model="time.day"
                          class="hidden md:block w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium ">
                          <option value="Montag">Montag</option>
                          <option value="Dienstag">Dienstag</option>
                          <option value="Mittwoch">Mittwoch</option>
                          <option value="Donnerstag">Donnerstag</option>
                          <option value="Freitag">Freitag</option>
                          <option value="Samstag">Samstag</option>
                          <option value="Sonntag">Sonntag</option>
                        </select>
                      </td>
                      <td class="py-2 group-last:pt-2 group-last:pb-0 px-2.5">
                        <!--Time Selector-->
                        <input
                          class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                          :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                          v-model="time.starttime" min='00:00' :max='time.endtime' @change="validateTime(time)" />
                      </td>
                      <td class="py-2 group-last:pt-2 group-last:pb-0">
                        <!--Time Selector-->
                        <input
                          class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                          :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                          v-model="time.endtime" :min='time.starttime' max='00:00' @change="validateTime(time)" />
                      </td>

                      <td @click="newGroup.times.splice(index, 1)">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                          stroke="currentColor" class="w-7 h-7">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </td>
                    </tr>

                    <tr v-show="showNewTime">
                      <td class="pt-2 ">
                        <!--Selector Day-->
                        <select v-model="tempTime.day"
                          class="block md:hidden w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium ">
                          <option value="Montag">Mo.</option>
                          <option value="Dienstag">Di.</option>
                          <option value="Mittwoch">Mi.</option>
                          <option value="Donnerstag">Do.</option>
                          <option value="Freitag">Fr.</option>
                          <option value="Samstag">Sa.</option>
                          <option value="Sonntag">So.</option>
                        </select>
                        <select v-model="tempTime.day"
                          class="hidden md:block w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium ">
                          <option value="Montag">Montag</option>
                          <option value="Dienstag">Dienstag</option>
                          <option value="Mittwoch">Mittwoch</option>
                          <option value="Donnerstag">Donnerstag</option>
                          <option value="Freitag">Freitag</option>
                          <option value="Samstag">Samstag</option>
                          <option value="Sonntag">Sonntag</option>
                        </select>
                      </td>
                      <td class="pt-2 px-2.5">
                        <!--Time Selector-->
                        <input
                          class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                          :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                          v-model="tempTime.starttime" :max='tempTime.endtime' min='00:00' @change="tempTimeChange()" />
                      </td>
                      <td class="pt-2">
                        <!--Time Selector-->
                        <input
                          class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                          :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                          v-model="tempTime.endtime" max='00:00' :min='tempTime.starttime' @change="tempTimeChange()" />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="flex items-center justify-end w-full" v-show="!showNewTime">
                  <button @click="showNewTime = true"
                    class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md px-3.5 py-1">
                    <p class="font-medium font-base md:text-lg">Zeit hinzufügen</p>
                  </button>
                </div>
              </template>
            </CollapsibleContainer>
          </div>

          <!--Veranstaltungsort-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="venue" class="font-medium">Sportstätte:</label>
            <TextInput name="venue" v-model="newGroup.venue" placeholder="Sportstätte" :showError="error.cause.venueInput"
              class="md:w-96"></TextInput>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
          <div class="flex justify-between items-center gap-6 ">
            <button @click="cancel"
              class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Abbrechen</p>
            </button>
            <button @click="createNewGroup"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Erstellen</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>

    <!-- Edit Group Modal -->
    <ModalDialog :show="showEditGroupModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <p class="text-xl md:text-2xl">Bearbeiten</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4">
          <!--Gruppenbezeichnung-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="name" class="font-medium">Name:</label>
            <TextInput name="name" v-model="newGroup.name" placeholder="Gruppenbezeichnung"
              :showError="error.cause.nameInput" class="md:w-96"></TextInput>
          </div>

          <!--Abteilung-->
          <div class="w-full flex items-center justify-between gap-4">
            <!--Dropdown Selector aus allen Departments-->
            <p class="font-medium">Abteilung:</p>
            <SelectList v-model="newGroup.department" :options="departments" :showError="error.cause.departmentInput"
              class="md:w-96 text-black" :sortAlphabetically="true"></SelectList>
          </div>

          <!--Zeiten der Gruppe -->
          <div class="w-full flex items-center justify-between gap-4">
            <CollapsibleContainer :show="true" class="w-full">
              <template #header>
                <p class="font-medium">Zeiten</p>
              </template>
              <template #content>
                <table class="table-fixed w-full mb-2">
                  <thead class="border-b border-[#D1D5DB]">
                    <tr>
                      <th class="pb-1.5 font-medium">Tag</th>
                      <th class="pb-1.5 font-medium  px-2.5">Start</th>
                      <th class="pb-1.5 font-medium">Ende</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b border-[#E5E7EB] last:border-0 group" v-for="(time, index) in newGroup.times"
                      :key="index">
                      <td class="py-2 group-last:pt-2 group-last:pb-0">
                        <!--Selector Day-->
                        <select v-model="time.day"
                          class="block w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-lg font-medium">
                          <option value="Montag">Montag</option>
                          <option value="Dienstag">Dienstag</option>
                          <option value="Mittwoch">Mittwoch</option>
                          <option value="Donnerstag">Donnerstag</option>
                          <option value="Freitag">Freitag</option>
                          <option value="Samstag">Samstag</option>
                          <option value="Sonntag">Sonntag</option>
                        </select>
                      </td>
                      <td class="py-2 group-last:pt-2 group-last:pb-0 px-2.5">
                        <!--Time Selector-->
                        <input
                          class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg'
                          :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                          v-model="time.starttime" min='00:00' :max='time.endtime' @change="validateTime(time)" />
                      </td>
                      <td class="py-2 group-last:pt-2 group-last:pb-0">
                        <!--Time Selector-->
                        <input
                          class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg'
                          :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                          v-model="time.endtime" :min='time.starttime' max='00:00' @change="validateTime(time)" />
                      </td>
                    </tr>

                    <tr class="">
                      <td class="pt-2 ">
                        <!--Selector Day-->
                        <select v-model="tempTime.day"
                          class="block w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-lg font-medium">
                          <option value="Montag">Montag</option>
                          <option value="Dienstag">Dienstag</option>
                          <option value="Mittwoch">Mittwoch</option>
                          <option value="Donnerstag">Donnerstag</option>
                          <option value="Freitag">Freitag</option>
                          <option value="Samstag">Samstag</option>
                          <option value="Sonntag">Sonntag</option>
                        </select>
                      </td>
                      <td class="pt-2 px-2.5">
                        <!--Time Selector-->
                        <input
                          class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg'
                          :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                          v-model="tempTime.starttime" :max='tempTime.endtime' min='00:00' @change="tempTimeChange()" />
                      </td>
                      <td class="pt-2">
                        <!--Time Selector-->
                        <input
                          class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg'
                          :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                          v-model="tempTime.endtime" max='00:00' :min='tempTime.starttime' @change="tempTimeChange()" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </template>
            </CollapsibleContainer>
          </div>
          <!--Veranstaltungsort-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="venue" class="font-medium">Sportstätte:</label>
            <TextInput name="venue" v-model="newGroup.venue" placeholder="Sportstätte" :showError="error.cause.venueInput"
              class="md:w-96"></TextInput>
          </div>
          <!--Teilnehmer-->
          <div class="w-full flex items-center justify-between gap-4">
            <CollapsibleContainer>
              <template #header>
                <p class="font-medium">Teilnehmer</p>
              </template>
              <template #content>
                <div v-for="participant in editGroup.participants " :key="participant._id"
                  v-show="editGroup.participants.length !== 0" class="flex justify-between items-center gap-2">
                  <!--TODO Ordentliche Liste-->
                  <p>{{ participant.name }}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-8 h-8 -mr-[2px]"
                    @click="editGroup.accessible_groups = editGroup.accessible_groups.filter(e => e !== participant)">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <!--TODO Add Participant-->
                </div>
                <p class="text-light-gray" v-show="editGroup.participants.length === 0">Keine Teilnehmer zugeteilt</p>
              </template>
            </CollapsibleContainer>
          </div>

          <!--Teilnehmer-->
          <div class="w-full flex items-center justify-between gap-4">
            <CollapsibleContainer>
              <template #header>
                <p class="font-medium">Trainer</p>
              </template>
              <template #content>
                <div v-for="trainer in editGroup.trainers " :key="trainer._id" v-show="editGroup.trainers.length !== 0"
                  class="flex justify-between items-center gap-2">
                  <!--TODO Ordentliche Liste-->
                  <p>{{ trainer.name }}</p>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                    stroke="currentColor" class="w-8 h-8 -mr-[2px]"
                    @click="editGroup.accessible_groups = editGroup.accessible_groups.filter(e => e !== trainer)">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <!--TODO Add Trainer-->
                </div>
                <p class="text-light-gray" v-show="editGroup.trainers.length === 0">Keine Trainer zugeteilt</p>
              </template>
            </CollapsibleContainer>
          </div>

          <div class="w-full flex items-center justify-between gap-4">
            <p class="">Gruppe löschen:</p>
            <button
              @click="() => { showDeleteButton = true; error.message = 'Die gehörige Listen werden ebenfalls gelöscht!'; error.show = true; }"
              v-show="!showDeleteButton"
              class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 rounded-2xl drop-shadow-md w-[90px] md:w-[114px] py-3">
              <p class="font-medium font-base md:text-lg">Löschen</p>
            </button>
            <button @click="deleteGroup(editGroup._id)"
              class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-fit px-[7px] md:px-6 py-1.5"
              v-show="showDeleteButton">
              <p class="font-medium font-base md:text-lg">Wirklich Löschen?</p>
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
          <div class="flex justify-between items-center gap-6 ">
            <button @click="cancel"
              class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Abbrechen</p>
            </button>
            <button @click="saveEditedGroup"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Speichern</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>
  
<script>
import _ from "lodash"
import { getAllGroups, createNewGroup, updateGroup, deleteGroup, getAllDepartments } from "@/util/fetchOperations"
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import ModalDialog from '@/components/ModalDialog.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import SelectList from "@/components/SelectList.vue";

export default {
  name: "EditUsersView",
  setup() {
    const dataStore = useDataStore()
    return {
      dataStore
    }
  },
  data() {
    return {
      allGroups: [],
      searchResults: [],
      indexSort: 0,
      showSearchBar: false,
      showCreateGroupModal: false,
      showEditGroupModal: false,
      newGroup: {
        name: '',
        venue: '',
        department: {},
        times: []
      },
      editGroup: {
        venue: '',
        name: '',
        department: {},
        times: [],
        participants: [],
        trainers: []
      },
      departments: [],
      error: {
        message: '',
        show: false,
        cause: {
          venueInput: false,
          nameInput: false,
          departmentInput: false,
          timesInput: false
        }
      },
      showDeleteButton: false,
      tempTime: {
        day: '',
        starttime: '',
        endtime: ''
      },
      showNewTime: false,
      sorter: {
        "Montag": 1,
        "Dienstag": 2,
        "Mittwoch": 3,
        "Donnerstag": 4,
        "Freitag": 5,
        "Samstag": 6,
        "Sonntag": 7
      }
    }
  },
  components: {
    SortIcon,
    TextInput,
    ModalDialog,
    ErrorMessage,
    CollapsibleContainer,
    SelectList
  },
  methods: {
    search(searchString) {
      if (this.showSearchBar) {
        if (searchString !== '') {
          this.searchResults = this.allGroups.filter(group => {
            return group.name.toLowerCase().indexOf(searchString.toLowerCase()) > -1
          })
        } else {
          this.searchResults = this.allGroups
        }
      }
    },

    cancel() {
      this.showCreateGroupModal = false
      this.showEditGroupModal = false
      this.showDeleteButton = false

      this.searchString = ''

      this.newGroup = {
        name: '',
        venue: '',
        department: {},
        times: []
      }

      this.editGroup = {
        venue: '',
        name: '',
        department: {},
        times: [],
        participants: [],
        trainers: []
      }

      this.resetError()
    },

    async createNewGroup() {
      this.validateInputs(this.newGroup)

      if (!this.error.show) {
        this.newGroup.department = this.newGroup.department._id

        const res = await createNewGroup(this.newGroup)
        if (res.ok) {
          this.getAllGroups()
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async saveEditedGroup() {
      this.validateInputs(this.editGroup)

      if (!this.error.show) {
        this.editGroup.department = this.editGroup.department._id
        this.editGroup.participants = this.editGroup.participants.map(p => {
          return {
            memberId: p.memberId,
            firsttraining: p.firsttraining
          }
        })

        this.editGroup.trainers = this.editGroup.trainers.map(p => {
          return {
            userId: p.memberId,
            role: p.role
          }
        })

        const res = await updateGroup(this.editGroup)
        if (res.ok) {
          this.getAllGroups()
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async deleteGroup(id) {
      const res = await deleteGroup(id)
      if (res.ok) {
        this.getAllGroups()
        this.cancel()
      } else {
        this.error.message = res.body.message
        this.error.show = true
      }
    },

    async openEditGroup(id) {
      this.$router.push({ path: '/administration/edit-group', query: { id: id } })
    },

    async getAllGroups() {
      this.allGroups = (await getAllGroups()).sort((a, b) => a.name.localeCompare(b.name))
      //Array aus allen Departments der Gruppen Keine Duplikate
      this.departments = await getAllDepartments()
      this.searchResults = this.allGroups
    },

    resetError() {
      this.error.show = false
      //TODO Update error.cause
      this.error.cause = {
        nameInput: false,
        venueInput: false,
        departmentInput: false,
        timesInput: false
      }
      this.error.message = ''
    },

    validateInputs(inputs) {
      this.resetError()

      if (inputs.name.trim().length === 0 || !inputs.name.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen Name ein.'
        this.error.show = true
        this.error.cause.nameInput = true
      }
      //Regex Groß- und Kleinbuchstaben, Umlaute, ß, Bindestriche & Leerzeichen
      //Regex: /^[a-zA-ZäöüÄÖÜß- ]+$/
      if (inputs.venue.trim().length === 0 || !inputs.venue.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen gültigen Veranstaltungsort ein.'
        this.error.show = true
        this.error.cause.venueInput = true
      }
      if (typeof inputs.department._id === "undefined" || inputs.department._id?.trim().length === 0 || !inputs.department._id?.match(/^[0-9a-fA-F]{24}$/)) {
        this.error.message = 'Bitte wähle eine Abteilung aus.'
        this.error.show = true
        this.error.cause.departmentInput = true
      }
      if (inputs.times.length === 0 || !inputs.times.every(t => ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].includes(t.day) && t.starttime.match(/^[0-9]{2}:[0-9]{2}$/) && t.endtime.match(/^[0-9]{2}:[0-9]{2}$/))) {
        this.error.message = 'Bitte gebe die Trainingszeiten ein.'
        this.error.show = true
        this.error.cause.timesInput = true
      }

      //If any error is true, set error.message to 'Mehrere Fehler.'
      if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
        this.error.message = 'Mehrere Fehler.'
      }

      if (typeof inputs._id !== 'undefined') {
        const oldEntry = this.allGroups.find(m => m._id === inputs._id)
        if (_.isEqual(inputs.name, oldEntry.name) && _.isEqual(inputs.venue, oldEntry.venue)
          && _.isEqual(inputs.participants, oldEntry.participants) && _.isEqual(inputs.trainers, oldEntry.trainers)
          && _.isEqual(inputs.times, oldEntry.times) && _.isEqual(inputs.department, oldEntry.department)) {
          this.error.message = 'Es wurden keine Änderungen vorgenommen.'
          this.error.show = true
        }
      }
    },

    validateTime(time) {
      if (time.starttime !== "" && time.endtime !== "") {
        if (parseInt(time.starttime.replace(":", "")) > parseInt(time.endtime.replace(":", ""))) {
          const temp = time.starttime
          time.starttime = time.endtime
          time.endtime = temp
        }
      }
    },

    tempTimeChange() {
      if (this.tempTime.day !== '' && this.tempTime.starttime !== '' && this.tempTime.endtime !== '') {
        if (parseInt(this.tempTime.starttime.replace(":", "")) > parseInt(this.tempTime.endtime.replace(":", ""))) {
          const temp = this.tempTime.starttime
          this.tempTime.starttime = this.tempTime.endtime
          this.tempTime.endtime = temp
        }
        this.newGroup.times.push(this.tempTime)
        this.tempTime = {
          day: '',
          starttime: '',
          endtime: ''
        }
        this.showNewTime = false
      }
    }
  },

  async created() {
    document.title = 'Gruppen bearbeiten - Attend'
    this.dataStore.viewname = "Gruppen bearbeiten"

  },

  async mounted() {
    await this.getAllGroups()
  },

  watch: {
    allGroups() {
      this.searchResults = this.allGroups
    },
    indexSort() {
      this.searchResults.sort((a, b) => {
        if (this.indexSort === 1) {
          return b.name.localeCompare(a.name)
        } else {
          return a.name.localeCompare(b.name)
        }
      })
    }
  }
}
</script>

<style scoped>
select {
  line-height: 2rem;
  padding-bottom: 2px;
  padding-top: 5px;
}

input[type="time"] {
  line-height: 2rem;
  padding-bottom: 2px;
  padding-top: 5px;
}

input[type="time"]::-webkit-calendar-picker-indicator {
  display: block;
  opacity: 0;
}

input::-webkit-inner-spin-button,
input::-webkit-clear-button {
  display: block;
  opacity: 0;
}

input[type="time"] {
  background-image: url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%22%20stroke-width%3D%221.5%22%20stroke%3D%22currentColor%22%20class%3D%22w-6%20h-6%22%3E%0A%20%20%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20d%3D%22M12%206v6h4.5m4.5%200a9%209%200%2011-18%200%209%209%200%200118%200z%22%20%2F%3E%0A%3C%2Fsvg%3E%0A");
  background-repeat: no-repeat;
  background-size: 1.5rem 1.5rem;
  background-position: right 0.25rem center;

  cursor: pointer;
}

input::-webkit-date-and-time-value {
  text-align: left;
}
</style>
