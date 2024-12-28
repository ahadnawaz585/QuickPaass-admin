import React from 'react';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import { Search, QrCode } from '@mui/icons-material';


interface SearchTypeToggleProps {
  searchType: 'name' | 'code';
  onSearchTypeChange: (type: 'name' | 'code') => void;
}

const SearchTypeToggle: React.FC<SearchTypeToggleProps> = ({
  searchType,
  onSearchTypeChange,
}) => {
  return (
    <ToggleButtonGroup
      value={searchType}
      exclusive
      onChange={(_, newValue) => {
        if (newValue !== null) {
          onSearchTypeChange(newValue);
        }
      }}
      aria-label="search type"
      fullWidth
      sx={{ mb: 2 }}
    >
      <ToggleButton value="name" aria-label="search by name">
        <Search className="mr-2"  />
        Search by Name
      </ToggleButton>
      <ToggleButton value="code" aria-label="search by code">
        <QrCode className="mr-2"  />
        Search by Code
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

export default SearchTypeToggle;