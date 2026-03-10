import { useState } from "react";
import {
  BUILT_IN_PRESETS,
  CATEGORY_LABELS,
  HITTING_POINT_STATS,
  PITCHING_POINT_STATS,
  getAllPresets,
  saveCustomPreset,
  deleteCustomPreset,
  loadCustomPresets,
} from "../data/scoringPresets";

export default function ScoringConfig({ config, onChange }) {
  const [activeTab, setActiveTab] = useState("preset");
  const [saveName, setSaveName] = useState("");
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [presetVersion, setPresetVersion] = useState(0);

  const allPresets = getAllPresets();
  const customKeys = Object.keys(loadCustomPresets());

  const handlePresetChange = (presetKey) => {
    const preset = allPresets[presetKey];
    onChange({ ...preset, presetKey });
  };

  const updatePointValue = (stat, value) => {
    const numVal = parseFloat(value) || 0;
    onChange({
      ...config,
      presetKey: null,
      points: { ...config.points, [stat]: numVal },
    });
  };

  const handleSavePreset = () => {
    if (!saveName.trim()) return;
    const key = `custom_${saveName.trim().toLowerCase().replace(/\s+/g, "_")}`;
    saveCustomPreset(key, {
      name: saveName.trim(),
      description: "Custom saved preset",
      type: "points",
      points: { ...config.points },
    });
    onChange({ ...config, presetKey: key });
    setSaveName("");
    setShowSaveForm(false);
    setPresetVersion((v) => v + 1);
  };

  const handleDeletePreset = (key) => {
    deleteCustomPreset(key);
    if (config.presetKey === key) {
      onChange({ ...config, presetKey: null });
    }
    setPresetVersion((v) => v + 1);
  };

  return (
    <div className="scoring-config">
      <div className="config-tabs">
        <button
          className={activeTab === "preset" ? "active" : ""}
          onClick={() => setActiveTab("preset")}
        >
          Presets
        </button>
        <button
          className={activeTab === "custom" ? "active" : ""}
          onClick={() => setActiveTab("custom")}
        >
          Custom
        </button>
      </div>

      {activeTab === "preset" ? (
        <div className="preset-list">
          {Object.entries(allPresets).map(([key, preset]) => {
            const isCustom = customKeys.includes(key);
            return (
              <div key={key} className="preset-row">
                <button
                  className={`preset-btn ${config.presetKey === key ? "active" : ""}`}
                  onClick={() => handlePresetChange(key)}
                >
                  <strong>{preset.name}</strong>
                  <span>{preset.description}</span>
                </button>
                {isCustom && (
                  <button
                    className="preset-delete"
                    onClick={() => handleDeletePreset(key)}
                    title="Delete preset"
                  >
                    ×
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="custom-config">
          <div className="points-editor">
            <h4>Hitting Points</h4>
            <div className="points-grid">
              {HITTING_POINT_STATS.map((stat) => (
                <div key={stat} className="point-input">
                  <label>{CATEGORY_LABELS[stat] || stat}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.points?.[stat] ?? 0}
                    onChange={(e) => updatePointValue(stat, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <h4>Pitching Points</h4>
            <div className="points-grid">
              {PITCHING_POINT_STATS.map((stat) => (
                <div key={stat} className="point-input">
                  <label>{CATEGORY_LABELS[stat] || stat}</label>
                  <input
                    type="number"
                    step="0.5"
                    value={config.points?.[stat] ?? 0}
                    onChange={(e) => updatePointValue(stat, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Save as preset */}
          <div className="save-preset-section">
            {showSaveForm ? (
              <div className="save-preset-form">
                <input
                  type="text"
                  placeholder="Preset name..."
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSavePreset()}
                  autoFocus
                />
                <button className="save-btn" onClick={handleSavePreset}>
                  Save
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => { setShowSaveForm(false); setSaveName(""); }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                className="save-preset-trigger"
                onClick={() => setShowSaveForm(true)}
              >
                Save as Preset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
