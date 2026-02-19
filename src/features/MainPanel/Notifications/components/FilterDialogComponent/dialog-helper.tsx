
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { FormLabel, DateInput, CheckBox, ValidationTextLevel } from "@essnextgen/ui-kit";
import { useTranslation } from "@essnextgen/ui-intl-kit";
import "./style.scss";
import { DialogContentProps } from "./FilterDialog.props";

export const DialogContent: React.FC<DialogContentProps> = ({ 
    setStartDate, 
    setEndDate, 
    // setStatus, 
    // status,
    // setPriority,
    // priority,
    // startDate,
    // endDate,
    startDateError
}) => {
    const { t }: { t: (key: string) => string } = useTranslation();
    // const handleStatusChange = (value: string) => {
    //     setStatus((prev: string[]) => {
    //         if (prev.includes(value)) {
    //             return prev.filter((s: string) => s !== value);
    //         }
    //         return [...prev, value];
    //     });
    // };

    // const handlePriorityChange = (value: string) => {
    //     setPriority((prev: string[]) => {
    //         if (prev.includes(value)) {
    //             return prev.filter((p: string) => p !== value);
    //         }
    //         return [...prev, value];
    //     });
    // };

    // const parseDateString = (dateStr: string): { day?: number; month?: number; year?: number } => {
    //     if (!dateStr) return {};
    //     const parts = dateStr.split("-");
    //     if (parts.length !== 3) return {};
    //     const year = parseInt(parts[0], 10);
    //     const month = parseInt(parts[1], 10);
    //     const day = parseInt(parts[2], 10);
    //     if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) return {};
    //     return { day, month, year };
    // };

    // const startDateParsed = parseDateString(startDate);
    // const endDateParsed = parseDateString(endDate);

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
                    Status
                </FormLabel>
                <div className="status-checkboxes">
                    <CheckBox
                        dataTestId="status-read"
                        id="status-read"
                        label="Read"
                        onChange={() => {
                            // handleStatusChange("read");
                        }}
                        value="read"
                    />
                    <CheckBox
                        dataTestId="status-unread"
                        id="status-unread"
                        label="Unread"
                        onChange={() => {
                            // handleStatusChange("unread");
                        }}
                        value="unread"
                    />
                </div>
                <div style={{ marginTop: "24px" }}>
                    <FormLabel forId="select" className="priority-label">
                        Priority
                    </FormLabel>
                    <div className="priority-checkboxes">
                        <CheckBox
                            dataTestId="priority-low"
                            id="priority-low"
                            label="Low"
                            onChange={() => {
                                // handlePriorityChange("low");
                            }}
                            value="low"
                        />
                        <CheckBox
                            dataTestId="priority-medium"
                            id="priority-medium"
                            label="Medium"
                            onChange={() => {
                                // handlePriorityChange("medium");
                            }}
                            value="medium"
                        />
                        <CheckBox
                            dataTestId="priority-high"
                            id="priority-high"
                            label="High"
                            onChange={() => {
                                // handlePriorityChange("high");
                            }}
                            value="high"
                        />
                    </div>
                </div>
            </div>
            <div className="date-selection">
                <div className="start-end-date-container">
                    <FormLabel>
                        Start date
                    </FormLabel>
                    <DateInput
                        dataTestId="start-date"
                        id="start-date"
                        // day={startDateParsed.day}
                        // month={startDateParsed.month}
                        // year={startDateParsed.year}
                        onChange={(day: string | number, month: string | number, year: string | number) => {
                            const formattedDay: string = String(day).padStart(2, '0');
                            const formattedMonth: string = String(month).padStart(2, '0');
                            if (setStartDate) setStartDate(`${year}-${formattedMonth}-${formattedDay}`);
                        }}
                        onError={() => { }}
                        onValidateDate={() => { }}
                        showDatePicker
                        validationText={startDateError ? t("Filter.startDateRequired") : undefined}
                        validationTextLevel={startDateError ? ValidationTextLevel.Error : undefined}
                    />
                </div>
                <div className="start-end-date-container">
                    <FormLabel>
                        End date
                    </FormLabel>
                    <DateInput
                        dataTestId="end-date"
                        id="end-date"
                        // day={endDateParsed.day}
                        // month={endDateParsed.month}
                        // year={endDateParsed.year}
                        onChange={(day: string | number, month: string | number, year: string | number) => {
                            const formattedDay: string = String(day).padStart(2, '0');
                            const formattedMonth: string = String(month).padStart(2, '0');
                            if (setEndDate) setEndDate(`${year}-${formattedMonth}-${formattedDay}`);
                        }}
                        onError={() => { }}
                        onValidateDate={() => { }}
                        showDatePicker
                    />
                </div>
            </div>
        </div>
    );
};