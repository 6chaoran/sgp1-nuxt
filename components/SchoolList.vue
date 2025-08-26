<template>
    <div>
        <h2 class="font-semibold text-indigo-600">Intro
            <span><v-icon :class="['transition', showIntro ? '' : 'rotate-180']" icon="mdi-chevron-double-down"
                    color="indigo-600" size="20px" @click="showIntro = !showIntro"></v-icon></span>
        </h2>
        <div v-show="showIntro" class="text-sm">
            <p> I know, I know "every primary school is a good school", but kiasu parents still cautiously plan their
                strategies
                for their little ones' primary one registration.
                Some quetisons are appareantly brother the parents.
                Shall I join the parent voluneer program now to secure the 2B round ?
                Shall I move to another district that is less competitive in P1 application? </p>
            <p>I hope this is the tool, that should provide some number insights to help with your important decisions.
                Lastly,
                may your kid goes to the dream school, as you wish!</p>

        </div>

    </div>
    <v-divider class="my-3"></v-divider>
    <div class="flex flex-row space-x-1">
        <div class="w-1/2 sm:w-1/2">
            <InputsSelectMenu label-text="Area" :choices="areaChoices" :selected="selected.area"
                v-model="selected.area" />
        </div>
        <div class="w-1/6 sm:w-1/6">
            <InputsSelectMenu label-text="SAP" :choices="sapChoices" :selected="selected.sap" v-model="selected.sap" />
        </div>
        <div class="w-1/6  sm:w-1/6">
            <InputsSelectMenu label-text="GEP" :choices="gepChoices" :selected="selected.gep" v-model="selected.gep" />
        </div>
        <div class="w-1/6  sm:w-1/10 sm:block">
            <InputsSelectMenu label-text="Affil." :choices="affilChoices" :selected="selected.affil"
                v-model="selected.affil" />
        </div>
    </div>

    <div class="flex flex-row space-x-1 mt-6">
        <div class="w-3/4 sm:w-3/4 ">
            <InputsAutoComplete label-text="School Filter"
            :schools="schoolsForDisplay" @update:selected-school="updateSchoolFilter" />
        </div>
        <div class="w-1/4 sm:w-1/4">
            <InputsSelectMenu label-text="Target Phase" :choices="phaseChoices" :selected="selected.phase"
                v-model="selected.phase" />
        </div>
    </div>

    <div class="mt-3 ml-1">
        {{ schoolsForDisplay.length }} schools are selected
    </div>
    <ul role="list" class="divide-y divide-gray-100">
        <li v-for="school in schoolsForDisplay" :key="school.sid" class="relative flex justify-between gap-x-6 py-5">
            <div class="flex gap-x-4">
                <img class="h-12 w-12 flex-none rounded-full bg-gray-50" loading="lazy" width="48px" height="48px"
                    :src="school.logo_url2 ? '/school_logo/' + school.logo_url2 : school.logo_url"
                    :alt="'logo of ' + school.name" />
                <div class="min-w-0 flex-auto">
                    <p class="text-sm font-semibold leading-6 text-gray-900">
                        <a :href="`/schools/${school.sid}`">
                            <span class="absolute inset-x-0 -top-px bottom-0" />
                            {{ school.name }}
                        </a>
                        <br></br>
                        <span v-if="school['type_gep']"
                            class="inline-flex items-center rounded-full bg-purple-50 mx-2 px-2 py-1 text-xs font-medium text-purple-600 ring-1 ring-inset ring-purple-500/10">
                            GEP
                        </span>
                        <span v-if="school.type_sap"
                            class="inline-flex items-center rounded-full bg-purple-50 mx-2 px-2 py-1 text-xs font-medium text-purple-600 ring-1 ring-inset ring-purple-500/10">
                            SAP
                        </span>
                        <span v-if="school['type_girls-only']"
                            class="inline-flex items-center rounded-full bg-pink-50 mx-2 px-2 py-1 text-xs font-medium text-pink-600 ring-1 ring-inset ring-pink-500/10">
                            Girls
                        </span>
                        <span v-if="school['type_boys-only']"
                            class="inline-flex items-center rounded-full bg-blue-50 mx-2 px-2 py-1 text-xs font-medium text-blue-600 ring-1 ring-inset ring-blue-500/10">
                            Boys
                        </span>
                        <span v-if="school['affiliations'] != '-'"
                            class="inline-flex items-center rounded-full bg-blue-50 mx-2 px-2 py-1 text-xs font-medium text-green-600 ring-1 ring-inset ring-green-500/10">
                            Affil.
                        </span>
                    </p>
                    <div class="mt-1 flex items-center gap-x-1.5">
                        <div class="flex-none rounded-full bg-emerald-500/20 p-1">
                            <div class="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        </div>
                        <p class="text-xs leading-5 text-gray-500">{{ school.area }} |</p>
                        <div class="flex items-center">
                            <svg class="w-4 h-4 text-yellow-300 me-1" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 22 20">
                                <path
                                    d="M20.924 7.625a1.523 1.523 0 0 0-1.238-1.044l-5.051-.734-2.259-4.577a1.534 1.534 0 0 0-2.752 0L7.365 5.847l-5.051.734A1.535 1.535 0 0 0 1.463 9.2l3.656 3.563-.863 5.031a1.532 1.532 0 0 0 2.226 1.616L11 17.033l4.518 2.375a1.534 1.534 0 0 0 2.226-1.617l-.863-5.03L20.537 9.2a1.523 1.523 0 0 0 .387-1.575Z" />
                            </svg>
                            <!-- rating -->
                            <p class="text-xs text-gray-500 ">{{ Number(school.review_rating_avg) ?
                                school.review_rating_avg.toFixed(2) : 'N/A' }}</p>
                        </div>
                        <div class="flex items-center">
                        <p class="text-xs leading-5 text-gray-500">  |  </p>
                        <ReceiptPercentIcon class="h-4 w-4 text-indigo-600 me-1 ml-1" /> 
                            <p class="text-xs leading-5 text-gray-500 -ml-1">  
                        odds({{ selected.phase.name }}): {{ school.odds?.[selected.phase.name] ?
                            (school.odds[selected.phase.name] * 100).toFixed(0) : 'N/A' }}%</p>
                        </div>



                    </div>
                    <p class="mt-1 flex text-xs leading-5 text-gray-500">
                        {{ school.address }}
                    </p>
                </div>
            </div>
            <div class="flex items-center gap-x-4">
                <ChevronRightIcon class="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
            </div>
        </li>
    </ul>
