import React from "react";
import { Dialog, DialogContent, DialogFooter, Button, ButtonColor } from "@essnextgen/ui-kit";
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

const FilterDialogView = ({ 
    status, 
    setStatus,
    priority, 
    setPriority, 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate,
    startDateError="",
    endDateError="",
    onApply,
    onClear,
    onClose
}: FilterDialogViewProps) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(true);

    const handleClose = () => {
        setIsDialogOpen(false);
        onClose();
    };

    const handleApply = () => {
        if (startDateError || endDateError) {
            return;
        }
        onApply();
        setIsDialogOpen(false);
    };

    const handleClear = () => {
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
                title="Filter by"
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
                            Apply
                        </Button>
                        <Button
                            dataTestId="clear-all-btn"
                            onClick={handleClear}
                            color={ButtonColor.Secondary}
                        >
                            Clear all
                        </Button>
                    </div>
                </DialogFooter>
            </Dialog>
        </>
    )
}

export default FilterDialogView;
