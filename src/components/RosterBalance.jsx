import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const HITTER_COLOR = "#3b82f6";
const PITCHER_COLOR = "#f59e0b";

function Section({ title, subtitle, children }) {
  return (
    <div className="roster-balance">
      <h3>{title}</h3>
      {subtitle && <p className="roster-subtitle">{subtitle}</p>}
      <div className="balance-grid">{children}</div>
    </div>
  );
}

function SummaryCards({ label, total, hitterTotal, pitcherTotal, hitterSlots, pitcherSlots }) {
  const hitterPct = total > 0 ? Math.round((hitterTotal / total) * 100) : 0;
  const pitcherPct = 100 - hitterPct;
  const hitterPerSlot = hitterSlots > 0 ? Math.round((hitterTotal / hitterSlots) * 10) / 10 : 0;
  const pitcherPerSlot = pitcherSlots > 0 ? Math.round((pitcherTotal / pitcherSlots) * 10) / 10 : 0;

  return (
    <>
      <div className="balance-cards">
        <div className="balance-card">
          <div className="balance-card-label">{label}</div>
          <div className="balance-card-value">{total.toFixed(1)} pts</div>
        </div>
        <div className="balance-card hitter">
          <div className="balance-card-label">Hitters</div>
          <div className="balance-card-value">{hitterTotal.toFixed(1)} pts ({hitterPct}%)</div>
          <div className="balance-card-sub">{hitterPerSlot} pts/slot</div>
        </div>
        <div className="balance-card pitcher">
          <div className="balance-card-label">Pitchers</div>
          <div className="balance-card-value">{pitcherTotal.toFixed(1)} pts ({pitcherPct}%)</div>
          <div className="balance-card-sub">{pitcherPerSlot} pts/slot</div>
        </div>
      </div>
      <div className="split-bar-container">
        <div className="split-bar">
          <div className="split-bar-segment hitter" style={{ width: `${hitterPct}%` }}>
            {hitterPct}% Hit
          </div>
          <div className="split-bar-segment pitcher" style={{ width: `${pitcherPct}%` }}>
            {pitcherPct}% Pitch
          </div>
        </div>
      </div>
    </>
  );
}

// Map MLB primary positions to fantasy-eligible roster slots
const OF_POSITIONS = new Set(["LF", "CF", "RF", "OF"]);
function isOFEligible(pos) { return OF_POSITIONS.has(pos); }

/**
 * Build league-wide slot tiers.
 *
 * For a 10-team league with 3 OF slots, there are 30 OF spots league-wide.
 * We split those into tiers: OF1 = avg of OFs ranked 1-10, OF2 = 11-20, OF3 = 21-30.
 *
 * Pitchers use SP and RP as positions (not generic P slots), since what matters
 * is the GS-driven value for starters and appearance-driven value for relievers.
 * SP depth = teams * P slots (most P slots are filled by SPs).
 * RP depth = teams * RP slots.
 *
 * Bench (BE) and IL slots consume additional players from the pool without
 * scoring — this deepens the replacement level at each position.
 * We estimate ~60% of bench/IL are hitters, ~40% pitchers.
 */
