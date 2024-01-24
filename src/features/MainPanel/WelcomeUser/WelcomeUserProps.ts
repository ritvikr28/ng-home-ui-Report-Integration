export interface IWelcomeUserViewProps {
  fullName: string;
  isLongName: boolean;
  parentClassName: string;
  subparentClassName: string;
  organisationName?: string;
  isApiError?: boolean;
  isOpen?: boolean;
  isMobileView?:any;
}

export interface IWelcomeUserLogicProps {
  isApiError?: boolean;
  organisationName?: string;
  isOpen?: boolean;
  isMobileView?:any;
}
