<template>
  <div>
    <div class="container mx-auto flex flex-col gap-8 mb-20">
      <!-- Group Info -->
      <div class="flex flex-col justify-center items-center gap-4 bg-white rounded-xl p-3.5 md:p-7">
        <!--Gruppenbezeichnung-->
        <div class="w-full flex items-center justify-between gap-4">
          <label for="name" class="font-medium">Name:</label>
          <TextInput name="name" v-model="group.name" placeholder="Gruppenbezeichnung" :showError="error.cause.nameInput"
            class="md:w-96"></TextInput>
        </div>

        <!--Abteilung-->
        <div class="w-full flex items-center justify-between gap-4">
          <!--Dropdown Selector aus allen Departments-->
          <p class="font-medium">Abteilung:</p>
          <SelectList v-model="group.department" :options="departments" :showError="error.cause.departmentInput"
            class="md:w-96 text-black" :sortAlphabetically="true"></SelectList>
        </div>

        <!--Zeiten der Gruppe -->
        <div class="w-full flex items-center justify-between gap-4"
          :class="{ 'outline outline-2 outline-offset-4 rounded-lg outline-special-red': error.cause.timesInput }">
          <CollapsibleContainer :show="true" class="w-full">
            <template #header>
              <p class="font-medium">Zeiten</p>
            </template>
            <template #content>
              <table class="table-auto w-full mb-2">
                <thead class="border-b border-[#D1D5DB] text-left">
                  <tr>
                    <th class="pb-1.5 font-medium">Tag</th>
                    <th class="pb-1.5 font-medium px-2.5"><span class="hidden ty:block">Start</span> <span
                        class="block ty:hidden">Zeiten</span></th>
                    <th class="pb-1.5 font-medium hidden ty:block">Ende</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  <!--Zeiten-->
                  <tr class="border-b border-[#E5E7EB] last:border-0 group"
                    v-for="(time, index) in group.times.sort((a, b) => sorter[b] - sorter[a])" :key="index">
                    <td class="">
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
                    <td class="py-2 px-2.5 flex flex-col gap-2 sm:table-cell">
                      <!--Time Selector-->
                      <input
                        class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                        :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                        v-model="time.starttime" min='00:00' :max='time.endtime' @change="validateTime(time)" />
                      <!--Time Selector-->
                      <input
                        class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3 block ty:hidden'
                        :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                        v-model="time.endtime" :min='time.starttime' max='00:00' @change="validateTime(time)" />
                    </td>
                    <td class="hidden ty:table-cell">
                      <!--Time Selector-->
                      <input
                        class='font-medium focus:ring-0 focus:border-standard-gradient-1 border-2 border-[#9ea3ae] rounded-2xl text-lg px-1 md:px-3'
                        :class="error.cause.timesInput ? 'border-2 rounded-lg border-special-red' : ''" type='time'
                        v-model="time.endtime" :min='time.starttime' max='00:00' @change="validateTime(time)" />
                    </td>
                    <td @click="group.times.splice(index, 1)" class="">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2"
                        stroke="currentColor" class="w-7 h-7 ml-auto">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                  </tr>

                  <!--Füge Zeit hinzu-->
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
          <TextInput name="venue" v-model="group.venue" placeholder="Sportstätte" :showError="error.cause.venueInput"
            class="md:w-96"></TextInput>
        </div>
        <!-- TODO Config Error Message -->
        <div class="w-full">
          <ErrorMessage
            :show="error.cause.nameInput || error.cause.departmentInput || error.cause.timesInput || error.cause.venueInput"
            :message="error.message"></ErrorMessage>
        </div>
        <button @click="saveChanges"
          class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-3.5 md:px-7 py-2.5">
          <p class="font-medium font-base md:text-lg">Speichern</p>
        </button>
      </div>

      <!-- TODO Teilnehmer/Trainer hinzufügen + Teilnehmer bearbeiten -->

      <!-- Liste Teilnehmer -->
      <div class="flex flex-col gap-4 items-center w-full">
        <div class="flex gap-4 items-center justify-between w-full px-3.5 md:px-7">
          <p class="font-medium text-xl md:text-2xl">Teilnehmer</p>
          <button @click="showAddParticipantModal = true"
            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md px-3.5 md:px-7 py-2.5">
            <p class="font-medium font-base md:text-lg">Hinzufügen</p>
          </button>
        </div>
        <div class="h-fit max-h-[55vh] overflow-y-auto block w-full bg-white p-3.5 md:p-7 rounded-xl">
          <table class="table-auto w-full text-left">
            <thead class="sticky top-0 border-b border-[#D1D5DB]">
              <tr>
                <th scope="col" class="w-[142px] md:w-[152px] pb-2.5 font-medium"
                  @click="participantSortIndex.lastname = (participantSortIndex.lastname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="participantSortIndex.lastname"></SortIcon>
                    Name
                  </span>
                </th>
                <th scope="col" class="w-[142px] md:w-[152px] px-3 md:px-4 pb-2.5 font-medium"
                  @click="participantSortIndex.firstname = (participantSortIndex.firstname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="participantSortIndex.firstname"></SortIcon>
                    Vorname
                  </span>
                </th>
                <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                  @click="participantSortIndex.birthday = (participantSortIndex.birthday + 1) % 2">
                  <span class="hidden md:flex items-center gap-1 ">
                    <SortIcon :index="participantSortIndex.birthday"></SortIcon>
                    Geburtstag
                  </span>
                  <span class="flex md:hidden items-center gap-1 ">
                    <SortIcon :index="participantSortIndex.birthday"></SortIcon>
                    Geb.
                  </span>
                </th>
                <th scope="col" class="pb-2.5 font-medium w-full"></th>
              </tr>
            </thead>
            <tbody class="overscroll-y-scroll">
              <tr v-for="participant in group.participants" :key="participant._id"
                @click="openEditParticipant(participant._id)"
                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                <!--Lastname-->
                <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 w-fit text-base sm:text-lg md:text-xl">
                  <p class="">{{ participant.lastname }}</p>
                </td>
                <!--Firstname-->
                <td class="px-3 md:px-4 w-fit py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="">{{ participant.firstname }}</p>
                </td>
                <!--Birthday-->
                <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="text-light-gray">{{
                    new Date(participant.birthday).toLocaleDateString('de-DE', {
                      year: '2-digit', month:
                        '2-digit', day: '2-digit'
                    })
                  }}</p>
                </td>
                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end">
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
          <p v-show="typeof this.group.participants === 'undefined' || this.group.participants?.length === 0"
            class="font-medium text-gray-500 text-center pt-2.5">Keine Gruppen gefunden</p>
        </div>
      </div>

      <!-- Liste Trainer -->
      <div class="flex flex-col gap-4 items-center w-full">
        <div class="flex gap-4 items-center justify-between w-full px-3.5 md:px-7">
          <p class="font-medium text-xl md:text-2xl">Trainer</p>
          <button @click="showAddTrainerModal = true"
            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md px-3.5 md:px-7 py-2.5">
            <p class="font-medium font-base md:text-lg">Hinzufügen</p>
          </button>
        </div>
        <div class="h-fit max-h-[55vh] overflow-y-auto block w-full bg-white p-3.5 md:p-7 rounded-xl">
          <table class="table-auto w-full text-left">
            <thead class="sticky top-0 border-b border-[#D1D5DB]">
              <tr>
                <th scope="col" class="w-[142px] md:w-[152px] pb-2.5 font-medium"
                  @click="trainersSortIndex.lastname = (trainersSortIndex.lastname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.lastname"></SortIcon>
                    Name
                  </span>
                </th>
                <th scope="col" class="w-[142px] md:w-[152px] px-3 md:px-4 pb-2.5 font-medium"
                  @click="trainersSortIndex.firstname = (trainersSortIndex.firstname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.firstname"></SortIcon>
                    Vorname
                  </span>
                </th>
                <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                  @click="trainersSortIndex.role = (trainersSortIndex.role + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="trainersSortIndex.role"></SortIcon>
                    Rolle
                  </span>
                </th>
                <th scope="col" class="pb-2.5 font-medium w-full"></th>
              </tr>
            </thead>
            <tbody class="overscroll-y-scroll">
              <tr v-for="trainer in group.trainers" :key="trainer._id" @click="openEditTrainer(trainer._id)"
                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">
                <!--Lastname-->
                <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 w-fit text-base sm:text-lg md:text-xl">
                  <p class="">{{ trainer.lastname }}</p>
                </td>
                <!--Firstname-->
                <td class="px-3 md:px-4 w-fit py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="">{{ trainer.firstname }}</p>
                </td>
                <!--Rolle-->
                <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="text-light-gray">{{ trainer.role === "trainer" ? "Trainer" : "Assistent" }}</p>
                </td>
                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end">
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
          <p v-show="typeof this.group.trainers === 'undefined' || this.group.trainers?.length === 0"
            class="font-medium text-gray-500 text-center pt-2.5">Keine Gruppen gefunden</p>
        </div>
      </div>
    </div>

    <!-- Edit Participant -->
    <ModalDialog :show="showEditParticipantModal" :hasSubheader="false" @onClose="cancel">
      <!-- TODO Edit Participant Weiter -->
      <template #header>
        <p class="text-xl md:text-2xl text-[#111827]">Bearbeiten</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4 text-[#111827]">

          <!--Vorname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname" class="">Vorname:</label>
            <TextInput name="firstname" v-model="editParticipant.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname" class="">Nachname:</label>
            <TextInput name="lastname" v-model="editParticipant.lastname" placeholder="Nachname"
              :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Geburtstag des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="birthday" class=""><span class="hidden sm:block">Geburtstag:</span><span
                class="block sm:hidden">Geb.:</span></label>
            <DateInput v-model="editParticipant.birthday" name="birthday" :max="new Date().toJSON().slice(0, 10)"
              class="font-medium md:w-96" :showError="error.cause.birthdayInput">
            </DateInput>
          </div>

          <!--Erstes Training des Teilnehmers-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firsttraining" class=""><span class="hidden sm:block">Erstes Training:</span><span
                class="block sm:hidden">Erstes Train.:</span></label>
            <DateInput v-model="editParticipant.firsttraining" name="firsttraining"
              :max="new Date().toJSON().slice(0, 10)" class="font-medium md:w-96"
              :showError="error.cause.firsttrainingInput">
            </DateInput>
          </div>

          <div class="w-full flex items-center justify-between gap-4 mt-4">
            <p class="">Teilnehmer entfernen:</p>
            <button @click="showDeleteButton = true" v-show="!showDeleteButton"
              class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 rounded-2xl drop-shadow-md w-fit px-2 ty:px-3 md:px-6 py-3">
              <p class="font-medium font-base md:text-lg">Entfernen</p>
            </button>
            <button @click="removeParticipant(editParticipant._id)"
              class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-fit px-2 md:px-4 py-2"
              v-show="showDeleteButton">
              <p class="font-medium font-base md:text-lg">Wirklich entfernen?</p>
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
          <div class="flex justify-between items-center gap-2 ty:gap-6 ">
            <button @click="cancel"
              class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-2 ty:px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Abbrechen</p>
            </button>
            <button @click="saveEditedParticipant"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-2 ty:px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Speichern</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>

    <!-- Edit Trainer -->
    <ModalDialog :show="showEditTrainerModal" :hasSubheader="false" @onClose="cancel">
      <!-- TODO Edit Participant Weiter -->
      <template #header>
        <p class="text-xl md:text-2xl text-[#111827]">Bearbeiten</p>
      </template>
      <template #content>
        <div class="flex flex-col justify-center items-center gap-4 text-[#111827]">

          <!--Vorname des Trainer-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="firstname" class="">Vorname:</label>
            <TextInput name="firstname" v-model="editTrainer.firstname" placeholder="Vorname"
              :showError="error.cause.firstnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Nachname des Trainer-->
          <div class="w-full flex items-center justify-between gap-4">
            <label for="lastname" class="">Nachname:</label>
            <TextInput name="lastname" v-model="editTrainer.lastname" placeholder="Nachname"
              :showError="error.cause.lastnameInput" class="md:w-96"></TextInput>
          </div>

          <!--Rolle des Trainer-->
          <div class="w-full flex items-center justify-between gap-4">
            <p class="">Rolle:</p>
            <select v-model="editTrainer.role"
              class="w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-0 border-b-2 border-[#9ea3ae] text-base md:text-lg font-medium"
              :class="{ 'outline outline-2 outline-offset-4 rounded-lg outline-special-red': error.cause.roleInput }">
              <option value="trainer">Trainer</option>
              <option value="assistant">Assistent</option>
            </select>
          </div>

          <div class="w-full flex items-center justify-between gap-4 mt-4">
            <p class="">Trainer entfernen:</p>
            <button @click="showDeleteButton = true" v-show="!showDeleteButton"
              class="flex justify-center items-center text-delete-gradient-1 outline outline-2 outline-delete-gradient-1 rounded-2xl drop-shadow-md w-fit px-2 ty:px-3 md:px-6 py-3">
              <p class="font-medium font-base md:text-lg">Entfernen</p>
            </button>
            <button @click="removeTrainer(editTrainer._id)"
              class="flex justify-center items-center text-white bg-gradient-to-br from-delete-gradient-1 to-delete-gradient-2 rounded-2xl drop-shadow-md w-fit px-2 md:px-4 py-2"
              v-show="showDeleteButton">
              <p class="font-medium font-base md:text-lg">Wirklich entfernen?</p>
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
          <div class="flex justify-between items-center gap-2 ty:gap-6 ">
            <button @click="cancel"
              class="flex items-center text-light-gray outline outline-2 outline-light-gray rounded-2xl px-2 ty:px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Abbrechen</p>
            </button>
            <button @click="saveEditTrainer"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-2 ty:px-3.5 md:px-7 py-4">
              <p class="font-medium font-base md:text-lg">Speichern</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>

    <!-- Add Participant -->
    <ModalDialog :show="showAddParticipantModal" :hasSubheader="false" @onClose="cancel">
      <template #header>
        <div class="flex justify-between items-center">
          <p class="text-xl md:text-2xl text-[#111827]">Teilnehmer hinzufügen</p>
          <p class="text-light-gray mr-[7px] font-medium cursor-pointer" @click="cancel">Schließen</p>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4 text-[#111827]">
          <!-- Search Bar -->
          <div class="w-full flex items-center justify-between gap-4">
            <TextInput name="search" v-model="searchString" placeholder="Suche" class="w-full"></TextInput>
            <span class="mr-2">
              <!-- Lupe -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-7 h-7" v-show="searchString === ''">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <!-- X Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-7 h-7" v-show="searchString !== ''" @click="searchString = ''">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </div>
          <!-- Tabelle Trainers -->
          <div class="h-fit max-h-[40vh] overflow-y-auto block w-full pr-2">
            <div v-for="member in searchResult" :key="member._id" @click="onClickOnNewParticipant(member._id)"
              class="w-full border-b last:border-0 border-[#D1D5DB] py-2 last:pb-0 flex justify-between items-center gap-2">
              <div class="w-full flex justify-start items-center gap-2">
                <p class="">{{ member.firstname }} {{ member.lastname }}</p>
                <p class="text-light-gray">{{ new Date(member.birthday).toLocaleDateString('de-DE', {
                  year: '2-digit', month:
                    '2-digit', day: '2-digit'
                }) }}</p>
              </div>
              <div class="w-fit h-fit">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                  stroke="currentColor" class="w-7 h-7 text-[#111827]"
                  v-show="selectedMembers.some(m => m._id === member._id) || group.trainers.some(p => p.userId === member._id)">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <div
                  v-show="!selectedMembers.some(m => m._id === member._id) && !group.trainers.some(p => p.userId === member._id)"
                  class="w-[28px] h-[28px] border-[2.25pt] border-light-gray rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
          <div class="flex justify-center items-center gap-2">
            <button @click="addParticipants()"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-2 ty:px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Hinzufügen</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>

    <!-- Add Trainer -->
    <ModalDialog :show="showAddTrainerModal" :hasSubheader="false" @onClose="cancel" class="">
      <template #header>
        <div class="flex justify-between items-center">
          <p class="text-xl md:text-2xl text-[#111827]">Trainer hinzufügen</p>
          <p class="text-light-gray mr-[7px] font-medium cursor-pointer" @click="cancel">Schließen</p>
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4 text-[#111827]">
          <!-- Search Bar -->
          <div class="w-full flex items-center justify-between gap-4">
            <TextInput name="search" v-model="searchString" placeholder="Suche" class="w-full"></TextInput>
            <span class="mr-2">
              <!-- Lupe -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-7 h-7" v-show="searchString === ''">
                <path stroke-linecap="round" stroke-linejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <!-- X Icon -->
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-7 h-7" v-show="searchString !== ''" @click="searchString = ''">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </span>
          </div>
          <!-- Tabelle Trainers -->
          <div class="h-fit max-h-[40vh] overflow-y-auto block w-full pr-2">
            <div v-for="user in searchResult" :key="user._id" @click="onClickOnNewTrainer(user._id)"
              class="w-full border-b last:border-0 border-[#D1D5DB] py-3 last:pb-0 flex justify-between items-center gap-2">
              <div class="w-full flex justify-between items-center gap-2 -my-[4px]">
                <p class="">{{ user.firstname }} {{ user.lastname }}</p>
                <select v-model="user.role" @click.stop=""
                  class="w-fit focus:ring-0 focus:border-standard-gradient-1 border-0 py-[4px] rounded-xl bg-[#D1D5DB] font-medium text-base md:text-lg"
                  :class="{ 'outline outline-2 outline-offset-4 rounded-lg outline-special-red': (error.cause.roleInput && user.role === 'role') }"
                  v-show="selectedUsers.some(m => m._id === user._id)">
                  <option value="trainer" class="bg-white">Trainer</option>
                  <option value="assistant" class="bg-white">Assistent</option>
                  <option value="role" disabled hidden class="bg-white">Rolle</option>
                </select>
              </div>
              <div class="w-fit h-fit">
                <!-- Checkmark Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                  stroke="currentColor" class="w-7 h-7 "
                  v-show="selectedUsers.some(m => m._id === user._id) || group.trainers.some(p => p.userId === user._id)">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <!-- Rectangle -->
                <div
                  v-show="!selectedUsers.some(m => m._id === user._id) && !group.trainers.some(p => p.userId === user._id)"
                  class="w-[28px] h-[28px] border-[2.25pt] border-light-gray rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="flex flex-col gap-4">
          <ErrorMessage :message="error.message" :show="error.show" class=""></ErrorMessage>
          <div class="flex justify-center items-center gap-2">
            <button @click="addTrainers()"
              class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-2xl drop-shadow-md w-full px-2 ty:px-3.5 md:px-7 py-3.5">
              <p class="font-medium font-base md:text-lg">Hinzufügen</p>
            </button>
          </div>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>
  
<script>
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import ModalDialog from '@/components/ModalDialog.vue';
import ErrorMessage from '@/components/ErrorMessage.vue';
import CollapsibleContainer from "@/components/CollapsibleContainer.vue";
import SelectList from "@/components/SelectList.vue";
import { fetchGroup, getAllDepartments, updateParticipantInGroup, removeParticipantFromGroup, updateGroup, removeTrainerFromGroup, updateTrainerInGroup, getAllMembers, addMultipleMembersToGroup, getAllUsers, addMultipleTrainerToGroup } from "@/util/fetchOperations";
import _ from "lodash";
import DateInput from "@/components/DateInput.vue";

export default {
  name: "EditGroupView",
  setup() {
    const dataStore = useDataStore()
    return {
      dataStore
    }
  },
  data() {
    return {
      group: {
        name: "",
        department: {
        },
        times: [
        ],
        venue: "",
        participants: [
        ],
        trainers: [
        ]
      },
      tempTime: {
        day: "",
        starttime: "",
        endtime: ""
      },
      error: {
        message: '',
        show: false,
        cause: {
          venueInput: false,
          nameInput: false,
          departmentInput: false,
          timesInput: false,
          firstnameInput: false,
          lastnameInput: false,
          birthdayInput: false,
          firsttrainingInput: false,
          roleInput: false
        }
      },
      participantSortIndex: {
        lastname: 0,
        firstname: 0,
        birthday: 0
      },
      trainersSortIndex: {
        lastname: 0,
        firstname: 0,
        role: 0
      },
      departments: [],
      showNewTime: false,
      sorter: {
        "Montag": 1,
        "Dienstag": 2,
        "Mittwoch": 3,
        "Donnerstag": 4,
        "Freitag": 5,
        "Samstag": 6,
        "Sonntag": 7
      },
      showAddParticipantModal: false,
      showEditParticipantModal: false,
      showEditTrainerModal: false,
      showAddTrainerModal: false,
      showDeleteButton: false,

      editParticipant: {
        firstname: '',
        lastname: '',
        birthday: '',
        firsttraining: '',
        memberId: '',
        id: ''
      },

      editTrainer: {
        firstname: '',
        lastname: '',
        role: '',
        userId: ''
      },

      searchString: '',
      selectedMembers: [],
      selectedUsers: [],
      allMembers: [],
      allUsers: []
    }
  },
  components: {
    SortIcon,
    TextInput,
    ErrorMessage,
    CollapsibleContainer,
    SelectList,
    ModalDialog,
    DateInput
  },
  methods: {
    tempTimeChange() {
      if (this.tempTime.day !== '' && this.tempTime.starttime !== '' && this.tempTime.endtime !== '') {
        if (parseInt(this.tempTime.starttime.replace(":", "")) > parseInt(this.tempTime.endtime.replace(":", ""))) {
          const temp = this.tempTime.starttime
          this.tempTime.starttime = this.tempTime.endtime
          this.tempTime.endtime = temp
        }
        this.group.times.push(this.tempTime)
        this.tempTime = {
          day: '',
          starttime: '',
          endtime: ''
        }
        this.showNewTime = false
      }
    },

    cancel() {
      this.showAddParticipantModal = false
      this.showAddTrainerModal = false
      this.showEditParticipantModal = false
      this.showEditTrainerModal = false
      this.showDeleteButton = false

      this.editParticipant = {
        firstname: '',
        lastname: '',
        birthday: '',
        firsttraining: '',
        memberId: '',
        id: ''
      }

      this.editTrainer = {
        firstname: '',
        lastname: '',
        role: '',
        userId: ''
      }

      this.selectedMembers = []
      this.selectedUsers = []
      this.allMembers = []
      this.allUsers = []
      
      this.searchString = ''
      
      this.resetError()
    },

    async openEditParticipant(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      this.editParticipant = _.cloneDeep(this.group.participants.find(m => m.memberId === id))

      this.editParticipant.birthday = this.editParticipant.birthday.slice(0, 10)
      this.editParticipant.firsttraining = this.editParticipant.firsttraining.slice(0, 10)

      this.showEditParticipantModal = true
    },

    async saveEditedParticipant() {
      this.validateParticipantInputs(this.editParticipant)

      if (!this.error.show) {
        const res = await updateParticipantInGroup(this.group._id, this.editParticipant.memberId, this.editParticipant)
        if (res.ok) {
          this.group = await fetchGroup(this.group._id)
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async removeParticipant(id) {
      const res = await removeParticipantFromGroup(this.group._id, id)
      if (res.ok) {
        this.group = await fetchGroup(this.group._id)
        this.cancel()
      } else {
        this.error.message = res.body.message
        this.error.show = true
      }
    },

    async openEditTrainer(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      this.editTrainer = _.cloneDeep(this.group.trainers.find(t => t.userId === id))

      this.showEditTrainerModal = true
    },

    async saveEditTrainer() {
      this.validateTrainerInputs(this.editTrainer)

      if (!this.error.show) {
        const res = await updateTrainerInGroup(this.group._id, this.editTrainer.userId, this.editTrainer)
        if (res.ok) {
          this.group = await fetchGroup(this.group._id)
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    async removeTrainer(id) {
      const res = await removeTrainerFromGroup(this.group._id, id)
      if (res.ok) {
        this.group = await fetchGroup(this.group._id)
        this.cancel()
      } else {
        this.error.message = res.body.message
        this.error.show = true
      }
    },

    async saveChanges() {
      this.validateInputs()

      if (!this.error.show) {
        this.group.department = this.group.department._id

        const res = await updateGroup(this.group._id, this.group)
        if (res.ok) {
          this.group = await fetchGroup(this.group._id)
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      }
    },

    resetError() {
      this.error.show = false
      this.error.cause = {
        venueInput: false,
        nameInput: false,
        departmentInput: false,
        timesInput: false,
        firstnameInput: false,
        lastnameInput: false,
        birthdayInput: false,
        firsttrainingInput: false,
        roleInput: false
      }
      this.error.message = ''
    },

    validateParticipantInputs(inputs) {
      this.resetError()

      if (inputs.firstname.trim().length === 0 || !inputs.firstname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen gültigen Vornamen ein.'
        this.error.show = true
        this.error.cause.firstnameInput = true
      }
      if (inputs.lastname.trim().length === 0 || !inputs.lastname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen gültigen Nachnamen ein.'
        this.error.show = true
        this.error.cause.lastnameInput = true
      }
      if (inputs.birthday.trim().length === 0 || !inputs.birthday.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
        this.error.message = 'Bitte gebe einen Geburtstag ein.'
        this.error.show = true
        this.error.cause.birthdayInput = true
      }

      if (inputs.firsttraining.trim().length === 0 || !inputs.firsttraining.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)) {
        this.error.message = 'Bitte das erste Trainingsdatum ein.'
        this.error.show = true
        this.error.cause.firsttrainingInput = true
      }

      //If any error is true, set error.message to 'Mehrere Fehler.'
      if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
        this.error.message = 'Mehrere Fehler.'
      }

      if (typeof inputs._id !== 'undefined') {
        const oldEntry = this.group.participants.find(m => m._id === inputs._id)
        if (inputs.firstname === oldEntry.firstname && inputs.lastname === oldEntry.lastname
          && inputs.birthday === oldEntry.birthday.slice(0, 10)
          && inputs.firsttraining === oldEntry.firsttraining.slice(0, 10)) {
          this.error.message = 'Es wurden keine Änderungen vorgenommen.'
          this.error.show = true
        }
      }
    },

    validateTrainerInputs(inputs) {
      this.resetError()

      if (inputs.firstname.trim().length === 0 || !inputs.firstname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen gültigen Vornamen ein.'
        this.error.show = true
        this.error.cause.firstnameInput = true
      }
      if (inputs.lastname.trim().length === 0 || !inputs.lastname.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen gültigen Nachnamen ein.'
        this.error.show = true
        this.error.cause.lastnameInput = true
      }

      if (!["trainer", "assistant"].includes(inputs.role)) {
        this.error.message = 'Bitte wähle eine gültige Rolle aus.'
        this.error.show = true
        this.error.cause.roleInput = true
      }

      //If any error is true, set error.message to 'Mehrere Fehler.'
      if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
        this.error.message = 'Mehrere Fehler.'
      }

      if (typeof inputs._id !== 'undefined') {
        const oldEntry = this.group.trainers.find(t => t.userId === inputs.userId)
        if (inputs.firstname === oldEntry.firstname && inputs.lastname === oldEntry.lastname
          && inputs.role === oldEntry.role) {
          this.error.message = 'Es wurden keine Änderungen vorgenommen.'
          this.error.show = true
        }
      }
    },

    validateInputs() {
      this.resetError()

      if (this.group.name.trim().length === 0 || !this.group.name.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe einen gültigen Namen ein.'
        this.error.show = true
        this.error.cause.nameInput = true
      }
      if (this.group.department._id.trim().length === 0 || !this.group.department._id.match(/^[0-9a-fA-F]{24}$/)) {
        this.error.message = 'Bitte wähle eine Abteilung aus.'
        this.error.show = true
        this.error.cause.departmentInput = true
      }

      if (this.group.venue.trim().length === 0 || !this.group.venue.match(/^[a-zA-ZäöüÄÖÜß-\s]+$/)) {
        this.error.message = 'Bitte gebe eine gültige Sportstätte ein.'
        this.error.show = true
        this.error.cause.venueInput = true
      }

      if (this.group.times.length === 0) {
        this.error.message = 'Bitte gebe mindestens eine Zeit an.'
        this.error.show = true
        this.error.cause.timesInput = true
      }

      if (!this.group.times.every(t => ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"].includes(t.day) && t.starttime.match(/^[0-9]{2}:[0-9]{2}$/) && t.endtime.match(/^[0-9]{2}:[0-9]{2}$/))) {
        this.error.message = 'Bitte kontrolliere die Zeiten.'
        this.error.show = true
        this.error.cause.timesInput = true
      }

      //If any error is true, set error.message to 'Mehrere Fehler.'
      if (Object.keys(this.error.cause).filter(k => this.error.cause[k]).length > 1) {
        this.error.message = 'Mehrere Fehler.'
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

    onClickOnNewParticipant(id) {
      if (!this.group.participants.some(p => p.memberId === id)) {
        if (this.selectedMembers.some(m => m._id === id)) {
          this.selectedMembers = this.selectedMembers.filter(m => m._id !== id)
        } else {
          this.selectedMembers.push(this.allMembers.find(m => m._id === id))
        }
      }
    },

    onClickOnNewTrainer(id) {
      if (!this.group.trainers.some(t => t.userId === id)) {
        if (this.selectedUsers.some(t => t._id === id)) {
          this.selectedUsers = this.selectedUsers.filter(t => t._id !== id)
        } else {
          this.allUsers.find(u => u._id === id).role = "role"
          this.selectedUsers.push(this.allUsers.find(u => u._id === id))
        }
      }
    },

    async addParticipants() {
      if (this.selectedMembers.length > 0) {
        this.selectedMembers = this.selectedMembers.map(m => {
          return {
            ...m,
            firsttraining: new Date().toJSON().slice(0, 10)
          }
        })

        const res = await addMultipleMembersToGroup(this.group._id, this.selectedMembers)
        if (res.ok) {
          this.group = await fetchGroup(this.group._id)
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      } else {
        this.cancel()

      }
    },

    async addTrainers() {
      if (this.selectedUsers.length > 0) {
        this.selectedUsers = this.selectedUsers.map(u => {
          return {
            ...u,
            role: u.role
          }
        })

        if (this.selectedUsers.some(u => u.role === "role")) {
          this.error.message = "Bitte wähle für jeden Trainer eine Rolle aus."
          this.error.show = true
          this.error.cause.roleInput = true
          return
        }

        const res = await addMultipleTrainerToGroup(this.group._id, this.selectedUsers)
        if (res.ok) {
          this.group = await fetchGroup(this.group._id)
          this.cancel()
        } else {
          this.error.message = res.body.message
          this.error.show = true
        }
      } else {
        this.cancel()
      }
    }
  },

  async created() {
    document.title = 'Gruppe bearbeiten - Attend'
    this.dataStore.viewname = "Gruppe bearbeiten"
  },

  async mounted() {
    const id = this.$route.query.id

    if (!id || typeof id !== "string") {
      console.error("No ID provided");
      this.$router.back()
    }

    this.group = await fetchGroup(id)

    this.departments = await getAllDepartments()
  },

  watch: {
    "participantSortIndex.lastname"() {
      this.group.participants.sort((a, b) => {
        if (this.participantSortIndex.lastname === 0) {
          return a.lastname.localeCompare(b.lastname)
        } else {
          return b.lastname.localeCompare(a.lastname)
        }
      })
    },
    "participantSortIndex.firstname"() {
      this.group.participants.sort((a, b) => {
        if (this.participantSortIndex.firstname === 0) {
          return a.firstname.localeCompare(b.firstname)
        } else {
          return b.firstname.localeCompare(a.firstname)
        }
      })
    },
    "participantSortIndex.birthday"() {
      this.group.participants.sort((a, b) => {
        if (this.participantSortIndex.birthday === 0) {
          return new Date(a.birthday) - new Date(b.birthday)
        } else {
          return new Date(b.birthday) - new Date(a.birthday)
        }
      })
    },
    "trainersSortIndex.lastname"() {
      this.group.trainers.sort((a, b) => {
        if (this.trainersSortIndex.lastname === 0) {
          return a.lastname.localeCompare(b.lastname)
        } else {
          return b.lastname.localeCompare(a.lastname)
        }
      })
    },
    "trainersSortIndex.firstname"() {
      this.group.trainers.sort((a, b) => {
        if (this.trainersSortIndex.firstname === 0) {
          return a.firstname.localeCompare(b.firstname)
        } else {
          return b.firstname.localeCompare(a.firstname)
        }
      })
    },
    "trainersSortIndex.role"() {
      this.group.trainers.sort((a, b) => {
        if (this.trainersSortIndex.role === 0) {
          return a.role.localeCompare(b.role)
        } else {
          return b.role.localeCompare(a.role)
        }
      })
    },
    async showAddParticipantModal(newVal) {
      if (newVal) {
        this.allMembers = await getAllMembers()
        this.allMembers.sort((a, b) => a.lastname.localeCompare(b.lastname))
      } else {
        this.selectedMembers = []
      }
    },
    async showAddTrainerModal(newVal) {
      if (newVal) {
        this.allUsers = await getAllUsers()
        this.allUsers.sort((a, b) => a.lastname.localeCompare(b.lastname))
      } else {
        this.selectedMembers = []
      }
    }
  },
  computed: {
    searchResult() {
      if (this.showAddParticipantModal) {
        if (this.searchString === '') {
          return this.allMembers
        } else {
          return this.allMembers.filter(m => m.firstname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || m.lastname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1)
        }
      } else if (this.showAddTrainerModal) {
        if (this.searchString === '') {
          return this.allUsers
        } else {
          return this.allUsers.filter(u => u.firstname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1 || u.lastname.toLowerCase().indexOf(this.searchString.toLowerCase()) > -1)
        }
      }
      return []
    }
  }
}
</script>
