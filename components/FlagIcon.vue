<script setup lang="ts">
import type { Team } from '~/composables/useFootball'

const props = defineProps<{
  team: Team
  size?: 'sm' | 'lg'
}>()

const { countryCode } = useFootball()
</script>

<template>
  <img
    v-if="team.area?.flag"
    :src="team.area.flag"
    :alt="team.name"
    :class="[
      'object-contain flex-shrink-0',
      size === 'lg' ? 'h-12 w-16 rounded-lg' : 'h-5 w-8 rounded'
    ]"
  />
  <span
    v-else
    :class="[
      `fi fi-${countryCode(team)} flex-shrink-0`,
      size === 'lg' ? 'text-5xl rounded-lg' : 'text-xl rounded'
    ]"
  ></span>
</template>
