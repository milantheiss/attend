<template>
  <div>
    <div class="container mx-auto flex flex-col gap-4">

      <!-- Header mit Neuer M Button & Search Bar -->

      <div class="flex flex-col gap-4 px-3.5 md:px-7">
        <div class="flex gap-4 justify-end items-center ">

          <!-- Button callapset wenn Screen zu klein wird. Es wird nur noch + Icon gezeigt -->

          <StandardButton @click="$refs.newMemberModal.open()" class="hidden ty:flex">
            <p class="font-base md:text-lg">Neues Mitglied</p>
          </StandardButton>
          <button @click="$refs.newMemberModal.open()"
            class="flex ty:hidden justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md w-fit h-fit p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"
              class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>

          <!-- Toggle Search Bar -->

          <button @click="showSearchBar = !showSearchBar"
            class="flex justify-center items-center text-white bg-gradient-to-br from-standard-gradient-1 to-standard-gradient-2 rounded-full drop-shadow-md w-fit h-fit p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
              stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

        </div>

        <!-- Searchbar -->

        <transition enter-active-class="transition ease-linear duration-200" enter-from-class="-translate-y-9"
          enter-to-class="translate-y-0" leave-active-class="transition ease-linear duration-200"
          leave-from-class="translate-y-0" leave-to-class="-translate-y-9">
          <div class="flex items-center gap-4" v-show="showSearchBar">
            <TextInput name="searchbar" placeholder="Suche..." v-model="searchString"></TextInput>
            <!-- X Icon entweder clear searchString oder schließt Searchbar, wenn searchString leer -->
            <div class="px-3.5 py-3.5"
              @click="() => { if (searchString === '') showSearchBar = false; searchString = ''; }">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5"
                stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
        </transition>
      </div>

      <!-- Box mit allen Mitglieder -->

      <div class="bg-white px-3.5 md:px-7 py-4 rounded-xl drop-shadow-md flex flex-col">
        <div class="h-fit max-h-[60vh] overflow-y-auto block">
          <table class="table-auto w-full text-left">

            <!-- Tabellen Header ist sticky -->
            <thead class="sticky top-0 border-b border-[#D1D5DB] bg-white">
              <tr>

                <th scope="col" class="w-[142px] md:w-[152px] pb-2.5 font-medium"
                  @click="indexSort.lastname = (indexSort.lastname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="indexSort.lastname"></SortIcon>
                    Name
                  </span>
                </th>

                <th scope="col" class="w-[142px] md:w-[152px] px-3 md:px-4 pb-2.5 font-medium"
                  @click="indexSort.firstname = (indexSort.firstname + 1) % 2">
                  <span class="flex items-center gap-1">
                    <SortIcon :index="indexSort.firstname"></SortIcon>
                    Vorname
                  </span>
                </th>

                <th scope="col" class="hidden sm:table-cell pb-2.5 font-medium"
                  @click="indexSort.birthday = (indexSort.birthday + 1) % 2">
                  <span class="hidden md:flex items-center gap-1 ">
                    <SortIcon :index="indexSort.birthday"></SortIcon>
                    Geburtstag
                  </span>
                  <span class="flex md:hidden items-center gap-1 ">
                    <SortIcon :index="indexSort.birthday"></SortIcon>
                    Geb.
                  </span>
                </th>

                <!-- Spalte für Pfeil -->
                <th scope="col" class="pb-2.5 font-medium w-full"></th>

              </tr>
            </thead>

            <tbody class="overscroll-y-scroll">
              <tr v-for="member in searchResults" :key="member._id" @click="openEditMember(member._id)"
                class="border-b border-[#E5E7EB] last:border-0 cursor-pointer group">

                <!--Lastname-->
                <td class="truncate py-2.5 group-last:pt-2.5 group-last:pb-0 w-fit text-base sm:text-lg md:text-xl">
                  <p class="">{{ member.lastname }}</p>
                </td>

                <!--Firstname-->
                <td class="px-3 md:px-4 w-fit py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="">{{ member.firstname }}</p>
                </td>

                <!--Birthday-->
                <td class="hidden sm:table-cell py-2.5 group-last:pt-2.5 group-last:pb-0 text-base sm:text-lg md:text-xl">
                  <p class="text-light-gray">{{
                    new Date(member.birthday).toLocaleDateString('de-DE', {
                      year: '2-digit', month:
                        '2-digit', day: '2-digit'
                    })
                  }}</p>
                </td>

                <!--Arrow Right-->
                <td class="py-2.5 group-last:pt-2.5 group-last:pb-0 w-full justify-items-end">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3"
                    stroke="currentColor" class="w-7 md:w-8 h-7 md:h-8 ml-auto">
                    <path stroke-linecap="round" stroke-linejoin="round"
                      d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75" />
                  </svg>
                </td>

              </tr>
            </tbody>
          </table>

          <!-- Wenn keine Mitglieder gefunden werden -->
          <p v-show="typeof searchResults === 'undefined' || searchResults?.length === 0"
            class="font-medium text-gray-500 text-center pt-2.5">Keine Mitglieder gefunden</p>
        </div>
      </div>
    </div>

    <!-- Create Member Modal -->
    <MemberModal ref="newMemberModal" @onClose="getAllMembers" type="new"></MemberModal>

    <!-- Edit Member Modal -->
    <MemberModal ref="editMemberModal" @onClose="getAllMembers" type="edit"></MemberModal>
  </div>
</template>
  
