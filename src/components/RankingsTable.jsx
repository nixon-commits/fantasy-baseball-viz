export default function RankingsTable({ rankings, comparisonRankings }) {
  if (!rankings || rankings.length === 0) {
    return <div className="empty-state">No players match your filters.</div>;
  }

  return (
    <div className="rankings-table-wrapper">
      <table className="rankings-table">
        <thead>
          <tr>
            <th className="rank-col">#</th>
            {comparisonRankings && <th className="delta-col">+/-</th>}
            <th className="name-col">Player</th>
            <th className="team-col">Tm</th>
            <th className="year-col">Yr</th>
            <th className="pos-col">Pos</th>
            <th className="stat-col" title="Points per matchup week">Pts/Wk</th>
            <th className="stat-col" title="Per start (SP) or per game (hitters)">
              Per Start
            </th>
            <th className="stat-col" title="Starts or games per week">St/Wk</th>
            <th className="stat-col" title="Quality Starts (pitchers only)">QS</th>
            <th className="score-col" title="Total season points">Season</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((player) => {
            const compPlayer = comparisonRankings?.find(
              (p) => p.name === player.name && p.year === player.year
            );
            const delta = compPlayer ? compPlayer.rank - player.rank : null;
            const isPitcher = player.pos === "SP" || player.pos === "RP";
            const perUnit = isPitcher
              ? player.perStart
              : player.perGame;
            const unitsPerWeek = isPitcher
              ? player.startsPerWeek ?? player.appsPerWeek
              : player.gamesPerWeek;

            return (
              <tr key={`${player.name}-${player.year}`}>
                <td className="rank-col">{player.rank}</td>
                {comparisonRankings && (
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
                <td className="name-col">{player.name}</td>
                <td className="team-col">{player.team}</td>
                <td className="year-col">{player.year}</td>
                <td className="pos-col">{player.pos}</td>
                <td className="stat-col highlight">
                  {player.perMatchup?.toFixed(1)}
                </td>
                <td className="stat-col">
                  {perUnit != null ? perUnit.toFixed(1) : "—"}
                </td>
                <td className="stat-col">
                  {unitsPerWeek != null ? unitsPerWeek.toFixed(1) : "—"}
                </td>
                <td className="stat-col">
                  {isPitcher ? (player.QS ?? "—") : "—"}
                </td>
                <td className="score-col">
                  <strong>{player.fantasyPoints?.toFixed(0)}</strong>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
