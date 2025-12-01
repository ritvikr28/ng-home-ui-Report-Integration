
import React from "react";

export interface FilterDialogLogicProps {
    setFilterBtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface DialogContentProps {
    startDate: string;
    setStartDate: (date: string) => void;
    endDate: string;
    setEndDate: (date: string) => void;
    status: string;
    setStatus: (status: string) => void;
    priority: string;
    setPriority: (priority: string) => void;
}