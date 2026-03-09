// Historical player statistics for 2023-2025 seasons
// Data represents approximate real stats for analysis purposes

export const HITTER_STATS = [
  // 2023 Season
  { name: "Ronald Acuna Jr.", team: "ATL", year: 2023, pos: "OF", G: 159, AB: 643, R: 149, H: 217, "2B": 35, "3B": 4, HR: 41, RBI: 106, BB: 80, K_hit: 107, SB: 73, CS: 11, HBP: 4, AVG: .337, OBP: .416, SLG: .596, OPS: 1.012 },
  { name: "Mookie Betts", team: "LAD", year: 2023, pos: "SS/OF", G: 152, AB: 584, R: 126, H: 179, "2B": 29, "3B": 1, HR: 39, RBI: 107, BB: 72, K_hit: 108, SB: 14, CS: 5, HBP: 6, AVG: .307, OBP: .408, SLG: .579, OPS: .987 },
  { name: "Corey Seager", team: "TEX", year: 2023, pos: "SS", G: 119, AB: 454, R: 87, H: 137, "2B": 32, "3B": 2, HR: 33, RBI: 90, BB: 41, K_hit: 88, SB: 2, CS: 2, HBP: 8, AVG: .302, OBP: .369, SLG: .577, OPS: .946 },
  { name: "Freddie Freeman", team: "LAD", year: 2023, pos: "1B", G: 161, AB: 637, R: 131, H: 211, "2B": 59, "3B": 2, HR: 29, RBI: 102, BB: 72, K_hit: 121, SB: 23, CS: 2, HBP: 7, AVG: .331, OBP: .410, SLG: .567, OPS: .977 },
  { name: "Matt Olson", team: "ATL", year: 2023, pos: "1B", G: 162, AB: 608, R: 127, H: 168, "2B": 29, "3B": 0, HR: 54, RBI: 139, BB: 104, K_hit: 169, SB: 0, CS: 1, HBP: 2, AVG: .276, OBP: .389, SLG: .604, OPS: .993 },
  { name: "Shohei Ohtani", team: "LAA", year: 2023, pos: "DH", G: 135, AB: 497, R: 102, H: 151, "2B": 26, "3B": 8, HR: 44, RBI: 95, BB: 91, K_hit: 143, SB: 20, CS: 6, HBP: 4, AVG: .304, OBP: .412, SLG: .654, OPS: 1.066 },
  { name: "Juan Soto", team: "SD", year: 2023, pos: "OF", G: 162, AB: 568, R: 97, H: 156, "2B": 33, "3B": 2, HR: 35, RBI: 109, BB: 132, K_hit: 129, SB: 5, CS: 2, HBP: 2, AVG: .275, OBP: .410, SLG: .519, OPS: .930 },
  { name: "Trea Turner", team: "PHI", year: 2023, pos: "SS", G: 155, AB: 607, R: 93, H: 168, "2B": 31, "3B": 1, HR: 26, RBI: 76, BB: 39, K_hit: 134, SB: 30, CS: 9, HBP: 13, AVG: .277, OBP: .338, SLG: .455, OPS: .793 },
  { name: "Marcus Semien", team: "TEX", year: 2023, pos: "2B", G: 162, AB: 667, R: 122, H: 180, "2B": 42, "3B": 2, HR: 29, RBI: 100, BB: 59, K_hit: 143, SB: 14, CS: 5, HBP: 8, AVG: .270, OBP: .339, SLG: .467, OPS: .806 },
  { name: "Corbin Carroll", team: "ARI", year: 2023, pos: "OF", G: 155, AB: 604, R: 116, H: 164, "2B": 34, "3B": 9, HR: 25, RBI: 76, BB: 66, K_hit: 143, SB: 54, CS: 8, HBP: 4, AVG: .272, OBP: .349, SLG: .463, OPS: .868 },
  { name: "Bobby Witt Jr.", team: "KC", year: 2023, pos: "SS", G: 152, AB: 627, R: 96, H: 185, "2B": 41, "3B": 5, HR: 30, RBI: 96, BB: 35, K_hit: 145, SB: 49, CS: 10, HBP: 2, AVG: .295, OBP: .332, SLG: .520, OPS: .852 },
  { name: "Yordan Alvarez", team: "HOU", year: 2023, pos: "DH", G: 114, AB: 417, R: 64, H: 122, "2B": 23, "3B": 0, HR: 31, RBI: 97, BB: 62, K_hit: 100, SB: 0, CS: 0, HBP: 5, AVG: .293, OBP: .392, SLG: .583, OPS: .975 },

  // 2024 Season
  { name: "Shohei Ohtani", team: "LAD", year: 2024, pos: "DH", G: 159, AB: 636, R: 134, H: 197, "2B": 38, "3B": 7, HR: 54, RBI: 130, BB: 81, K_hit: 167, SB: 59, CS: 4, HBP: 3, AVG: .310, OBP: .390, SLG: .646, OPS: 1.036 },
  { name: "Aaron Judge", team: "NYY", year: 2024, pos: "OF", G: 158, AB: 565, R: 122, H: 180, "2B": 27, "3B": 0, HR: 58, RBI: 144, BB: 106, K_hit: 171, SB: 3, CS: 0, HBP: 8, AVG: .322, OBP: .432, SLG: .701, OPS: 1.133 },
  { name: "Bobby Witt Jr.", team: "KC", year: 2024, pos: "SS", G: 161, AB: 648, R: 125, H: 211, "2B": 45, "3B": 11, HR: 32, RBI: 109, BB: 42, K_hit: 118, SB: 31, CS: 9, HBP: 5, AVG: .326, OBP: .368, SLG: .571, OPS: .939 },
  { name: "Juan Soto", team: "NYY", year: 2024, pos: "OF", G: 157, AB: 550, R: 128, H: 166, "2B": 31, "3B": 1, HR: 41, RBI: 109, BB: 129, K_hit: 119, SB: 3, CS: 1, HBP: 4, AVG: .288, OBP: .419, SLG: .569, OPS: .989 },
  { name: "Freddie Freeman", team: "LAD", year: 2024, pos: "1B", G: 147, AB: 565, R: 107, H: 182, "2B": 44, "3B": 0, HR: 22, RBI: 89, BB: 63, K_hit: 99, SB: 11, CS: 2, HBP: 5, AVG: .282, OBP: .378, SLG: .476, OPS: .854 },
  { name: "Marcell Ozuna", team: "ATL", year: 2024, pos: "DH", G: 162, AB: 597, R: 93, H: 178, "2B": 31, "3B": 0, HR: 39, RBI: 104, BB: 56, K_hit: 163, SB: 4, CS: 1, HBP: 7, AVG: .302, OBP: .378, SLG: .558, OPS: .936 },
  { name: "Gunnar Henderson", team: "BAL", year: 2024, pos: "SS", G: 162, AB: 615, R: 118, H: 172, "2B": 34, "3B": 6, HR: 37, RBI: 92, BB: 75, K_hit: 168, SB: 12, CS: 4, HBP: 10, AVG: .281, OBP: .369, SLG: .534, OPS: .903 },
  { name: "Mookie Betts", team: "LAD", year: 2024, pos: "SS/OF", G: 116, AB: 440, R: 89, H: 136, "2B": 24, "3B": 1, HR: 19, RBI: 75, BB: 59, K_hit: 80, SB: 12, CS: 3, HBP: 5, AVG: .290, OBP: .380, SLG: .477, OPS: .857 },
  { name: "Kyle Tucker", team: "HOU", year: 2024, pos: "OF", G: 78, AB: 300, R: 55, H: 94, "2B": 18, "3B": 2, HR: 19, RBI: 40, BB: 32, K_hit: 66, SB: 13, CS: 3, HBP: 2, AVG: .289, OBP: .395, SLG: .523, OPS: .918 },
  { name: "Elly De La Cruz", team: "CIN", year: 2024, pos: "SS", G: 156, AB: 606, R: 101, H: 156, "2B": 28, "3B": 10, HR: 25, RBI: 76, BB: 50, K_hit: 213, SB: 67, CS: 10, HBP: 3, AVG: .260, OBP: .323, SLG: .459, OPS: .782 },
  { name: "Trea Turner", team: "PHI", year: 2024, pos: "SS", G: 116, AB: 466, R: 74, H: 142, "2B": 27, "3B": 4, HR: 21, RBI: 62, BB: 34, K_hit: 100, SB: 21, CS: 5, HBP: 4, AVG: .295, OBP: .349, SLG: .491, OPS: .840 },
  { name: "Rafael Devers", team: "BOS", year: 2024, pos: "3B", G: 154, AB: 601, R: 94, H: 176, "2B": 35, "3B": 1, HR: 28, RBI: 83, BB: 53, K_hit: 118, SB: 3, CS: 2, HBP: 8, AVG: .272, OBP: .345, SLG: .459, OPS: .804 },

  // 2025 Season (projected/estimated)
  { name: "Shohei Ohtani", team: "LAD", year: 2025, pos: "DH", G: 155, AB: 610, R: 128, H: 189, "2B": 36, "3B": 5, HR: 48, RBI: 122, BB: 85, K_hit: 155, SB: 45, CS: 5, HBP: 4, AVG: .310, OBP: .400, SLG: .630, OPS: 1.030 },
  { name: "Aaron Judge", team: "NYY", year: 2025, pos: "OF", G: 150, AB: 540, R: 110, H: 162, "2B": 24, "3B": 0, HR: 50, RBI: 128, BB: 98, K_hit: 160, SB: 2, CS: 0, HBP: 7, AVG: .300, OBP: .420, SLG: .670, OPS: 1.090 },
  { name: "Bobby Witt Jr.", team: "KC", year: 2025, pos: "SS", G: 158, AB: 640, R: 120, H: 205, "2B": 42, "3B": 9, HR: 35, RBI: 112, BB: 45, K_hit: 120, SB: 35, CS: 8, HBP: 4, AVG: .320, OBP: .365, SLG: .565, OPS: .930 },
  { name: "Juan Soto", team: "NYM", year: 2025, pos: "OF", G: 155, AB: 545, R: 115, H: 160, "2B": 30, "3B": 1, HR: 38, RBI: 105, BB: 125, K_hit: 115, SB: 4, CS: 2, HBP: 3, AVG: .294, OBP: .420, SLG: .560, OPS: .980 },
  { name: "Gunnar Henderson", team: "BAL", year: 2025, pos: "SS", G: 158, AB: 610, R: 115, H: 178, "2B": 36, "3B": 5, HR: 40, RBI: 100, BB: 70, K_hit: 155, SB: 15, CS: 3, HBP: 8, AVG: .292, OBP: .375, SLG: .555, OPS: .930 },
  { name: "Elly De La Cruz", team: "CIN", year: 2025, pos: "SS", G: 155, AB: 600, R: 108, H: 162, "2B": 30, "3B": 8, HR: 28, RBI: 82, BB: 55, K_hit: 195, SB: 70, CS: 12, HBP: 3, AVG: .270, OBP: .340, SLG: .475, OPS: .815 },
  { name: "Freddie Freeman", team: "LAD", year: 2025, pos: "1B", G: 150, AB: 575, R: 105, H: 178, "2B": 45, "3B": 1, HR: 25, RBI: 95, BB: 65, K_hit: 105, SB: 15, CS: 2, HBP: 6, AVG: .310, OBP: .395, SLG: .520, OPS: .915 },
  { name: "Corbin Carroll", team: "ARI", year: 2025, pos: "OF", G: 152, AB: 590, R: 105, H: 160, "2B": 30, "3B": 7, HR: 28, RBI: 80, BB: 60, K_hit: 138, SB: 40, CS: 7, HBP: 5, AVG: .271, OBP: .350, SLG: .475, OPS: .825 },
  { name: "Kyle Tucker", team: "CHC", year: 2025, pos: "OF", G: 148, AB: 560, R: 100, H: 168, "2B": 35, "3B": 3, HR: 30, RBI: 95, BB: 60, K_hit: 105, SB: 20, CS: 4, HBP: 4, AVG: .300, OBP: .380, SLG: .535, OPS: .915 },
  { name: "Mookie Betts", team: "LAD", year: 2025, pos: "SS/OF", G: 145, AB: 555, R: 110, H: 167, "2B": 28, "3B": 1, HR: 30, RBI: 95, BB: 68, K_hit: 95, SB: 12, CS: 3, HBP: 5, AVG: .301, OBP: .390, SLG: .530, OPS: .920 },
  { name: "Trea Turner", team: "PHI", year: 2025, pos: "SS", G: 148, AB: 580, R: 95, H: 172, "2B": 32, "3B": 5, HR: 24, RBI: 78, BB: 40, K_hit: 115, SB: 28, CS: 6, HBP: 8, AVG: .297, OBP: .349, SLG: .486, OPS: .835 },
  { name: "Yordan Alvarez", team: "HOU", year: 2025, pos: "DH", G: 140, AB: 520, R: 88, H: 155, "2B": 28, "3B": 0, HR: 35, RBI: 105, BB: 70, K_hit: 110, SB: 1, CS: 0, HBP: 5, AVG: .298, OBP: .395, SLG: .575, OPS: .970 },
];

