import React from "react";
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";

export interface SidePanelProps {
  isOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  showMainPanelView?: any;
  showQuickLinkView?: any;
  quicklinkData? : IQuickLinkApiResponse[] | null;
  setQuickLinkData: React.Dispatch<React.SetStateAction<IQuickLinkApiResponse[] | null>>;
  isLoader?:boolean;
  isSIMSIDAdmin?:boolean;
}
export interface QuickLinkSidePanel{
  isPermissionquicklink: any;
  isError:any;
  quicklinkData:any;
  handleStarClick: any;
  showQuickLinkView: any;
  isLoader: any;
  togglePanel: any;
  isMobileView: any;
}