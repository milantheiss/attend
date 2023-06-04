<template>
    <!--Selector Day-->
    <select v-model="day" class="block md:hidden" :class="style">
        <option value="Montag">Mo.</option>
        <option value="Dienstag">Di.</option>
        <option value="Mittwoch">Mi.</option>
        <option value="Donnerstag">Do.</option>
        <option value="Freitag">Fr.</option>
        <option value="Samstag">Sa.</option>
        <option value="Sonntag">So.</option>
    </select>
    <select v-model="day" class="hidden md:block" :class="style">
        <option value="Montag">Montag</option>
        <option value="Dienstag">Dienstag</option>
        <option value="Mittwoch">Mittwoch</option>
        <option value="Donnerstag">Donnerstag</option>
        <option value="Freitag">Freitag</option>
        <option value="Samstag">Samstag</option>
        <option value="Sonntag">Sonntag</option>
    </select>
</template>
<script>
export default {
    data() {
        return {
            day: "",
            style: "w-fit focus:ring-0 focus:border-standard-gradient-1 bg-inherit border-2 border-[#9ea3ae] rounded-2xl text-base md:text-lg font-medium "
        }
    },
    props: {
        modelValue: String
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                this.day = value;
            }
        },
        day(value) {
            this.$emit('update:modelValue', value);
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
</style>