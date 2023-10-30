import React, { useState } from "react";
import SidePanelView from "./SidePanel.view";

const SidePanel: () => JSX.Element = () => {
  const [isOpen, setIsOpen] = useState(true);

  const togglePanel: () => void = () => {
    setIsOpen(!isOpen);
  };

  const closePanel: () => void = () => {
    setIsOpen(false);
  };

  return (
    <SidePanelView
      isOpen={isOpen}
      closePanel={closePanel}
      togglePanel={togglePanel}
    />
  );
};

export default SidePanel;
