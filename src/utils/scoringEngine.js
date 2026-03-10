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
 * Calculate season points and derived averages for a player.
 *
 * Returns season totals as the primary metric, with a simple weekly average
 * (seasonPoints / matchupWeeks) for balance visualization.
 */
export function calculateSeasonStats(player, pointValues, matchupWeeks = 21) {
  const seasonPts = calculatePoints(player, pointValues);
  const weeklyAvg = Math.round((seasonPts / matchupWeeks) * 10) / 10;
  const isPitcher = player.pos === "SP" || player.pos === "RP";

  if (!isPitcher) {
    return {
      seasonPoints: seasonPts,
      weeklyAvg,
      perGame: player.G ? Math.round((seasonPts / player.G) * 10) / 10 : 0,
    };
  }

  if (player.pos === "SP") {
    const totalStarts = player.GS || 1;
    return {
      seasonPoints: seasonPts,
      weeklyAvg,
      perStart: Math.round((seasonPts / totalStarts) * 10) / 10,
    };
  }

  // Relievers
  return {
    seasonPoints: seasonPts,
    weeklyAvg,
  };
}

/**
 * Rank players by season points.
 */
export function rankByH2HPoints(players, pointValues, matchupWeeks = 21) {
  const scored = players.map((p) => {
    const stats = calculateSeasonStats(p, pointValues, matchupWeeks);
    return {
      ...p,
      fantasyPoints: stats.seasonPoints,
      weeklyAvg: stats.weeklyAvg,
      perStart: stats.perStart || null,
      perGame: stats.perGame || null,
    };
  });
  scored.sort((a, b) => b.fantasyPoints - a.fantasyPoints);
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
