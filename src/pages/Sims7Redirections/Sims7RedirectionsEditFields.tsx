import { EffectiveDateInput, ReasonTextarea } from "./Sims7RedirectionsEditHelpers";

export interface RenderEditFieldsProps {
    selectedRow: any; // Use a more specific type if available
    redirectToNextGen: string;
    effectiveDate: Date | null;
    reasonForChanges: string;
    dateError?: string;
    reasonError?: string;
    getDateParts: (
        date: Date | null
    ) => {
        day?: number;
        month?: number;
        year?: number;
    };
    handleDateChange: (...args: any[]) => void;
    handleValidateDate: (date: Date) => void;
    setReasonForChanges: (val: string) => void;
    setIsDirty: (dirty: boolean) => void;
    isFormDirty: (redirect: string, date: Date | null, reason: string) => boolean;
}

export const renderEditFields = (props: RenderEditFieldsProps) => {
    const {
        selectedRow,
        redirectToNextGen,
        effectiveDate,
        reasonForChanges,
        dateError,
        reasonError,
        getDateParts,
        handleDateChange,
        handleValidateDate,
        setReasonForChanges,
        setIsDirty,
        isFormDirty
    }: RenderEditFieldsProps = props;

    // Migrated & no
    if (selectedRow.status === 'Migrated' && redirectToNextGen === 'no') {
        return <>
            <div>
                <div className="heading-category">Effective date</div>
                <EffectiveDateInput {...{ getDateParts, effectiveDate, handleDateChange, handleValidateDate, dateError }} />
            </div>
            <div>
                <div className="heading-category">Reason for changes</div>
                <div className="details-category">
                    <ReasonTextarea {...{ reasonForChanges, setReasonForChanges, setIsDirty, isFormDirty, redirectToNextGen, effectiveDate, reasonError }} />
                </div>
            </div>
        </>;
    }
    // Reversing & no
    if (selectedRow.status === 'Reversing' && redirectToNextGen === 'no') {
        return <>
            <div>
                <div className="heading-category">Effective date</div>
                <EffectiveDateInput {...{ getDateParts, effectiveDate, handleDateChange, handleValidateDate, dateError }} />
            </div>
            <div>
                <div className="heading-category">Reason for changes</div>
                <div className="details-category">
                    <ReasonTextarea {...{ reasonForChanges, setReasonForChanges, setIsDirty, isFormDirty, redirectToNextGen, effectiveDate, reasonError }} />
                </div>
            </div>
        </>;
    }
    // Not migrated & yes
    if (redirectToNextGen === 'yes' && selectedRow.status === 'Not migrated') {
        return <div>
            <div className="heading-category">Effective date</div>
            <EffectiveDateInput {...{ getDateParts, effectiveDate, handleDateChange, handleValidateDate, dateError }} />
        </div>;
    }
    // Other statuses & yes
    if (redirectToNextGen === 'yes'
        && selectedRow.status !== 'Migrated'
        && selectedRow.status !== 'Not migrated'
        && selectedRow.status !== 'Reversing') {
        return <div>
            <div className="heading-category">Effective date</div>
            <EffectiveDateInput {...{ getDateParts, effectiveDate, handleDateChange, handleValidateDate, dateError }} />
        </div>;
    }
    // Other statuses & no, with reason
    if (redirectToNextGen !== 'yes'
        && selectedRow.status !== 'Migrated'
        && selectedRow.status !== 'Reversing'
        && selectedRow.reasonForChanges) {
        return <div>
            <div className="heading-category">Reason for changes</div>
            <div className="details-category">
                <ReasonTextarea {...{ reasonForChanges, setReasonForChanges, setIsDirty, isFormDirty, redirectToNextGen, effectiveDate, reasonError }} />
            </div>
        </div>;
    }
    return null;
};