<script>
import { getAllMembers, getGroupName } from '@/util/fetchOperations'
import _ from "lodash"
import { useDataStore } from "@/store/dataStore";
import SortIcon from "@/components/SortIcon.vue";
import TextInput from "@/components/TextInput.vue";
import MemberModal from '@/components/MemberModal.vue';
import StandardButton from '@/components/StandardButton.vue';

export default {
  name: "EditMembersView",

  setup() {
    const dataStore = useDataStore()
    return {
      dataStore
    }
  },

  data() {
    return {
      allMembers: [],
      indexSort: {
        lastname: 0,
        firstname: 0,
        birthday: 0
      },
      sortKey: 'lastname',
      showSearchBar: false,
      searchString: ''
    }
  },

  components: {
    SortIcon,
    TextInput,
    MemberModal,
    StandardButton
  },

  methods: {
    async openEditMember(id) {
      //Deep Copy, damit Änderungen nicht direkt übernommen werden
      const editMember = _.cloneDeep(this.allMembers.find(m => m._id === id))

      editMember.birthday = editMember.birthday.slice(0, 10)

      editMember.groups = await Promise.all(editMember.groups.map(async g => getGroupName(g)))

      this.$refs.editMemberModal.open(editMember)
    },

    async getAllMembers() {
      this.allMembers = await getAllMembers()
    },

    searchFilter(member, searchString) {
      //Suchfilter für Geburtstag
      //Wenn der Suchstring nur aus Zahlen, Punkten, Schrägstrichen oder Bindestrichen besteht, wird der Suchstring als Datum interpretiert
      if (/^[0-9./-]*$/.test(searchString)) {
        //Splitte searchString an Punkt, Schrägstrich oder Bindestrich
        //Regex für Punkt, Schrägstrich oder Bindestrich
        const dateString = searchString.split(/\.|\/|-/).filter(s => s !== '')

        //Wenn der Suchstring aus 1-3 Teilen besteht, wird nach Tag, Monat und Jahr gesucht, ansonsten wird nicht weiter im Geburtstag gesucht
        if (dateString.length <= 3) {
          //Wenn der searchString aus 3 Teilen besteht, wird nach einem genauem Datum gesucht (DD, MM, YY oder YYYY)
          if (dateString.length === 3) {
            return new Date(member.birthday).getDate() === parseInt(dateString[0])
              && new Date(member.birthday).getMonth() + 1 === parseInt(dateString[1])
              && (new Date(member.birthday).getFullYear().toString().slice(2, 4) === dateString[2]
                || new Date(member.birthday).getFullYear() === parseInt(dateString[2]))
          }
          //Wenn der searchString aus 2 Teilen besteht, wird nach einem Datum (DD, MM) oder Monat und Jahr gesucht (MM, YY oder YYYY)
          if (dateString.length === 2) {
            return new Date(member.birthday).getDate() === parseInt(dateString[0]) && new Date(member.birthday).getMonth() + 1 === parseInt(dateString[1])
              || new Date(member.birthday).getMonth() + 1 === parseInt(dateString[0])
              && (new Date(member.birthday).getFullYear() === parseInt(dateString[1]) || new Date(member.birthday).getFullYear().toString().slice(2, 4) === dateString[1])
          }

          //Wenn der searchString aus 1 Teil besteht, wird nach einem Monatstag (DD), Monat (MM), Jahr gesucht (Wird mit String verglichen, dass Suchen besser aussieht)
          if (dateString.length === 1) {
            return new Date(member.birthday).getDate() === parseInt(dateString[0]) || new Date(member.birthday).getMonth() + 1 === parseInt(dateString[0])
              || new Date(member.birthday).getFullYear().toString().indexOf(dateString[0]) > -1
          }
        }
      }

      //Sucht in Vorname, Nachname, dem Monat des Geburtstags oder gibt true zurück, wenn der Suchstring leer ist	
      return member.firstname.toLowerCase().indexOf(searchString.toLowerCase()) > -1 || member.lastname.toLowerCase().indexOf(searchString.toLowerCase()) > -1 || searchString.trim().length === 0 || new Date(member.birthday).toLocaleString('de-DE', { month: 'long' }).toLowerCase().indexOf(searchString.toLowerCase()) > -1
    }
  },

  async created() {
    document.title = 'Mitglieder bearbeiten - Attend'
    this.dataStore.viewname = "Mitglieder bearbeiten"
  },

  async mounted() {
    await this.getAllMembers()
  },

  watch: {
    "indexSort.lastname"() {
      this.sortKey = 'lastname'
    },

    "indexSort.firstname"() {
      this.sortKey = 'firstname'
    },

    "indexSort.birthday"() {
      this.sortKey = 'birthday'
    },
  },

  computed: {
    searchResults() {
      //Filtert die Teilnehmer nach dem Suchstring bzw. wenn der Suchstring leer ist, wird die Liste ungefiltert zurückgegeben
      const arr = this.allMembers.filter(member => this.searchFilter(member, this.searchString)).sort((a, b) => {
        //Sortiert die Teilnehmer nach dem SortKey
        if (this.sortKey === "birthday") return new Date(a.birthday) - new Date(b.birthday);
        return a[this.sortKey].localeCompare(b[this.sortKey])
      })
      //Wenn der indexSort des SortKeys 1 ist, wird die Liste umgedreht
      return this.indexSort[this.sortKey] === 1 ? arr.reverse() : arr
    }
  }
}
</script>
