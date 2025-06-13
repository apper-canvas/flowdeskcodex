import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Input from '@/components/atoms/Input';

const SearchBar = ({ 
  placeholder = 'Search...', 
  onSearch, 
  suggestions = [],
  value,
  onChange,
  className = '' 
}) => {
  const [focused, setFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    onChange?.(newValue);
    setShowSuggestions(newValue.length > 0 && suggestions.length > 0);
  };

  const handleFocus = () => {
    setFocused(true);
    setShowSuggestions(value?.length > 0 && suggestions.length > 0);
  };

  const handleBlur = () => {
    setFocused(false);
    // Delay hiding suggestions to allow for clicks
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    onChange?.(suggestion);
    onSearch?.(suggestion);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onSearch?.(value);
      setShowSuggestions(false);
    }
    if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          icon="Search"
          className="w-full"
        />
        
        {value && (
          <button
            onClick={() => onChange?.('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-surface-100 rounded-full transition-colors"
          >
            <ApperIcon name="X" size={14} className="text-surface-400" />
          </button>
        )}
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-surface-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
          >
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-surface-50 transition-colors first:rounded-t-md last:rounded-b-md"
              >
                <div className="flex items-center">
                  <ApperIcon name="Search" size={14} className="text-surface-400 mr-2" />
                  <span className="text-sm text-surface-900">{suggestion}</span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;