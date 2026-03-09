import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, ReferenceLine,
} from "recharts";

export default function ComparisonView({ rankingsA, rankingsB, configA, configB }) {
  if (!rankingsA?.length || !rankingsB?.length) {
    return (
      <div className="empty-state">
        Select two scoring configurations to compare rank changes.
      </div>
    );
  }

  // Build comparison data: rank delta for each player
  const comparison = rankingsA
    .map((pA) => {
      const pB = rankingsB.find(
        (p) => p.name === pA.name && p.year === pA.year
      );
      if (!pB) return null;
      return {
        name: `${pA.name.split(" ").pop()} '${String(pA.year).slice(2)}`,
        fullName: pA.name,
        year: pA.year,
        rankA: pA.rank,
        rankB: pB.rank,
        delta: pB.rank - pA.rank, // positive = player ranks better in config A
      };
    })
    .filter(Boolean)
    .sort((a, b) => Math.abs(b.delta) - Math.abs(a.delta))
    .slice(0, 20);

  const biggestWinners = comparison.filter((c) => c.delta > 0).slice(0, 5);
  const biggestLosers = comparison.filter((c) => c.delta < 0).slice(0, 5);

  return (
    <div className="comparison-view">
      <h3>Rank Changes: {configA.name || "Config A"} vs {configB.name || "Config B"}</h3>

      <div className="comparison-summary">
        <div className="movers-section winners">
          <h4>Biggest Winners (Better in Config A)</h4>
          {biggestWinners.map((p) => (
            <div key={`${p.fullName}-${p.year}`} className="mover-row">
              <span className="mover-name">{p.fullName} ({p.year})</span>
              <span className="mover-delta positive">+{p.delta} spots</span>
              <span className="mover-ranks">#{p.rankA} → #{p.rankB}</span>
            </div>
          ))}
        </div>
        <div className="movers-section losers">
          <h4>Biggest Losers (Worse in Config A)</h4>
          {biggestLosers.map((p) => (
            <div key={`${p.fullName}-${p.year}`} className="mover-row">
              <span className="mover-name">{p.fullName} ({p.year})</span>
              <span className="mover-delta negative">{p.delta} spots</span>
              <span className="mover-ranks">#{p.rankA} → #{p.rankB}</span>
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={comparison}
          margin={{ top: 10, right: 20, left: 10, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis
            tick={{ fill: "#94a3b8" }}
            label={{
              value: "Rank Change",
              angle: -90,
              position: "insideLeft",
              fill: "#94a3b8",
            }}
          />
          <Tooltip
            contentStyle={{
              background: "#1e293b",
              border: "1px solid #334155",
              borderRadius: 8,
              color: "#e2e8f0",
            }}
            formatter={(value) => [
              `${value > 0 ? "+" : ""}${value} spots`,
              "Rank Change",
            ]}
          />
          <ReferenceLine y={0} stroke="#64748b" />
          <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
            {comparison.map((entry, index) => (
              <Cell
                key={index}
                fill={entry.delta > 0 ? "#22c55e" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
