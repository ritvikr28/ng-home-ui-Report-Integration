export interface SidePanelProps {
  isOpen: boolean;
  togglePanel: () => void;
  closePanel: () => void;
  showMainPanelView?: any;
  showQuickLinkView?: any;
}
