interface ContentHeaderProps {
  searchPlaceholder?: string;
  buttonText?: string;
  buttonIcon?: string;
  initialSearchArray?:string[],
  feature:string;
  buttonClass?: 'primary' | 'discard';
  headerTitle?: string;
  search?: boolean;
  onSearchArrayChange?: (searchArray: string[]) => void;
  onButtonClick: () => void; // Updated to accept a function that returns void
}
