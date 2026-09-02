import React from 'react';

const FilterDropdown = ({ label, options, value, onChange, id }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
    {label && (
      <label htmlFor={id} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', whiteSpace: 'nowrap' }}>
        {label}
      </label>
    )}
    <select
      id={id}
      className="form-select"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{ minWidth: 130 }}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

export default FilterDropdown;