function buildLeagueSlots(rankings, roster) {
  const teams = roster.teams || 10;
  const benchSlots = roster.BE || 0;
  const ilSlots = roster.IL || 0;
  const hitters = rankings.filter((p) => p.pos !== "SP" && p.pos !== "RP");
  const sps = rankings.filter((p) => p.pos === "SP").sort((a, b) => b.perMatchup - a.perMatchup);
  const rps = rankings.filter((p) => p.pos === "RP").sort((a, b) => b.perMatchup - a.perMatchup);

  // Track used players across all slots to avoid double-counting
  const used = new Set();
  const key = (p) => `${p.name}-${p.year}`;

  function pickFromPool(pool, count) {
    const picked = [];
    for (const p of pool) {
      if (picked.length >= count) break;
      if (!used.has(key(p))) {
        picked.push(p);
        used.add(key(p));
      }
    }
    return picked;
  }

  function avgStat(players, stat) {
    if (players.length === 0) return 0;
    return players.reduce((s, p) => s + (p[stat] || 0), 0) / players.length;
  }

  // Bench/IL depth factor: each active slot has some fraction of a bench player behind it.
  // E.g., 15 active + 5 bench + 3 IL = 23 total, so depth factor = 23/15 ≈ 1.53
  const activeSlots = (roster.C || 0) + (roster["1B"] || 0) + (roster["2B"] || 0)
    + (roster["3B"] || 0) + (roster.SS || 0) + (roster.OF || 0) + (roster.UTIL || 0)
    + (roster.P || 0) + (roster.RP || 0);
  const totalRoster = activeSlots + benchSlots + ilSlots;
  const depthFactor = activeSlots > 0 ? totalRoster / activeSlots : 1;

  function buildTiers(pos, pool, slotsPerTeam, type) {
    // Total rostered at this position = active slots + proportional bench/IL depth
    const totalNeeded = Math.round(slotsPerTeam * teams * depthFactor);
    const picked = pickFromPool(pool, totalNeeded);
    const tiers = [];
    for (let tier = 0; tier < slotsPerTeam; tier++) {
      const tierStart = tier * teams;
      const tierEnd = Math.min(tierStart + teams, picked.length);
      const tierPlayers = picked.slice(tierStart, tierEnd);
      const label = slotsPerTeam > 1 ? `${pos}${tier + 1}` : pos;
      tiers.push({
        name: label,
        type,
        tierPlayers,
        avgWeekly: Math.round(avgStat(tierPlayers, "perMatchup") * 10) / 10,
        avgSeason: Math.round(avgStat(tierPlayers, "fantasyPoints")),
        topPlayer: tierPlayers[0]?.name || "—",
        bottomPlayer: tierPlayers[tierPlayers.length - 1]?.name || "—",
        depth: tierPlayers.length,
      });
    }
    return tiers;
  }

  const slots = [];

  // Hitter position pools
  const hitterPools = {
    C: hitters.filter((p) => p.pos === "C"),
    SS: hitters.filter((p) => p.pos === "SS"),
    "2B": hitters.filter((p) => p.pos === "2B"),
    "3B": hitters.filter((p) => p.pos === "3B"),
    "1B": hitters.filter((p) => p.pos === "1B"),
    OF: hitters.filter((p) => isOFEligible(p.pos)),
  };

  // Fill scarce positions first
  const hitterOrder = [
    { pos: "C", count: roster.C || 0 },
    { pos: "SS", count: roster.SS || 0 },
    { pos: "2B", count: roster["2B"] || 0 },
    { pos: "3B", count: roster["3B"] || 0 },
    { pos: "1B", count: roster["1B"] || 0 },
    { pos: "OF", count: roster.OF || 0 },
  ];

  for (const { pos, count } of hitterOrder) {
    if (count > 0) slots.push(...buildTiers(pos, hitterPools[pos], count, "hitter"));
  }

  // UTIL — best remaining hitters
  const utilCount = roster.UTIL || 0;
  if (utilCount > 0) {
    slots.push(...buildTiers("UTIL", hitters, utilCount, "hitter"));
  }

  // Pitchers: SP and RP as actual positions
  // SP slots = P roster slots (most teams fill P slots with starters)
  const spSlotsPerTeam = roster.P || 0;
  if (spSlotsPerTeam > 0) {
    slots.push(...buildTiers("SP", sps, spSlotsPerTeam, "pitcher"));
  }

  // RP slots
  const rpSlotsPerTeam = roster.RP || 0;
  if (rpSlotsPerTeam > 0) {
    slots.push(...buildTiers("RP", rps, rpSlotsPerTeam, "pitcher"));
  }

  return slots;
}

