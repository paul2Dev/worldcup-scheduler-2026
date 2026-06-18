<script setup lang="ts">
import type { TeamDetail, Player, Standing } from '~/composables/useFootball'

const props = defineProps<{ teams: TeamDetail[]; standings: Standing[] }>()

const { selectedTeamId, closeTeam } = useTeamModal()

const team = computed(() =>
  props.teams.find(t => t.id === selectedTeamId.value) ?? null
)

const standingEntry = computed(() => {
  if (!selectedTeamId.value) return null
  for (const s of props.standings) {
    if (s.type !== 'TOTAL') continue
    const entry = s.table.find(e => e.team.id === selectedTeamId.value)
    if (entry) return { entry, group: s.group }
  }
  return null
})

const positions = ['Goalkeeper', 'Defence', 'Midfield', 'Offence'] as const

const squadByPosition = computed(() => {
  if (!team.value) return {}
  const result: Partial<Record<string, Player[]>> = {}
  for (const pos of positions) {
    const players = team.value.squad.filter(p => p.position === pos)
    if (players.length) result[pos] = players
  }
  return result
})

function posLabel(pos: string): string {
  return ({ Goalkeeper: 'Portari', Defence: 'Apărare', Midfield: 'Mijlocași', Offence: 'Atacanți' } as Record<string, string>)[pos] ?? pos
}

function age(dob: string | null): string {
  if (!dob) return '—'
  const d = new Date(dob)
  const now = new Date()
  let a = now.getFullYear() - d.getFullYear()
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) a--
  return String(a)
}

function onBackdrop(e: MouseEvent) {
  if (e.target === e.currentTarget) closeTeam()
}

onMounted(() => {
  const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') closeTeam() }
  window.addEventListener('keydown', handler)
  onUnmounted(() => window.removeEventListener('keydown', handler))
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="team"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        @click="onBackdrop"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <!-- Modal -->
        <Transition
          enter-active-class="transition duration-200"
          enter-from-class="translate-y-4 sm:translate-y-0 sm:scale-95 opacity-0"
          enter-to-class="translate-y-0 sm:scale-100 opacity-100"
          leave-active-class="transition duration-150"
          leave-from-class="translate-y-0 sm:scale-100 opacity-100"
          leave-to-class="translate-y-4 sm:translate-y-0 sm:scale-95 opacity-0"
        >
          <div
            v-if="team"
            class="relative bg-wc-card border border-wc-border rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col"
          >
            <!-- Header -->
            <div class="flex items-center justify-between px-5 py-4 border-b border-wc-border flex-shrink-0">
              <div class="flex items-center gap-3">
                <img :src="team.crest" :alt="team.name" class="w-12 h-12 object-contain" />
                <div>
                  <h2 class="text-white font-bold text-lg leading-tight">{{ team.name }}</h2>
                  <p class="text-slate-400 text-xs mt-0.5">
                    <span v-if="team.founded">Înf. {{ team.founded }}</span>
                    <span v-if="team.founded && team.clubColors"> · </span>
                    <span v-if="team.clubColors">{{ team.clubColors }}</span>
                  </p>
                </div>
              </div>
              <button
                @click="closeTeam()"
                class="text-slate-400 hover:text-white w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-700 transition-colors flex-shrink-0"
              >
                ✕
              </button>
            </div>

            <!-- Scrollable body -->
            <div class="overflow-y-auto flex-1 px-5 py-4 space-y-5">

              <!-- Coach -->
              <div v-if="team.coach">
                <p class="text-xs text-slate-500 uppercase tracking-widest mb-2">Antrenor</p>
                <div class="flex items-center gap-3 bg-slate-800/50 rounded-xl px-4 py-3">
                  <div class="w-9 h-9 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 text-sm font-bold flex-shrink-0">
                    {{ team.coach.name.charAt(0) }}
                  </div>
                  <div>
                    <p class="text-white font-medium text-sm">{{ team.coach.name }}</p>
                    <p class="text-slate-400 text-xs">
                      {{ team.coach.nationality }}
                      <span v-if="team.coach.dateOfBirth"> · {{ age(team.coach.dateOfBirth) }} ani</span>
                    </p>
                  </div>
                </div>
              </div>

              <!-- Standing stats -->
              <div v-if="standingEntry">
                <p class="text-xs text-slate-500 uppercase tracking-widest mb-2">
                  {{ standingEntry.group }} · Locul {{ standingEntry.entry.position }}
                </p>
                <div class="grid grid-cols-4 gap-2">
                  <div class="bg-slate-800/50 rounded-xl px-3 py-2.5 text-center">
                    <p class="text-wc-gold font-black text-xl">{{ standingEntry.entry.points }}</p>
                    <p class="text-slate-500 text-xs mt-0.5">Pct</p>
                  </div>
                  <div class="bg-slate-800/50 rounded-xl px-3 py-2.5 text-center">
                    <p class="text-white font-bold text-xl">{{ standingEntry.entry.playedGames }}</p>
                    <p class="text-slate-500 text-xs mt-0.5">Jucate</p>
                  </div>
                  <div class="bg-slate-800/50 rounded-xl px-3 py-2.5 text-center">
                    <p class="text-green-400 font-bold text-xl">{{ standingEntry.entry.goalsFor }}</p>
                    <p class="text-slate-500 text-xs mt-0.5">Marcate</p>
                  </div>
                  <div class="bg-slate-800/50 rounded-xl px-3 py-2.5 text-center">
                    <p class="text-red-400 font-bold text-xl">{{ standingEntry.entry.goalsAgainst }}</p>
                    <p class="text-slate-500 text-xs mt-0.5">Primite</p>
                  </div>
                </div>
                <div class="flex gap-2 mt-2 text-xs text-slate-400 justify-center">
                  <span class="text-green-400">{{ standingEntry.entry.won }}V</span>
                  <span>·</span>
                  <span>{{ standingEntry.entry.draw }}E</span>
                  <span>·</span>
                  <span class="text-red-400">{{ standingEntry.entry.lost }}Î</span>
                  <span>·</span>
                  <span>
                    GD {{ standingEntry.entry.goalDifference > 0 ? '+' : '' }}{{ standingEntry.entry.goalDifference }}
                  </span>
                </div>
              </div>

              <!-- Squad by position -->
              <div v-for="(players, pos) in squadByPosition" :key="pos">
                <p class="text-xs text-slate-500 uppercase tracking-widest mb-2">
                  {{ posLabel(String(pos)) }}
                  <span class="text-slate-600 ml-1">({{ players!.length }})</span>
                </p>
                <div class="bg-slate-800/30 rounded-xl overflow-hidden">
                  <div
                    v-for="(player, idx) in players"
                    :key="player.id"
                    :class="['flex items-center justify-between px-4 py-2.5 text-sm', idx < players!.length - 1 ? 'border-b border-wc-border/40' : '']"
                  >
                    <span class="text-white">{{ player.name }}</span>
                    <div class="flex items-center gap-3 text-xs text-slate-400">
                      <span>{{ player.nationality }}</span>
                      <span class="text-slate-600">{{ age(player.dateOfBirth) }} ani</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>
