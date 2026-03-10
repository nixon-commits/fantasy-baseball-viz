import { useState, useMemo } from "react";
import { CATEGORY_LABELS } from "../data/scoringPresets";

function SortHeader({ label, sortKey, currentSort, onSort, className, title }) {
  const isActive = currentSort.key === sortKey;
  const arrow = isActive ? (currentSort.dir === "asc" ? " \u25B2" : " \u25BC") : "";
  return (
    <th
      className={`${className} sortable`}
      title={title}
      onClick={() => onSort(sortKey)}
    >
      {label}{arrow}
    </th>
  );
}

export default function RankingsTable({ rankings, comparisonRankings, configA, configB }) {
  if (!rankings || rankings.length === 0) {
    return <div className="empty-state">No players match your filters.</div>;
  }

  const isCompare = !!comparisonRankings;
  const labelA = configA?.name || "Format A";
  const labelB = configB?.name || "Format B";

  const [sort, setSort] = useState({ key: "rank", dir: "asc" });

  const handleSort = (key) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "name" || key === "pos" || key === "team" ? "asc" : "desc" }
    );
  };

  // Build a lookup for comparison data
  const compMap = useMemo(() => {
    if (!comparisonRankings) return null;
    const m = new Map();
    for (const p of comparisonRankings) {
      m.set(`${p.name}-${p.year}-${p.pos}`, p);
    }
    return m;
  }, [comparisonRankings]);

  const getCompPlayer = (player) =>
    compMap?.get(`${player.name}-${player.year}-${player.pos}`) ?? null;

  const getRowData = (player) => {
    const isPitcher = player.pos === "SP" || player.pos === "RP";
    const perUnit = isPitcher ? player.perStart : player.perGame;
    const comp = getCompPlayer(player);
    const delta = comp ? player.rank - comp.rank : null;
    const ptsA = player.fantasyPoints ?? 0;
    const ptsB = comp?.fantasyPoints ?? 0;
    const diff = comp ? ptsB - ptsA : null;

    // Compute per-stat scoring change breakdown (B − A)
    let reason = null;
    let breakdown = [];
    if (isCompare && diff !== null && diff !== 0 && configA?.points && configB?.points) {
      const ptsAMap = configA.points;
      const ptsBMap = configB.points;
      const allStats = new Set([...Object.keys(ptsAMap), ...Object.keys(ptsBMap)]);
      const diffDir = diff > 0 ? 1 : -1;
      let bestStat = null;
      let bestImpact = 0;
      for (const stat of allStats) {
        const wA = ptsAMap[stat] ?? 0;
        const wB = ptsBMap[stat] ?? 0;
        const weightDiff = wB - wA;
        if (weightDiff === 0) continue;
        const val = player[stat] ?? 0;
        const impact = val * weightDiff;
        if (Math.round(impact) !== 0) {
          breakdown.push({ stat, label: CATEGORY_LABELS[stat] || stat, impact: Math.round(impact) });
        }
        if (impact * diffDir > 0 && Math.abs(impact) > Math.abs(bestImpact)) {
          bestImpact = impact;
          bestStat = stat;
        }
      }
      breakdown.sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));
      if (bestStat) {
        const label = CATEGORY_LABELS[bestStat] || bestStat;
        const sign = bestImpact > 0 ? "+" : "";
        reason = `${label} (${sign}${Math.round(bestImpact)})`;
      }
    }

    return { isPitcher, perUnit, comp, delta, ptsA, ptsB, diff, reason, breakdown };
  };

  const sorted = useMemo(() => {
    const rows = [...rankings];
    const { key, dir } = sort;
    const mult = dir === "asc" ? 1 : -1;

    rows.sort((a, b) => {
      let va, vb;
      const da = getRowData(a);
      const db = getRowData(b);

      switch (key) {
        case "rank": va = a.rank; vb = b.rank; break;
        case "delta": va = da.delta ?? 0; vb = db.delta ?? 0; break;
        case "name": va = a.name; vb = b.name; return mult * va.localeCompare(vb);
        case "team": va = a.team ?? ""; vb = b.team ?? ""; return mult * va.localeCompare(vb);
        case "year": va = a.year; vb = b.year; break;
        case "pos": va = a.pos; vb = b.pos; return mult * va.localeCompare(vb);
        case "weeklyAvg": va = a.weeklyAvg ?? 0; vb = b.weeklyAvg ?? 0; break;
        case "perUnit": va = da.perUnit ?? 0; vb = db.perUnit ?? 0; break;
        case "qs": va = (a.pos === "SP" || a.pos === "RP") ? (a.QS ?? 0) : -1; vb = (b.pos === "SP" || b.pos === "RP") ? (b.QS ?? 0) : -1; break;
        case "season": va = a.fantasyPoints ?? 0; vb = b.fantasyPoints ?? 0; break;
        case "ptsA": va = da.ptsA; vb = db.ptsA; break;
        case "ptsB": va = da.ptsB; vb = db.ptsB; break;
        case "diff": va = da.diff ?? 0; vb = db.diff ?? 0; break;
        default: va = a.rank; vb = b.rank;
      }
      return mult * (va - vb);
    });

    return rows;
  }, [rankings, comparisonRankings, sort]);

  return (
    <div className="rankings-table-wrapper">
      <table className="rankings-table">
        <thead>
          <tr>
            <SortHeader label="#" sortKey="rank" currentSort={sort} onSort={handleSort} className="rank-col" />
            {isCompare && <SortHeader label="+/-" sortKey="delta" currentSort={sort} onSort={handleSort} className="delta-col" />}
            <SortHeader label="Player" sortKey="name" currentSort={sort} onSort={handleSort} className="name-col" />
            <SortHeader label="Tm" sortKey="team" currentSort={sort} onSort={handleSort} className="team-col" />
            <SortHeader label="Yr" sortKey="year" currentSort={sort} onSort={handleSort} className="year-col" />
            <SortHeader label="Pos" sortKey="pos" currentSort={sort} onSort={handleSort} className="pos-col" />
            {isCompare ? (
              <>
                <SortHeader label={labelA} sortKey="ptsA" currentSort={sort} onSort={handleSort} className="score-col" title={`Season points — ${labelA}`} />
                <SortHeader label={labelB} sortKey="ptsB" currentSort={sort} onSort={handleSort} className="score-col" title={`Season points — ${labelB}`} />
                <SortHeader label="Diff" sortKey="diff" currentSort={sort} onSort={handleSort} className="diff-col" title="Point difference (A − B)" />
                <th className="reason-col" title="Top stat driving the point difference">Reason</th>
              </>
            ) : (
              <>
                <SortHeader label="Season" sortKey="season" currentSort={sort} onSort={handleSort} className="score-col" title="Total season points" />
                <SortHeader label="Pts/Wk" sortKey="weeklyAvg" currentSort={sort} onSort={handleSort} className="stat-col" title="Weekly average (season / 21)" />
                <SortHeader label="Per Unit" sortKey="perUnit" currentSort={sort} onSort={handleSort} className="stat-col" title="Per start (SP) or per game (hitters)" />
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {sorted.map((player) => {
            const { isPitcher, perUnit, unitsPerWeek, comp, delta, ptsA, ptsB, diff, reason, breakdown } = getRowData(player);

            return (
              <tr key={`${player.name}-${player.year}-${player.pos}`} className={isPitcher ? "row-pitcher" : "row-hitter"}>
                <td className="rank-col">{player.rank}</td>
                {isCompare && (
                  <td
                    className={`delta-col ${delta > 0 ? "positive" : delta < 0 ? "negative" : ""}`}
                  >
                    {delta !== null
                      ? delta > 0
                        ? `+${delta}`
                        : delta
                      : "—"}
                  </td>
                )}
                <td className="name-col">
                  <span className="player-first">{player.name.split(" ")[0]}</span>{" "}
                  <span className="player-last">{player.name.split(" ").slice(1).join(" ")}</span>
                </td>
                <td className="team-col">{player.team}</td>
                <td className="year-col">{player.year}</td>
                <td className="pos-col">{player.pos}</td>
                {isCompare ? (
                  <>
                    <td className="score-col">
                      <strong>{ptsA.toFixed(0)}</strong>
                    </td>
                    <td className="score-col">
                      <strong>{comp ? ptsB.toFixed(0) : "—"}</strong>
                    </td>
                    <td className={`diff-col ${diff > 0 ? "positive" : diff < 0 ? "negative" : ""}`}>
                      <span className="diff-hover-wrapper">
                        <strong>{diff !== null ? (diff > 0 ? `+${diff.toFixed(0)}` : diff.toFixed(0)) : "—"}</strong>
                        {breakdown.length > 0 && (
                          <div className="diff-tooltip">
                            {breakdown.map((b) => (
                              <div key={b.stat} className={`diff-tooltip-row ${b.impact > 0 ? "positive" : "negative"}`}>
                                <span>{b.label}</span>
                                <span>{b.impact > 0 ? "+" : ""}{b.impact}</span>
                              </div>
                            ))}
                            <div className="diff-tooltip-total">
                              <span>Total</span>
                              <span>{diff > 0 ? "+" : ""}{diff.toFixed(0)}</span>
                            </div>
                          </div>
                        )}
                      </span>
                    </td>
                    <td className="reason-col">{reason || "—"}</td>
                  </>
                ) : (
                  <>
                    <td className="score-col">
                      <strong>{player.fantasyPoints?.toFixed(0)}</strong>
                    </td>
                    <td className="stat-col">
                      {player.weeklyAvg?.toFixed(1)}
                    </td>
                    <td className="stat-col">
                      {perUnit != null ? perUnit.toFixed(1) : "—"}
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
