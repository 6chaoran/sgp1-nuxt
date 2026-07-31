<template>
  <SchoolList :selected-area="area" />
</template>

<script setup>
const route = useRoute()
const area = computed(() => String(route.params.area))

useSeoMeta({
  title: computed(() => `Primary schools in ${area.value}`),
  description: computed(() => `Explore historical Primary 1 ballot information for primary schools in ${area.value}, Singapore.`),
  ogTitle: computed(() => `Primary schools in ${area.value} | SGP1`),
  ogDescription: computed(() => `Review historical Primary 1 registration outcomes for schools in ${area.value}.`),
})
</script>
