import { useState, useEffect } from "react";
import FilterDialogView from "./FilterDialog.view";

interface FilterDialogLogicProps {
    setFilterBtnClicked: (val: boolean) => void;
    filters: {
        status?: string[];
        priority?: string[];
        startDate?: string;
        endDate?: string;
    };
    onApply: (filters: {
        status?: string[];
        priority?: string[];
        startDate?: string;
        endDate?: string;
    }) => void;
    onClear: () => void;
}

const FilterDialogLogic = ({
    setFilterBtnClicked,
    filters = {},
    onApply,
    onClear
}: FilterDialogLogicProps) => {
    const [status, setStatus] = useState<string[]>(filters.status || []);
    const [priority, setPriority] = useState<string[]>(filters.priority || []);
    const [startDate, setStartDate] = useState(filters.startDate || "");
    const [endDate, setEndDate] = useState(filters.endDate || "");

    useEffect(() => {
        setStatus(filters.status || []);
        setPriority(filters.priority || []);
        setStartDate(filters.startDate || "");
        setEndDate(filters.endDate || "");
    }, [filters]);

    const handleApply = () => {
        onApply({
            status: status.length > 0 ? status : undefined,
            priority: priority.length > 0 ? priority : undefined,
            startDate: startDate || undefined,
            endDate: endDate || undefined
        });
        setFilterBtnClicked(false);
    };

    const handleClear = () => {
        setStatus([]);
        setPriority([]);
        setStartDate("");
        setEndDate("");
        onApply({
            status: undefined,
            priority: undefined,
            startDate: undefined,
            endDate: undefined
        });
        onClear();
        setFilterBtnClicked(false);
    };

    const handleClose = () => {
        setFilterBtnClicked(false);
    };

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
            onApply={handleApply}
            onClear={handleClear}
            onClose={handleClose}
        />
    );
};

export default FilterDialogLogic;