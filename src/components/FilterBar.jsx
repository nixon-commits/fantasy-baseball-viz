export default function FilterBar({ year, posType, onYearChange, onPosTypeChange }) {
  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label>Season</label>
        <select value={year} onChange={(e) => onYearChange(e.target.value)}>
          <option value="all">All Years</option>
          <option value="last2">Last 2 Years</option>
          <option value="last3">Last 3 Years</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
          <option value="2023">2023</option>
          <option value="2022">2022</option>
          <option value="2021">2021</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Position</label>
        <select value={posType} onChange={(e) => onPosTypeChange(e.target.value)}>
          <option value="all">All Players</option>
          <option value="hitter">Hitters Only</option>
          <option value="pitcher">Pitchers Only</option>
        </select>
      </div>
    </div>
  );
}
