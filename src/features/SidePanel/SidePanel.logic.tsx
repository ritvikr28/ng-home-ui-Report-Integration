import { useState } from "react";
import SidePanelView from "./SidePanel.view";

const SidePanel: () => JSX.Element = () => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePanel: () => void = () => {
    setIsOpen(!isOpen);
  };

  return (
    <SidePanelView
      data-testid="toggle-button"
      isOpen={isOpen}
      togglePanel={togglePanel}
    />
  );
};

export default SidePanel;
