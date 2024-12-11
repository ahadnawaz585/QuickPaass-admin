interface CustomButtonProps {
    buttonText: string;
    iconName?: string;
    buttonClass: 'primary' | 'discard';
    onClick: () => void;
  }