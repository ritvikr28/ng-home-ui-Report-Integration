import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";


export interface IQuickLinkViewProps {
    apiQuickLinkData?: IQuickLinkApiResponse[] | null;
    apiError?: boolean;
    displaystarredicon: (favorites: boolean, id: number) => JSX.Element
  }