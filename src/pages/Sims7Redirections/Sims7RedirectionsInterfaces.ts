import React from "react";

export interface Sims7RedirectionsRow {
    status: string;
    effectiveDate?: string;
    modifiedBy?: string;
    reasonForChanges?: string;
    redirectToNextGen?: string;
}
export interface Sims7RedirectionsSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'view' | 'edit';
    selectedRow: any;
    t: (key: string) => string;
    setSidePanelMode: (mode: 'view' | 'edit') => void;
}

export interface DateParts {
    day: string;
    month: string;
    year: string;
}

export interface Sims7RedirectionsViewProps {
    selectedRow: any;
    t: (key: string) => string;
    setSidePanelMode: (mode: 'view' | 'edit') => void;
}

export interface Sims7RedirectionsEditProps {
    selectedRow: any;
    redirectToNextGen: string;
    effectiveDate: Date | null;
    reasonForChanges: string;
    dateError: string;
    reasonError: string;
    // getDateParts: (date: Date | null) => DatePartsNumbers;
    getDateParts: (
        date: Date | null
    ) => {
        day?: number;
        month?: number;
        year?: number;
    };
    handleRedirectToNextGenChange: (e: React.SyntheticEvent<Element, Event>, value: string | number) => void;
    handleDateChange: (arg1: any, arg2?: any, arg3?: any) => void;
    handleValidateDate: (date: Date) => void;
    setReasonForChanges: (val: string) => void;
    setIsDirty: (dirty: boolean) => void;
    isFormDirty: (redirect: string, date: Date | null, reason: string) => boolean;
    t: (key: string) => string;
}
