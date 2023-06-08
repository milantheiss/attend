<template>
    <div>
        <CollapsibleContainer class="bg-white p-3.5 md:px-7 rounded-xl drop-shadow-md">

            <template #header>
                <div class="flex flex-col w-full">
                    <p class="font-medium">{{ types.find(t => t.tag === issue.tag).title }}</p>
                    <p class="text-light-gray">{{ new Date(issue.date).toLocaleString('de-DE', {
                        year: 'numeric', month:
                            '2-digit', day: '2-digit', timeZone: "CET", hour: '2-digit', minute: '2-digit'
                    })
                    }}</p>
                </div>
            </template>

            <template #content>
                <div class="flex flex-col gap-4">
                    <div class="cursor-text w-full whitespace-normal" v-html="$resolveMarkdown(issue.message)"></div>

                    <select v-model="command"
                        class="w-full focus:ring-0 focus:border-standard-gradient-1 border-0 py-[4px] rounded-xl bg-[#D1D5DB] font-medium text-lg md:text-xl">
                        <option value="" disabled hidden class="bg-white">Aktion auswählen...</option>
                        <option v-for="action in types.find(t => t.tag === issue.tag).actions" :value="action.command"
                            :key="action.tag" class="bg-white">
                            {{ action.title }}</option>
                    </select>

                    <StandardButton @click="resolveIssue()" v-if="command !== ''">
                        <p class="">Ausführen</p>
                    </StandardButton>
                </div>
            </template>

        </CollapsibleContainer>
    </div>
</template>
<script>
import CollapsibleContainer from './CollapsibleContainer.vue';
import StandardButton from './StandardButton.vue';
import { resolveIssue } from "@/util/fetchOperations";

export default {
    name: "IssueCard",

    props: {
        issue: {
            type: Object,
            required: true,
            default() {
                return {
                    _id: "",
                    tag: "",
                    date: "",
                    message: "",
                    body: {}
                }
            }
        }
    },

    data() {
        return {
            //INFO Neue Issue Typen mussen in types definiert werden.
            types: [
                {
                    tag: "duplicateMemberInDB",
                    title: "Doppelter Mitgliedereintrag",
                    actions: [
                        {
                            command: "merge",
                            title: "Einträge zusammenführen"
                        },
                        {
                            command: "keepBoth",
                            title: "Beide Einträge behalten"
                        }
                    ]
                },
                {
                    tag: "newMemberCreated",
                    title: "Neuer Mitgliedereintrag",
                    actions: [
                        {
                            command: "keep",
                            title: "Eintrag behalten"
                        },
                        {
                            command: "delete",
                            title: "Einträge löschen"
                        }
                    ]
                }
            ],
            command: ""
        }
    },

    methods: {
        async resolveIssue() {
            //Je nach Command wird im Backend die entsprechende Aktion ausgeführt, um das Issue zu lösen
            await resolveIssue(this.issue._id, this.command)
            this.$emit("resolved")
        }
    },

    components: {
        CollapsibleContainer,
        StandardButton
    },

    emits: ["resolved"]
}
</script>
<style scoped>
option:checked,
option:hover,
option::selection {
    color: white;
    background: #5864e0;
}
</style>   