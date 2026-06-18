<script setup lang="ts">
import type { Team } from '~/composables/useFootball'

const props = defineProps<{
  team: Team
  size?: 'sm' | 'lg'
}>()

const { countryCode } = useFootball()
const code = computed(() => countryCode(props.team))
</script>

<template>
  <span
    :class="[
      `fi fi-${code} flex-shrink-0`,
      size === 'lg' ? 'text-5xl rounded-lg' : 'text-xl rounded'
    ]"
  ></span>
</template>