</template>
<script setup>

import { ChevronRightIcon } from '@heroicons/vue/20/solid'
import { ReceiptPercentIcon } from '@heroicons/vue/20/solid'

import { getAffilList } from '../utils/selectionChoices'

const props = defineProps({
    selectedArea: {
        type: String,
        default: 'All'
    }
})

const sapChoices = getSapList()
const gepChoices = getGepList()
const areaChoices = getAreaList()
const affilChoices = getAffilList()
const phaseChoices = [{ name: '2A' }, { name: '2B' }, { name: '2C' }, { name: '2C(S)' }]

const data = ref(null)

import { ref as dbRef } from 'firebase/database'
import { useDatabase, useDatabaseList } from 'vuefire'

const db = useDatabase()
const schoolsFull = useDatabaseList(dbRef(db, 'school_profile'))
const schools = computed(() => schoolsFull.value.filter(x => x.odds && x.sid))

const showIntro = ref(false)
const selected = ref({
    area: { name: props.selectedArea },
    sap: { name: 'All' },
    gep: { name: 'All' },
    affil: { name: 'All' },
    school: null,
    phase: { name: '2C' },
})

const updateSchoolFilter = (school) => {
    selected.value.school = school;
    console.log('Selected school updated to:', selected.value.school);
};

const schoolsForDisplay = computed(() => {
    const area = selected.value.area.name
    const sap = selected.value.sap.name
    const gep = selected.value.gep.name
    const affil = selected.value.affil.name
    const school = selected.value.school
    let filtered = schools.value
    if (area === 'All') {
        // filtered = schools.value
    } else {
        filtered = schools.value.filter((x) => x.area === area)
    }

    if (sap === true) {
        filtered = filtered.filter((x) => x.type_sap)
    } else if (sap === false) {
        filtered = filtered.filter((x) => !x.type_sap)
    } else {

    }

    if (gep === true) {
        filtered = filtered.filter((x) => x.type_gep)
    } else if (gep === false) {
        filtered = filtered.filter((x) => !x.type_sap)
    } else {

    }

    if (affil === true) {
        filtered = filtered.filter((x) => x.affiliations != '-')
    } else if (affil === false) {
        filtered = filtered.filter((x) => x.affiliations == '-')
    } else {

    }

    if (school) {
        filtered = schools.value.filter((x) => x.name === school)
    }
    return filtered

})
</script>