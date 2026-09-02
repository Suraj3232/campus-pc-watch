import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange, placeholder = 'Search…', id }) => (
  <div className="input-wrapper has-icon-left" style={{ minWidth: 240 }}>
    <span className="input-icon-left">
      <Search size={16} />
    </span>
    <input
      id={id}
      type="search"
      className="form-input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      style={{ paddingLeft: 38 }}
    />
  </div>
);

export default SearchInput;
