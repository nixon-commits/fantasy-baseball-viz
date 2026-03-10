import { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, ReferenceLine,
} from "recharts";

const HITTER_COLOR = "#3b82f6";
const PITCHER_COLOR = "#f59e0b";

function median(arr) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function mean(arr) {
  return arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
}

function percentile(arr, p) {
  if (!arr.length) return 0;
  const s = [...arr].sort((a, b) => a - b);
  const idx = (p / 100) * (s.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return lo === hi ? s[lo] : s[lo] + (s[hi] - s[lo]) * (idx - lo);
}

function computeStats(rankings) {
  const isPitcher = (p) => p.pos === "SP" || p.pos === "RP";
  const hitters = rankings.filter((p) => !isPitcher(p));
  const pitchers = rankings.filter((p) => isPitcher(p));

  const hPM = hitters.map((p) => p.weeklyAvg);
  const pPM = pitchers.map((p) => p.weeklyAvg);

  const top50 = rankings.slice(0, 50);
  const pitchersInTop50 = top50.filter((p) => isPitcher(p)).length;

  const top10H = hitters.slice(0, 10);
  const top10P = pitchers.slice(0, 10);

  return {
    hitters, pitchers,
    hMedian: median(hPM),
    pMedian: median(pPM),
    hMean: mean(hPM),
    pMean: mean(pPM),
    hP75: percentile(hPM, 75),
    pP75: percentile(pPM, 75),
    hP25: percentile(hPM, 25),
    pP25: percentile(pPM, 25),
    pitchersInTop50,
    top10HAvg: mean(top10H.map((p) => p.weeklyAvg)),
    top10PAvg: mean(top10P.map((p) => p.weeklyAvg)),
    hCount: hitters.length,
    pCount: pitchers.length,
  };
}

function buildHistogram(values, binSize = 2) {
  if (!values.length) return [];
  const min = Math.floor(Math.min(...values) / binSize) * binSize;
  const max = Math.ceil(Math.max(...values) / binSize) * binSize;
  const bins = [];
  for (let b = min; b <= max; b += binSize) {
    bins.push({ bin: b, label: `${b}-${b + binSize}`, count: 0 });
  }
  for (const v of values) {
    const idx = Math.min(Math.floor((v - min) / binSize), bins.length - 1);
    if (idx >= 0) bins[idx].count++;
  }
  return bins;
}

function ScorecardRow({ label, valA, valB, fmt }) {
  const fmtFn = fmt || ((v) => v.toFixed(1));
  return (
    <tr>
      <td className="scorecard-label">{label}</td>
      <td className="scorecard-val">{fmtFn(valA)}</td>
      <td className="scorecard-val">{fmtFn(valB)}</td>
    </tr>
  );
}

function ParityScorecard({ statsA, statsB, configA, configB }) {
  const ratioA = statsA.pMedian > 0 ? statsA.hMedian / statsA.pMedian : 0;
  const ratioB = statsB.pMedian > 0 ? statsB.hMedian / statsB.pMedian : 0;

  return (
    <div className="parity-scorecard">
      <h4>Parity Scorecard</h4>
      <table className="scorecard-table">
        <thead>
          <tr>
            <th>Metric</th>
            <th>{configA.name || "Format A"}</th>
            <th>{configB.name || "Format B"}</th>
          </tr>
        </thead>
        <tbody>
          <ScorecardRow
            label="Median Hitter Pts/Wk"
            valA={statsA.hMedian} valB={statsB.hMedian}

          />
          <ScorecardRow
            label="Median Pitcher Pts/Wk"
            valA={statsA.pMedian} valB={statsB.pMedian}

          />
          <tr className="scorecard-highlight">
            <td className="scorecard-label">Hitter/Pitcher Ratio <span className="scorecard-hint">(1.00 = perfect)</span></td>
            <td className="scorecard-val">{ratioA.toFixed(2)}x</td>
            <td className="scorecard-val">{ratioB.toFixed(2)}x</td>
          </tr>
          <ScorecardRow
            label="Top-10 Hitter Avg Pts/Wk"
            valA={statsA.top10HAvg} valB={statsB.top10HAvg}

          />
          <ScorecardRow
            label="Top-10 Pitcher Avg Pts/Wk"
            valA={statsA.top10PAvg} valB={statsB.top10PAvg}

          />
          <tr>
            <td className="scorecard-label">Top-10 Gap (P − H) <span className="scorecard-hint">(0 = perfect)</span></td>
            <td className="scorecard-val">{(statsA.top10PAvg - statsA.top10HAvg).toFixed(1)}</td>
            <td className="scorecard-val">{(statsB.top10PAvg - statsB.top10HAvg).toFixed(1)}</td>
          </tr>
          <tr>
            <td className="scorecard-label">Pitchers in Top 50 <span className="scorecard-hint">(50% = perfect)</span></td>
            <td className="scorecard-val">{statsA.pitchersInTop50} ({((statsA.pitchersInTop50 / 50) * 100).toFixed(0)}%)</td>
            <td className="scorecard-val">{statsB.pitchersInTop50} ({((statsB.pitchersInTop50 / 50) * 100).toFixed(0)}%)</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function DistributionChart({ statsA, statsB, configA, configB }) {
  const hitterValsA = statsA.hitters.map((p) => p.weeklyAvg);
  const pitcherValsA = statsA.pitchers.map((p) => p.weeklyAvg);
  const hitterValsB = statsB.hitters.map((p) => p.weeklyAvg);
  const pitcherValsB = statsB.pitchers.map((p) => p.weeklyAvg);

  const binSize = 3;
  const hBinsA = buildHistogram(hitterValsA, binSize);
  const pBinsA = buildHistogram(pitcherValsA, binSize);
  const hBinsB = buildHistogram(hitterValsB, binSize);
  const pBinsB = buildHistogram(pitcherValsB, binSize);

  // Merge bins into a single dataset per format, covering the full range of both
  const mergeBins = (hBins, pBins) => {
    const allVals = [...hBins, ...pBins].map((b) => b.bin);
    const lo = Math.min(...allVals);
    const hi = Math.max(...allVals);
    const hMap = Object.fromEntries(hBins.map((b) => [b.bin, b.count]));
    const pMap = Object.fromEntries(pBins.map((b) => [b.bin, b.count]));
    const result = [];
    for (let b = lo; b <= hi; b += binSize) {
      result.push({
        label: `${b}-${b + binSize}`,
        bin: b,
        Hitters: hMap[b] || 0,
        Pitchers: pMap[b] || 0,
      });
    }
    return result;
  };

  const dataA = mergeBins(hBinsA, pBinsA);
  const dataB = mergeBins(hBinsB, pBinsB);

  const tooltipStyle = {
    background: "#1e293b",
    border: "1px solid #334155",
    borderRadius: 8,
    color: "#e2e8f0",
  };

  return (
    <div className="distribution-charts">
      <h4>Weekly Average Points Distribution</h4>
      <div className="distribution-grid">
        <div className="distribution-panel">
          <h5>{configA.name || "Format A"}</h5>
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={dataA} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 9, angle: -45, textAnchor: "end" }} interval={1} height={50} label={{ value: "Pts/Wk", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} label={{ value: "# Players", angle: -90, position: "insideLeft", offset: -10, fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine x={dataA.find((d) => statsA.hMedian >= d.bin && statsA.hMedian < d.bin + binSize)?.label} stroke={HITTER_COLOR} strokeDasharray="5 5" label={{ value: "H med", fill: HITTER_COLOR, fontSize: 10, position: "top" }} />
              <ReferenceLine x={dataA.find((d) => statsA.pMedian >= d.bin && statsA.pMedian < d.bin + binSize)?.label} stroke={PITCHER_COLOR} strokeDasharray="5 5" label={{ value: "P med", fill: PITCHER_COLOR, fontSize: 10, position: "top" }} />
              <Bar dataKey="Hitters" fill={HITTER_COLOR} opacity={0.7} />
              <Bar dataKey="Pitchers" fill={PITCHER_COLOR} opacity={0.7} />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 16 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="distribution-panel">
          <h5>{configB.name || "Format B"}</h5>
          <ResponsiveContainer width="100%" height={310}>
            <BarChart data={dataB} margin={{ top: 5, right: 10, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="label" tick={{ fill: "#94a3b8", fontSize: 9, angle: -45, textAnchor: "end" }} interval={1} height={50} label={{ value: "Pts/Wk", position: "insideBottom", offset: -5, fill: "#64748b", fontSize: 11 }} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} label={{ value: "# Players", angle: -90, position: "insideLeft", offset: -10, fill: "#64748b", fontSize: 11 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine x={dataB.find((d) => statsB.hMedian >= d.bin && statsB.hMedian < d.bin + binSize)?.label} stroke={HITTER_COLOR} strokeDasharray="5 5" label={{ value: "H med", fill: HITTER_COLOR, fontSize: 10, position: "top" }} />
              <ReferenceLine x={dataB.find((d) => statsB.pMedian >= d.bin && statsB.pMedian < d.bin + binSize)?.label} stroke={PITCHER_COLOR} strokeDasharray="5 5" label={{ value: "P med", fill: PITCHER_COLOR, fontSize: 10, position: "top" }} />
              <Bar dataKey="Hitters" fill={HITTER_COLOR} opacity={0.7} />
              <Bar dataKey="Pitchers" fill={PITCHER_COLOR} opacity={0.7} />
              <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: 16 }} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default function ParityAnalysis({ rankingsA, rankingsB, configA, configB }) {
  const statsA = useMemo(() => computeStats(rankingsA), [rankingsA]);
  const statsB = useMemo(() => computeStats(rankingsB), [rankingsB]);

  if (!rankingsA?.length || !rankingsB?.length) return null;

  return (
    <div className="parity-analysis">
      <h3>Hitter / Pitcher Parity Analysis</h3>
      <ParityScorecard statsA={statsA} statsB={statsB} configA={configA} configB={configB} />
      <DistributionChart statsA={statsA} statsB={statsB} configA={configA} configB={configB} />
    </div>
  );
}
