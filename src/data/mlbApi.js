const BASE_URL = "https://statsapi.mlb.com/api/v1";

/**
 * Fetch hitters for a given season from the MLB Stats API.
 * Fetches qualified hitters first, then supplements with non-qualified
 * to ensure enough depth at every position (especially C).
 */
async function fetchHitters(season) {
  // Qualified hitters (502+ PA) — the core
  const qualUrl = `${BASE_URL}/stats?stats=season&group=hitting&season=${season}&playerPool=QUALIFIED&limit=150&sortStat=ops&order=desc`;
  // Non-qualified with decent playing time (catches part-time C, platoon players)
  const allUrl = `${BASE_URL}/stats?stats=season&group=hitting&season=${season}&playerPool=ALL&limit=300&sortStat=plateAppearances&order=desc`;

  const [qualRes, allRes] = await Promise.all([
    fetch(qualUrl).then((r) => r.json()),
    fetch(allUrl).then((r) => r.json()),
  ]);

  const qualSplits = qualRes.stats?.[0]?.splits || [];
  const allSplits = allRes.stats?.[0]?.splits || [];

  const seen = new Set();
  const results = [];

  function mapHitter(s) {
    const st = s.stat;
    // Skip players with very few PA (< 200)
    if (st.plateAppearances < 200) return null;
    const key = `${s.player.fullName}-${s.season}`;
    if (seen.has(key)) return null;
    seen.add(key);
    const singles = st.hits - st.doubles - st.triples - st.homeRuns;
    const xbh = st.doubles + st.triples + st.homeRuns;
    return {
      name: s.player.fullName,
      team: s.team?.abbreviation || s.team?.name?.slice(0, 3).toUpperCase() || "???",
      year: parseInt(s.season),
      pos: s.position?.abbreviation || "DH",
      G: st.gamesPlayed,
      AB: st.atBats,
      R: st.runs,
      H: st.hits,
      "1B": singles,
      "2B": st.doubles,
      "3B": st.triples,
      HR: st.homeRuns,
      RBI: st.rbi,
      BB: st.baseOnBalls,
      K_hit: st.strikeOuts,
      SB: st.stolenBases,
      CS: st.caughtStealing,
      HBP: st.hitByPitch,
      TB: st.totalBases,
      XBH: xbh,
      GIDP: st.groundIntoDoublePlay,
      AVG: parseFloat(st.avg),
      OBP: parseFloat(st.obp),
      SLG: parseFloat(st.slg),
      OPS: parseFloat(st.ops),
    };
  }

  // Add qualified first (higher quality), then fill from ALL pool
  for (const s of qualSplits) {
    const h = mapHitter(s);
    if (h) results.push(h);
  }
  for (const s of allSplits) {
    const h = mapHitter(s);
    if (h) results.push(h);
  }

  return results;
}

/**
 * Fetch top starting pitchers for a given season.
 * Fetches qualified starters plus non-qualified with 10+ GS for depth.
 */
