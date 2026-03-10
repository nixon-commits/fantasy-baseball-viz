import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

export default function ComparisonView({ rankingsA, rankingsB, configA, configB }) {
  if (!rankingsA?.length || !rankingsB?.length) {
    return (
      <div className="empty-state">
        Select two scoring configurations to compare rank changes.
      </div>
    );
  }

  const labelB = configB.name || "Config B";

  // Build comparison data: rank delta for each player
  const all = rankingsA
    .map((pA) => {
      const pB = rankingsB.find(
        (p) => p.name === pA.name && p.year === pA.year && p.pos === pA.pos
      );
      if (!pB) return null;
      return {
        name: String(pA.year).includes("/")
          ? pA.name.split(" ").pop()
          : `${pA.name.split(" ").pop()} '${String(pA.year).slice(2)}`,
        fullName: pA.name,
        pos: pA.pos,
        year: pA.year,
        rankA: pA.rank,
        rankB: pB.rank,
        delta: pA.rank - pB.rank, // positive = player ranks better in config B
      };
    })
    .filter(Boolean);

  const risers = [...all].sort((a, b) => b.delta - a.delta).filter((c) => c.delta > 0).slice(0, 15);
  const fallers = [...all].sort((a, b) => a.delta - b.delta).filter((c) => c.delta < 0).slice(0, 15);

  const tooltipStyle = {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "#e2e8f0",
  };

  const formatTooltip = (value, _name, entry) => [
    `${value > 0 ? "+" : ""}${value} spots  (#${entry.payload.rankA} → #${entry.payload.rankB})`,
    entry.payload.fullName,
  ];

  return (
    <div className="comparison-view">
      <h3>Rank Changes: {configA.name || "Config A"} → {labelB}</h3>

      <div className="comparison-summary">
        <div className="movers-section winners">
          <h4>Top Risers in {labelB}</h4>
          {risers.slice(0, 5).map((p) => (
            <div key={`${p.fullName}-${p.year}-${p.pos}`} className="mover-row">
              <span className="mover-name">{p.fullName} ({p.year})</span>
              <span className="mover-delta positive">+{p.delta} spots</span>
              <span className="mover-ranks">#{p.rankA} → #{p.rankB}</span>
            </div>
          ))}
        </div>
        <div className="movers-section losers">
          <h4>Top Fallers in {labelB}</h4>
          {fallers.slice(0, 5).map((p) => (
            <div key={`${p.fullName}-${p.year}-${p.pos}`} className="mover-row">
              <span className="mover-name">{p.fullName} ({p.year})</span>
              <span className="mover-delta negative">{p.delta} spots</span>
              <span className="mover-ranks">#{p.rankA} → #{p.rankB}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="comparison-charts">
        <div className="comparison-chart-half">
          <h4>Top Risers</h4>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={risers} margin={{ top: 10, right: 20, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                angle={-50}
                textAnchor="end"
                height={120}
                tickMargin={10}
                interval={0}
                tick={{ fill: "#94a3b8", fontSize: 11, dx: -5 }}
              />
              <YAxis tick={{ fill: "#94a3b8" }} label={{ value: "Spots Gained", angle: -90, position: "insideLeft", fill: "#94a3b8" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={formatTooltip} />
              <Bar dataKey="delta" radius={[4, 4, 0, 0]}>
                {risers.map((_, i) => (
                  <Cell key={i} fill="#22c55e" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="comparison-chart-half">
          <h4>Top Fallers</h4>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={fallers} margin={{ top: 10, right: 20, left: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                angle={-50}
                textAnchor="end"
                height={120}
                tickMargin={10}
                interval={0}
                tick={{ fill: "#94a3b8", fontSize: 11, dx: -5 }}
              />
              <YAxis tick={{ fill: "#94a3b8" }} label={{ value: "Spots Lost", angle: -90, position: "insideLeft", fill: "#94a3b8" }} />
              <Tooltip contentStyle={tooltipStyle} formatter={formatTooltip} />
              <Bar dataKey="delta" radius={[0, 0, 4, 4]}>
                {fallers.map((_, i) => (
                  <Cell key={i} fill="#ef4444" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
