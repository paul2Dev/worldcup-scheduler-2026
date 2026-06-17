<script setup lang="ts">
import type { Match } from '~/composables/useFootball'

const { formatMatchTime, minutesUntil, countryCode } = useFootball()

const props = defineProps<{ matches: Match[] }>()

const liveMatches = computed(() =>
  props.matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')
)

const otherMatches = computed(() =>
  props.matches.filter(m => m.status !== 'IN_PLAY' && m.status !== 'PAUSED')
)

function timeLabel(match: Match): { text: string; class: string } {
  const min = minutesUntil(match.utcDate)
  if (match.status === 'FINISHED') return { text: 'FINAL', class: 'bg-slate-600' }
  if (min <= 15 && min > 0) return { text: `În ${min} min`, class: 'bg-wc-gold text-slate-900' }
  return { text: formatMatchTime(match.utcDate), class: 'bg-slate-700' }
}

function score(match: Match): string {
  const h = match.score.fullTime.home
  const a = match.score.fullTime.away
  if (h === null || a === null) return 'vs'
  return `${h} – ${a}`
}
</script>

<template>
  <section class="flex flex-col gap-8">

    <!-- Live matches -->
    <div v-if="liveMatches.length > 0">
      <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-wc-red animate-pulse inline-block"></span>
        Live acum
      </h2>
      <div class="flex flex-col gap-4">
        <div
          v-for="match in liveMatches"
          :key="match.id"
          class="bg-wc-card border border-wc-red/40 rounded-2xl px-6 py-5 relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-wc-red/5 pointer-events-none"></div>

          <div class="flex justify-center mb-4">
            <span class="flex items-center gap-1.5 bg-wc-red px-3 py-1 rounded-full text-xs font-bold tracking-widest">
              <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block"></span>
              {{ match.status === 'PAUSED' ? 'PAUZĂ' : 'LIVE' }}
            </span>
          </div>

          <div class="flex items-center justify-between gap-4">
            <div class="flex flex-col items-center gap-2 flex-1">
              <span :class="`fi fi-${countryCode(match.homeTeam)} text-5xl rounded-lg`"></span>
              <span class="text-white font-semibold text-sm text-center">{{ match.homeTeam.shortName }}</span>
            </div>

            <div class="flex flex-col items-center min-w-[100px]">
              <span class="text-white font-black text-5xl tracking-widest tabular-nums">
                {{ score(match) }}
              </span>
              <span v-if="match.score.halfTime.home !== null" class="text-slate-500 text-xs mt-1">
                Prim reprize: {{ match.score.halfTime.home }} – {{ match.score.halfTime.away }}
              </span>
            </div>

            <div class="flex flex-col items-center gap-2 flex-1">
              <span :class="`fi fi-${countryCode(match.awayTeam)} text-5xl rounded-lg`"></span>
              <span class="text-white font-semibold text-sm text-center">{{ match.awayTeam.shortName }}</span>
            </div>
          </div>

          <div v-if="match.group" class="text-center text-xs text-slate-500 mt-3">{{ match.group }}</div>
        </div>
      </div>
    </div>

    <!-- Rest of today -->
    <div>
      <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
        Programul zilei
      </h2>

      <div v-if="matches.length === 0" class="text-slate-400 text-sm py-6 text-center">
        Niciun meci programat azi.
      </div>

      <div v-else-if="otherMatches.length === 0 && liveMatches.length > 0" class="text-slate-500 text-sm py-4 text-center">
        Toate meciurile de azi sunt live.
      </div>

      <div class="grid gap-3">
        <div
          v-for="match in otherMatches"
          :key="match.id"
          class="bg-wc-card border border-wc-border rounded-xl px-4 py-3 flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-2 flex-1 justify-end">
            <span class="text-white font-semibold text-sm text-right">{{ match.homeTeam.shortName }}</span>
            <span :class="`fi fi-${countryCode(match.homeTeam)} text-2xl rounded`"></span>
          </div>

          <div class="flex flex-col items-center gap-1 min-w-[90px]">
            <span :class="`text-xs font-bold px-2 py-0.5 rounded-full text-white ${timeLabel(match).class}`">
              {{ timeLabel(match).text }}
            </span>
            <span class="text-white font-bold text-lg tracking-widest">{{ score(match) }}</span>
          </div>

          <div class="flex items-center gap-2 flex-1 justify-start">
            <span :class="`fi fi-${countryCode(match.awayTeam)} text-2xl rounded`"></span>
            <span class="text-white font-semibold text-sm">{{ match.awayTeam.shortName }}</span>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>
