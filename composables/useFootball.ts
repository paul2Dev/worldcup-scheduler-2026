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

const TLA_TO_ISO: Record<string, string> = {
  // Americas
  ARG: 'ar', BRA: 'br', URU: 'uy', COL: 'co', CHI: 'cl', CHL: 'cl',
  PER: 'pe', VEN: 've', PAR: 'py', BOL: 'bo', ECU: 'ec',
  USA: 'us', CAN: 'ca', MEX: 'mx', CRC: 'cr', PAN: 'pa',
  HON: 'hn', JAM: 'jm', TTO: 'tt', HAI: 'ht', SLV: 'sv',
  GTM: 'gt', CUB: 'cu', NCA: 'ni',
  // Europe
  ESP: 'es', FRA: 'fr', GER: 'de', ITA: 'it', POR: 'pt',
  NED: 'nl', BEL: 'be', ENG: 'gb-eng', SCO: 'gb-sct', WAL: 'gb-wls',
  IRL: 'ie', SUI: 'ch', AUT: 'at', SWE: 'se', NOR: 'no',
  DEN: 'dk', FIN: 'fi', POL: 'pl', CRO: 'hr', SRB: 'rs',
  SVK: 'sk', SVN: 'si', CZE: 'cz', HUN: 'hu', ROU: 'ro',
  BUL: 'bg', GRE: 'gr', TUR: 'tr', UKR: 'ua', RUS: 'ru',
  ISL: 'is', ALB: 'al', MKD: 'mk', MNE: 'me', BIH: 'ba',
  LTU: 'lt', LAT: 'lv', EST: 'ee', BLR: 'by', ISR: 'il',
  AZE: 'az', GEO: 'ge', ARM: 'am', CYP: 'cy', MLT: 'mt',
  LUX: 'lu', AND: 'ad', SMR: 'sm', LIE: 'li',
  // Africa
  MAR: 'ma', NGA: 'ng', GHA: 'gh', SEN: 'sn', CMR: 'cm',
  CIV: 'ci', TUN: 'tn', EGY: 'eg', ALG: 'dz', DZA: 'dz',
  RSA: 'za', ZIM: 'zw', ZAM: 'zm', KEN: 'ke', ETH: 'et',
  ANG: 'ao', MOZ: 'mz', UGA: 'ug', TAN: 'tz', MLW: 'mw',
  BEN: 'bj', MLI: 'ml', BFA: 'bf', GUI: 'gn', NIG: 'ne',
  SLE: 'sl', GAM: 'gm', CPV: 'cv', GAB: 'ga', COD: 'cd',
  CGO: 'cg', GNQ: 'gq', GNB: 'gw', TGO: 'tg', LBR: 'lr',
  // Asia & Oceania
  KSA: 'sa', SAU: 'sa', UAE: 'ae', IRN: 'ir', IRQ: 'iq',
  JOR: 'jo', QAT: 'qa', OMA: 'om', BHR: 'bh', KUW: 'kw',
  JPN: 'jp', KOR: 'kr', CHN: 'cn', AUS: 'au', UZB: 'uz',
  KAZ: 'kz', TKM: 'tm', KGZ: 'kg', TJK: 'tj',
  THA: 'th', VIE: 'vn', IDN: 'id', MAS: 'my', PHI: 'ph',
  IND: 'in', PAK: 'pk', SRI: 'lk', BAN: 'bd', NEP: 'np',
  NZL: 'nz', FIJ: 'fj',
}

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
      minute: '2-digit'
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
    if (team.area?.flag) {
      const m = team.area.flag.match(/\/flags\/([A-Za-z-]+)\.svg$/i)
      if (m) return m[1].toLowerCase()
    }
    const iso = TLA_TO_ISO[team.tla?.toUpperCase()]
    return iso ?? team.tla?.toLowerCase().slice(0, 2) ?? ''
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
