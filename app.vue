<template>
  <div>
    <div>
      <TransitionRoot as="template" :show="sidebarOpen">
        <Dialog as="div" class="relative z-50 lg:hidden" @close="sidebarOpen = false">
          <TransitionChild as="template" enter="transition-opacity ease-linear duration-300" enter-from="opacity-0"
            enter-to="opacity-100" leave="transition-opacity ease-linear duration-300" leave-from="opacity-100"
            leave-to="opacity-0">
            <div class="fixed inset-0 bg-gray-900/80" />
          </TransitionChild>

          <div class="fixed inset-0 flex">
            <TransitionChild as="template" enter="transition ease-in-out duration-300 transform"
              enter-from="-translate-x-full" enter-to="translate-x-0"
              leave="transition ease-in-out duration-300 transform" leave-from="translate-x-0"
              leave-to="-translate-x-full">
              <DialogPanel class="relative mr-16 flex w-full max-w-xs flex-1">
                <TransitionChild as="template" enter="ease-in-out duration-300" enter-from="opacity-0"
                  enter-to="opacity-100" leave="ease-in-out duration-300" leave-from="opacity-100" leave-to="opacity-0">
                  <div class="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button type="button" class="-m-2.5 p-2.5" @click="sidebarOpen = false">
                      <span class="sr-only">Close sidebar</span>
                      <XMarkIcon class="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </TransitionChild>
                <!-- Sidebar component, swap this element with another sidebar if you like -->
                <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
                  <div class="flex h-16 shrink-0 items-center">
                    <img class="mt-3 h-16 w-auto rounded-full" :src="siteLogo" alt="Your Company" />
                  </div>
                  <nav class="flex flex-1 flex-col">
                    <ul role="list" class="flex flex-1 flex-col gap-y-7">
                      <li>
                        <ul role="list" class="-mx-2 space-y-1">
                          <li v-for="(item, idx) in navigation" :key="item.name">
                            <NuxtLink @click="updateCurrent(idx)" :to="item.href"
                              :class="[item.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-700', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                              <component :is="item.icon"
                                :class="[item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white', 'h-6 w-6 shrink-0']"
                                aria-hidden="true" />
                              {{ item.name }}
                            </NuxtLink>

                          </li>
                        </ul>
                      </li>
                      <li>
                        <div class="text-xs font-semibold leading-6 text-indigo-200">Quick links</div>
                        <ul role="list" class="-mx-2 mt-2 space-y-1">
                          <li v-for="team in qlinks" :key="team.name">
                            <NuxtLink :to="team.href" target="_blank"
                              :class="[team.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-700', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                              <span
                                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">{{
                                team.initial }}</span>
                              <span class="truncate">{{ team.name }}</span>
                              <v-tooltip v-if="team.description" activator="parent" location="bottom">{{
                                team.description }}</v-tooltip>
                            </NuxtLink>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <div class="text-xs font-semibold leading-6 text-indigo-200">Related Projects</div>
                        <ul role="list" class="-mx-2 mt-2 space-y-1">
                          <li v-for="team in projects" :key="team.name">
                            <NuxtLink :to="team.href" target="_blank"
                              :class="[team.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-700', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                              <span
                                class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">{{
                                team.initial }}</span>
                              <span class="truncate">{{ team.name }} <v-tooltip activator="parent" location="bottom">{{
                                  team.description }}</v-tooltip></span>
                              <v-tooltip v-if="team.description" activator="parent" location="bottom">
                                <span v-html="team.description"></span>
                              </v-tooltip>
                            </NuxtLink>
                          </li>
                        </ul>
                      </li>

                      <li class="mt-auto">
                        <NuxtLink to="https://www.buymeacoffee.com/chaoran" target="_blank"><img
                            src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=chaoran&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                            alt="buy me coffee banner" loading="lazy" /></NuxtLink>
                        <!-- <a href="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white">
                        <Cog6ToothIcon class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white" aria-hidden="true" />
                        Settings
                      </a> -->
                      </li>
                    </ul>
                  </nav>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </TransitionRoot>

      <!-- Static sidebar for desktop -->
      <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <!-- Sidebar component, swap this element with another sidebar if you like -->
        <div class="flex grow flex-col gap-y-5 overflow-y-auto bg-indigo-600 px-6 pb-4">
          <div class="flex h-16 shrink-0 items-center">
            <NuxtImg class="h-16 w-auto mt-3 rounded-full" :src="siteLogo" alt="Your Company" />
          </div>
          <nav class="flex flex-1 flex-col">
            <ul role="list" class="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" class="-mx-2 space-y-1">
                  <li v-for="item in navigation" :key="item.name">
                    <NuxtLink :to="item.href"
                      :class="[item.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-700', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                      <component :is="item.icon"
                        :class="[item.current ? 'text-white' : 'text-indigo-200 group-hover:text-white', 'h-6 w-6 shrink-0']"
                        aria-hidden="true" />
                      {{ item.name }}
                    </NuxtLink>
                  </li>
                </ul>
              </li>
              <li>
                <div class="text-xs font-semibold leading-6 text-indigo-200">Quick Links</div>
                <ul role="list" class="-mx-2 mt-2 space-y-1">
                  <li v-for="team in qlinks" :key="team.name">
                    <NuxtLink :href="team.href" target="_blank"
                      :class="[team.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-700', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                      <span
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">{{
                        team.initial }}</span>
                      <span class="truncate">{{ team.name }}</span>
                      <v-tooltip v-if="team.description" activator="parent" location="bottom">{{ team.description
                        }}</v-tooltip>
                    </NuxtLink>
                  </li>
                </ul>
              </li>

              <li>
                <div class="text-xs font-semibold leading-6 text-indigo-200">Related Projects</div>
                <ul role="list" class="-mx-2 mt-2 space-y-1">
                  <li v-for="team in projects" :key="team.name">
                    <NuxtLink :href="team.href" target="_blank"
                      :class="[team.current ? 'bg-indigo-700 text-white' : 'text-indigo-200 hover:text-white hover:bg-indigo-700', 'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold']">
                      <span
                        class="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-indigo-400 bg-indigo-500 text-[0.625rem] font-medium text-white">{{
                        team.initial }}</span>
                      <span class="truncate">{{ team.name }}</span>
                      <v-tooltip v-if="team.description" activator="parent" location="bottom">
                        <span v-html="team.description"></span>
                      </v-tooltip>
                    </NuxtLink>
                  </li>
                </ul>
              </li>

              <li class="mt-auto">
                <NuxtLink to="https://www.buymeacoffee.com/chaoran" target="_blank"><img
                    src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=chaoran&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
                    alt="buy me coffee banner" loading="lazy" /></NuxtLink>
                <!-- <NuxtLink to="#" class="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white">
                <Cog6ToothIcon class="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white" aria-hidden="true" />
                Settings
              </NuxtLink> -->
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div class="lg:pl-72">
        <div
          class="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button type="button" class="-m-2.5 p-2.5 text-gray-700 lg:hidden" @click="sidebarOpen = true">
            <span class="sr-only">Open sidebar</span>
            <Bars3Icon class="h-6 w-6" aria-hidden="true" />
          </button>

          <!-- Separator -->
          <div class="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />
          <h1 class="font-bold text-indigo-600">{{ siteTitle }}</h1>
          <span class="flex flex-wrap hidden sm:block">Singapore Primary 1 Planning Companion</span>
          <span class="flex flex-wrap block sm:hidden">Planning Companion</span>
          <v-spacer class="hidden sm:block"></v-spacer>
          <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
            <div class="flex items-center gap-x-4 lg:gap-x-6">
              <!-- <button type="button" class="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500">
              <span class="sr-only">View notifications</span>
              <BellIcon class="h-6 w-6" aria-hidden="true" />
            </button> -->

              <!-- Separator -->
              <div class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10" aria-hidden="true" />

              <!-- Profile dropdown -->
              <Menu as="div" class="relative ">
                <MenuButton class="-m-1.5 flex items-center p-1.5">
                  <span class="sr-only">Open user menu</span>
                  <img class="h-8 w-8 rounded-full bg-gray-50" :src="userAvatar" alt="" />
                  <span class="hidden lg:flex lg:items-center">
                    <span class="ml-4 text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">{{ userName
                      }}</span>
                    <ChevronDownIcon class="ml-2 h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </MenuButton>
                <transition enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95">
                  <MenuItems
                    class="absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                    <MenuItem v-for="item in userNavigation" :key="item.name" v-slot="{ active }">
                    <a :href="item.href"
                      :class="[active ? 'bg-gray-50' : '', 'block px-3 py-1 text-sm leading-6 text-gray-900']">{{
                      item.name }}</a>
                    </MenuItem>
                    <div class="flex justify-center my-3">
                      <NuxtImg src="/bmc_qr.png" sizes="120px" class="rounded-lg" loading="lazy"
                        alt="buy me coffee QR code"></NuxtImg>
                    </div>
                  </MenuItems>
                </transition>
              </Menu>
            </div>
          </div>
        </div>

        <main class="py-5">
          <div class="px-4 sm:px-6 lg:px-8">
            <!-- Your content -->
            <NuxtLoadingIndicator />
            <NuxtPwaManifest />
            <NuxtLayout>
              <NuxtPage />
            </NuxtLayout>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  Dialog,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon, MagnifyingGlassIcon } from '@heroicons/vue/20/solid'

