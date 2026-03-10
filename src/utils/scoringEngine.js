/**
 * Calculate total season fantasy points for a player.
 */
export function calculatePoints(player, pointValues) {
  let total = 0;
  for (const [stat, pts] of Object.entries(pointValues)) {
    if (player[stat] !== undefined && player[stat] !== null) {
      total += player[stat] * pts;
    }
  }
  return Math.round(total * 10) / 10;
}

/**
 * Calculate per-matchup (weekly) points for a player.
 *
 * For hitters: season points / number of matchup weeks (typically ~23 in a season)
 * For pitchers: season points normalized to the configured avg starts per matchup.
 *   - SP: (season pts / total starts) * avg matchup starts for that pitcher
 *   - RP: season points / matchup weeks (they pitch multiple appearances per week)
 *
 * matchupStarts = how many SP starts your team averages per matchup week
 * matchupWeeks = total matchup weeks in the season (default 23)
 */
export function calculateMatchupPoints(player, pointValues, matchupStarts = 7, matchupWeeks = 21) {
  const seasonPts = calculatePoints(player, pointValues);
  const isPitcher = player.pos === "SP" || player.pos === "RP";

  if (!isPitcher) {
    // Hitters: per-week average
    const gamesPerWeek = (player.G || 140) / matchupWeeks;
    return {
      seasonPoints: seasonPts,
      perMatchup: Math.round((seasonPts / matchupWeeks) * 10) / 10,
      perGame: player.G ? Math.round((seasonPts / player.G) * 10) / 10 : 0,
      gamesPerWeek: Math.round(gamesPerWeek * 10) / 10,
    };
  }

  if (player.pos === "SP") {
    // Starters: value per start, then scale by team's matchup starts budget.
    // matchupStarts = total SP starts your team averages per matchup week.
    // With more starts available, each SP contributes more weekly points.
    const totalStarts = player.GS || 1;
    const perStart = seasonPts / totalStarts;
    const pitcherStartsPerWeek = totalStarts / matchupWeeks;
    // perMatchup scales with matchupStarts: more team starts → more pitcher value
    const perMatchup = perStart * pitcherStartsPerWeek * (matchupStarts / 7);

    return {
      seasonPoints: seasonPts,
      perStart: Math.round(perStart * 10) / 10,
      startsPerWeek: Math.round(pitcherStartsPerWeek * 100) / 100,
      perMatchup: Math.round(perMatchup * 10) / 10,
    };
  }

  // Relievers: per-week average based on appearances
  const appsPerWeek = (player.G || 60) / matchupWeeks;
  return {
    seasonPoints: seasonPts,
    perMatchup: Math.round((seasonPts / matchupWeeks) * 10) / 10,
    appsPerWeek: Math.round(appsPerWeek * 10) / 10,
  };
}

/**
 * Rank players by H2H points with matchup context.
 */
export function rankByH2HPoints(players, pointValues, matchupStarts = 7, matchupWeeks = 21) {
  const scored = players.map((p) => {
    const matchup = calculateMatchupPoints(p, pointValues, matchupStarts, matchupWeeks);
    return {
      ...p,
      fantasyPoints: matchup.seasonPoints,
      perMatchup: matchup.perMatchup,
      perStart: matchup.perStart || null,
      startsPerWeek: matchup.startsPerWeek || null,
      perGame: matchup.perGame || null,
      appsPerWeek: matchup.appsPerWeek || null,
    };
  });
  scored.sort((a, b) => b.perMatchup - a.perMatchup);
  return scored.map((p, i) => ({ ...p, rank: i + 1 }));
}

/**
 * Filter players by year.
 * Multi-year selections return individual player-season rows.
 */
export function filterByYear(players, year) {
  if (year === "all") return players;
  if (year === "last2") {
    const cutoff = new Date().getFullYear() - 1;
    return players.filter((p) => p.year >= cutoff);
  }
  if (year === "last3") {
    const cutoff = new Date().getFullYear() - 2;
    return players.filter((p) => p.year >= cutoff);
  }
  return players.filter((p) => p.year === parseInt(year));
}

/**
 * Filter by position type (hitter/pitcher).
 */
export function filterByPosition(players, posType) {
  if (posType === "all") return players;
  if (posType === "hitter") {
    return players.filter((p) => !["SP", "RP"].includes(p.pos));
  }
  return players.filter((p) => ["SP", "RP"].includes(p.pos));
}
