<script setup lang="ts">
import type { Match } from '~/composables/useFootball'

const { formatMatchDate } = useFootball()

defineProps<{ matches: Match[] }>()

function score(match: Match): string {
  const h = match.score.fullTime.home
  const a = match.score.fullTime.away
  if (h === null || a === null) return '- –  -'
  return `${h} – ${a}`
}

function isWinner(match: Match, side: 'home' | 'away'): boolean {
  if (match.score.winner === 'HOME_TEAM') return side === 'home'
  if (match.score.winner === 'AWAY_TEAM') return side === 'away'
  return false
}
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-slate-400 inline-block"></span>
      Rezultate Anterioare
    </h2>

    <div v-if="matches.length === 0" class="text-slate-400 text-sm py-6 text-center">
      Niciun meci jucat încă.
    </div>

    <div class="flex flex-col gap-2">
      <div
        v-for="match in [...matches].reverse()"
        :key="match.id"
        class="bg-wc-card border border-wc-border rounded-xl px-4 py-3 flex items-center justify-between gap-4"
      >
        <!-- Home -->
        <div class="flex items-center gap-2 flex-1 justify-end">
          <span
            :class="['text-sm font-semibold text-right', isWinner(match, 'home') ? 'text-white' : 'text-slate-400']"
          >
            {{ match.homeTeam.shortName }}
          </span>
          <FlagIcon :team="match.homeTeam" />
        </div>

        <!-- Score -->
        <div class="flex flex-col items-center min-w-[90px]">
          <span class="text-white font-bold text-lg tracking-widest">{{ score(match) }}</span>
          <span class="text-xs text-slate-500">{{ formatMatchDate(match.utcDate) }}</span>
        </div>

        <!-- Away -->
        <div class="flex items-center gap-2 flex-1 justify-start">
          <FlagIcon :team="match.awayTeam" />
          <span
            :class="['text-sm font-semibold', isWinner(match, 'away') ? 'text-white' : 'text-slate-400']"
          >
            {{ match.awayTeam.shortName }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
