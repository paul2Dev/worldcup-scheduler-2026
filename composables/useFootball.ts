export interface Team {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string
  area?: { flag?: string; code?: string }
}

export interface Score {
  winner: string | null
  duration: string
  fullTime: { home: number | null; away: number | null }
  halfTime: { home: number | null; away: number | null }
}

export interface Match {
  id: number
  utcDate: string
  status: string
  stage: string
  group: string | null
  homeTeam: Team
  awayTeam: Team
  score: Score
}

export interface StandingEntry {
  position: number
  team: Team
  playedGames: number
  won: number
  draw: number
  lost: number
  points: number
  goalsFor: number
  goalsAgainst: number
  goalDifference: number
}

export interface Standing {
  stage: string
  type: string
  group: string
  table: StandingEntry[]
}

import { tlaToIso } from '~/utils/flagCodes'

export function useFootball() {
  async function fetchAllMatches() {
    return await $fetch<{ matches: Match[] }>('/api/matches')
  }

  async function fetchStandings() {
    return await $fetch<{ standings: Standing[] }>('/api/standings')
  }

  function localDateStr(utcDate: string): string {
    return new Intl.DateTimeFormat('en-CA').format(new Date(utcDate))
  }

  function todayLocal(): string {
    return new Intl.DateTimeFormat('en-CA').format(new Date())
  }

  function filterLive(matches: Match[]): Match[] {
    return matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED')
  }

  function filterToday(matches: Match[]): Match[] {
    const t = todayLocal()
    return matches.filter(m =>
      localDateStr(m.utcDate) === t ||
      m.status === 'IN_PLAY' ||
      m.status === 'PAUSED'
    )
  }

  function filterUpcoming(matches: Match[]): Match[] {
    const t = todayLocal()
    return matches.filter(m => {
      const d = localDateStr(m.utcDate)
      return d > t && (m.status === 'TIMED' || m.status === 'SCHEDULED')
    })
  }

  function filterPast(matches: Match[]): Match[] {
    const t = todayLocal()
    return matches.filter(m => localDateStr(m.utcDate) < t && m.status === 'FINISHED')
  }

  const knockoutStages = ['ROUND_OF_16', 'QUARTER_FINALS', 'SEMI_FINALS', 'THIRD_PLACE', 'FINAL']

  function filterKnockout(matches: Match[]): Match[] {
    return matches.filter(m => knockoutStages.includes(m.stage))
  }

  function formatMatchTime(utcDate: string): string {
    return new Intl.DateTimeFormat(undefined, {
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(new Date(utcDate))
  }

  function formatMatchDate(utcDate: string): string {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }).format(new Date(utcDate))
  }

  function minutesUntil(utcDate: string): number {
    return Math.round((new Date(utcDate).getTime() - Date.now()) / 60000)
  }

  function countryCode(team: Team): string {
    return tlaToIso(team.tla)
  }

  return {
    fetchAllMatches,
    fetchStandings,
    filterLive,
    filterToday,
    filterUpcoming,
    filterPast,
    filterKnockout,
    formatMatchTime,
    formatMatchDate,
    minutesUntil,
    countryCode
  }
}
