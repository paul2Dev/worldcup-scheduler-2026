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

  // Asia
  KSA: 'sa', SAU: 'sa', UAE: 'ae', IRN: 'ir', IRQ: 'iq',
  JOR: 'jo', QAT: 'qa', OMA: 'om', BHR: 'bh', KUW: 'kw',
  JPN: 'jp', KOR: 'kr', CHN: 'cn', AUS: 'au', UZB: 'uz',
  KAZ: 'kz', TKM: 'tm', KGZ: 'kg', TJK: 'tj',
  THA: 'th', VIE: 'vn', IDN: 'id', MAS: 'my', PHI: 'ph',
  IND: 'in', PAK: 'pk', SRI: 'lk', BAN: 'bd', NEP: 'np',
}

export function tlaToIso(tla: string): string {
  return TLA_TO_ISO[tla?.toUpperCase()] ?? tla?.toLowerCase().slice(0, 2) ?? ''
}
