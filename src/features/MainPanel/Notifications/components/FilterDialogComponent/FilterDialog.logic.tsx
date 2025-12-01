import { useState } from "react";
import FilterDialogView from "./FilterDialog.view";

// const statusOptions = ["Read", "Unread"];
// const priorityOptions = ["Low", "Medium", "High"];

const FilterDialogLogic = ({
    // setFilterBtnClicked,
    // filters = {},
    // onApply,
    // onClear
}: {
        // setFilterBtnClicked: (val: boolean) => void,
        // filters?: any,
        // onApply?: (filters: any) => void,
        // onClear?: () => void
    }) => {
    const [status, setStatus] = useState("");
    const [priority, setPriority] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // const handleApply = () => {
    //     onApply?.({
    //         status,
    //         priority,
    //         startDate,
    //         endDate
    //     });
    //     setFilterBtnClicked(false);
    // };

    // const handleClear = () => {
    //     setStatus("");
    //     setPriority("");
    //     setStartDate("");
    //     setEndDate("");
    //     onClear?.();
    // };

    return (
        <FilterDialogView
            status={status}
            setStatus={setStatus}
            priority={priority}
            setPriority={setPriority}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
        // onApply={handleApply}
        // onClear={handleClear}
        // onClose={() => setFilterBtnClicked(false)}
        // statusOptions={statusOptions}
        // priorityOptions={priorityOptions}
        />
    );
};

export default FilterDialogLogic;