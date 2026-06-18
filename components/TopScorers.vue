<script setup lang="ts">
import type { Scorer } from '~/composables/useFootball'

defineProps<{ scorers: Scorer[] }>()

const { countryCode } = useFootball()

function flagCode(scorer: Scorer): string {
  return countryCode(scorer.team)
}
</script>

<template>
  <section>
    <h2 class="text-xl font-bold text-white mb-4 flex items-center gap-2">
      <span class="w-2 h-2 rounded-full bg-wc-gold inline-block"></span>
      Marcatori Top
    </h2>

    <div v-if="scorers.length === 0" class="text-slate-400 text-sm py-6 text-center">
      Nu sunt date disponibile încă.
    </div>

    <div v-else class="bg-wc-card border border-wc-border rounded-xl overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="text-slate-400 text-xs border-b border-wc-border">
            <th class="text-left px-4 py-3 w-8">#</th>
            <th class="text-left px-2 py-3">Jucător</th>
            <th class="text-left px-2 py-3 hidden sm:table-cell">Echipă</th>
            <th class="text-center px-3 py-3 text-wc-gold font-bold">G</th>
            <th class="text-center px-3 py-3">A</th>
            <th class="text-center px-3 py-3 hidden sm:table-cell">Pen.</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(scorer, idx) in scorers"
            :key="scorer.player.id"
            class="border-b border-wc-border last:border-0 hover:bg-slate-800/40 transition-colors"
          >
            <td class="px-4 py-3 text-slate-400 font-mono text-xs">{{ idx + 1 }}</td>
            <td class="px-2 py-3">
              <div class="flex items-center gap-2">
                <span :class="`fi fi-${flagCode(scorer)} flex-shrink-0 text-base rounded`"></span>
                <span class="text-white font-medium">{{ scorer.player.name }}</span>
              </div>
            </td>
            <td class="px-2 py-3 hidden sm:table-cell">
              <div class="flex items-center gap-1.5 text-slate-400 text-xs">
                <img :src="scorer.team.crest" :alt="scorer.team.shortName" class="w-4 h-4 object-contain" />
                {{ scorer.team.shortName }}
              </div>
            </td>
            <td class="px-3 py-3 text-center">
              <span class="text-wc-gold font-black text-base">{{ scorer.goals }}</span>
            </td>
            <td class="px-3 py-3 text-center text-slate-300">
              {{ scorer.assists ?? 0 }}
            </td>
            <td class="px-3 py-3 text-center text-slate-400 hidden sm:table-cell text-xs">
              {{ scorer.penalties ?? 0 }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <p class="text-xs text-slate-600 mt-3 text-center">G = goluri &nbsp;·&nbsp; A = assist-uri &nbsp;·&nbsp; Pen. = penalty-uri marcate</p>
  </section>
</template>
