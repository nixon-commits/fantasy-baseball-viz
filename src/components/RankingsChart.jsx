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
    <ResponsiveContainer width="100%" height={data.length * 28 + 40}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 10, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={false} />
        <XAxis type="number" tick={{ fill: "#94a3b8", fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="name"
          width={120}
          tick={{ fill: "#94a3b8", fontSize: 11 }}
          interval={0}
        />
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
        <Bar dataKey={dataKey} radius={[0, 4, 4, 0]} barSize={20}>
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

  const formatLabel = (p) => {
    const last = p.name.split(" ").pop();
    const yr = String(p.year);
    if (yr.includes("/")) return last;
    return `${last} '${yr.slice(2)}`;
  };

  const toChartEntry = (p) => ({
    name: formatLabel(p),
    fullName: p.name,
    year: p.year,
    pos: p.pos,
    weeklyAvg: p.weeklyAvg,
    seasonPts: Math.round(p.fantasyPoints),
    rank: p.rank,
    isPitcher: isPitcher(p.pos),
  });

  const weeklyData = [...rankings]
    .sort((a, b) => (b.weeklyAvg ?? 0) - (a.weeklyAvg ?? 0))
    .slice(0, 30)
    .map(toChartEntry);

  const seasonData = [...rankings]
    .sort((a, b) => b.fantasyPoints - a.fantasyPoints)
    .slice(0, 30)
    .map(toChartEntry);

  return (
    <>
      <div className="rankings-chart">
        <h3>Top 30 Players — Weekly Average</h3>
        <ChartLegend />
        <PlayerBarChart
          data={weeklyData}
          dataKey="weeklyAvg"
          tooltipSuffix="pts/wk"
          tooltipLabel="Weekly Avg"
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
