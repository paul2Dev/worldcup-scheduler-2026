<script setup lang="ts">
import type { Match } from '~/composables/useFootball'

const { formatMatchDate, formatMatchTime, countryCode } = useFootball()

const props = defineProps<{ matches: Match[] }>()

const stageOrder = [
  'ROUND_OF_16',
  'QUARTER_FINALS',
  'SEMI_FINALS',
  'THIRD_PLACE',
  'FINAL'
]

const stageLabels: Record<string, string> = {
  ROUND_OF_16: 'Optimi de finală',
  QUARTER_FINALS: 'Sferturi de finală',
  SEMI_FINALS: 'Semifinale',
  THIRD_PLACE: 'Locul 3',
  FINAL: 'Finală'
}

const knockoutStages = computed(() =>
  stageOrder
    .filter(s => props.matches.some(m => m.stage === s))
    .map(stage => ({
      stage,
      label: stageLabels[stage] ?? stage,
      matches: props.matches.filter(m => m.stage === stage)
    }))
)

function isWinner(match: Match, side: 'home' | 'away'): boolean {
  if (match.score.winner === 'HOME_TEAM') return side === 'home'
  if (match.score.winner === 'AWAY_TEAM') return side === 'away'
  return false
}

function isDraw(match: Match): boolean {
  return match.score.winner === 'DRAW'
}
</script>

<template>
  <section>
    <div v-if="knockoutStages.length === 0" class="text-slate-400 text-sm py-6 text-center">
      Fazele eliminatorii nu au început încă.
    </div>

    <div v-else class="flex flex-col gap-8">
      <div v-for="stageGroup in knockoutStages" :key="stageGroup.stage">
        <!-- Stage header -->
        <h3 class="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
          <span class="w-2 h-2 rounded-full bg-purple-400 inline-block"></span>
          {{ stageGroup.label }}
        </h3>

        <!-- Matches grid: 1 col mobile, 2 col md, wider stages get more cols -->
        <div
          :class="[
            'grid gap-3',
            stageGroup.stage === 'FINAL' || stageGroup.stage === 'THIRD_PLACE'
              ? 'grid-cols-1 max-w-sm'
              : stageGroup.stage === 'SEMI_FINALS'
                ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          ]"
        >
          <div
            v-for="match in stageGroup.matches"
            :key="match.id"
            class="bg-wc-card border border-wc-border rounded-xl overflow-hidden"
          >
            <!-- Home team row -->
            <div
              :class="[
                'flex items-center gap-3 px-4 py-3 border-b border-wc-border',
                isWinner(match, 'home') ? 'bg-slate-700/60' : ''
              ]"
            >
              <span :class="`fi fi-${countryCode(match.homeTeam)} text-xl rounded flex-shrink-0`"></span>
              <span
                :class="[
                  'text-sm flex-1 truncate',
                  isWinner(match, 'home') ? 'text-white font-bold' : 'text-slate-300'
                ]"
              >
                {{ match.homeTeam.shortName }}
              </span>
              <span
                :class="[
                  'text-sm font-bold tabular-nums ml-2',
                  isWinner(match, 'home') ? 'text-white' : 'text-slate-400'
                ]"
              >
                {{ match.score.fullTime.home ?? '–' }}
              </span>
            </div>

            <!-- Away team row -->
            <div
              :class="[
                'flex items-center gap-3 px-4 py-3',
                isWinner(match, 'away') ? 'bg-slate-700/60' : ''
              ]"
            >
              <span :class="`fi fi-${countryCode(match.awayTeam)} text-xl rounded flex-shrink-0`"></span>
              <span
                :class="[
                  'text-sm flex-1 truncate',
                  isWinner(match, 'away') ? 'text-white font-bold' : 'text-slate-300'
                ]"
              >
                {{ match.awayTeam.shortName }}
              </span>
              <span
                :class="[
                  'text-sm font-bold tabular-nums ml-2',
                  isWinner(match, 'away') ? 'text-white' : 'text-slate-400'
                ]"
              >
                {{ match.score.fullTime.away ?? '–' }}
              </span>
            </div>

            <!-- Date footer (if not yet played) -->
            <div
              v-if="match.status === 'TIMED' || match.status === 'SCHEDULED'"
              class="px-4 py-2 bg-slate-800/40 border-t border-wc-border"
            >
              <span class="text-xs text-slate-400">
                {{ formatMatchDate(match.utcDate) }} · {{ formatMatchTime(match.utcDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
