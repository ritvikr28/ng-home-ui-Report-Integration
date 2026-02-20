
import React from "react";

export interface FilterDialogLogicProps {
    setFilterBtnClicked: React.Dispatch<React.SetStateAction<boolean>>;
}

export type StringArrayState = [string[], React.Dispatch<React.SetStateAction<string[]>>];

export interface FilterStates {
    status: string[];
    setStatus: React.Dispatch<React.SetStateAction<string[]>>;
    priority: string[];
    setPriority: React.Dispatch<React.SetStateAction<string[]>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    startDateError: string;
    setStartDateError: React.Dispatch<React.SetStateAction<string>>;
    errors: DateErrors;
    setErrors: React.Dispatch<React.SetStateAction<DateErrors>>;
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
    startDateError?: string;
    endDateError?: string;
}

export type DateErrors = {
    from: string;
    to: string;
};
