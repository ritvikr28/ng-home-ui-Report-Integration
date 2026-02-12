import { ISelectedItem, SelectedItem } from "@essnextgen/ui-kit";
import { CategoryData } from "../../../features/DocumentManagementServer/responseModel";
import { ISchoolNameDataResponse } from "../../model/SchoolDomain/responsemodels";

export interface DateParts {
  day: string;
  month: string;
  year: string;
}

export interface DateRange {
  fromDate: string;
  toDate: string;
}

export interface UseFilterDialogLogicProps {
  isOpen: boolean;
  selectedKey: string;
  localTagListArray: SelectedItem[];
  schoolData: ISchoolNameDataResponse | null;
  setRefId: React.Dispatch<React.SetStateAction<string[]>>;
  setFilterEntities: React.Dispatch<React.SetStateAction<unknown[]>>;
  refId: string[];
  setCategoryError: React.Dispatch<React.SetStateAction<boolean>>;
  setAvailableCategories: React.Dispatch<React.SetStateAction<CategoryData[]>>;
  setLocalSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>;
  localSelectedCategories: ISelectedItem[];
  selectedDisplayKey: string;
  fetchSchoolData: () => void;
  selectedDateRange: DateRange;
  setLocalSelectedDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  setLocalTagListArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  setLocalSelectedRelatedTo: React.Dispatch<React.SetStateAction<ISelectedItem | undefined>>;
  selectedRelatedTo: ISelectedItem | undefined;
  setSelectedKey: React.Dispatch<React.SetStateAction<string>>;
  setIsDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  setSuggestions: React.Dispatch<React.SetStateAction<any[]>>;
  setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>;
  setFromDate: React.Dispatch<React.SetStateAction<DateParts>>;
  setToDate: React.Dispatch<React.SetStateAction<DateParts>>;
  setSelectedDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  setFromDateError: React.Dispatch<React.SetStateAction<string>>;
  setToDateError: React.Dispatch<React.SetStateAction<string>>;
  setIsDateError: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterDialogOpen: boolean;
  setWasApplied: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
  selectedCategories: ISelectedItem[];
  tagListArray: SelectedItem[];
  localSelectedRelatedTo: ISelectedItem | undefined;
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>;
  setTagListArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  searchTerm: string;
  handleSearchChange: (
    t: (key: string) => string,
    e: { target: { value: string } },
    registrationIds: string[],
    fromDate: string,
    toDate: string,
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>,
    setSuggestions: React.Dispatch<React.SetStateAction<any[]>>,
    setShowSearchError: React.Dispatch<React.SetStateAction<boolean>>,
    setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setShowErrorBanner: React.Dispatch<React.SetStateAction<boolean>>,
    documentRelatedTo?: number
  ) => void;
  setIsSearchLoading: React.Dispatch<React.SetStateAction<boolean>>;
  wasApplied: boolean;
}