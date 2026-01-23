import { useState, useEffect, Dispatch, SetStateAction } from "react";
import FilterDialogView from "./FilterDialog.view";
import { FilterStates } from "./FilterDialog.props";

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

const isNonEmptyString = (value?: string): boolean => !!value && value.trim() !== "";

const getInitialState = (filters: FilterDialogLogicProps["filters"]) => ({
    status: filters.status || [],
    priority: filters.priority || [],
    startDate: filters.startDate || "",
    endDate: filters.endDate || ""
});

const useFilterStates = (filters: FilterDialogLogicProps["filters"]) => {
    const initial: {
        status: string[];
        priority: string[];
        startDate: string;
        endDate: string;
    } = getInitialState(filters);
    const [status, setStatus]: [string[], Dispatch<SetStateAction<string[]>>] = useState<string[]>(initial.status);
    const [priority, setPriority]: [string[], Dispatch<SetStateAction<string[]>>] = useState<string[]>(initial.priority);
    const [startDate, setStartDate]: [string, Dispatch<SetStateAction<string>>] = useState<string>(initial.startDate);
    const [endDate, setEndDate]: [string, Dispatch<SetStateAction<string>>] = useState<string>(initial.endDate);
    const [startDateError, setStartDateError]: [string, Dispatch<SetStateAction<string>>] = useState<string>("");

    useEffect(() => {
        setStatus(filters.status || []);
        setPriority(filters.priority || []);
        setStartDate(filters.startDate || "");
        setEndDate(filters.endDate || "");
        setStartDateError("");
    }, [filters]);

    return {
        status, setStatus,
        priority, setPriority,
        startDate, setStartDate,
        endDate, setEndDate,
        startDateError, setStartDateError
    };
};

const validateStartDate: (startDate: string, endDate: string) => string = (startDate: string, endDate: string): string => {
    if (isNonEmptyString(endDate) && !isNonEmptyString(startDate)) {
        return "startDateRequired";
    }
    return "";
};

const FilterDialogLogic: ({ setFilterBtnClicked, filters, onApply, onClear }: FilterDialogLogicProps) => JSX.Element = ({
    setFilterBtnClicked,
    filters = {},
    onApply,
    onClear
}: FilterDialogLogicProps): JSX.Element => {
    const {
        status, setStatus,
        priority, setPriority,
        startDate, setStartDate,
        endDate, setEndDate,
        startDateError, setStartDateError
    }: FilterStates = useFilterStates(filters);

    useEffect(() => {
        setStartDateError(validateStartDate(startDate, endDate));
    }, [startDate, endDate, setStartDateError, endDate]);

    const handleApply: () => void
        = () => {
            if (startDateError) return;
            onApply({
                ...(status.length ? { status } : {}),
                ...(priority.length ? { priority } : {}),
                ...(isNonEmptyString(startDate) ? { startDate } : {}),
                ...(isNonEmptyString(endDate) ? { endDate } : {})
            });
            setFilterBtnClicked(false);
        };

    const handleClear: () => void = () => {
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

    const handleClose: () => void = () => setFilterBtnClicked(false);

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
            startDateError={startDateError}
            onApply={handleApply}
            onClear={handleClear}
            onClose={handleClose}
        />
    );
};

export default FilterDialogLogic;