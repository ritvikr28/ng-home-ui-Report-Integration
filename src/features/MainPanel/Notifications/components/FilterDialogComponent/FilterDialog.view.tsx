import { Button, ButtonColor, Dialog, DialogContent, DialogFooter } from "@essnextgen/ui-kit"
import React from "react";
import { DialogContent as Content } from "./dialog-helper";
import "./style.scss";

const FilterDialogView = ({ setFilterBtnClicked }: { setFilterBtnClicked: React.Dispatch<React.SetStateAction<boolean>> }) => {
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
                    setFilterBtnClicked(false);
                    setIsDialogOpen(false)
                }}
                title="Filter by"
            >
                <DialogContent>
                    <Content />
                </DialogContent>
                <DialogFooter>
                    <div className="dialog-footer" style={{ display: "flex", gap: "10px", width: "100%", flexDirection: "row-reverse" }}>
                        <Button
                            dataTestId="close-btn"
                            onClick={() => { }}
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
