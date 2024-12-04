import { Chip } from '@mui/material';
import React from 'react';

const ChipsComponent: React.FC<ChipsProps> = ({ keywords, select, onKeywordsChange }) => {
  const removeKeyword = (keyword: string) => {
    const updatedKeywords:string[] = keywords.filter((kw) => kw !== keyword);
    onKeywordsChange(updatedKeywords);
  };

  return (
    <div className="chips" style={{ marginBottom: '10px' }}>
      {!select && (
        <div>
          {keywords.map((keyword, index) => (
            <Chip
              key={index}
              label={keyword}
              onDelete={() => removeKeyword(keyword)}
              deleteIcon={<span aria-hidden="true">×</span>}
            />
          ))}
        </div>
      )}
      {select && (
        <div>
          {keywords.map((keyword, index) => (
            <Chip key={index} label={keyword} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ChipsComponent;
