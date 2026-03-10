import { useState, useMemo, useEffect, useCallback } from "react";
import ScoringConfig from "./components/ScoringConfig";
import RankingsTable from "./components/RankingsTable";
import RankingsChart from "./components/RankingsChart";
import ComparisonView from "./components/ComparisonView";
import RosterBalance from "./components/RosterBalance";
import FilterBar from "./components/FilterBar";
import { fetchWithCache } from "./data/mlbApi";
import { SCORING_PRESETS, MY_LEAGUE_ROSTER } from "./data/scoringPresets";
import { rankByH2HPoints, filterByYear, filterByPosition } from "./utils/scoringEngine";
import "./App.css";

const SEASONS = [2021, 2022, 2023, 2024, 2025];

const DEFAULT_CONFIG = {
  ...SCORING_PRESETS.myLeague,
  presetKey: "myLeague",
};

export default function App() {
  const [activeView, setActiveView] = useState("rankings");
  const [configA, setConfigA] = useState(DEFAULT_CONFIG);
  const [configB, setConfigB] = useState({
    ...SCORING_PRESETS.dingersProposal,
    presetKey: "dingersProposal",
  });
  const [year, setYear] = useState("2025");
  const [posType, setPosType] = useState("all");
  const [liveData, setLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(null);
  const [error, setError] = useState(null);

  const doFetch = useCallback((forceRefresh = false) => {
    setLoading(true);
    setError(null);
    setLoadProgress(null);
    fetchWithCache(SEASONS, {
      forceRefresh,
      onProgress: (p) => setLoadProgress(p),
    })
      .then((data) => {
        setLiveData(data);
        setLoading(false);
        setLoadProgress(null);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch MLB data");
        setLoading(false);
        setLoadProgress(null);
      });
  }, []);

  useEffect(() => { doFetch(); }, [doFetch]);

  const allPlayers = useMemo(() => {
    if (!liveData) return [];
    const combined = [...liveData.hitters, ...liveData.pitchers];
    // Ohtani appears as both hitter and pitcher — disambiguate with position
    return combined.map((p) =>
      p.name === "Shohei Ohtani" ? { ...p, name: `Shohei Ohtani (${p.pos})` } : p
    );
  }, [liveData]);

  const filtered = useMemo(() => {
    let result = filterByYear(allPlayers, year);
    result = filterByPosition(result, posType);
    return result;
  }, [allPlayers, year, posType]);

  const rankingsA = useMemo(() => {
    return rankByH2HPoints(filtered, configA.points, configA.matchupStarts ?? 7);
  }, [filtered, configA]);

  const rankingsB = useMemo(() => {
    return rankByH2HPoints(filtered, configB.points, configB.matchupStarts ?? 7);
  }, [filtered, configB]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>H2H Points Scoring Analyzer</h1>
        <p className="subtitle">
          Adjust scoring settings and matchup starts to see how player rankings
          shift — powered by real MLB data (2021-2025)
        </p>
        <nav className="view-nav">
          <button
            className={activeView === "rankings" ? "active" : ""}
            onClick={() => setActiveView("rankings")}
          >
            Rankings
          </button>
          <button
            className={activeView === "compare" ? "active" : ""}
            onClick={() => setActiveView("compare")}
          >
            Compare Formats
          </button>
        </nav>
      </header>

      <main className="app-main">
        <div className="data-status-bar">
          {loading && (
            <div className="loading-banner">
              <div className="loading-text">
                {loadProgress
                  ? `Fetching ${loadProgress.season} season... (${loadProgress.done}/${loadProgress.total})`
                  : "Loading MLB stats from statsapi.mlb.com..."}
              </div>
              {loadProgress && (
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${(loadProgress.done / loadProgress.total) * 100}%` }}
                  />
                </div>
              )}
            </div>
          )}
          {!loading && error && (
            <div className="data-source-badge error">
              {error}
              <button className="refresh-btn" onClick={() => doFetch(true)}>Retry</button>
            </div>
          )}
          {!loading && !error && liveData && (
            <div className="data-source-badge mlb">
              Live data from MLB Stats API ({liveData.hitters.length} hitters, {liveData.pitchers.length} pitchers)
              <button className="refresh-btn" onClick={() => doFetch(true)}>Refresh</button>
            </div>
          )}
        </div>
        <FilterBar
          year={year}
          posType={posType}
          onYearChange={setYear}
          onPosTypeChange={setPosType}
        />

        {activeView === "rankings" ? (
          <div className="rankings-layout">
            <aside className="config-panel">
              <h2>Scoring Settings</h2>
              <ScoringConfig config={configA} onChange={setConfigA} />
            </aside>
            <section className="results-panel">
              <RosterBalance rankings={rankingsA} roster={MY_LEAGUE_ROSTER} />
              <RankingsChart rankings={rankingsA} config={configA} />
              <RankingsTable rankings={rankingsA} />
            </section>
          </div>
        ) : (
          <div className="compare-layout">
            <div className="compare-configs">
              <div className="compare-config-panel">
                <h2>Format A</h2>
                <ScoringConfig config={configA} onChange={setConfigA} />
              </div>
              <div className="compare-config-panel">
                <h2>Format B</h2>
                <ScoringConfig config={configB} onChange={setConfigB} />
              </div>
            </div>
            <ComparisonView
              rankingsA={rankingsA}
              rankingsB={rankingsB}
              configA={configA}
              configB={configB}
            />
            <div className="compare-tables">
              <FilterBar
                year={year}
                posType={posType}
                onYearChange={setYear}
                onPosTypeChange={setPosType}
              />
              <div className="compare-table-wrapper">
                <h3>{configA.name || "Format A"} Rankings</h3>
                <RankingsTable
                  rankings={rankingsA}
                  comparisonRankings={rankingsB}
                  configA={configA}
                  configB={configB}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          H2H Points Scoring Analyzer — Built for League Managers —
          Data: 2021-2025 seasons (MLB Stats API)
        </p>
      </footer>
    </div>
  );
}
