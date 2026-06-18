<script setup lang="ts">
import type { Match, Standing } from '~/composables/useFootball'

const props = defineProps<{ matches: Match[]; standings: Standing[] }>()

const { openTeam } = useTeamModal()

const finished = computed(() =>
  props.matches.filter(m => m.status === 'FINISHED')
)

const totalGoals = computed(() =>
  finished.value.reduce((s, m) => s + (m.score.fullTime.home ?? 0) + (m.score.fullTime.away ?? 0), 0)
)

const matchesPlayed = computed(() => finished.value.length)

const matchesRemaining = computed(() =>
  props.matches.filter(m => m.status === 'TIMED' || m.status === 'SCHEDULED').length
)

const totalMatches = computed(() => matchesPlayed.value + matchesRemaining.value)

const progressPct = computed(() =>
  totalMatches.value ? Math.round((matchesPlayed.value / totalMatches.value) * 100) : 0
)

const avgGoals = computed(() =>
  matchesPlayed.value ? (totalGoals.value / matchesPlayed.value).toFixed(2) : '—'
)

const cleanSheets = computed(() =>
  finished.value.filter(m => m.score.fullTime.home === 0 || m.score.fullTime.away === 0).length
)

const topMatch = computed(() => {
  let best: Match | null = null
  let bestTotal = 0
  for (const m of finished.value) {
    const t = (m.score.fullTime.home ?? 0) + (m.score.fullTime.away ?? 0)
    if (t > bestTotal) { bestTotal = t; best = m }
  }
  return best ? { match: best, total: bestTotal } : null
})

const allEntries = computed(() =>
  props.standings
    .filter(s => s.type === 'TOTAL')
    .flatMap(s => s.table)
    .filter(e => e.playedGames > 0)
)

const bestAttack = computed(() =>
  allEntries.value.reduce<typeof allEntries.value[0] | null>(
    (best, e) => (!best || e.goalsFor > best.goalsFor ? e : best), null
  )
)

const bestDefense = computed(() =>
  allEntries.value.reduce<typeof allEntries.value[0] | null>(
    (best, e) => (!best || e.goalsAgainst < best.goalsAgainst ? e : best), null
  )
)
</script>

<template>
  <section class="flex flex-col gap-6">
    <div>
      <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
        Statistici Turneu
      </h2>

      <!-- Main stat cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div class="bg-wc-card border border-wc-border rounded-xl p-4 text-center">
          <p class="text-4xl font-black text-wc-gold">{{ totalGoals }}</p>
          <p class="text-xs text-slate-400 mt-1">Goluri marcate</p>
        </div>
        <div class="bg-wc-card border border-wc-border rounded-xl p-4 text-center">
          <p class="text-4xl font-black text-white">{{ matchesPlayed }}</p>
          <p class="text-xs text-slate-400 mt-1">Meciuri jucate</p>
        </div>
        <div class="bg-wc-card border border-wc-border rounded-xl p-4 text-center">
          <p class="text-4xl font-black text-blue-400">{{ avgGoals }}</p>
          <p class="text-xs text-slate-400 mt-1">Medie goluri/meci</p>
        </div>
        <div class="bg-wc-card border border-wc-border rounded-xl p-4 text-center">
          <p class="text-4xl font-black text-slate-400">{{ cleanSheets }}</p>
          <p class="text-xs text-slate-400 mt-1">Meciuri cu poartă zero</p>
        </div>
      </div>

      <!-- Progress bar -->
      <div class="bg-wc-card border border-wc-border rounded-xl p-4">
        <div class="flex justify-between text-xs text-slate-400 mb-2">
          <span>Progres turneu</span>
          <span>{{ matchesPlayed }} / {{ totalMatches }} meciuri · {{ matchesRemaining }} rămase</span>
        </div>
        <div class="w-full bg-slate-700 rounded-full h-2.5">
          <div
            class="bg-wc-gold h-2.5 rounded-full transition-all duration-700"
            :style="{ width: `${progressPct}%` }"
          ></div>
        </div>
        <p class="text-right text-xs text-slate-500 mt-1">{{ progressPct }}%</p>
      </div>
    </div>

    <!-- Highlights -->
    <div>
      <h3 class="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Recorduri</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">

        <!-- Best attack -->
        <div
          v-if="bestAttack"
          class="bg-wc-card border border-wc-border rounded-xl p-4 cursor-pointer hover:border-green-500/40 transition-colors"
          @click="openTeam(bestAttack.team.id)"
        >
          <p class="text-xs text-slate-500 uppercase tracking-widest mb-3">Cel mai bun atac</p>
          <div class="flex items-center gap-3">
            <img :src="bestAttack.team.crest" :alt="bestAttack.team.name" class="w-10 h-10 object-contain" />
            <div>
              <p class="text-white font-semibold text-sm">{{ bestAttack.team.shortName }}</p>
              <p class="text-green-400 font-black text-2xl leading-none mt-0.5">{{ bestAttack.goalsFor }}</p>
              <p class="text-xs text-slate-500">goluri marcate</p>
            </div>
          </div>
        </div>

        <!-- Best defense -->
        <div
          v-if="bestDefense"
          class="bg-wc-card border border-wc-border rounded-xl p-4 cursor-pointer hover:border-blue-500/40 transition-colors"
          @click="openTeam(bestDefense.team.id)"
        >
          <p class="text-xs text-slate-500 uppercase tracking-widest mb-3">Cea mai bună apărare</p>
          <div class="flex items-center gap-3">
            <img :src="bestDefense.team.crest" :alt="bestDefense.team.name" class="w-10 h-10 object-contain" />
            <div>
              <p class="text-white font-semibold text-sm">{{ bestDefense.team.shortName }}</p>
              <p class="text-blue-400 font-black text-2xl leading-none mt-0.5">{{ bestDefense.goalsAgainst }}</p>
              <p class="text-xs text-slate-500">goluri primite</p>
            </div>
          </div>
        </div>

        <!-- Top match -->
        <div v-if="topMatch" class="bg-wc-card border border-wc-border rounded-xl p-4">
          <p class="text-xs text-slate-500 uppercase tracking-widest mb-3">Meciul cu cele mai multe goluri</p>
          <div class="flex items-center gap-2 mt-1">
            <button class="flex items-center gap-1.5 hover:opacity-75 transition-opacity" @click="openTeam(topMatch.match.homeTeam.id)">
              <img :src="topMatch.match.homeTeam.crest" class="w-6 h-6 object-contain" />
              <span class="text-white text-xs font-medium">{{ topMatch.match.homeTeam.tla }}</span>
            </button>
            <span class="text-white font-black text-lg mx-1">
              {{ topMatch.match.score.fullTime.home }} – {{ topMatch.match.score.fullTime.away }}
            </span>
            <button class="flex items-center gap-1.5 hover:opacity-75 transition-opacity" @click="openTeam(topMatch.match.awayTeam.id)">
              <span class="text-white text-xs font-medium">{{ topMatch.match.awayTeam.tla }}</span>
              <img :src="topMatch.match.awayTeam.crest" class="w-6 h-6 object-contain" />
            </button>
          </div>
          <p class="text-wc-gold font-black text-2xl mt-2">{{ topMatch.total }} goluri</p>
        </div>

      </div>
    </div>

    <div v-if="matchesPlayed === 0" class="text-slate-400 text-sm py-6 text-center">
      Niciun meci jucat încă — statisticile vor apărea după primul meci.
    </div>
  </section>
</template>
