
import React from "react";

export interface FilterDialogLogicProps {
    setFilterBtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DialogContentProps {
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    status: string[];
    setStatus: React.Dispatch<React.SetStateAction<string[]>>;
    priority: string[];
    setPriority: React.Dispatch<React.SetStateAction<string[]>>;
}