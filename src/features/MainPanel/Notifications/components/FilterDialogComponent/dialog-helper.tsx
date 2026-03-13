
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useMemo } from "react";
import { FormLabel, DateInput, CheckBox, ValidationTextLevel } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { getHandleStatusChange, getHandlePriorityChange, parseDateString } from "./dialog-helper.utils";
import "./style.scss";
import { DialogContentProps } from "./FilterDialog.props";

export const DialogContent: React.FC<DialogContentProps> = ({
    setStartDate,
    setEndDate,
    setStatus,
    status,
    setPriority,
    priority,
    startDate,
    endDate,
    startDateError,
    endDateError
}) => {
    const handleStatusChange: (value: string) => void = getHandleStatusChange(setStatus);
    const handlePriorityChange: (value: string) => void = getHandlePriorityChange(setPriority);
    const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

    useEffect(() => {
        const yearPlaceholder = t("NotificationCenter_T.filterDateYearPlaceholder");
        const startYearInput = document.getElementById("start-date_year") as HTMLInputElement | null;
        const endYearInput = document.getElementById("end-date_year") as HTMLInputElement | null;
        if (startYearInput) startYearInput.placeholder = yearPlaceholder;
        if (endYearInput) endYearInput.placeholder = yearPlaceholder;
    }, [t]);

    const startDateParsed: {
        day?: number | undefined;
        month?: number | undefined;
        year?: number | undefined;
    } = useMemo(() => parseDateString(startDate), [startDate]);
    const endDateParsed: {
        day?: number | undefined;
        month?: number | undefined;
        year?: number | undefined;
    } = useMemo(() => parseDateString(endDate), [endDate]);

    // const updateCheckboxState = (elementId: string, shouldBeChecked: boolean) => {
    //     const element = document.getElementById(elementId);
    //     if (!element) return false;

    //     let input: HTMLInputElement | null = null;

    //     input = element.querySelector('input[type="checkbox"]') as HTMLInputElement;

    //     if (!input) {
    //         input = element.querySelector(`#${elementId} input[type="checkbox"]`) as HTMLInputElement;
    //     }

    //     if (!input) {
    //         const testId = element.getAttribute('data-testid');
    //         if (testId) {
    //             input = document.querySelector(`input[data-testid="${testId}"]`) as HTMLInputElement;
    //         }
    //     }

    //     if (!input) {
    //         let value: string | null = null;
    //         if (elementId.includes('read')) {
    //             value = 'read';
    //         } else if (elementId.includes('unread')) {
    //             value = 'unread';
    //         } else if (elementId.includes('low')) {
    //             value = 'low';
    //         } else if (elementId.includes('medium')) {
    //             value = 'medium';
    //         } else if (elementId.includes('high')) {
    //             value = 'high';
    //         }
    //         if (value) {
    //             const allInputs = document.querySelectorAll('input[type="checkbox"]');
    //             allInputs.forEach((inp) => {
    //                 if ((inp as HTMLInputElement).value === value) {
    //                     input = inp as HTMLInputElement;
    //                 }
    //             });
    //         }
    //     }

    //     if (input) {
    //         input.checked = shouldBeChecked;
    //         input.dispatchEvent(new Event('change', { bubbles: true }));
    //         return true;
    //     }
    //     return false;
    // };

    // useEffect(() => {
    //     const updateStatusCheckboxes = () => {
    //         updateCheckboxState("status-read", status.includes("read"));
    //         updateCheckboxState("status-unread", status.includes("unread"));
    //     };

    //     const container = document.querySelector('.dialog-content-container');
    //     if (container) {
    //         const observer = new MutationObserver(() => {
    //             updateStatusCheckboxes();
    //         });

    //         observer.observe(container, {
    //             childList: true,
    //             subtree: true
    //         });

    //         updateStatusCheckboxes();
    //         const timeouts = [
    //             setTimeout(updateStatusCheckboxes, 0),
    //             setTimeout(updateStatusCheckboxes, 10),
    //             setTimeout(updateStatusCheckboxes, 50),
    //             setTimeout(updateStatusCheckboxes, 100),
    //             setTimeout(updateStatusCheckboxes, 200)
    //         ];

    //         return () => {
    //             observer.disconnect();
    //             timeouts.forEach(timeout => clearTimeout(timeout));
    //         };
    //     }
    //     const timeouts = [
    //         setTimeout(updateStatusCheckboxes, 0),
    //         setTimeout(updateStatusCheckboxes, 50),
    //         setTimeout(updateStatusCheckboxes, 100),
    //         setTimeout(updateStatusCheckboxes, 200)
    //     ];
    //     return () => {
    //         timeouts.forEach(timeout => clearTimeout(timeout));
    //     };
    // }, [status]);

    // useEffect(() => {
    //     const updatePriorityCheckboxes = () => {
    //         updateCheckboxState("priority-low", priority.includes("low"));
    //         updateCheckboxState("priority-medium", priority.includes("medium"));
    //         updateCheckboxState("priority-high", priority.includes("high"));
    //     };

    //     const container = document.querySelector('.dialog-content-container');
    //     if (container) {
    //         const observer = new MutationObserver(() => {
    //             updatePriorityCheckboxes();
    //         });

    //         observer.observe(container, {
    //             childList: true,
    //             subtree: true
    //         });

    //         updatePriorityCheckboxes();
    //         const timeouts = [
    //             setTimeout(updatePriorityCheckboxes, 0),
    //             setTimeout(updatePriorityCheckboxes, 10),
    //             setTimeout(updatePriorityCheckboxes, 50),
    //             setTimeout(updatePriorityCheckboxes, 100),
    //             setTimeout(updatePriorityCheckboxes, 200)
    //         ];

    //         return () => {
    //             observer.disconnect();
    //             timeouts.forEach(timeout => clearTimeout(timeout));
    //         };
    //     }
    //     const timeouts = [
    //         setTimeout(updatePriorityCheckboxes, 0),
    //         setTimeout(updatePriorityCheckboxes, 50),
    //         setTimeout(updatePriorityCheckboxes, 100),
    //         setTimeout(updatePriorityCheckboxes, 200)
    //     ];
    //     return () => {
    //         timeouts.forEach(timeout => clearTimeout(timeout));
    //     };
    // }, [priority]);

    return (
        <div className={`dialog-content-container${startDateError ? ' has-error' : ''}`}>
            <div>
                <FormLabel forId="select" className="status-label">
                    {t("NotificationCenter_T.filterStatusLabel")}
                </FormLabel>
                <div className="status-checkboxes">
                    <CheckBox
                        dataTestId="status-read"
                        id="status-read"
                        label={t("NotificationCenter_T.filterStatusRead")}
                        isSelected={status.includes("read")}
                        onChange={() => {
                            handleStatusChange("read");
                        }}
                        value="read"
                    />
                    <CheckBox
                        dataTestId="status-unread"
                        id="status-unread"
                        label={t("NotificationCenter_T.filterStatusUnread")}
                        isSelected={status.includes("unread")}
                        onChange={() => {
                            handleStatusChange("unread");
                        }}
                        value="unread"
                    />
                </div>
                <div style={{ marginTop: "24px" }}>
                    <FormLabel forId="select" className="priority-label">
                        {t("NotificationCenter_T.filterPriorityLabel")}
                    </FormLabel>
                    <div className="priority-checkboxes">
                        <CheckBox
                            dataTestId="priority-low"
                            id="priority-low"
                            label={t("NotificationCenter_T.filterPriorityLow")}
                            isSelected={priority.includes("low")}
                            onChange={() => {
                                handlePriorityChange("low");
                            }}
                            value="low"
                        />
                        <CheckBox
                            dataTestId="priority-medium"
                            id="priority-medium"
                            label={t("NotificationCenter_T.filterPriorityMedium")}
                            isSelected={priority.includes("medium")}
                            onChange={() => {
                                handlePriorityChange("medium");
                            }}
                            value="medium"
                        />
                        <CheckBox
                            dataTestId="priority-high"
                            id="priority-high"
                            label={t("NotificationCenter_T.filterPriorityHigh")}
                            isSelected={priority.includes("high")}
                            onChange={() => {
                                handlePriorityChange("high");
                            }}
                            value="high"
                        />
                    </div>
                </div>
            </div>
            <div className="date-selection">
                <div className="start-end-date-container">
                    <FormLabel>
                        {t("NotificationCenter_T.filterStartDateLabel")}
                    </FormLabel>
                    <DateInput
                        dataTestId="start-date"
                        id="start-date"
                        day={startDateParsed.day}
                        month={startDateParsed.month}
                        year={startDateParsed.year}
                        onChange={(day: string | number, month: string | number, year: string | number) => {
                            if ((!year || !month || !day )) {
                                setStartDate("");
                                return;
                            }
                            const formattedDay: string = String(day).padStart(2, '0');
                            const formattedMonth: string = String(month).padStart(2, '0');
                            setStartDate(`${year}-${formattedMonth}-${formattedDay}`);
                        }}
                        onError={() => { }}
                        onValidateDate={() => { }}
                        showDatePicker
                        validationText={startDateError || undefined}
                        validationTextLevel={startDateError ? ValidationTextLevel.Error : undefined}
                    />
                </div>
                <div className="start-end-date-container">
                    <FormLabel>
                        {t("NotificationCenter_T.filterEndDateLabel")}
                    </FormLabel>
                    <DateInput
                        dataTestId="end-date"
                        id="end-date"
                        day={endDateParsed.day}
                        month={endDateParsed.month}
                        year={endDateParsed.year}
                        onChange={(day: string | number, month: string | number, year: string | number) => {
                            const formattedDay: string = String(day).padStart(2, '0');
                            const formattedMonth: string = String(month).padStart(2, '0');
                            if (year === "" || month === "" || day === "") {
                                setEndDate("");
                                return;
                            }
                            if (setEndDate) setEndDate(`${year}-${formattedMonth}-${formattedDay}`);
                        }}
                        onError={() => { }}
                        onValidateDate={() => { }}
                        showDatePicker
                        validationText={endDateError || undefined}
                        validationTextLevel={
                            endDateError ? ValidationTextLevel.Error : undefined
                        }
                    />
                </div>
            </div>
        </div>
    );
};