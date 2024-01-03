import React from "react";
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";


export interface IQuickLinkViewProps {
    apiQuickLinkData?: IQuickLinkApiResponse[] | null;
    apiError?: boolean;
    displaystarredicon: (favorites: boolean, id: number) => JSX.Element;
    isOpen?:boolean;
    isLoader?:boolean;
    
  } 
  export interface QuicklinkComponentProps {
    apiQuickLinkData?: IQuickLinkApiResponse[] | null;
    setQuickLinkData: React.Dispatch<React.SetStateAction<IQuickLinkApiResponse[] | null>>;
    setIsError?: React.Dispatch<React.SetStateAction<boolean>>;
  }