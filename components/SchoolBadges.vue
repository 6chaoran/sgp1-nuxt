<template>
  <div class="flex flex-wrap gap-1.5">
    <UiBadge v-if="school.type_sap" variant="brand">SAP</UiBadge>
    <UiBadge v-if="school.type_gep" variant="brand">GEP</UiBadge>
    <UiBadge v-if="school['type_boys-only']" variant="info">Boys</UiBadge>
    <UiBadge v-if="school['type_girls-only']" variant="info">Girls</UiBadge>
    <UiBadge v-if="school.affiliations && school.affiliations !== '-'" variant="success">
      Affiliated
    </UiBadge>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  school: {
    type_sap?: boolean
    type_gep?: boolean
    'type_boys-only'?: boolean
    'type_girls-only'?: boolean
    affiliations?: string
  }
}>()
</script>
