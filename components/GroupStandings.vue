<script setup lang="ts">
import type { Standing } from '~/composables/useFootball'

defineProps<{ standings: Standing[] }>()
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-wc-gold inline-block"></span>
      Clasament Grupe
    </h2>

    <div v-if="standings.length === 0" class="text-slate-400 text-sm py-6 text-center">
      Clasamentul nu este disponibil încă.
    </div>

    <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="standing in standings.filter(s => s.type === 'TOTAL')"
        :key="standing.group"
        class="bg-wc-card border border-wc-border rounded-xl overflow-hidden"
      >
        <div class="bg-slate-700 px-4 py-2">
          <h3 class="text-wc-gold font-bold text-sm tracking-wide">{{ standing.group }}</h3>
        </div>

        <table class="w-full text-xs">
          <thead>
            <tr class="text-slate-400 border-b border-wc-border">
              <th class="text-left px-3 py-2 w-6">#</th>
              <th class="text-left px-2 py-2">Echipă</th>
              <th class="text-center px-2 py-2">J</th>
              <th class="text-center px-2 py-2">V</th>
              <th class="text-center px-2 py-2">E</th>
              <th class="text-center px-2 py-2">Î</th>
              <th class="text-center px-2 py-2">GD</th>
              <th class="text-center px-3 py-2 font-bold">Pct</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(entry, idx) in standing.table"
              :key="entry.team.id"
              :class="[
                'border-b border-wc-border last:border-0',
                idx < 2 ? 'bg-slate-800/50' : ''
              ]"
            >
              <td class="px-3 py-2 text-slate-400">{{ entry.position }}</td>
              <td class="px-2 py-2">
                <div class="flex items-center gap-1.5">
                  <FlagIcon :team="entry.team" />
                  <span class="text-white">{{ entry.team.tla }}</span>
                </div>
              </td>
              <td class="text-center px-2 py-2 text-slate-300">{{ entry.playedGames }}</td>
              <td class="text-center px-2 py-2 text-slate-300">{{ entry.won }}</td>
              <td class="text-center px-2 py-2 text-slate-300">{{ entry.draw }}</td>
              <td class="text-center px-2 py-2 text-slate-300">{{ entry.lost }}</td>
              <td class="text-center px-2 py-2 text-slate-300">
                {{ entry.goalDifference > 0 ? '+' : '' }}{{ entry.goalDifference }}
              </td>
              <td class="text-center px-3 py-2 font-bold text-white">{{ entry.points }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>
</template>
