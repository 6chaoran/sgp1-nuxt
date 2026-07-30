<template>
    <Listbox as="div" v-model="selected">
      <ListboxLabel class="ui-label">{{ labelText }}</ListboxLabel>
      <div class="relative mt-1.5">
        <ListboxButton
          class="ui-control relative cursor-default py-2.5 pl-3 pr-10 text-left"
        >
          <span class="block truncate capitalize text-sm">{{ mapBoolean(selected.name) }}</span>
          <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <ChevronUpDownIcon class="h-5 w-5 text-neutral-500" aria-hidden="true" />
          </span>
        </ListboxButton>
  
        <transition leave-active-class="transition ease-in duration-100" leave-from-class="opacity-100" leave-to-class="opacity-0">
          <ListboxOptions class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-neutral-200 bg-neutral-0 py-1 text-base shadow-overlay focus:outline-none sm:text-sm">
            <ListboxOption as="template" v-for="(person, id) in choices" :key="id" :value="person" v-slot="{ active, selected }">
              <li :class="[active ? 'bg-brand-600 text-white' : 'text-neutral-900', 'relative cursor-default select-none py-2.5 pl-3 pr-5']">
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate capitalize text-sm']">{{ mapBoolean(person.name) }}</span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </template>
  
  <script setup>
  import { Listbox, ListboxButton, ListboxLabel, ListboxOption, ListboxOptions } from '@headlessui/vue'
  import { ChevronUpDownIcon } from '@heroicons/vue/20/solid'
  import { ref } from 'vue'

  const props = defineProps({
    labelText: String,
    choices: Array,
    selected: Object,
  })

  const mapBoolean = (x) => {
    if ( x === true ) {
      return 'Yes'
    } else if ( x === false) {
      return 'No'
    } else {
      return x
    }
  }
  
  const selected = ref(props.selected)

  </script>
