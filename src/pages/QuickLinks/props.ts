import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";


export interface IQuickLinkViewProps {
    apiQuickLinkData?: IQuickLinkApiResponse[] | null;
    apiError?: boolean;
    displaystarredicon: (favorites: boolean, id: number) => JSX.Element
    
  }

  export interface IQuickLinkProps {
    apiQuickLinkData?: IQuickLinkApiResponse[] | null;
    
    displaystarredicon?: (favorites: boolean, id: number) => JSX.Element
    
  }