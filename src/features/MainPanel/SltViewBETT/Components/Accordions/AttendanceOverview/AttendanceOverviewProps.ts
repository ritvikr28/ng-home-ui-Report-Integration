export interface IAttendanceOverviewProps {
  isOpen?: boolean;
  setIsOpen?: (isOpen: boolean) => void;
  cols: ICols;
}
export interface ICols {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}
