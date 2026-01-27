import React from "react";
import { DateInput, Textarea, ValidationTextLevel } from "@essnextgen/ui-kit";

export interface ReasonTextareaProps {
    reasonForChanges: string;
    setReasonForChanges: (val: string) => void;
    setIsDirty: (dirty: boolean) => void;
    isFormDirty: (redirect: string, date: Date | null, reason: string) => boolean;
    redirectToNextGen: string;
    effectiveDate: Date | null;
    reasonError?: string;
}

export interface EffectiveDateInputProps {
    getDateParts: (
        date: Date | null
    ) => {
        day?: number;
        month?: number;
        year?: number;
    };
    effectiveDate: Date | null;
    handleDateChange: (...args: any[]) => void;
    handleValidateDate: (date: Date) => void;
    dateError?: string;
}

export const EffectiveDateInput: React.FC<EffectiveDateInputProps> = ({ getDateParts, effectiveDate, handleDateChange, handleValidateDate, dateError }) => (
    <DateInput
        showDatePicker
        day={getDateParts(effectiveDate).day}
        month={getDateParts(effectiveDate).month}
        year={getDateParts(effectiveDate).year}
        onChange={handleDateChange}
        onValidateDate={handleValidateDate}
        validationText={dateError || undefined}
        validationTextLevel={dateError ? ValidationTextLevel.Error : undefined}
    />
);
EffectiveDateInput.defaultProps = {
    dateError: ''
};

export const ReasonTextarea: React.FC<ReasonTextareaProps> = ({ reasonForChanges, setReasonForChanges, setIsDirty, isFormDirty, redirectToNextGen, effectiveDate, reasonError }) => (
    <Textarea
        id="textarea-1"
        value={reasonForChanges}
        onChange={e => {
            const val: string = (e.target as HTMLTextAreaElement).value;
            setReasonForChanges(val);
            setIsDirty(isFormDirty(redirectToNextGen, effectiveDate, val));
        }}
        validationText={reasonError}
        validationTextLevel={reasonError ? ValidationTextLevel.Error : undefined}
        maxLength={100}
    />
);
ReasonTextarea.defaultProps = {
    reasonError: ''
};
