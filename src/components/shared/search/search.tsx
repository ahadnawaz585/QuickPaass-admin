import React, { useState } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchComponent: React.FC<{ placeholderText?: string; onSearchQueryChange?: (query: string) => void }> = ({
  placeholderText = 'Search',
  onSearchQueryChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchIconClick = () => {
    performSearch();
  };

  const handleEnterPressed = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      performSearch();
    }
  };

  const performSearch = () => {
    if (onSearchQueryChange && searchQuery.trim() !== '') {
      onSearchQueryChange(searchQuery.trim());
    }
    setSearchQuery('');
  };

  return (
    <div className="search-bar">
      <TextField
        variant="standard"
        size='small'
        placeholder={placeholderText}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={handleEnterPressed}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearchIconClick}>
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </div>
  );
};

export default SearchComponent;
