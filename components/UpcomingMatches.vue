<script setup lang="ts">
import type { Match } from '~/composables/useFootball'

const { formatMatchDate, formatMatchTime, minutesUntil } = useFootball()

defineProps<{ matches: Match[] }>()

function soonLabel(match: Match): string | null {
  const min = minutesUntil(match.utcDate)
  if (min > 0 && min <= 60) return `În ${min} min`
  return null
}

function groupByDate(matches: Match[]): { date: string; label: string; items: Match[] }[] {
  const map = new Map<string, Match[]>()
  for (const m of matches) {
    const key = m.utcDate.slice(0, 10)
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(m)
  }
  return Array.from(map.entries()).map(([date, items]) => ({
    date,
    label: new Intl.DateTimeFormat(undefined, { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(date)),
    items
  }))
}
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-blue-400 inline-block"></span>
      Meciuri Viitoare
    </h2>

    <div v-if="matches.length === 0" class="text-slate-400 text-sm py-6 text-center">
      Niciun meci viitor în următoarele 14 zile.
    </div>

    <div class="flex flex-col gap-5">
      <div v-for="group in groupByDate(matches)" :key="group.date">
        <h3 class="text-slate-400 text-xs font-semibold uppercase tracking-widest mb-2 pl-1">
          {{ group.label }}
        </h3>

        <div class="flex flex-col gap-2">
          <div
            v-for="match in group.items"
            :key="match.id"
            class="bg-wc-card border border-wc-border rounded-xl px-3 py-3 flex items-center gap-2"
          >
            <!-- Home -->
            <div class="flex items-center gap-1.5 flex-1 justify-end min-w-0">
              <span class="text-white text-sm font-semibold text-right truncate">{{ match.homeTeam.shortName }}</span>
              <FlagIcon :team="match.homeTeam" />
            </div>

            <!-- Time -->
            <div class="flex flex-col items-center flex-shrink-0 w-24">
              <span v-if="soonLabel(match)" class="text-xs font-bold text-wc-gold mb-0.5 whitespace-nowrap">{{ soonLabel(match) }}</span>
              <span class="text-slate-300 text-sm font-mono whitespace-nowrap">{{ formatMatchTime(match.utcDate) }}</span>
              <span v-if="match.group" class="text-xs text-slate-500 mt-0.5">{{ match.group }}</span>
            </div>

            <!-- Away -->
            <div class="flex items-center gap-1.5 flex-1 justify-start min-w-0">
              <FlagIcon :team="match.awayTeam" />
              <span class="text-white text-sm font-semibold truncate">{{ match.awayTeam.shortName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
