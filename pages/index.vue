<template>  
  <SchoolList />
</template>

<script setup>
useHead({
  title: 'SGP1 | P1 school selection companion',
  htmlAttrs: { lang: 'en' },
  link: [{ rel: 'canonical', href: 'https://sgp1.ichaoran.com' }],
  meta: [
    {
      name: 'description',
      content: 'The Singapore primary school selection companion for the kaisu parents ...'
    },
    { property: 'og:title', content: 'SGP1' },
    { property: 'og:description', content: 'The Singapore primary school selection companion for the kiasu parents ...' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://sgp1.ichaoran.com' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:image', content: '/social.jfif' },
  ],
});

</script>