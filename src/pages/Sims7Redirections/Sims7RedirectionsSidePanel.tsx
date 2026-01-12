/* eslint-disable */
import React, { useState } from "react";
import {
    Dialog,
    DialogTemplate,
    Notification,
    NotificationStatus,
    ValidationTextLevel,
    SidePanel,
    SidePanelContent,
    SidePanelFooter,
    Button,
    ButtonColor,
    ButtonSize,
    ButtonIconPosition,
    Tag,
    TagSize,
    TagColor,
    ReactionButtonGroup,
    ReactionButton,
    DateInput,
    Textarea
} from "@essnextgen/ui-kit";

interface Sims7RedirectionsSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'view' | 'edit';
    selectedRow: any;
    t: (key: string) => string;
    setSidePanelMode: (mode: 'view' | 'edit') => void;
}

const Sims7RedirectionsSidePanel: React.FC<Sims7RedirectionsSidePanelProps> = ({
    isOpen,
    onClose,
    mode,
    selectedRow,
    t,
    setSidePanelMode
}) => {
    const [reasonForChanges, setReasonForChanges] = useState(selectedRow?.reasonForChanges || "");
    // Store last migrated effective date for toggling logic
    // const [lastMigratedEffectiveDate, setLastMigratedEffectiveDate] = useState<Date | null>(
    //     selectedRow?.status === 'Migrated' && selectedRow?.effectiveDate && selectedRow.effectiveDate !== '-' ? (() => {
    //         const parts = selectedRow.effectiveDate.split(' ');
    //         if (parts.length === 3) {
    //             const [day, monthStr, year] = parts;
    //             const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //             const month = months.indexOf(monthStr);
    //             if (month !== -1) {
    //                 return new Date(Number(year), month, Number(day));
    //             }
    //         }
    //         return null;
    //     })() : null
    // );
    React.useEffect(() => {
        setReasonForChanges(selectedRow?.reasonForChanges || "");
    }, [selectedRow]);
    // Update lastMigratedEffectiveDate when selectedRow changes
    // React.useEffect(() => {
    //     if (selectedRow?.status === 'Migrated' && selectedRow?.effectiveDate && selectedRow.effectiveDate !== '-') {
    //         const parts = selectedRow.effectiveDate.split(' ');
    //         if (parts.length === 3) {
    //             const [day, monthStr, year] = parts;
    //             const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    //             const month = months.indexOf(monthStr);
    //             if (month !== -1) {
    //                 setLastMigratedEffectiveDate(new Date(Number(year), month, Number(day)));
    //             }
    //         }
    //     } else {
    //         setLastMigratedEffectiveDate(null);
    //     }
    // }, [selectedRow]);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [dateError, setDateError] = useState<string>("");
    const [reasonError, setReasonError] = useState<string>("");
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [redirectToNextGen, setRedirectToNextGen] = useState(
        selectedRow?.status === 'Not migrated' || selectedRow?.status === 'Reversing' ? 'no' : 'yes'
    );
    React.useEffect(() => {
        if (selectedRow?.status === 'Not migrated' || selectedRow?.status === 'Reversing') {
            setRedirectToNextGen('no');
        } else {
            setRedirectToNextGen('yes');
        }
    }, [selectedRow]);

    // Effective date state for edit mode
    const getTomorrow = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        return tomorrow;
    };

    let initialEffectiveDate: Date = getTomorrow();
    if (selectedRow?.effectiveDate && selectedRow.effectiveDate !== '-') {
        const parts = selectedRow.effectiveDate.split(' ');
        if (parts.length === 3) {
            const [day, monthStr, year] = parts;
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const month = months.indexOf(monthStr);
            if (month !== -1) {
                initialEffectiveDate = new Date(Number(year), month, Number(day));
            }
        }
    }
    React.useEffect(() => {
        setReasonError("");
        setDateError("");
        setIsDirty(false);
    }, [selectedRow, mode]);

    const [dateParts, setDateParts] = useState<{ day: string; month: string; year: string }>(() => {
        if (initialEffectiveDate) {
            return {
                day: initialEffectiveDate.getDate().toString().padStart(2, '0'),
                month: (initialEffectiveDate.getMonth() + 1).toString().padStart(2, '0'),
                year: initialEffectiveDate.getFullYear().toString()
            };
        }
        return { day: '', month: '', year: '' };
    });
    const [effectiveDate, setEffectiveDate] = useState<Date | null>(initialEffectiveDate);
    React.useEffect(() => {
        let date = getTomorrow();
        let partsObj = { day: '', month: '', year: '' };
        if (selectedRow?.effectiveDate && selectedRow.effectiveDate !== '-') {
            const parts = selectedRow.effectiveDate.split(' ');
            if (parts.length === 3) {
                const [day, monthStr, year] = parts;
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const month = months.indexOf(monthStr);
                if (month !== -1) {
                    date = new Date(Number(year), month, Number(day));
                    partsObj = {
                        day: String(day).padStart(2, '0'),
                        month: String(month + 1).padStart(2, '0'),
                        year: String(year)
                    };
                }
            }
        } else {
            partsObj = {
                day: date.getDate().toString().padStart(2, '0'),
                month: (date.getMonth() + 1).toString().padStart(2, '0'),
                year: date.getFullYear().toString()
            };
        }
        setEffectiveDate(date);
        setDateParts(partsObj);
    }, [selectedRow]);

    const handleRedirectToNextGenChange = (_e: React.SyntheticEvent<Element, Event>, value: string | number) => {
        setIsDirty(true);
        const val = value as string;
        setRedirectToNextGen(val);
        // If status is Not migrated and selecting Yes, set effective date to tomorrow
        if (selectedRow.status === 'Not migrated' && val === 'yes') {
            const tomorrow = getTomorrow();
            setEffectiveDate(tomorrow);
            setDateParts({
                day: tomorrow.getDate().toString().padStart(2, '0'),
                month: (tomorrow.getMonth() + 1).toString().padStart(2, '0'),
                year: tomorrow.getFullYear().toString()
            });
        }
        // If status is Migrated and selecting No, set effective date to tomorrow
        if (selectedRow.status === 'Migrated' && val === 'no') {
            const tomorrow = getTomorrow();
            setEffectiveDate(tomorrow);
            setDateParts({
                day: tomorrow.getDate().toString().padStart(2, '0'),
                month: (tomorrow.getMonth() + 1).toString().padStart(2, '0'),
                year: tomorrow.getFullYear().toString()
            });
        }
        // If toggling back to Migrated (Yes) after previously being Migrated, restore the last effective date
        // if (val === 'yes' && lastMigratedEffectiveDate) {
        //     setEffectiveDate(lastMigratedEffectiveDate);
        //     setDateParts({
        //         day: lastMigratedEffectiveDate.getDate().toString().padStart(2, '0'),
        //         month: (lastMigratedEffectiveDate.getMonth() + 1).toString().padStart(2, '0'),
        //         year: lastMigratedEffectiveDate.getFullYear().toString()
        //     });
        // }
    };

    const handleDateChange = (arg1: any, arg2?: any, arg3?: any) => {
        setIsDirty(true);
        let day, month, year;
        if (typeof arg1 === 'object' && arg1 !== null && 'day' in arg1 && 'month' in arg1 && 'year' in arg1) {
            day = arg1.day;
            month = arg1.month;
            year = arg1.year;
        } else {
            day = arg1;
            month = arg2;
            year = arg3;
        }

        setDateParts({
            day: day ? String(day).padStart(2, '0') : '',
            month: month ? String(month).padStart(2, '0') : '',
            year: year ? String(year) : ''
        });

        const formattedDay = day ? String(day).padStart(2, '0') : '';
        const formattedMonth = month ? String(month).padStart(2, '0') : '';
        const formattedYear = year ? String(year) : '';
        if (!formattedDay && !formattedMonth && !formattedYear) {
            setEffectiveDate(null);
            setDateError('Date is required');
            return;
        }
        if (
            !formattedDay || !formattedMonth || !formattedYear ||
            formattedDay === '00' || formattedDay === '0' ||
            formattedMonth === '00' || formattedMonth === '0' ||
            formattedYear.length < 4 ||
            isNaN(Number(formattedDay)) || isNaN(Number(formattedMonth)) || isNaN(Number(formattedYear))
        ) {
            setEffectiveDate(null);
            setDateError('Invalid Date');
            return;
        }

        const dateObj = new Date(Number(formattedYear), Number(formattedMonth) - 1, Number(formattedDay));
        if (
            dateObj.getFullYear() !== Number(formattedYear) ||
            dateObj.getMonth() + 1 !== Number(formattedMonth) ||
            dateObj.getDate() !== Number(formattedDay)
        ) {
            setEffectiveDate(null);
            setDateError('Invalid Date');
            return;
        }
        setEffectiveDate(dateObj);
        setDateError("");
    };

    const handleValidateDate = (date: Date) => {
        if (!date) {
            setDateError('Invalid Date');
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (date <= today) {
            setDateError('Date should be in the future');
            return;
        }
        setDateError("");
    };

    const handleSave = () => {
        // If nothing has changed, just switch to view mode
        if (!isDirty) {
            setSidePanelMode('view');
            return;
        }
        // If status is 'Reversing' and redirectToNextGen is 'yes', change status to 'Migrated', set redirectToNextGen to 'yes', and clear reasonForChanges
        if (selectedRow.status === 'Reversing' && redirectToNextGen === 'yes') {
            selectedRow.status = 'Migrated';
            selectedRow.redirectToNextGen = 'yes';
            selectedRow.reasonForChanges = '';
        }
        // If status is 'Reversing' and redirectToNextGen is 'no', update effectiveDate and reasonForChanges
        if (selectedRow.status === 'Reversing' && redirectToNextGen === 'no') {
            // Format date as 'DD MMM YYYY' (e.g., 09 Jan 2026)
            if (effectiveDate) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const formattedDate = `${String(effectiveDate.getDate()).padStart(2, '0')} ${months[effectiveDate.getMonth()]} ${effectiveDate.getFullYear()}`;
                selectedRow.effectiveDate = formattedDate;
            }
            selectedRow.reasonForChanges = reasonForChanges;
        }
        // Only validate if effective date is required (based on UI logic)
        let requireDate = false;
        let requireReason = false;
        if (
            (selectedRow.status === 'Migrated' && redirectToNextGen === 'no') ||
            (selectedRow.status === 'Reversing' && redirectToNextGen === 'no') ||
            (redirectToNextGen === 'yes' && selectedRow.status === 'Not migrated') ||
            (redirectToNextGen === 'yes' && selectedRow.status !== 'Migrated' && selectedRow.status !== 'Not migrated' && selectedRow.status !== 'Reversing')
        ) {
            requireDate = true;
        }
        // Reason for changes is required if status is Migrated and redirectToNextGen is no,
        // or status is Reversing and redirectToNextGen is no,
        // or status is Not migrated and saving (redirectToNextGen === 'no')
        if (
            (selectedRow.status === 'Migrated' && redirectToNextGen === 'no') ||
            (selectedRow.status === 'Reversing' && redirectToNextGen === 'no') ||
            (selectedRow.status === 'Not migrated' && redirectToNextGen === 'no')
        ) {
            requireReason = true;
        }
        setReasonError("");
        if (requireDate) {
            if (!dateParts.day && !dateParts.month && !dateParts.year) {
                setDateError('Date is required');
                return;
            }
            if (!effectiveDate) {
                setDateError('Invalid Date');
                return;
            }
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (effectiveDate <= today) {
                setDateError('Date should be in the future');
                return;
            }
        }
        setDateError("");
        if (requireReason) {
            if (!reasonForChanges.trim()) {
                setReasonError('Reason for changes is required');
                return;
            } else {
                setReasonError("");
            }
        }
        // Log all details to console
        console.log('Save Details:', {
            reasonForChanges,
            redirectToNextGen,
            effectiveDate,
            dateParts,
            selectedRow
        });
        // If date is future and status is 'Not migrated', change status to 'Planned'
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (
            effectiveDate &&
            effectiveDate > today &&
            (selectedRow.status === 'Not migrated' || selectedRow.status === 'Planned')
        ) {
            if (selectedRow.status === 'Not migrated') {
                selectedRow.status = 'Planned';
                // Remove reasonForChanges if present
                if (selectedRow.reasonForChanges) {
                    selectedRow.reasonForChanges = '';
                }
            }
            // Format date as 'DD MMM YYYY' (e.g., 09 Jan 2026)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const formattedDate = `${String(effectiveDate.getDate()).padStart(2, '0')} ${months[effectiveDate.getMonth()]} ${effectiveDate.getFullYear()}`;
            selectedRow.effectiveDate = formattedDate;
        }
        // If status is 'Migrated' and redirectToNextGen is 'no', change status to 'Reversing', set redirectToNextGen to 'no', and update effectiveDate and reasonForChanges
        if (selectedRow.status === 'Migrated' && redirectToNextGen === 'no') {
            selectedRow.status = 'Reversing';
            selectedRow.redirectToNextGen = 'no';
            // Format date as 'DD MMM YYYY' (e.g., 09 Jan 2026)
            if (effectiveDate) {
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                const formattedDate = `${String(effectiveDate.getDate()).padStart(2, '0')} ${months[effectiveDate.getMonth()]} ${effectiveDate.getFullYear()}`;
                selectedRow.effectiveDate = formattedDate;
            }
            selectedRow.reasonForChanges = reasonForChanges;
        }
        // If status is 'Planned' and redirectToNextGen is 'no', revert status to 'Not migrated' and clear effectiveDate and modifiedBy
        if (selectedRow.status === 'Planned' && redirectToNextGen === 'no') {
            selectedRow.status = 'Not migrated';
            selectedRow.effectiveDate = "-";
            selectedRow.modifiedBy = "-";
        }
        setIsDirty(false);
        setSidePanelMode('view');
        setShowSuccessToast(true);
        setTimeout(() => {
            setShowSuccessToast(false);
        }, 3000);

    };

    const getDateParts = (_date: Date | null) => {
        return {
            day: dateParts.day ? Number(dateParts.day) : undefined,
            month: dateParts.month ? Number(dateParts.month) : undefined,
            year: dateParts.year ? Number(dateParts.year) : undefined
        };
    };

    const handleCancel = () => {
        if (isDirty) {
            setShowCancelDialog(true);
            return;
        }

        onClose();
    };

    const handleCancelConfirm = () => {
        setIsDirty(false);
        setShowCancelDialog(false);
        // Reset all form states to initial values from selectedRow
        setReasonForChanges(selectedRow?.reasonForChanges || "");
        setReasonError("");
        setDateError("");
        // Reset effectiveDate and dateParts
        // let initialEffectiveDate = getTomorrow();
        // if (selectedRow?.effectiveDate && selectedRow.effectiveDate !== '-') {
        //     const parts = selectedRow.effectiveDate.split(' ');
        //     if (parts.length === 3) {
        //         const [day, monthStr, year] = parts;
        //         const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        //         const month = months.indexOf(monthStr);
        //         if (month !== -1) {
        //             initialEffectiveDate = new Date(Number(year), month, Number(day));
        //         }
        //     }
        // }
        // setEffectiveDate(initialEffectiveDate);
        // setDateParts({
        //     day: initialEffectiveDate.getDate().toString().padStart(2, '0'),
        //     month: (initialEffectiveDate.getMonth() + 1).toString().padStart(2, '0'),
        //     year: initialEffectiveDate.getFullYear().toString()
        // });
        // // Reset redirectToNextGen
        // if (selectedRow?.status === 'Not migrated' || selectedRow?.status === 'Reversing') {
        //     setRedirectToNextGen('no');
        // } else {
        //     setRedirectToNextGen('yes');
        // }
        onClose();
    };

    const handleCancelDialogClose = () => {
        setShowCancelDialog(false);
    };

    return (
        <SidePanel
            isOpen={isOpen}
            onClose={handleCancel}
            isOnClose
            title={mode === 'view' ? 'View SIMS 7 redirects' : 'Edit SIMS 7 redirects'}
            alignHeading
        >
            <SidePanelContent>
                <>
                    <div>
                        {mode === 'view' && selectedRow && (
                            <div className="view-mode-with-edit-button">
                                <div className="view-mode-content">
                                    <div>
                                        <div className="heading-category">Category</div>
                                        <div className="details-category">{selectedRow.category}</div>
                                    </div>
                                    <div>
                                        <div className="heading-category">Next Gen module</div> {selectedRow.nextGenModule ? (
                                            <a
                                                href={`https://example.com/module/${encodeURIComponent(selectedRow.nextGenModule)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {selectedRow.nextGenModule}
                                            </a>
                                        ) : null}
                                    </div>
                                    <div>
                                        <div className="heading-category">SIMS 7 module</div>
                                        <div className="details-category">{selectedRow.sims7Module}</div>
                                    </div>
                                    <div>
                                        <div className="heading-category">Redirect to open in Next Gen</div>
                                        <div className="details-category">{(selectedRow.status === 'Not migrated' || selectedRow.status === 'Reversing') ? 'No' : 'Yes'}</div>
                                    </div>
                                    {selectedRow.modifiedBy && selectedRow.modifiedBy !== '-' && (
                                        <div>
                                            <div className="heading-category">Modified by</div>
                                            <div className="details-category">{selectedRow.modifiedBy}</div>
                                        </div>
                                    )}
                                    {(selectedRow.status !== 'Not migrated' && selectedRow.effectiveDate && selectedRow.effectiveDate !== '-') || (selectedRow.status === 'Not migrated' && selectedRow.effectiveDate && selectedRow.effectiveDate !== '-') ? (
                                        <div>
                                            <div className="heading-category">Effective date</div>
                                            <div className="details-category">{selectedRow.effectiveDate}</div>
                                        </div>
                                    ) : null}
                                    {selectedRow.reasonForChanges && (
                                        <div>
                                            <div className="heading-category">Reason for changes</div>
                                            <div className="details-category">{selectedRow.reasonForChanges}</div>
                                        </div>
                                    )}
                                    <div>
                                        <div className="heading-category">Status</div>
                                        <div className="details-category">
                                            <Tag
                                                text={selectedRow.status}
                                                size={TagSize.Large}
                                                color={(() => {
                                                    if (selectedRow.status === 'Permanent' || selectedRow.status === 'Migrated') {
                                                        return TagColor.Success;
                                                    }
                                                    if (selectedRow.status === 'Not migrated') {
                                                        return TagColor.Neutral;
                                                    }
                                                    if (selectedRow.status === 'Planned' || selectedRow.status === 'Reversing') {
                                                        return TagColor.Outstanding;
                                                    }
                                                    return TagColor.Neutral;
                                                })()}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {selectedRow.status !== 'Permanent' && (
                                    <div>
                                        <Button
                                            size={ButtonSize.Small}
                                            color={ButtonColor.Tertiary}
                                            iconName="edit--alt"
                                            iconPosition={ButtonIconPosition.Left}
                                            onClick={() => setSidePanelMode('edit')}
                                            dataTestId="edit-button"
                                        >
                                            {t("UI_KIT_EditableSectionEditBtnText")}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )
                        }
                        {mode === 'edit' && selectedRow && (
                            <div className="edit-mode-content">
                                <div>
                                    <div className="heading-category">Category</div>
                                    <div className="details-category">{selectedRow.category}</div>
                                </div>
                                <div>
                                    <div className="heading-category">Next Gen module</div> {selectedRow.nextGenModule ? (
                                        <a
                                            href={`https://example.com/module/${encodeURIComponent(selectedRow.nextGenModule)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {selectedRow.nextGenModule}
                                        </a>
                                    ) : null}
                                </div>
                                <div>
                                    <div className="heading-category">SIMS 7 module</div>
                                    <div className="details-category">{selectedRow.sims7Module}</div>
                                </div>
                                <div>
                                    <div className="heading-category">Redirect to open in Next Gen</div>
                                    <div className="details-category">
                                        <ReactionButtonGroup
                                            dataTestId="edit-redirect-nextgen"
                                            id="edit-redirect-nextgen"
                                            selectedValue={redirectToNextGen}
                                            onChange={handleRedirectToNextGenChange}
                                        >
                                            <ReactionButton
                                                label="Yes"
                                                value="yes"
                                                className="reaction-yes"
                                            />
                                            <ReactionButton
                                                label="No"
                                                value="no"
                                                className="reaction-no"
                                            />
                                        </ReactionButtonGroup>
                                    </div>
                                </div>

                                {selectedRow.status === 'Migrated' && redirectToNextGen === 'no' && (
                                    <>
                                        <div>
                                            <div className="heading-category">Effective date</div>
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
                                        </div>
                                        <div>
                                            <div className="heading-category">Reason for changes</div>
                                            <div className="details-category">
                                                <Textarea
                                                    id="textarea-1"
                                                    value={reasonForChanges}
                                                    // onChange={e => {
                                                    //     setIsDirty(true);
                                                    //     setReasonForChanges(e.target.value);
                                                    // }}
                                                    onChange={e => {
                                                        setIsDirty(true);
                                                        setIsDirty(true);
                                                        setReasonForChanges(e.target.value);
                                                        if (!e.target.value.trim()) {
                                                            setReasonError('Reason for changes is required');
                                                        } else {
                                                            setReasonError("");
                                                        }
                                                    }}
                                                    validationText={reasonError}
                                                    validationTextLevel={reasonError ? ValidationTextLevel.Error : undefined}
                                                    maxLength={100}
                                                />
                                                {/* {reasonError && (
                                                    <div style={{ color: 'red', fontSize: '12px', marginTop: '4px' }}>{reasonError}</div>
                                                )} */}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {selectedRow.status === 'Reversing' && (
                                    redirectToNextGen === 'no' ? (
                                        <>
                                            <div>
                                                <div className="heading-category">Effective date</div>
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
                                            </div>
                                            <div>
                                                <div className="heading-category">Reason for changes</div>
                                                <div className="details-category">
                                                    <Textarea
                                                        id="textarea-1"
                                                        value={reasonForChanges}
                                                        // onChange={e => setReasonForChanges(e.target.value)}
                                                        onChange={e => {
                                                            setIsDirty(true);
                                                            setReasonForChanges(e.target.value);
                                                            // if (e.target.value.trim()) {
                                                            //     setReasonError("");
                                                            // }
                                                            if (!e.target.value.trim()) {
                                                                setReasonError('Reason for changes is required');
                                                            } else {
                                                                setReasonError("");
                                                            }
                                                        }}
                                                        maxLength={100}
                                                        validationText={reasonError}
                                                        validationTextLevel={reasonError ? ValidationTextLevel.Error : undefined}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    ) : null
                                )}
                                {redirectToNextGen === 'yes' && selectedRow.status === 'Not migrated' && (
                                    <div>
                                        <div className="heading-category">Effective date</div>
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
                                    </div>
                                )}
                                {redirectToNextGen === 'yes'
                                    && selectedRow.status !== 'Migrated'
                                    && selectedRow.status !== 'Not migrated'
                                    && selectedRow.status !== 'Reversing' && (
                                        <div>
                                            <div className="heading-category">Effective date</div>
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
                                        </div>
                                    )}
                                {redirectToNextGen !== 'yes'
                                    && selectedRow.status !== 'Migrated'
                                    && selectedRow.status !== 'Reversing'
                                    && selectedRow.reasonForChanges && (
                                        <div>
                                            <div className="heading-category">Reason for changes</div>
                                            <div className="details-category">
                                                <Textarea
                                                    id="textarea-1"
                                                    value={reasonForChanges}
                                                    onChange={e => {
                                                        setIsDirty(true);
                                                        setReasonForChanges(e.target.value);
                                                        if (!e.target.value.trim()) {
                                                            setReasonError('Reason for changes is required');
                                                        } else {
                                                            setReasonError("");
                                                        }
                                                    }}
                                                    validationText={reasonError}
                                                    validationTextLevel={reasonError ? ValidationTextLevel.Error : undefined}
                                                    maxLength={100}
                                                />
                                            </div>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>
                    {showSuccessToast && (
                        <Notification status={NotificationStatus.SUCCESSTOAST} title="Changes saved" />
                    )}
                    <Dialog
                        isOpen={showCancelDialog}
                        onClose={handleCancelDialogClose}
                        escapeExits={true}
                        title={t("SIMS7Redirects.discardChanges")}
                        templateProps={{
                            template: DialogTemplate.Confirmation,
                            contentText: t("SIMS7Redirects.discardChangesDescription"),
                            onConfirm: handleCancelConfirm,
                            onCancel: handleCancelDialogClose,
                            cancelText: "Cancel",
                            okText: "Discard"
                        }}
                    />
                </>
            </SidePanelContent>
            <SidePanelFooter>
                {mode === 'view' ?
                    <Button
                        size={ButtonSize.Large}
                        color={ButtonColor.Secondary}
                        className="btn-full-width"
                        onClick={onClose}
                    >
                        Close
                    </Button>
                    :
                    <>
                        <Button
                            size={ButtonSize.Large}
                            color={ButtonColor.Secondary}
                            className="btn-full-width"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                        <Button
                            size={ButtonSize.Large}
                            color={ButtonColor.Primary}
                            className="btn-full-width"
                            onClick={handleSave}
                        >
                            Save
                        </Button>
                    </>
                }
            </SidePanelFooter>
        </SidePanel>
    );
};

export default Sims7RedirectionsSidePanel;