async function fetchStarters(season) {
  const qualUrl = `${BASE_URL}/stats?stats=season&group=pitching&season=${season}&playerPool=QUALIFIED&limit=80&sortStat=earnedRunAverage&order=asc`;
  const allUrl = `${BASE_URL}/stats?stats=season&group=pitching&season=${season}&playerPool=ALL&limit=150&sortStat=gamesStarted&order=desc`;

  const [qualRes, allRes] = await Promise.all([
    fetch(qualUrl).then((r) => r.json()),
    fetch(allUrl).then((r) => r.json()),
  ]);

  const qualSplits = qualRes.stats?.[0]?.splits || [];
  const allSplits = allRes.stats?.[0]?.splits || [];

  const seen = new Set();
  const results = [];

  function addStarter(s) {
    if (s.stat.gamesStarted < 10) return;
    if (s.stat.gamesStarted <= s.stat.gamesPlayed * 0.5) return;
    const key = `${s.player.fullName}-${s.season}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push(mapPitcher(s, "SP"));
  }

  for (const s of qualSplits) addStarter(s);
  for (const s of allSplits) addStarter(s);

  return results;
}

/**
 * Fetch top relievers for a given season.
 * Fetches by saves (closers) and by appearances (setup men with holds).
 */
async function fetchRelievers(season) {
  const savesUrl = `${BASE_URL}/stats?stats=season&group=pitching&season=${season}&playerPool=ALL&limit=40&sortStat=saves&order=desc`;
  const appsUrl = `${BASE_URL}/stats?stats=season&group=pitching&season=${season}&playerPool=ALL&limit=80&sortStat=gamesPlayed&order=desc`;

  const [savesRes, appsRes] = await Promise.all([
    fetch(savesUrl).then((r) => r.json()),
    fetch(appsUrl).then((r) => r.json()),
  ]);

  const savesSplits = savesRes.stats?.[0]?.splits || [];
  const appsSplits = appsRes.stats?.[0]?.splits || [];

  const seen = new Set();
  const results = [];

  function addReliever(s) {
    // Must be a reliever (few starts) with meaningful appearances
    if (s.stat.gamesStarted > s.stat.gamesPlayed * 0.2) return;
    if (s.stat.gamesPlayed < 20) return;
    const key = `${s.player.fullName}-${s.season}`;
    if (seen.has(key)) return;
    seen.add(key);
    results.push(mapPitcher(s, "RP"));
  }

  for (const s of savesSplits) addReliever(s);
  for (const s of appsSplits) addReliever(s);

  return results;
}

function mapPitcher(s, posLabel) {
  const st = s.stat;
  const ip = parseFloat(st.inningsPitched);
  return {
    name: s.player.fullName,
    team: s.team?.abbreviation || s.team?.name?.slice(0, 3).toUpperCase() || "???",
    year: parseInt(s.season),
    pos: posLabel,
    G: st.gamesPlayed,
    GS: st.gamesStarted,
    W: st.wins,
    L: st.losses,
    SV: st.saves,
    HD: st.holds,
    IP: ip,
    H_pitch: st.hits,
    ER: st.earnedRuns,
    BB_pitch: st.baseOnBalls,
    K: st.strikeOuts,
    K_pitch: st.strikeOuts,
    HR_pitch: st.homeRuns,
    ERA: parseFloat(st.era),
    WHIP: parseFloat(st.whip),
    QS: null, // MLB API doesn't provide QS directly; estimated below
    CG: st.completeGames,
    SO: st.shutouts,
    BS: st.blownSaves || 0,
    BK: st.balks || 0,
    "SV+HD": (st.saves || 0) + (st.holds || 0),
    HBP_pitch: st.hitByPitch,
  };
}

/**
 * Estimate quality starts from season stats.
 * A QS = 6+ IP and <= 3 ER in a single start.
 *
 * Uses IP/GS and ERA to model the probability of a QS per start,
 * then multiplies by total starts. Calibrated against historical QS rates:
 *   - Elite SP (ERA < 2.5, 6+ IP/GS): ~70-75% QS rate
 *   - Good SP (ERA 2.5-3.5, 5.5+ IP/GS): ~55-65% QS rate
 *   - Average SP (ERA 3.5-4.5, 5+ IP/GS): ~35-45% QS rate
 *   - Below avg (ERA > 4.5): ~20-30% QS rate
 */
function estimateQualityStarts(pitcher) {
  if (!pitcher.GS || pitcher.GS === 0) return 0;

  const ipPerStart = pitcher.IP / pitcher.GS;
  const era = pitcher.ERA;

  // P(6+ IP) based on average innings per start
  let pDeep;
  if (ipPerStart >= 6.5) pDeep = 0.85;
  else if (ipPerStart >= 6.0) pDeep = 0.70;
  else if (ipPerStart >= 5.5) pDeep = 0.50;
  else if (ipPerStart >= 5.0) pDeep = 0.35;
  else pDeep = 0.20;

  // P(<= 3 ER) based on ERA
  let pLowER;
  if (era <= 2.0) pLowER = 0.90;
  else if (era <= 2.5) pLowER = 0.85;
  else if (era <= 3.0) pLowER = 0.78;
  else if (era <= 3.5) pLowER = 0.70;
  else if (era <= 4.0) pLowER = 0.60;
  else if (era <= 4.5) pLowER = 0.50;
  else if (era <= 5.0) pLowER = 0.40;
  else pLowER = 0.30;

  const qsRate = pDeep * pLowER;
  return Math.round(pitcher.GS * qsRate);
}

/**
 * Fetch all data for a single season.
 */
async function fetchSeason(season) {
  const [hitters, starters, relievers] = await Promise.all([
    fetchHitters(season),
    fetchStarters(season),
    fetchRelievers(season),
  ]);

  const pitchers = [...starters, ...relievers].map((p) => ({
    ...p,
    QS: p.QS ?? estimateQualityStarts(p),
  }));

  // Deduplicate pitchers by name+year (reliever sort may overlap with starter sort)
  const seen = new Set();
  const dedupedPitchers = pitchers.filter((p) => {
    const key = `${p.name}-${p.year}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return { hitters, pitchers: dedupedPitchers };
}

/**
 * Fetch all data for multiple seasons.
 * Returns { hitters: [...], pitchers: [...] }
 */
export async function fetchAllSeasons(seasons = [2021, 2022, 2023, 2024, 2025], onProgress) {
  const results = [];
  for (let i = 0; i < seasons.length; i++) {
    onProgress?.({ season: seasons[i], done: i, total: seasons.length });
    results.push(await fetchSeason(seasons[i]));
  }
  onProgress?.({ season: null, done: seasons.length, total: seasons.length });

  const allHitters = results.flatMap((r) => r.hitters);
  const allPitchers = results.flatMap((r) => r.pitchers);

  return { hitters: allHitters, pitchers: allPitchers };
}

/**
 * Cache key for localStorage.
 */
const CACHE_KEY = "fantasy-baseball-mlb-data-v4";
const CACHE_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Fetch with localStorage caching to avoid hammering the API.
 */
export async function fetchWithCache(seasons = [2021, 2022, 2023, 2024, 2025], { onProgress, forceRefresh = false } = {}) {
  if (!forceRefresh) {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS) {
          return data;
        }
      }
    } catch {
      // cache miss or corrupt, proceed to fetch
    }
  }

  const data = await fetchAllSeasons(seasons, onProgress);

  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {
    // storage full, ignore
  }

  return data;
}
