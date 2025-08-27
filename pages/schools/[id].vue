<template>
  <SchoolProfile :profile="profile" :items="items" />
  <div class="mt-4 sm:mt-0 sm:flex-none sm:w-1/6">
    <InputsSelectMenu label-text="Year" :choices="yearChoices" :selected="selectedYear" v-model="selectedYear" />
  </div>
  <BallotHistory :ballotHistoryData="ballot" :year="selectedYear.name"/>
  <ReviewModal :school-id="id" :reviews="reviews"/>
</template>
  
<script setup>
import { useAppStore } from '~/stores/app';
import { ref as dbRef, get } from 'firebase/database';
import { useDatabase, useDatabaseList, useDatabaseObject } from 'vuefire'

const route = useRoute();
const id = route.params.id;

const appStore = useAppStore()

const selectedYear = computed({
  get: () => appStore.selectedYear,
  set: (value) => {
    appStore.updateSelectedYear(value.name)
  }
})


const db = useDatabase()
const ballot = useDatabaseObject(dbRef(db, `application_odds/${id}`))
const profile = useDatabaseObject(dbRef(db, `school_profile/${id}`))
const reviews = useDatabaseList(dbRef(db, `school_review/${id}`))
const allYears = computed(() =>  ballot.value ? Object.keys(ballot.value).sort().reverse() : [])
const yearChoices = computed(() => allYears.value?.map(x => Object({ name: x })))

const items = computed(() => {
  return [
    {
      title: 'School List',
      disabled: false,
      href: '/',
    },
    {
      title: profile.value?.area,
      disabled: false,
      href: `/area/${profile.value?.area}`,
    }
  ]
})

</script>