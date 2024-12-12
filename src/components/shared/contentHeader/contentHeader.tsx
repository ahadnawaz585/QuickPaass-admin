import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Typography } from '@mui/material';
import styles from './contentHeader.module.scss';
import Loader from '../loader/loader';
import { permission } from '@/auth/access.service';

const SearchComponent = lazy(() => import('../search/search'));
const CustomButton = lazy(() => import('../buttons/buttons'));
const ChipsComponent = lazy(() => import('../chips/chips'));

const ContentHeaderComponent: React.FC<ContentHeaderProps> = ({
  searchPlaceholder = 'Search Accounts',
  buttonText = 'Add Chart Of Account',
  feature = '',
  buttonIcon = 'add_circle',
  initialSearchArray=null,
  buttonClass = 'primary',
  headerTitle = 'My App Header',
  search = true,
  onSearchArrayChange = () => { },
  onButtonClick = () => { }, // Define function prop for button click
}) => {
  const [searchArray, setSearchArray] = useState<string[]>([]);
  const [isAllowed, setIsAllowed] = useState<boolean>(false);

  useEffect(() => {
    checkPermission();
    if(initialSearchArray){
      setSearchArray(initialSearchArray);
    }
  });

  const checkPermission = async () => {
    setIsAllowed(await permission(feature));
  }

  const handleSearchQueryChange = (query: string) => {
    setSearchArray([...searchArray, query]);
    onSearchArrayChange([...searchArray, query]);
  };

  const handleButtonClick = () => {
    onButtonClick(); // Call the function prop when button is clicked
  };

  const handleKeywordsChange = (keywords: string[]) => {
    setSearchArray(keywords);
    onSearchArrayChange(keywords);
  };

  return (
    <>
      <div className={styles.content}>

        <p className={styles.headerTitle}>{headerTitle}</p>
        <div className={`${styles.container} ${!search && 'no-search'}`}>
          {/* Suspense to handle lazy loading */}
          <Suspense fallback={<Loader />}>
            {search && <SearchComponent placeholderText={searchPlaceholder} onSearchQueryChange={handleSearchQueryChange} />}
            <p></p>
            {isAllowed && <CustomButton buttonText={buttonText} iconName={buttonIcon} buttonClass={buttonClass} onClick={handleButtonClick} />}
          </Suspense>
        </div>
        <div className={styles.chips}>
          {/* Suspense to handle lazy loading */}
          <Suspense fallback={<Loader />}>
            <ChipsComponent keywords={searchArray} onKeywordsChange={handleKeywordsChange} select={false} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default ContentHeaderComponent;