export const PITCHER_STATS = [
  // 2023 Season
  { name: "Spencer Strider", team: "ATL", year: 2023, pos: "SP", G: 32, GS: 32, W: 20, L: 5, SV: 0, HD: 0, IP: 186.7, H_pitch: 116, ER: 48, BB_pitch: 47, K: 281, HR_pitch: 19, ERA: 3.86, WHIP: 0.99, QS: 19, CG: 0, SO: 0 },
  { name: "Gerrit Cole", team: "NYY", year: 2023, pos: "SP", G: 33, GS: 33, W: 15, L: 4, SV: 0, HD: 0, IP: 209, H_pitch: 158, ER: 55, BB_pitch: 46, K: 222, HR_pitch: 17, ERA: 2.63, WHIP: 0.98, QS: 22, CG: 1, SO: 1 },
  { name: "Zack Wheeler", team: "PHI", year: 2023, pos: "SP", G: 32, GS: 32, W: 13, L: 6, SV: 0, HD: 0, IP: 192, H_pitch: 158, ER: 55, BB_pitch: 41, K: 212, HR_pitch: 15, ERA: 3.61, WHIP: 1.04, QS: 20, CG: 0, SO: 0 },
  { name: "Kevin Gausman", team: "TOR", year: 2023, pos: "SP", G: 31, GS: 31, W: 12, L: 9, SV: 0, HD: 0, IP: 185.2, H_pitch: 157, ER: 52, BB_pitch: 38, K: 237, HR_pitch: 14, ERA: 3.16, WHIP: 1.05, QS: 18, CG: 0, SO: 0 },
  { name: "Corbin Burnes", team: "MIL", year: 2023, pos: "SP", G: 32, GS: 32, W: 10, L: 8, SV: 0, HD: 0, IP: 193.2, H_pitch: 176, ER: 66, BB_pitch: 46, K: 200, HR_pitch: 19, ERA: 3.39, WHIP: 1.15, QS: 18, CG: 0, SO: 0 },
  { name: "Emmanuel Clase", team: "CLE", year: 2023, pos: "RP", G: 75, GS: 0, W: 4, L: 3, SV: 44, HD: 0, IP: 72.2, H_pitch: 52, ER: 9, BB_pitch: 14, K: 68, HR_pitch: 2, ERA: 1.11, WHIP: 0.91, QS: 0, CG: 0, SO: 0 },
  { name: "Felix Bautista", team: "BAL", year: 2023, pos: "RP", G: 56, GS: 0, W: 7, L: 3, SV: 33, HD: 0, IP: 61.2, H_pitch: 26, ER: 10, BB_pitch: 18, K: 91, HR_pitch: 2, ERA: 1.46, WHIP: 0.71, QS: 0, CG: 0, SO: 0 },
  { name: "Devin Williams", team: "MIL", year: 2023, pos: "RP", G: 61, GS: 0, W: 3, L: 5, SV: 36, HD: 0, IP: 58, H_pitch: 24, ER: 13, BB_pitch: 30, K: 87, HR_pitch: 5, ERA: 1.53, WHIP: 0.93, QS: 0, CG: 0, SO: 0 },
  { name: "Blake Snell", team: "SD", year: 2023, pos: "SP", G: 32, GS: 32, W: 14, L: 9, SV: 0, HD: 0, IP: 180, H_pitch: 114, ER: 43, BB_pitch: 99, K: 234, HR_pitch: 13, ERA: 2.25, WHIP: 1.18, QS: 13, CG: 0, SO: 0 },
  { name: "Logan Webb", team: "SF", year: 2023, pos: "SP", G: 33, GS: 33, W: 11, L: 13, SV: 0, HD: 0, IP: 216, H_pitch: 191, ER: 60, BB_pitch: 32, K: 194, HR_pitch: 17, ERA: 3.25, WHIP: 1.03, QS: 21, CG: 1, SO: 0 },

  // 2024 Season
  { name: "Chris Sale", team: "ATL", year: 2024, pos: "SP", G: 29, GS: 29, W: 18, L: 3, SV: 0, HD: 0, IP: 177.2, H_pitch: 127, ER: 37, BB_pitch: 30, K: 225, HR_pitch: 11, ERA: 2.38, WHIP: 0.92, QS: 21, CG: 1, SO: 0 },
  { name: "Tarik Skubal", team: "DET", year: 2024, pos: "SP", G: 31, GS: 31, W: 18, L: 4, SV: 0, HD: 0, IP: 192, H_pitch: 131, ER: 41, BB_pitch: 33, K: 228, HR_pitch: 16, ERA: 2.39, WHIP: 0.92, QS: 22, CG: 0, SO: 0 },
  { name: "Zack Wheeler", team: "PHI", year: 2024, pos: "SP", G: 32, GS: 32, W: 16, L: 7, SV: 0, HD: 0, IP: 200, H_pitch: 152, ER: 46, BB_pitch: 33, K: 224, HR_pitch: 13, ERA: 2.57, WHIP: 0.96, QS: 23, CG: 0, SO: 0 },
  { name: "Corbin Burnes", team: "BAL", year: 2024, pos: "SP", G: 32, GS: 32, W: 15, L: 9, SV: 0, HD: 0, IP: 194.1, H_pitch: 165, ER: 62, BB_pitch: 39, K: 181, HR_pitch: 23, ERA: 2.92, WHIP: 1.10, QS: 20, CG: 0, SO: 0 },
  { name: "Logan Webb", team: "SF", year: 2024, pos: "SP", G: 31, GS: 31, W: 12, L: 8, SV: 0, HD: 0, IP: 199, H_pitch: 184, ER: 57, BB_pitch: 35, K: 182, HR_pitch: 12, ERA: 3.13, WHIP: 1.10, QS: 19, CG: 0, SO: 0 },
  { name: "Emmanuel Clase", team: "CLE", year: 2024, pos: "RP", G: 73, GS: 0, W: 5, L: 4, SV: 47, HD: 0, IP: 74.2, H_pitch: 58, ER: 16, BB_pitch: 11, K: 78, HR_pitch: 3, ERA: 0.61, WHIP: 0.92, QS: 0, CG: 0, SO: 0 },
  { name: "Ryan Helsley", team: "STL", year: 2024, pos: "RP", G: 62, GS: 0, W: 4, L: 5, SV: 49, HD: 0, IP: 66, H_pitch: 32, ER: 12, BB_pitch: 14, K: 80, HR_pitch: 6, ERA: 2.04, WHIP: 0.70, QS: 0, CG: 0, SO: 0 },
  { name: "Cole Ragans", team: "KC", year: 2024, pos: "SP", G: 32, GS: 32, W: 11, L: 9, SV: 0, HD: 0, IP: 186.1, H_pitch: 131, ER: 55, BB_pitch: 59, K: 223, HR_pitch: 12, ERA: 3.14, WHIP: 1.05, QS: 18, CG: 0, SO: 0 },
  { name: "Seth Lugo", team: "KC", year: 2024, pos: "SP", G: 33, GS: 33, W: 16, L: 9, SV: 0, HD: 0, IP: 206.2, H_pitch: 170, ER: 61, BB_pitch: 52, K: 185, HR_pitch: 16, ERA: 3.00, WHIP: 1.09, QS: 19, CG: 0, SO: 0 },
  { name: "Paul Skenes", team: "PIT", year: 2024, pos: "SP", G: 23, GS: 23, W: 11, L: 3, SV: 0, HD: 0, IP: 133, H_pitch: 89, ER: 29, BB_pitch: 30, K: 170, HR_pitch: 7, ERA: 1.96, WHIP: 0.95, QS: 14, CG: 0, SO: 0 },

  // 2025 Season (projected/estimated)
  { name: "Tarik Skubal", team: "DET", year: 2025, pos: "SP", G: 30, GS: 30, W: 16, L: 6, SV: 0, HD: 0, IP: 190, H_pitch: 140, ER: 45, BB_pitch: 35, K: 230, HR_pitch: 15, ERA: 2.53, WHIP: 0.94, QS: 21, CG: 0, SO: 0 },
  { name: "Paul Skenes", team: "PIT", year: 2025, pos: "SP", G: 32, GS: 32, W: 15, L: 7, SV: 0, HD: 0, IP: 200, H_pitch: 130, ER: 48, BB_pitch: 42, K: 260, HR_pitch: 12, ERA: 2.16, WHIP: 0.86, QS: 22, CG: 1, SO: 0 },
  { name: "Zack Wheeler", team: "PHI", year: 2025, pos: "SP", G: 31, GS: 31, W: 14, L: 7, SV: 0, HD: 0, IP: 195, H_pitch: 155, ER: 50, BB_pitch: 35, K: 215, HR_pitch: 14, ERA: 2.77, WHIP: 0.97, QS: 21, CG: 0, SO: 0 },
  { name: "Corbin Burnes", team: "ARI", year: 2025, pos: "SP", G: 32, GS: 32, W: 14, L: 8, SV: 0, HD: 0, IP: 195, H_pitch: 170, ER: 58, BB_pitch: 40, K: 195, HR_pitch: 18, ERA: 2.95, WHIP: 1.08, QS: 20, CG: 0, SO: 0 },
  { name: "Logan Webb", team: "SF", year: 2025, pos: "SP", G: 32, GS: 32, W: 13, L: 9, SV: 0, HD: 0, IP: 205, H_pitch: 185, ER: 58, BB_pitch: 35, K: 190, HR_pitch: 14, ERA: 2.98, WHIP: 1.07, QS: 20, CG: 0, SO: 0 },
  { name: "Emmanuel Clase", team: "CLE", year: 2025, pos: "RP", G: 70, GS: 0, W: 4, L: 3, SV: 42, HD: 0, IP: 70, H_pitch: 55, ER: 12, BB_pitch: 12, K: 72, HR_pitch: 3, ERA: 1.54, WHIP: 0.96, QS: 0, CG: 0, SO: 0 },
  { name: "Ryan Helsley", team: "STL", year: 2025, pos: "RP", G: 60, GS: 0, W: 3, L: 4, SV: 45, HD: 0, IP: 64, H_pitch: 35, ER: 14, BB_pitch: 15, K: 78, HR_pitch: 5, ERA: 1.97, WHIP: 0.78, QS: 0, CG: 0, SO: 0 },
  { name: "Cole Ragans", team: "KC", year: 2025, pos: "SP", G: 32, GS: 32, W: 13, L: 8, SV: 0, HD: 0, IP: 190, H_pitch: 138, ER: 52, BB_pitch: 55, K: 228, HR_pitch: 14, ERA: 2.84, WHIP: 1.02, QS: 19, CG: 0, SO: 0 },
  { name: "Chris Sale", team: "ATL", year: 2025, pos: "SP", G: 28, GS: 28, W: 14, L: 5, SV: 0, HD: 0, IP: 170, H_pitch: 130, ER: 42, BB_pitch: 30, K: 210, HR_pitch: 14, ERA: 2.65, WHIP: 0.94, QS: 19, CG: 0, SO: 0 },
  { name: "Seth Lugo", team: "KC", year: 2025, pos: "SP", G: 32, GS: 32, W: 14, L: 8, SV: 0, HD: 0, IP: 200, H_pitch: 175, ER: 60, BB_pitch: 50, K: 190, HR_pitch: 15, ERA: 3.15, WHIP: 1.12, QS: 18, CG: 0, SO: 0 },
];

// Derived stats
function addDerivedHitting(players) {
  return players.map((p) => ({
    ...p,
    "1B": p.H - (p["2B"] || 0) - (p["3B"] || 0) - (p.HR || 0),
    TB: (p.H - (p["2B"] || 0) - (p["3B"] || 0) - (p.HR || 0))
      + (p["2B"] || 0) * 2
      + (p["3B"] || 0) * 3
      + (p.HR || 0) * 4,
  }));
}

export const HITTERS = addDerivedHitting(HITTER_STATS);
export const PITCHERS = PITCHER_STATS.map((p) => ({
  ...p,
  "SV+HD": (p.SV || 0) + (p.HD || 0),
  BS: p.BS || 0,
  BK: p.BK || 0,
}));
