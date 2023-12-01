import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";

export interface SidePanelProps {
  isOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  showMainPanelView?: any;
  showQuickLinkView?: any;
  quicklinkData? : IQuickLinkApiResponse[] | null;
}
