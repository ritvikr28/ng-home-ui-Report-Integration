import { useState, useEffect } from "react";
import FilterDialogView from "./FilterDialog.view";
import { DateErrors } from "./FilterDialog.props";

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
    const [errors, setErrors] = useState<DateErrors>({
      from: "",
      to: "",
    });

    useEffect(() => {
        setStatus(filters.status || []);
        setPriority(filters.priority || []);
        setStartDate(filters.startDate || "");
        setEndDate(filters.endDate || "");
        setErrors({from: "", to: ""});
    }, [filters]);

    useEffect(() => {
      setErrors(validateDateRange(startDate, endDate));
    }, [startDate, endDate]);

  const validateDateRange = (from: string, to: string): DateErrors => {
    if (!from || !to) {
      return { from: "", to: "" };
    }

    return new Date(from) > new Date(to)
      ? {
          from: "Date from cannot be after date to",
          to: "Date to cannot be before date from",
        }
      : { from: "", to: "" };
  };
    const handleApply = () => {
        if (!errors.from && !errors.to) {
            onApply({
                status: status.length > 0 ? status : undefined,
                priority: priority.length > 0 ? priority : undefined,
                startDate: startDate || undefined,
                endDate: endDate || undefined
            });
            setFilterBtnClicked(false);
        }
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
            startDateError={errors.from}
            endDateError={errors.to}     
            onApply={handleApply}
            onClear={handleClear}
            onClose={handleClose}
            isFormValid={!errors.from && !errors.to}
        />
    );
};

export default FilterDialogLogic;