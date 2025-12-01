import React from "react";
import { Dialog, DialogContent, DialogFooter, Button, ButtonColor } from "@essnextgen/ui-kit";
import { DialogContent as Content } from "./dialog-helper";
import "./style.scss";

const FilterDialogView = ({ status, setStatus, priority, setPriority, startDate, setStartDate, endDate, setEndDate }: {
    // setFilterBtnClicked?: React.Dispatch<React.SetStateAction<boolean>>;
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
    priority: string;
    setPriority: React.Dispatch<React.SetStateAction<string>>;
    startDate: string;
    setStartDate: React.Dispatch<React.SetStateAction<string>>;
    endDate: string;
    setEndDate: React.Dispatch<React.SetStateAction<string>>;
    // onApply?: () => void;
    // onClear?: () => void;
    // onClose?: () => void;
    // statusOptions?: string[];
    // priorityOptions?: string[];
}) => {
    const [isDialogOpen, setIsDialogOpen] = React.useState(true);

    return (
        <>
            <Dialog
                className="dialog-class"
                dataTestId="test-id"
                isOpen={isDialogOpen}
                escapeExits
                returnFocusOnDeactivate
                id="element-id"
                onClose={() => {
                    // setFilterBtnClicked && setFilterBtnClicked(false);
                    setIsDialogOpen(false)
                }}
                title="Filter by"
            >
                <DialogContent>
                    <Content startDate={startDate} setStartDate={setStartDate} endDate={endDate} setEndDate={setEndDate} status={status} setStatus={setStatus} priority={priority} setPriority={setPriority} />
                </DialogContent>
                <DialogFooter>
                    <div className="dialog-footer" style={{ display: "flex", gap: "10px", width: "100%", flexDirection: "row-reverse" }}>
                        <Button
                            dataTestId="close-btn"
                            onClick={() => {
                                console.log("Apply button clicked--------------", { startDate, endDate, status, priority });
                            }}
                            color={ButtonColor.Primary}
                        >
                            Apply
                        </Button>
                        <Button
                            dataTestId="close-btn"
                            onClick={() => { }}
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
