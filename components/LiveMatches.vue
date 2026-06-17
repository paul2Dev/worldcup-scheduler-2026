<script setup lang="ts">
import type { Match } from '~/composables/useFootball'

const { countryCode } = useFootball()

defineProps<{ matches: Match[] }>()

function score(match: Match): string {
  const h = match.score.fullTime.home
  const a = match.score.fullTime.away
  if (h === null || a === null) return '? – ?'
  return `${h} – ${a}`
}
</script>

<template>
  <section>
    <div v-if="matches.length === 0" class="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <span class="text-5xl opacity-30">📺</span>
      <p class="text-slate-400 font-medium">Niciun meci live acum</p>
      <p class="text-slate-500 text-sm">Verifică tab-ul <span class="text-white font-semibold">Azi</span> pentru meciurile programate</p>
    </div>

    <div v-else class="flex flex-col gap-4">
      <div
        v-for="match in matches"
        :key="match.id"
        class="bg-wc-card border border-wc-red/40 rounded-2xl px-6 py-5 relative overflow-hidden"
      >
        <!-- Pulsing background glow -->
        <div class="absolute inset-0 bg-wc-red/5 animate-pulse pointer-events-none"></div>

        <!-- LIVE badge -->
        <div class="flex justify-center mb-4">
          <span class="flex items-center gap-1.5 bg-wc-red px-3 py-1 rounded-full text-xs font-bold tracking-widest">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block"></span>
            {{ match.status === 'PAUSED' ? 'PAUZĂ' : 'LIVE' }}
          </span>
        </div>

        <!-- Teams + Score -->
        <div class="flex items-center justify-between gap-4">
          <!-- Home -->
          <div class="flex flex-col items-center gap-2 flex-1">
            <span :class="`fi fi-${countryCode(match.homeTeam)} text-5xl rounded-lg`"></span>
            <span class="text-white font-semibold text-sm text-center">{{ match.homeTeam.shortName }}</span>
          </div>

          <!-- Score -->
          <div class="flex flex-col items-center min-w-[100px]">
            <span class="text-white font-black text-5xl tracking-widest tabular-nums">
              {{ score(match) }}
            </span>
            <span v-if="match.score.halfTime.home !== null" class="text-slate-500 text-xs mt-1">
              Prim reprize: {{ match.score.halfTime.home }} – {{ match.score.halfTime.away }}
            </span>
          </div>

          <!-- Away -->
          <div class="flex flex-col items-center gap-2 flex-1">
            <span :class="`fi fi-${countryCode(match.awayTeam)} text-5xl rounded-lg`"></span>
            <span class="text-white font-semibold text-sm text-center">{{ match.awayTeam.shortName }}</span>
          </div>
        </div>

        <!-- Group info -->
        <div v-if="match.group" class="text-center text-xs text-slate-500 mt-3">
          {{ match.group }}
        </div>
      </div>
    </div>
  </section>
</template>
