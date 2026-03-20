import React from "react";
import { Dialog, DialogContent, DialogFooter, Button, ButtonColor } from "@essnextgen/ui-kit";
import { useTranslation, UseTranslationResponse } from "@essnextgen/ui-intl-kit";
import { DialogContent as Content } from "./dialog-helper";
import "./style.scss";

interface FilterDialogViewProps {
    status: string[];
    setStatus: React.Dispatch<React.SetStateAction<string[]>>;
    priority: string[];
    setPriority: React.Dispatch<React.SetStateAction<string[]>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    startDateError: string;
    endDateError: string;
    onApply: () => void;
    onClear: () => void;
    onClose: () => void;
}

const FilterDialogView: ({ status, setStatus, priority, setPriority, startDate, setStartDate, endDate, setEndDate, startDateError,
    onApply, onClear, onClose }: FilterDialogViewProps) => JSX.Element = ({
        status,
        setStatus,
        priority,
        setPriority,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        startDateError,
        endDateError = "",
        onApply,
        onClear,
        onClose
    }: FilterDialogViewProps) => {
        const [isDialogOpen, setIsDialogOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = React.useState(true);
        const { t }: UseTranslationResponse<"translation", undefined> = useTranslation();

        const handleClose: () => void = () => {
            setIsDialogOpen(false);
            onClose();
        };

        const handleApply: () => void = () => {
            if (startDateError || endDateError) {
                return;
            }
            onApply();
            setIsDialogOpen(false);
        };

        const handleClear: () => void = () => {
            onClear();
        };

        return (
            <>
                <Dialog
                    className="dialog-class"
                    dataTestId="test-id"
                    isOpen={isDialogOpen}
                    escapeExits
                    returnFocusOnDeactivate
                    id="element-id"
                    onClose={handleClose}
                    title={t("NotificationCenter_T.filterDialogTitle")}
                >
                    <DialogContent>
                        <Content
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
                            status={status}
                            setStatus={setStatus}
                            priority={priority}
                            setPriority={setPriority}
                            startDateError={startDateError}
                            endDateError={endDateError}
                        />
                    </DialogContent>
                    <DialogFooter>
                        <div className="dialog-footer" style={{ display: "flex", gap: "24px", width: "100%", flexDirection: "row-reverse" }}>
                            <Button
                                dataTestId="apply-btn"
                                onClick={handleApply}
                                color={ButtonColor.Primary}
                            >
                                {t("NotificationCenter_T.filterDialogApply")}
                            </Button>
                            <Button
                                dataTestId="clear-all-btn"
                                onClick={handleClear}
                                color={ButtonColor.Secondary}
                            >
                                {t("NotificationCenter_T.filterDialogClearAll")}
                            </Button>
                        </div>
                    </DialogFooter>
                </Dialog>
            </>
        )
    }

export default FilterDialogView;
