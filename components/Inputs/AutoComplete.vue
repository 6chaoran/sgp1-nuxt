<template>
    <Combobox v-model="selected" as="div" nullable>
      <ComboboxLabel class="ui-label">{{ labelText }}</ComboboxLabel>
      <div class="relative mt-1.5">
        <div
          class="relative w-full cursor-default overflow-hidden rounded-md bg-neutral-0 text-left"
        >
          <ComboboxInput
            class="ui-control pr-11"
            :display-value="person => person?.name"
            @change="query = $event.target.value"
            placeholder="Type to search..."
          />
          <ComboboxButton
            class="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-md text-neutral-500 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
            aria-label="Toggle school suggestions"
          >
            <XCircleIcon
              v-if="selected !== null"
              class="h-5 w-5 cursor-pointer text-neutral-500"
              aria-hidden="true"
              @click="reset"
               />
            <ChevronDownIcon
              v-else
              class="h-5 w-5 text-neutral-500"
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
            class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-neutral-200 bg-neutral-0 py-1 text-base shadow-overlay focus:outline-none sm:text-sm"
          >
            <div
              v-if="filteredPeople.length === 0 && query !== ''"
              class="relative cursor-default select-none px-4 py-2.5 text-neutral-700"
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
                class="relative cursor-default select-none py-2.5 pl-3 pr-3 text-sm"
                :class="{
                  'bg-brand-600 text-white': active,
                  'text-neutral-900': !active,
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
                  :class="{ 'text-white': active, 'text-brand-600 dark:text-brand-400': !active }"
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
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxLabel,
  ComboboxOption,
  ComboboxOptions,
  TransitionRoot,
} from '@headlessui/vue'
import { CheckIcon, ChevronDownIcon, XCircleIcon } from '@heroicons/vue/20/solid'
import { computed, ref } from 'vue'
const props = defineProps({
  // schoolList: Array
  labelText: String,
  schools: {
    type: Array,
    default: () => [{ id: 1, name: null }],
  },
})

const reset = () => {
  selected.value = null
  query.value = ''
  emit('update:selectedSchool', null)
}

const emit = defineEmits(['update:selectedSchool'])

const selected = ref(null)
const query = ref('')

const filteredPeople = computed(() =>
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