export default function RosterBalance({ rankings, roster }) {
  if (!rankings || rankings.length === 0) return null;

  const teams = roster.teams || 10;
  const hitterSlots = (roster.C || 0) + (roster["1B"] || 0) + (roster["2B"] || 0)
    + (roster["3B"] || 0) + (roster.SS || 0) + (roster.OF || 0) + (roster.UTIL || 0);
  const pitcherSlots = (roster.P || 0) + (roster.RP || 0);

  const leagueSlots = buildLeagueSlots(rankings, roster);

  // Average team totals
  const hitterWeekly = leagueSlots
    .filter((s) => s.type === "hitter")
    .reduce((sum, s) => sum + s.avgWeekly, 0);
  const pitcherWeekly = leagueSlots
    .filter((s) => s.type === "pitcher")
    .reduce((sum, s) => sum + s.avgWeekly, 0);
  const weeklyTotal = hitterWeekly + pitcherWeekly;

  const hitterSeason = leagueSlots
    .filter((s) => s.type === "hitter")
    .reduce((sum, s) => sum + s.avgSeason, 0);
  const pitcherSeason = leagueSlots
    .filter((s) => s.type === "pitcher")
    .reduce((sum, s) => sum + s.avgSeason, 0);
  const seasonTotal = hitterSeason + pitcherSeason;

  // Chart data
  const positionValue = leagueSlots.map((slot) => ({
    name: slot.name,
    avgPtsPerSlot: slot.avgWeekly,
    avgSeasonPerSlot: slot.avgSeason,
    type: slot.type,
    topPlayer: slot.topPlayer,
    bottomPlayer: slot.bottomPlayer,
    depth: slot.depth,
  }));

  const spSlots = roster.P || 0;
  const rpSlots = roster.RP || 0;
  const benchSlots = roster.BE || 0;
  const ilSlots = roster.IL || 0;
  const activePerTeam = hitterSlots + pitcherSlots;
  const totalPerTeam = activePerTeam + benchSlots + ilSlots;
  const subtitleText = `${teams}-team league — ${activePerTeam} active (${hitterSlots} hit, ${spSlots} SP, ${rpSlots} RP) + ${benchSlots} BE + ${ilSlots} IL = ${totalPerTeam} roster spots (${totalPerTeam * teams} players rostered league-wide)`;

  return (
    <>
      {/* Weekly section */}
      <Section title="Avg Team Weekly Projection" subtitle={subtitleText}>
        <SummaryCards
          label="Avg Team Weekly Total"
          total={weeklyTotal}
          hitterTotal={hitterWeekly}
          pitcherTotal={pitcherWeekly}
          hitterSlots={hitterSlots}
          pitcherSlots={pitcherSlots}
        />
        <div className="slot-chart">
          <h4>Points/Week per Roster Slot</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={positionValue} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8" }} domain={[0, 50]} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#e2e8f0" }}
                formatter={(value, name, props) => {
                  const d = props.payload;
                  return [
                    `${value} pts/wk avg (${d.depth} players)`,
                    `${d.topPlayer} → ${d.bottomPlayer}`,
                  ];
                }}
              />
              <Bar dataKey="avgPtsPerSlot" radius={[4, 4, 0, 0]}>
                {positionValue.map((entry, index) => (
                  <Cell key={index} fill={entry.type === "pitcher" ? PITCHER_COLOR : HITTER_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>

      {/* Season section */}
      <Section title="Avg Team Season Projection">
        <SummaryCards
          label="Avg Team Season Total"
          total={seasonTotal}
          hitterTotal={hitterSeason}
          pitcherTotal={pitcherSeason}
          hitterSlots={hitterSlots}
          pitcherSlots={pitcherSlots}
        />
        <div className="slot-chart">
          <h4>Season Points per Roster Slot</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={positionValue} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" tick={{ fill: "#94a3b8", fontSize: 12 }} />
              <YAxis tick={{ fill: "#94a3b8" }} />
              <Tooltip
                contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, color: "#e2e8f0" }}
                labelStyle={{ color: "#e2e8f0" }}
                itemStyle={{ color: "#e2e8f0" }}
                formatter={(value, name, props) => {
                  const d = props.payload;
                  return [
                    `${value} pts avg (${d.depth} players)`,
                    `${d.topPlayer} → ${d.bottomPlayer}`,
                  ];
                }}
              />
              <Bar dataKey="avgSeasonPerSlot" radius={[4, 4, 0, 0]}>
                {positionValue.map((entry, index) => (
                  <Cell key={index} fill={entry.type === "pitcher" ? PITCHER_COLOR : HITTER_COLOR} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Section>
    </>
  );
}
