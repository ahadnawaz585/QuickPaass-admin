interface DialogueProps {
    heading: string;
    question: string;
    onClose: (response: boolean) => void;
    showYesOrNo?:boolean
  }