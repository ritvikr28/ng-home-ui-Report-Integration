export interface IMainPanelProps {
  schoolName?: string;
  isError?: boolean;
  isSchoolPrimary?: boolean;
  isOpen?: boolean;
  setIsOpen: (isOpen: boolean) => void;
}
