'use client';

import { Search, X } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

/**
 * SearchBar component with clear functionality
 * Used for searching across users, sneakers, and posts
 */
export function SearchBar({ value, onChange, placeholder = 'Search...', onClear }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={`
      relative flex items-center
      bg-card border border-border rounded-lg
      transition-all duration-200
      ${isFocused ? 'border-primary shadow-glow' : ''}
    `}>
      <Search className="absolute left-3 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="
          w-full pl-10 pr-10 py-3
          bg-transparent text-white
          placeholder:text-gray-500
          outline-none
        "
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 p-1 hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  );
}
