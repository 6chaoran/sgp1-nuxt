<template>
  <div class="min-h-screen bg-neutral-50">
    <a
      href="#main-content"
      class="fixed left-4 top-4 z-[60] -translate-y-24 rounded-md bg-brand-700 px-4 py-3 text-sm font-semibold text-white shadow-overlay transition-transform focus:translate-y-0"
    >
      Skip to main content
    </a>

    <header class="sticky top-0 z-40 border-b border-neutral-200 bg-neutral-0/95 backdrop-blur">
      <UiContainer class="flex h-16 items-center justify-between gap-4">
        <div class="flex min-w-0 items-center gap-3">
          <NuxtLink
            to="/"
            class="flex min-h-11 shrink-0 items-center gap-2.5 rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
            aria-label="SGP1 school research home"
          >
            <NuxtImg
              :src="siteLogo"
              width="36"
              height="36"
              class="h-9 w-9 rounded-full"
              alt="SGP1 logo"
            />
            <span class="text-lg font-bold tracking-tight text-brand-700 dark:text-brand-300">SGP1</span>
          </NuxtLink>
          <span class="hidden h-5 w-px bg-neutral-200 sm:block" aria-hidden="true" />
          <p class="hidden truncate text-sm font-medium text-neutral-700 sm:block">
            Singapore Primary 1 Planning Companion
          </p>
        </div>

        <div class="flex items-center gap-1">
          <nav class="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            <NuxtLink
              to="/"
              :class="desktopNavClasses(isResearchRoute)"
              :aria-current="isResearchRoute ? 'page' : undefined"
            >
              <MagnifyingGlassIcon class="h-4 w-4" aria-hidden="true" />
              School research
            </NuxtLink>

            <Menu as="div" class="relative">
              <MenuButton :class="desktopNavClasses(false)">
                Resources
                <ChevronDownIcon class="h-4 w-4" aria-hidden="true" />
              </MenuButton>
              <transition
                enter-active-class="transition duration-fast ease-product"
                enter-from-class="translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-fast ease-product"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-1 opacity-0"
              >
                <MenuItems
                  class="absolute right-0 mt-2 w-72 origin-top-right rounded-lg border border-neutral-200 bg-neutral-0 p-2 shadow-overlay focus:outline-none"
                >
                  <MenuItem
                    v-for="item in secondaryLinks"
                    :key="item.name"
                    v-slot="{ active }"
                  >
                    <a
                      :href="item.href"
                      target="_blank"
                      rel="noopener noreferrer"
                      :class="[
                        'flex items-start gap-3 rounded-md px-3 py-2.5 text-sm',
                        active ? 'bg-brand-50 text-brand-900 dark:bg-brand-950 dark:text-brand-100' : 'text-neutral-700',
                      ]"
                    >
                      <component :is="item.icon" class="mt-0.5 h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                      <span>
                        <span class="block font-semibold">{{ item.name }}</span>
                        <span class="mt-0.5 block text-xs leading-5 text-neutral-500">{{ item.description }}</span>
                      </span>
                    </a>
                  </MenuItem>
                </MenuItems>
              </transition>
            </Menu>

            <button type="button" :class="desktopNavClasses(false)" @click="openAbout">
              <QuestionMarkCircleIcon class="h-4 w-4" aria-hidden="true" />
              About
            </button>

            <a
              href="https://www.buymeacoffee.com/chaoran"
              target="_blank"
              rel="noopener noreferrer"
              class="ml-1 inline-flex min-h-11 items-center rounded-md bg-brand-600 px-3.5 text-sm font-semibold text-white shadow-control transition-colors duration-fast ease-product hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
            >
              Support SGP1
            </a>
          </nav>

          <Menu as="div" class="relative">
            <MenuButton
              class="inline-flex h-11 w-11 items-center justify-center rounded-md border border-neutral-300 bg-neutral-0 text-neutral-700 shadow-control transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
              :aria-label="themeButtonLabel"
              :title="themeButtonLabel"
            >
              <MoonIcon v-if="isDarkTheme" class="h-5 w-5" aria-hidden="true" />
              <SunIcon v-else class="h-5 w-5" aria-hidden="true" />
            </MenuButton>
            <transition
              enter-active-class="transition duration-fast ease-product"
              enter-from-class="translate-y-1 opacity-0"
              enter-to-class="translate-y-0 opacity-100"
              leave-active-class="transition duration-fast ease-product"
              leave-from-class="translate-y-0 opacity-100"
              leave-to-class="translate-y-1 opacity-0"
            >
              <MenuItems
                class="absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-neutral-200 bg-neutral-0 p-2 shadow-overlay focus:outline-none"
              >
                <MenuItem
                  v-for="option in themeOptions"
                  :key="option.value"
                  v-slot="{ active }"
                >
                  <button
                    type="button"
                    :class="[
                      'flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold',
                      active ? 'bg-neutral-100 text-neutral-900' : 'text-neutral-700',
                    ]"
                    @click="setThemePreference(option.value)"
                  >
                    <component :is="option.icon" class="h-5 w-5" aria-hidden="true" />
                    <span class="flex-1">{{ option.label }}</span>
                    <CheckIcon
                      v-if="themePreference === option.value"
                      class="h-4 w-4 text-brand-600 dark:text-brand-400"
                      aria-hidden="true"
                    />
                  </button>
                </MenuItem>
              </MenuItems>
            </transition>
          </Menu>

          <UiIconButton
            ref="mobileMenuTrigger"
            class="md:hidden"
            label="Open navigation"
            variant="secondary"
            @click="openMobileMenu"
          >
            <Bars3Icon />
          </UiIconButton>
        </div>
      </UiContainer>
    </header>

    <main id="main-content" class="py-5 sm:py-7" tabindex="-1">
      <UiContainer>
        <NuxtLoadingIndicator color="#3437c7" />
        <NuxtPwaManifest />
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
      </UiContainer>
    </main>

    <TransitionRoot
      as="template"
      :show="mobileMenuOpen"
      @after-leave="restoreMobileMenuFocus"
    >
      <Dialog as="div" class="fixed inset-0 z-50 md:hidden" @close="mobileMenuOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity duration-normal ease-product"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity duration-normal ease-product"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-neutral-950/35" />
        </TransitionChild>

        <div class="fixed inset-0 flex justify-end">
          <TransitionChild
            as="template"
            enter="transition-transform duration-slow ease-product"
            enter-from="translate-x-full"
            enter-to="translate-x-0"
            leave="transition-transform duration-slow ease-product"
            leave-from="translate-x-0"
            leave-to="translate-x-full"
          >
            <DialogPanel class="flex h-full w-full max-w-sm flex-col bg-neutral-0 shadow-overlay">
              <div class="flex h-16 items-center justify-between border-b border-neutral-200 px-4">
                <div class="flex items-center gap-2.5">
                  <NuxtImg
                    :src="siteLogo"
                    width="36"
                    height="36"
                    class="h-9 w-9 rounded-full"
                    alt=""
                  />
                  <span class="font-bold text-brand-700 dark:text-brand-300">SGP1</span>
                </div>
                <UiIconButton label="Close navigation" @click="mobileMenuOpen = false">
                  <XMarkIcon />
                </UiIconButton>
              </div>

              <div class="flex-1 overflow-y-auto px-4 py-5">
                <p class="text-sm leading-6 text-neutral-600">
                  Check historical Primary 1 ballot information by school,
                  registration year, and admission phase.
                </p>

                <nav class="mt-6 space-y-1" aria-label="Mobile navigation">
                  <NuxtLink
                    to="/"
                    :class="mobileNavClasses(isResearchRoute)"
                    :aria-current="isResearchRoute ? 'page' : undefined"
                    @click="mobileMenuOpen = false"
                  >
                    <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
                    School research
                  </NuxtLink>
                  <button
                    type="button"
                    :class="mobileNavClasses(false)"
                    @click="openAboutFromMobile"
                  >
                    <QuestionMarkCircleIcon class="h-5 w-5" aria-hidden="true" />
                    About this tool
                  </button>
                </nav>

                <div class="mt-7 border-t border-neutral-200 pt-5">
                  <p class="px-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Helpful resources
                  </p>
                  <div class="mt-2 space-y-1">
                    <a
                      v-for="item in secondaryLinks"
                      :key="item.name"
                      :href="item.href"
                      target="_blank"
                      rel="noopener noreferrer"
                    class="flex min-h-11 gap-3 rounded-md px-3 py-3 text-sm text-neutral-700 hover:bg-neutral-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20"
                    >
                      <component :is="item.icon" class="h-5 w-5 shrink-0 text-brand-600 dark:text-brand-400" aria-hidden="true" />
                      <span>
                        <span class="block font-semibold">{{ item.name }}</span>
                        <span class="mt-0.5 block text-xs leading-5 text-neutral-500">{{ item.description }}</span>
                      </span>
                    </a>
                  </div>
                </div>
              </div>

              <div class="border-t border-neutral-200 p-4">
                <a
                  href="https://www.buymeacoffee.com/chaoran"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex min-h-11 w-full items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-semibold text-white shadow-control hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
                >
                  Support SGP1
                </a>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </TransitionRoot>

    <TransitionRoot
      as="template"
      :show="aboutOpen"
      @after-leave="restoreAboutFocus"
    >
      <Dialog as="div" class="fixed inset-0 z-50" @close="aboutOpen = false">
        <TransitionChild
          as="template"
          enter="transition-opacity duration-normal ease-product"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="transition-opacity duration-normal ease-product"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-neutral-950/45" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div class="flex min-h-full items-center justify-center">
            <TransitionChild
              as="template"
              enter="transition duration-normal ease-product"
              enter-from="translate-y-2 scale-95 opacity-0"
              enter-to="translate-y-0 scale-100 opacity-100"
              leave="transition duration-normal ease-product"
              leave-from="translate-y-0 scale-100 opacity-100"
              leave-to="translate-y-2 scale-95 opacity-0"
            >
              <DialogPanel class="w-full max-w-lg rounded-xl bg-neutral-0 p-6 shadow-overlay sm:p-7">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <DialogTitle class="text-xl font-bold tracking-tight text-neutral-900">
                      Plan with past registration data
                    </DialogTitle>
                    <DialogDescription class="mt-2 text-sm leading-6 text-neutral-600">
                      SGP1 helps Singapore parents review historical Primary 1
                      ballot information for target schools and admission rounds.
                    </DialogDescription>
                  </div>
                  <UiIconButton label="Close about dialog" @click="aboutOpen = false">
                    <XMarkIcon />
                  </UiIconButton>
                </div>

                <div class="mt-6 rounded-lg bg-brand-50 p-4 text-sm leading-6 text-brand-950 dark:bg-brand-950 dark:text-brand-100">
                  Historical results describe past registration outcomes. They
                  are not forecasts or guarantees of future admission.
                </div>

                <p class="mt-5 text-sm leading-6 text-neutral-600">
                  Always confirm current registration dates, phases, eligibility,
                  and procedures with Singapore’s Ministry of Education.
                </p>

                <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <UiButton variant="secondary" @click="aboutOpen = false">
                    Close
                  </UiButton>
                  <a
                    href="https://www.moe.gov.sg/primary/p1-registration"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-brand-600 px-4 text-sm font-semibold text-white shadow-control hover:bg-brand-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25"
                  >
                    Visit MOE registration guide
                    <ArrowTopRightOnSquareIcon class="h-4 w-4" aria-hidden="true" />
                  </a>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogDescription,
  DialogPanel,
  DialogTitle,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
  TransitionRoot,
} from '@headlessui/vue'
import {
  ArrowTopRightOnSquareIcon,
  Bars3Icon,
  BookOpenIcon,
  CheckIcon,
  ComputerDesktopIcon,
  HeartIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  Squares2X2Icon,
  SunIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'

type ThemePreference = 'system' | 'light' | 'dark'

const themeStorageKey = 'sgp1-theme'
const themeBootstrapScript = `(function(){try{var saved=localStorage.getItem('${themeStorageKey}');var preference=saved==='light'||saved==='dark'?saved:'system';var dark=preference==='dark'||(preference==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.dataset.theme=preference;}catch(error){document.documentElement.classList.toggle('dark',window.matchMedia('(prefers-color-scheme: dark)').matches);}})();`
const route = useRoute()
const mobileMenuOpen = ref(false)
const aboutOpen = ref(false)
const themePreference = ref<ThemePreference>('system')
const isDarkTheme = ref(false)
const mobileMenuTrigger = ref<{ $el?: HTMLButtonElement } | null>(null)
let mobileMenuTriggerElement: HTMLElement | null = null
let aboutTrigger: HTMLElement | null = null
let systemThemeQuery: MediaQueryList | null = null

const siteLogo = '/sgp1-mark.png'
const siteUrl = 'https://sgp1.ichaoran.com'
const siteDescription = 'Explore historical Singapore Primary 1 ballot information by school, registration year, and admission phase.'
const canonicalUrl = computed(() => new URL(route.path, siteUrl).toString())
const isResearchRoute = computed(() => (
  route.path === '/'
  || route.path.startsWith('/area/')
  || route.path.startsWith('/schools/')
))
const themeColor = computed(() => isDarkTheme.value ? '#111522' : '#3437c7')
const themeButtonLabel = computed(() => (
  `Theme: ${themePreference.value === 'system' ? 'System' : themePreference.value === 'dark' ? 'Dark' : 'Light'}`
))
const themeOptions: Array<{
  value: ThemePreference
  label: string
  icon: typeof ComputerDesktopIcon
}> = [
  { value: 'system', label: 'System', icon: ComputerDesktopIcon },
  { value: 'light', label: 'Light', icon: SunIcon },
  { value: 'dark', label: 'Dark', icon: MoonIcon },
]

const secondaryLinks = [
  {
    name: 'MOE P1 registration',
    href: 'https://www.moe.gov.sg/primary/p1-registration',
    description: 'Official registration phases, dates, and process.',
    icon: BookOpenIcon,
  },
  {
    name: 'MOE registration FAQ',
    href: 'https://www.moe.gov.sg/faq?categoryid=76037F9F568F46A7AA80EFDCE9AB23CD',
    description: 'Official answers to common registration questions.',
    icon: QuestionMarkCircleIcon,
  },
  {
    name: 'SG Schooling',
    href: 'https://sgschooling.com/school/',
    description: 'Related school information and historical data.',
    icon: Squares2X2Icon,
  },
  {
    name: 'About the maker',
    href: 'https://www.ichaoran.com/about/',
    description: 'Learn more about this independent project.',
    icon: HeartIcon,
  },
]

const desktopNavClasses = (current: boolean) => [
  'inline-flex min-h-11 items-center gap-2 rounded-md px-3 text-sm font-semibold',
  'transition-colors duration-fast ease-product focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/25',
  current
    ? 'bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200'
    : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
]

const mobileNavClasses = (current: boolean) => [
  'flex min-h-11 w-full items-center gap-3 rounded-md px-3 text-left text-sm font-semibold',
  'focus:outline-none focus-visible:ring-4 focus-visible:ring-brand-500/20',
  current
    ? 'bg-brand-50 text-brand-800 dark:bg-brand-950 dark:text-brand-200'
    : 'text-neutral-700 hover:bg-neutral-100',
]

const applyThemePreference = (preference: ThemePreference) => {
  const shouldUseDark = preference === 'dark'
    || (preference === 'system' && Boolean(systemThemeQuery?.matches))
  document.documentElement.classList.toggle('dark', shouldUseDark)
  document.documentElement.dataset.theme = preference
  isDarkTheme.value = shouldUseDark
}

const setThemePreference = (preference: ThemePreference) => {
  themePreference.value = preference
  if (preference === 'system') {
    localStorage.removeItem(themeStorageKey)
  } else {
    localStorage.setItem(themeStorageKey, preference)
  }
  applyThemePreference(preference)
}

const handleSystemThemeChange = () => {
  if (themePreference.value === 'system') {
    applyThemePreference('system')
  }
}

const mobileMenuButton = () => mobileMenuTrigger.value?.$el
const openMobileMenu = () => {
  mobileMenuTriggerElement = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : mobileMenuButton() || null
  mobileMenuOpen.value = true
}
const restoreMobileMenuFocus = () => {
  if (!aboutOpen.value) {
    const trigger = mobileMenuTriggerElement || mobileMenuButton()
    window.setTimeout(() => {
      if (trigger?.isConnected) {
        trigger.focus()
      }
    }, 0)
    mobileMenuTriggerElement = null
  }
}

const openAbout = () => {
  aboutTrigger = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null
  aboutOpen.value = true
}

const openAboutFromMobile = () => {
  aboutTrigger = mobileMenuButton() || null
  mobileMenuOpen.value = false
  requestAnimationFrame(() => {
    aboutOpen.value = true
  })
}

const restoreAboutFocus = () => {
  if (aboutTrigger?.isConnected) {
    aboutTrigger.focus()
  } else {
    mobileMenuButton()?.focus()
  }
  aboutTrigger = null
}

watch(() => route.fullPath, () => {
  mobileMenuOpen.value = false
})

onMounted(() => {
  systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')
  const savedPreference = localStorage.getItem(themeStorageKey)
  themePreference.value = savedPreference === 'light' || savedPreference === 'dark'
    ? savedPreference
    : 'system'
  applyThemePreference(themePreference.value)
  systemThemeQuery.addEventListener('change', handleSystemThemeChange)
})

onBeforeUnmount(() => {
  systemThemeQuery?.removeEventListener('change', handleSystemThemeChange)
})

useHead({
  htmlAttrs: {
    lang: 'en-SG',
  },
  titleTemplate: title => title ? `${title} | SGP1` : 'SGP1 | Singapore Primary 1 Planning Companion',
  link: [
    { rel: 'canonical', href: canonicalUrl },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png' },
  ],
  script: [
    {
      key: 'theme-bootstrap',
      innerHTML: themeBootstrapScript,
      tagPosition: 'head',
    },
  ],
  meta: [
    {
      key: 'theme-color',
      name: 'theme-color',
      content: themeColor,
    },
  ],
})

useSeoMeta({
  description: siteDescription,
  ogTitle: 'SGP1 | Singapore Primary 1 Planning Companion',
  ogDescription: siteDescription,
  ogType: 'website',
  ogUrl: canonicalUrl,
  ogLocale: 'en_SG',
  ogImage: `${siteUrl}/sgp1-mark.png`,
  ogImageAlt: 'SGP1 Singapore Primary 1 Planning Companion',
  twitterCard: 'summary',
  twitterTitle: 'SGP1 | Singapore Primary 1 Planning Companion',
  twitterDescription: siteDescription,
  twitterImage: `${siteUrl}/sgp1-mark.png`,
})
</script>
