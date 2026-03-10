// H2H Points scoring presets for common league formats

// Your league roster: C, 1B, 2B, 3B, SS, 3 OF, UTIL, 5 P, 1 RP, 5 BE, 3 IL
export const MY_LEAGUE_ROSTER = {
  teams: 10,
  C: 1, "1B": 1, "2B": 1, "3B": 1, SS: 1, OF: 3, UTIL: 1,
  P: 5, RP: 1,
  BE: 5, IL: 3,
};

// localStorage key for user-saved presets
const CUSTOM_PRESETS_KEY = "fantasy-baseball-custom-presets";

export const BUILT_IN_PRESETS = {
  myLeague: {
    name: "Current League Settings",
    description: "Custom H2H points — TB scoring, balks/blown saves",
    type: "points",
    points: {
      // Hitting
      R: 1, HR: 2, TB: 1, RBI: 1, BB: 1,
      K_hit: -1, SB: 2,
      // Pitching
      IP: 3, H_pitch: -1, ER: -2, BB_pitch: -1,
      K_pitch: 1, BK: -1, SO: 5, W: 5, L: -4,
      SV: 5, BS: -3, HD: 2,
    },
  },
  dingersProposal: {
    name: "Dingers 2026 Proposal",
    description: "Proposed scoring — QS 8, IP 3, no W/L, SB 2, CS -1",
    type: "points",
    points: {
      // Hitting
      R: 1, HR: 2, TB: 1, XBH: 0, RBI: 1, BB: 1,
      K_hit: -1, SB: 2,
      "1B": 0, "2B": 0, "3B": 0, CS: -1,
      HBP: 1, GIDP: -1,
      // Pitching
      IP: 3, K_pitch: 1, W: 0, L: 0,
      SV: 5, BS: -3, HD: 2, ER: -2,
      BB_pitch: -1, H_pitch: -1, BK: -1, SO: 5,
      QS: 5, HR_pitch: 0, HBP_pitch: -1, CG: 5,
    },
  },
};

export function loadCustomPresets() {
  try {
    const raw = localStorage.getItem(CUSTOM_PRESETS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveCustomPreset(key, preset) {
  const existing = loadCustomPresets();
  existing[key] = preset;
  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(existing));
}

export function deleteCustomPreset(key) {
  const existing = loadCustomPresets();
  delete existing[key];
  localStorage.setItem(CUSTOM_PRESETS_KEY, JSON.stringify(existing));
}

// Merged view: built-in + user-saved
export function getAllPresets() {
  return { ...BUILT_IN_PRESETS, ...loadCustomPresets() };
}

// For backwards compat
export const SCORING_PRESETS = BUILT_IN_PRESETS;

export const CATEGORY_LABELS = {
  // Hitting
  R: "Runs", HR: "Home Runs", RBI: "RBI", SB: "Stolen Bases",
  AVG: "Batting Average", OBP: "On-Base Pct", SLG: "Slugging Pct",
  OPS: "OPS", H: "Hits", "2B": "Doubles", "3B": "Triples",
  BB: "Walks", K_hit: "Strikeouts (H)", CS: "Caught Stealing",
  HBP: "Hit By Pitch", AB: "At Bats", "1B": "Singles",
  TB: "Total Bases", XBH: "Extra-Base Hits", GIDP: "Grounded Into DP",
  // Pitching
  W: "Wins", L: "Losses", SV: "Saves", HD: "Holds",
  K: "Strikeouts", K_pitch: "Strikeouts (P)", ERA: "ERA", WHIP: "WHIP",
  QS: "Quality Starts", IP: "Innings Pitched",
  BB_pitch: "Walks (P)", H_pitch: "Hits Allowed", HR_pitch: "HR Allowed",
  HBP_pitch: "HBP (P)", ER: "Earned Runs",
  CG: "Complete Games", SO: "Shutouts",
  BS: "Blown Saves", BK: "Balks",
  "SV+HD": "Saves + Holds",
};

export const HITTING_POINT_STATS = [
  "R", "HR", "TB", "XBH", "RBI", "BB", "K_hit", "SB",
  "1B", "2B", "3B", "CS", "HBP", "GIDP",
];

export const PITCHING_POINT_STATS = [
  "IP", "K_pitch", "W", "L", "SV", "BS", "HD", "ER",
  "BB_pitch", "H_pitch", "BK", "SO",
  "QS", "HR_pitch", "HBP_pitch", "CG",
];