const navigation = ref([
  { name: 'School List', href: '/', icon: HomeIcon, current: true },
  // { name: 'By Area', href: '/areas', icon: UsersIcon, current: false },
  // { name: 'Projects', href: '#', icon: FolderIcon, current: false },
  // { name: 'Calendar', href: '#', icon: CalendarIcon, current: false },
  // { name: 'Documents', href: '#', icon: DocumentDuplicateIcon, current: false },
  // { name: 'Reports', href: '#', icon: ChartPieIcon, current: false },
])

const qlinks = [
  {
    id: 1, name: 'MOE P1 registration process', href: 'https://www.moe.gov.sg/primary/p1-registration',
    initial: 'M', current: false
  },
  {
    id: 2, name: 'MOE P1 registration FAQ', href: 'https://www.moe.gov.sg/faq?categoryid=76037F9F568F46A7AA80EFDCE9AB23CD',
    initial: 'FAQ', current: false
  },
  // { id: 3, name: 'Workcation', href: '#', initial: 'W', current: false },
]

const projects = [
  {
    id: 1, name: 'SG Schooling', href: 'https://sgschooling.com/school/', initial: 'S', current: false,
    description: 'A useful website serve the similar purpose, <br>data source of the historical ballot result'
  },
]

const userNavigation = [
  { name: 'About me', href: 'https://www.ichaoran.com/about/' },
  { name: 'Other projects', href: 'https://www.ichaoran.com/projects/' },
  // { name: 'Sign out', href: '#' },
  { name: 'Sponsor me', href: 'https://www.buymeacoffee.com/chaoran' }
]

const updateCurrent = (idx) => {
  for (let i = 0; i < navigation.value.length; i++) {
    navigation.value[i].current = false
  }
  navigation.value[idx].current = true
  sidebarOpen.value = false
}

const siteTitle = 'SGP1'
const userName = 'Chaoran'
const userAvatar = '/unnamed.jpg'
const siteLogo = '/apple-icon-180x180.png' //'https://tailwindui.com/img/logos/mark.svg?color=white'
const sidebarOpen = ref(false)

</script>