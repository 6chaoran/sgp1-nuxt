<template>
  <SchoolList :selectedArea="area" />
</template>
<script setup>
const route = useRoute();
const area = route.params.area;
</script>
