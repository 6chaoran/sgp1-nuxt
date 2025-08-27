<template>
    <Combobox v-model="selected" as="div" nullable >
      <ComboboxLabel class="block text-sm font-medium leading-6 text-gray-900">{{ labelText }}</ComboboxLabel>
      <div class="relative mt-1 shadow-md">
        <div
          class="relative w-full cursor-default overflow-hidden rounded-md bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-300 sm:text-sm"
        >
          <ComboboxInput
            class="w-full border border-gray-300 py-1.5 pl-3 pr-10 text-sm text-gray-900 rounded-lg focus:border-indigo-500 focus:ring-indigo-500"
            :displayValue="(person) => person?.name"
            @change="query = $event.target.value"
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex items-center pr-2 leading-6"
          >
            <ChevronDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </ComboboxButton>
        </div>
        <TransitionRoot
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          @after-leave="query = ''"
        >
          <ComboboxOptions
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-gray-200 focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredPeople.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-1.5 text-gray-700"
            >
              Nothing found.
            </div>

            <ComboboxOption
              v-for="person in filteredPeople"
              as="template"
              :key="person.id"
              :value="person"
              v-slot="{ selected, active }"
              @click="$emit('update:selectedSchool', person.name)"
            >
              <li
                class="relative cursor-default select-none py-1.5 pl-4 pr-4"
                :class="{
                  'bg-indigo-600 text-white': active,
                  'text-gray-900': !active,
                }"
              >
                <span
                  class="block truncate"
                  :class="{ 'font-medium': selected, 'font-normal': !selected }"
                >
                  {{ person?.name }}
                </span>
                <span
                  v-if="selected"
                  class="absolute inset-y-0 left-0 flex items-center pl-3"
                  :class="{ 'text-white': active, 'text-indigo-600': !active }"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </TransitionRoot>
      </div>
    </Combobox>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Combobox,
  ComboboxInput,
  ComboboxButton,
  ComboboxOptions,
  ComboboxOption,
  TransitionRoot,
  ComboboxLabel,
} from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon, ChevronDownIcon } from '@heroicons/vue/20/solid'
const props = defineProps({
  // schoolList: Array
  labelText: String,
  schools: {
    type: Array,
    default: [{ id: 1, name: null}]
  }
})

const emit = defineEmits(['update:selectedSchool'])

let selected = ref(null)
let query = ref('')

let filteredPeople = computed(() =>
  query.value === ''
    ? props.schools
    : props.schools.filter((person) =>
        person?.name
          .toLowerCase()
          // .replace(/\s+/g, '')
          .includes(query.value.toLowerCase())
      )
)
</script>
