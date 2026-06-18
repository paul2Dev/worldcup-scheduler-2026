<script setup lang="ts">
const {
  fetchAllMatches,
  fetchStandings,
  fetchScorers,
  fetchTeams,
  filterLive,
  filterToday,
  filterUpcoming,
  filterPast,
  filterKnockout
} = useFootball()

const { data: matchesResp, refresh: refreshMatches, error: matchesError } = useAsyncData(
  'matches',
  () => fetchAllMatches(),
  { server: false, lazy: true }
)

const { data: standingsResp, refresh: refreshStandings, error: standingsError } = useAsyncData(
  'standings',
  () => fetchStandings(),
  { server: false, lazy: true }
)

const { data: scorersResp, refresh: refreshScorers } = useAsyncData(
  'scorers',
  () => fetchScorers(),
  { server: false, lazy: true }
)

const { data: teamsResp } = useAsyncData(
  'teams',
  () => fetchTeams(),
  { server: false, lazy: true }
)

const lastUpdated = ref<Date>(new Date())
const refreshing = ref(false)

async function loadAll() {
  refreshing.value = true
  await Promise.all([refreshMatches(), refreshStandings(), refreshScorers()])
  lastUpdated.value = new Date()
  refreshing.value = false
}

let interval: ReturnType<typeof setInterval>
onMounted(() => {
  interval = setInterval(loadAll, 60_000)
})
onUnmounted(() => {
  clearInterval(interval)
})

const allMatches = computed(() => matchesResp.value?.matches ?? [])
const liveMatches = computed(() => filterLive(allMatches.value))
const todayMatches = computed(() => filterToday(allMatches.value))
const upcomingMatches = computed(() => filterUpcoming(allMatches.value))
const pastMatches = computed(() => filterPast(allMatches.value))
const knockoutMatches = computed(() => filterKnockout(allMatches.value))
const standings = computed(() => standingsResp.value?.standings ?? [])
const scorers = computed(() => scorersResp.value?.scorers ?? [])
const teams = computed(() => teamsResp.value?.teams ?? [])

const error = computed(() => {
  const raw = matchesError.value?.message ?? standingsError.value?.message ?? null
  if (!raw) return null
  if (raw.includes('request limit') || raw.includes('429')) return 'Prea multe cereri către API. Așteaptă 10 secunde și apasă Reîncarcă.'
  if (raw.includes('403') || raw.includes('Forbidden')) return 'Cheie API invalidă. Verifică FOOTBALL_API_KEY în .env'
  return raw
})

const tabs = [
  { id: 'today', label: 'Azi', badge: computed(() => liveMatches.value.length), pulse: true },
  { id: 'upcoming', label: 'Viitoare', badge: null, pulse: false },
  { id: 'results', label: 'Rezultate', badge: null, pulse: false },
  { id: 'standings', label: 'Grupe', badge: null, pulse: false },
  { id: 'bracket', label: 'Bracket', badge: null, pulse: false },
  { id: 'scorers', label: 'Marcatori', badge: null, pulse: false },
]

const activeTab = ref('today')

function formatTime(d: Date): string {
  return new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit' }).format(d)
}
</script>

<template>
  <div class="min-h-screen bg-wc-dark text-white">
    <!-- Header -->
    <header class="border-b border-wc-border bg-slate-900/80 sticky top-0 z-10 backdrop-blur">
      <div class="max-w-5xl mx-auto px-4">
        <div class="flex items-center justify-between py-3">
          <div class="flex items-center gap-3">
            <img
              src="https://crests.football-data.org/wm26.png"
              alt="World Cup 2026"
              class="w-10 h-10 object-contain"
            />
            <div>
              <h1 class="font-bold text-white leading-none">World Cup 2026</h1>
              <p class="text-xs text-slate-400">Dashboard live</p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-xs text-slate-500 hidden sm:inline">
              Actualizat la {{ formatTime(lastUpdated) }}
            </span>
            <button
              @click="loadAll"
              :disabled="refreshing"
              class="text-xs bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-slate-300 px-3 py-1.5 rounded-lg transition"
            >
              {{ refreshing ? '...' : 'Reîncarcă' }}
            </button>
          </div>
        </div>

        <nav v-if="!error" class="grid grid-cols-3 sm:flex gap-1 pb-0">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'relative px-2 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-medium rounded-lg sm:rounded-b-none sm:whitespace-nowrap transition-colors',
              activeTab === tab.id
                ? 'bg-wc-dark text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            ]"
          >
            <span class="flex items-center justify-center gap-1.5">
              <span
                v-if="tab.pulse && tab.badge && tab.badge.value > 0"
                class="w-1.5 h-1.5 rounded-full bg-wc-red animate-pulse inline-block"
              ></span>
              {{ tab.label }}
              <span
                v-if="tab.badge && tab.badge.value > 0"
                :class="['text-white text-xs font-bold px-1.5 py-0.5 rounded-full', tab.pulse ? 'bg-wc-red' : 'bg-slate-600']"
              >
                {{ tab.badge.value }}
              </span>
            </span>
          </button>
        </nav>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-4 py-8">
      <div v-if="error" class="bg-red-900/30 border border-red-800 rounded-xl p-6 text-center">
        <p class="text-red-300 font-semibold mb-2">Nu s-au putut încărca datele</p>
        <p class="text-red-400 text-sm mb-4">{{ error }}</p>
        <button
          @click="loadAll"
          class="text-sm bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition"
        >
          Încearcă din nou
        </button>
      </div>

      <template v-else>
        <TodayMatches v-show="activeTab === 'today'" :matches="todayMatches" />
        <UpcomingMatches v-show="activeTab === 'upcoming'" :matches="upcomingMatches" />
        <PastResults v-show="activeTab === 'results'" :matches="pastMatches" />
        <GroupStandings v-show="activeTab === 'standings'" :standings="standings" />
        <KnockoutBracket v-show="activeTab === 'bracket'" :matches="knockoutMatches" />
        <TopScorers v-show="activeTab === 'scorers'" :scorers="scorers" />
      </template>
    </main>
  </div>

  <TeamModal :teams="teams" />
</template>
