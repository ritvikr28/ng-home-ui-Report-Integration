import React from "react";
import { FormLabel, Dropdown, DropdownItem, ISelectedItem } from "@essnextgen/ui-kit";

interface FilterRelatedToDropdownProps {
  t: (key: string) => string;
  dataTestId: string;
  relatedTo: any[];
  localSelectedRelatedTo: ISelectedItem | undefined;
  setLocalSelectedRelatedTo: (item: ISelectedItem) => void;
  setRelatedToError: (msg: string) => void;
  setRefId: (ids: string[]) => void;
  setSchoolData: (data: any) => void;
  setRelatedToSelected: (v: boolean) => void;
  setSuggestions: (v: any[]) => void;
  setLocalTagListArray: (v: any[]) => void;
  setReferenceExternalIds?: (v: string[]) => void;
  setSearchTerm: (v: string) => void;
  setShowSearchError: (v: boolean) => void;
  setIsDropdownOpen: (v: boolean) => void;
  setSearchSelectionError: (v: string) => void;
  setLocalSelectedCategories: (v: any[]) => void;
  setToDateError: (v: string) => void;
  setFromDateError: (v: string) => void;
  setFromDate: (v: { day: string; month: string; year: string }) => void;
  setToDate: (v: { day: string; month: string; year: string }) => void;
  setSelectedDateRange: (v: { fromDate: string; toDate: string }) => void;
  setSearchKey: (cb: (prev: number) => number) => void;
  relatedToError: string;
  onRelatedToChange?: (key: string) => void;
}

export const FilterRelatedToDropdown: React.FC<FilterRelatedToDropdownProps> = ({
  t,
  dataTestId,
  relatedTo,
  localSelectedRelatedTo,
  setLocalSelectedRelatedTo,
  setRelatedToError,
  setRefId,
  setSchoolData,
  setRelatedToSelected,
  setSuggestions,
  setLocalTagListArray,
  setReferenceExternalIds,
  setSearchTerm,
  setShowSearchError,
  setIsDropdownOpen,
  setSearchSelectionError,
  setLocalSelectedCategories,
  setToDateError,
  setFromDateError,
  setFromDate,
  setToDate,
  setSelectedDateRange,
  setSearchKey,
  relatedToError,
  onRelatedToChange
}) => (
  <>
    <FormLabel>{t("Filter.relatedToHeading")}</FormLabel>
    <Dropdown
      className="dms-related-to-dropdown"
      dataTestId={`${dataTestId}-related-to`}
      isScrollbarVisible
      selectedItem={localSelectedRelatedTo}
      onSelect={(_e, item: ISelectedItem) => {
        setLocalSelectedRelatedTo(item);
        setRelatedToError("");
        setRefId([]);
        setSchoolData(null);
        setRelatedToSelected(true);
        setSuggestions([]);
        setLocalTagListArray([]);
        if (setReferenceExternalIds) setReferenceExternalIds([]);
        setSearchTerm("");
        setShowSearchError(false);
        setIsDropdownOpen(false);
        setSearchSelectionError("");
        setLocalSelectedCategories([]);
        setToDateError("");
        setFromDateError("");
        setFromDate({ day: "", month: "", year: "" });
        setToDate({ day: "", month: "", year: "" });
        setSelectedDateRange({ fromDate: "", toDate: "" });
        setSearchKey(prevKey => prevKey + 1);
        if (onRelatedToChange) {
          onRelatedToChange(item.data?.data?.key || "");
        }
      }}
      validationText={relatedToError}
      validationTextLevel={relatedToError ? ("error" as any) : undefined}
      placeholderText={t("Filter.selectOption")}
    >
      {relatedTo.map((item) => (
        <DropdownItem
          key={item.value}
          data={item}
          id={item.value.toString()}
          text={item.text}
          value={item.value.toString()}
        >
          {item.text}
        </DropdownItem>
      ))}
    </Dropdown>
  </>
);

FilterRelatedToDropdown.defaultProps = {
  setReferenceExternalIds: undefined,
  onRelatedToChange: undefined
};