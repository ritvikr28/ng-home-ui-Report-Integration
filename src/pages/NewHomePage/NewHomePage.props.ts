import React from "react";

export interface BannerProps {
    showClassViewNotification: boolean;
    setShowClassViewNotification: React.Dispatch<React.SetStateAction<boolean>>;
  }