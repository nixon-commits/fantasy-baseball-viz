import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";

const HITTER_COLOR = "#3b82f6";
const PITCHER_COLOR = "#f59e0b";

function isPitcher(pos) {
  return pos === "SP" || pos === "RP";
}

function ChartLegend() {
  return (
    <div className="chart-legend">
      <span className="legend-item">
        <span className="legend-swatch" style={{ background: HITTER_COLOR }} />
        Hitter
      </span>
      <span className="legend-item">
        <span className="legend-swatch" style={{ background: PITCHER_COLOR }} />
        Pitcher
      </span>
    </div>
  );
}

function PlayerBarChart({ data, dataKey, tooltipSuffix, tooltipLabel }) {
  return (
    <ResponsiveContainer width="100%" height={480}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 20, left: 10, bottom: 80 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
        <XAxis
          dataKey="name"
          angle={-55}
          textAnchor="end"
          height={100}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          interval={0}
        />
        <YAxis tick={{ fill: "#94a3b8" }} />
        <Tooltip
          contentStyle={{
            background: "#1e293b",
            border: "1px solid #334155",
            borderRadius: 8,
            color: "#e2e8f0",
          }}
          formatter={(value) => [
            `${value} ${tooltipSuffix}`,
            tooltipLabel,
          ]}
          labelFormatter={(label, payload) => {
            const p = payload?.[0]?.payload;
            return p ? `${p.fullName} (${p.pos}, ${p.year})` : label;
          }}
        />
        <Bar dataKey={dataKey} radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={index}
              fill={entry.isPitcher ? PITCHER_COLOR : HITTER_COLOR}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default function RankingsChart({ rankings }) {
  if (!rankings || rankings.length === 0) return null;

  const toChartEntry = (p) => ({
    name: `${p.name.split(" ").pop()} '${String(p.year).slice(2)}`,
    fullName: p.name,
    year: p.year,
    pos: p.pos,
    perMatchup: p.perMatchup,
    seasonPts: Math.round(p.fantasyPoints),
    rank: p.rank,
    isPitcher: isPitcher(p.pos),
  });

  const weeklyData = rankings.slice(0, 30).map(toChartEntry);

  const seasonData = [...rankings]
    .sort((a, b) => b.fantasyPoints - a.fantasyPoints)
    .slice(0, 30)
    .map(toChartEntry);

  return (
    <>
      <div className="rankings-chart">
        <h3>Top 30 Players — Points per Matchup Week</h3>
        <ChartLegend />
        <PlayerBarChart
          data={weeklyData}
          dataKey="perMatchup"
          tooltipSuffix="pts/wk"
          tooltipLabel="Per Matchup"
        />
      </div>

      <div className="rankings-chart">
        <h3>Top 30 Players — Season Total Points</h3>
        <ChartLegend />
        <PlayerBarChart
          data={seasonData}
          dataKey="seasonPts"
          tooltipSuffix="pts"
          tooltipLabel="Season Total"
        />
      </div>
    </>
  );
}
