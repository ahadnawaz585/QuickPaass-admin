import React from 'react';
import { Checkbox, FormControlLabel, FormGroup, Typography } from '@mui/material';
import styles from './checkbox.module.scss';
import { AppFeature } from '@/types/schema/appFeature';

interface Feature {
  name: string;
  parentFeatureId: string;
  label: string;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: string | null;
}

interface CheckboxListProps {
  heading: string;
  features: AppFeature[];
  selectedIds: string[];
  onSelectedIdsChange: (newSelectedIds: string[]) => void;
  edit: boolean; // New prop to control edit mode
}

const CheckboxList: React.FC<CheckboxListProps> = ({ heading, features, selectedIds, onSelectedIdsChange, edit }) => {

  const handleParentCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelectedIds = Array.from(new Set([...selectedIds, ...features.map((feature) => feature.name)]));
      onSelectedIdsChange(newSelectedIds);
    } else {
      onSelectedIdsChange(selectedIds.filter(id => !features.some(feature => feature.name === id)));
    }
  };

  const handleChildCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
    if (event.target.checked) {
      onSelectedIdsChange([...selectedIds, id]);
    } else {
      onSelectedIdsChange(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const areAllSelected = features.every((feature) => selectedIds.includes(feature.name));
  const isIndeterminate = selectedIds.some((id) => features.map((feature) => feature.name).includes(id)) && !areAllSelected;

  return (
    <div className={styles.container}>
      <Typography variant="h6" className={styles.heading}>{heading}</Typography>
      <FormControlLabel
        control={
          <Checkbox
            checked={areAllSelected}
            indeterminate={isIndeterminate}
            onChange={handleParentCheckboxChange}
            disabled={!edit} // Disable the select all checkbox based on edit mode
          />
        }
        label="Select All"
      />
      <FormGroup className={styles.checkboxGroup}>
        {features.map((feature) => (
          <FormControlLabel
            key={feature.name}
            control={
              <Checkbox
                checked={selectedIds.includes(feature.name)}
                onChange={(event) => handleChildCheckboxChange(event, feature.name)}
                disabled={!edit} // Disable individual checkboxes based on edit mode
              />
            }
            label={feature.label}
          />
        ))}
      </FormGroup>
    </div>
  );
};

export default CheckboxList;
