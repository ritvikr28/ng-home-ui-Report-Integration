import {
  Dialog,
  Button,
  ButtonColor,
  ISelectedItem,
  ButtonSize,
  ValidationTextLevel,
  Loader,
  LoaderType,
  ISearchItemProp,
  Suggestion,
  SelectedItem,
  Notification,
  NotificationStatus
} from "@essnextgen/ui-kit";
import { useTranslation, TFunction } from "@essnextgen/ui-intl-kit";
import React, { useCallback, useEffect, useState } from "react";
import "./style.scss";
import { CategoryData, PrivacyFilterDetails } from "../../../features/DocumentManagementServer/responseModel";
import { DEFAULT_PRIVACY_FILTER, relatedToEnum } from "../../../../public/Constants";
import { handleSearchChange } from "../../../features/DocumentManagementServer/logic/DocumentManagementServer.handler";
import { ISchoolNameDataResponse } from "../../model/SchoolDomain/responsemodels";
import { getValidationState, getAllRegistrationIds, filterNonEmptySuggestions, addUniqueTagItem } from "../../../features/DocumentManagementServer/logic/DocumentManagementServer.utils";
import { SearchSection } from "./components/FilterSearch";
import { FilterDateSection } from "./components/FilterDateSection";
import { FilterCategoryDropdown } from "./components/FilterCategoryDropdown";
import { FilterRelatedToDropdown } from "./components/FilterRelatedToDropdown";
import {  handleDateChange, handleApplyWrapper, onSelectMultipleCategories, getEntityLabel, fetchSchoolData, clearAll, handleDialogClose, handleRemoveTag, getValidationLevelMsg, getValidationTextMsg, shouldShowWarningNotification } from "./FilterDialog.utils";
import { useFetchSchoolEffect, useSyncSelectedKeyEffect, useFetchCategoriesEffect, useResetCategoryErrorEffect, useDateSyncEffect, useDropdownSyncEffect, useResetOnCloseEffect, useEscapeKeyEffect, useSearchEffect, useBuildRefIdsEffect, usePrivacyFilterEffect } from "./hook/useFilterDialogLogic";
import { FilterRadioButton } from "./components/FilterRadioButton";
import { DMSPrivateDocument } from "../../../Layout";

export interface FilterDialogProps {
  dataTestId?: string;
  title: string;
  isOpen: boolean;
  onClose: () => void;
  setSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>;
  selectedCategories: ISelectedItem[];
  handleApply: (referenceExternalIds: string[], categories?: ISelectedItem[], entities?: any[], documentStatusIds?: number[]) => void;
  isFilterDialogOpen: boolean;
  setIsDateError: React.Dispatch<React.SetStateAction<boolean>>;
  isDateError: boolean;
  setSelectedDateRange: React.Dispatch<React.SetStateAction<{ fromDate: string, toDate: string }>>
  selectedDateRange: { fromDate: string, toDate: string }
  isLoading?: boolean;
  setReferenceExternalIds?: React.Dispatch<React.SetStateAction<string[]>>;
  setDocumentRelatedTo: React.Dispatch<React.SetStateAction<number>>;
  selectedRelatedTo: ISelectedItem | undefined;
  setSelectedRelatedTo: React.Dispatch<React.SetStateAction<ISelectedItem | undefined>>;
  tagListArray: SelectedItem[];
  setTagListArray: React.Dispatch<React.SetStateAction<SelectedItem[]>>;
  selectedPrivacyFilter?: string;
  setSelectedPrivacyFilter?: React.Dispatch<React.SetStateAction<string>>;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  dataTestId = "dms-filter-dialog",
  title,
  isOpen,
  onClose,
  setSelectedCategories,
  selectedCategories,
  handleApply,
  isDateError,
  isFilterDialogOpen,
  setIsDateError,
  setSelectedDateRange,
  selectedDateRange,
  isLoading,
  setReferenceExternalIds,
  setDocumentRelatedTo,
  selectedRelatedTo,
  setSelectedRelatedTo,
  tagListArray,
  setTagListArray,
  selectedPrivacyFilter,
  setSelectedPrivacyFilter
}: FilterDialogProps) => {
  const { t }: { t: TFunction } = useTranslation();
  const [fromDateError, setFromDateError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [toDateError, setToDateError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [fromDate, setFromDate]: [{ day: string; month: string; year: string }, React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [toDate, setToDate]: [{ day: string; month: string; year: string }, React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>] = useState<{ day: string; month: string; year: string }>({ day: "", month: "", year: "" });
  const [wasApplied, setWasApplied]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const [searchTerm, setSearchTerm]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [suggestions, setSuggestions]: [Suggestion[], React.Dispatch<React.SetStateAction<Suggestion[]>>] = useState<Suggestion[]>([]);
  const [isSearchLoading, setIsSearchLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showSearchError, setShowSearchError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const [availableCategories, setAvailableCategories]: [CategoryData[], React.Dispatch<React.SetStateAction<CategoryData[]>>] = useState<CategoryData[]>([]);
  const [relatedToError, setRelatedToError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [searchSelectionError, setSearchSelectionError]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [localSelectedCategories, setLocalSelectedCategories]: [ISelectedItem[], React.Dispatch<React.SetStateAction<ISelectedItem[]>>] = useState<ISelectedItem[]>([]);
  const [localSelectedDateRange, setLocalSelectedDateRange]: [{ fromDate: string, toDate: string }, React.Dispatch<React.SetStateAction<{ fromDate: string, toDate: string }>>] = useState<{ fromDate: string, toDate: string }>(selectedDateRange);
  const [localTagListArray, setLocalTagListArray]: [SelectedItem[], React.Dispatch<React.SetStateAction<SelectedItem[]>>] = useState<SelectedItem[]>(tagListArray);
  const [localSelectedRelatedTo, setLocalSelectedRelatedTo]: [ISelectedItem | undefined, React.Dispatch<React.SetStateAction<ISelectedItem | undefined>>] = useState<ISelectedItem | undefined>();
  const [relatedToSelected, setRelatedToSelected]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState(false);
  const [searchKey, setSearchKey]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
  const [alreadyExistingTags, setAlreadyExistingTags]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [selectedKey, setSelectedKey]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>(localSelectedRelatedTo?.data?.data?.key || "");
  const selectedDisplayKey: string = selectedKey === "Organisation" ? "School" : selectedKey;
  const [schoolData, setSchoolData]: [ISchoolNameDataResponse | null, React.Dispatch<React.SetStateAction<ISchoolNameDataResponse | null>>] = useState<ISchoolNameDataResponse | null>(null);
  const [refId, setRefId]: [string[], React.Dispatch<React.SetStateAction<string[]>>] = useState<string[]>([]);
  const [filterEntities, setFilterEntities]: [any[], React.Dispatch<React.SetStateAction<any[]>>] = useState<any[]>([]);
  const [categoryError, setCategoryError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [showErrorBanner, setShowErrorBanner]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyFilterDetails[]>(DEFAULT_PRIVACY_FILTER);
  const [localSelectedPrivacyFilter, setLocalSelectedPrivacyFilter] = useState<string>(selectedPrivacyFilter ?? "");  // local state like localSelectedCategories


  // eslint-disable-next-line no-unused-expressions
  alreadyExistingTags;
  // eslint-disable-next-line no-unused-expressions
  showErrorBanner;

  usePrivacyFilterEffect(selectedKey, setPrivacyFilter);

  const { validationText, validationTextLevel }: { validationText: string; validationTextLevel: ValidationTextLevel | null } = getValidationState(searchSelectionError, showSearchError, t);

  useFetchSchoolEffect(selectedDisplayKey, setSchoolData, fetchSchoolData);

  useSyncSelectedKeyEffect(localSelectedRelatedTo, setSelectedKey);

  useFetchCategoriesEffect({
    isOpen,
    refId,
    selectedKey,
    localSelectedRelatedTo,
    setCategoryError,
    setAvailableCategories,
    setLocalSelectedCategories,
    localSelectedCategories
  });

  useResetCategoryErrorEffect(refId, setCategoryError);
  // In your FilterDialog component
  useEffect(() => {
    // Only update refId when localTagListArray changes
    if (["Pupil", "Staff"].includes(selectedKey)) {
      setRefId(getAllRegistrationIds(localTagListArray));
    }
  }, [localTagListArray, selectedKey]);

  useDateSyncEffect(selectedDateRange, (from?: string, to?: string) => {
    setLocalSelectedDateRange({
      fromDate: from || "",
      toDate: to || ""
    });
  });

  useDropdownSyncEffect({
    isFilterDialogOpen,
    tagListArray,
    setTagListArray,
    setIsDropdownOpen
  });

  useResetOnCloseEffect({
    isOpen,
    wasApplied,
    setFromDate,
    setToDate,
    setSelectedDateRange,
    setFromDateError,
    setToDateError,
    setIsDateError,
    setWasApplied,
    setSearchTerm,
    setSuggestions,
    setCategoryError
  });

  useEscapeKeyEffect(isOpen, onClose, setCategoryError)


  useSearchEffect({
    searchTerm,
    selectedCategories,
    selectedDateRange,
    handleSearchChange,
    setSearchTerm,
    setSuggestions,
    setShowSearchError,
    setIsSearchLoading,
    localSelectedRelatedTo,
    t,
    relatedToEnum
  })

  useEffect(() => {
    if (!isOpen) return;

    setLocalSelectedCategories(selectedCategories);
    setLocalSelectedDateRange(selectedDateRange);
    setLocalTagListArray(tagListArray);
    setLocalSelectedRelatedTo(selectedRelatedTo);
    setLocalSelectedPrivacyFilter(selectedPrivacyFilter ?? "");
  }, [isOpen]);

  useBuildRefIdsEffect(selectedKey, localTagListArray, schoolData, isOpen, setRefId, setFilterEntities)


  const filteredSuggestions: typeof suggestions = filterNonEmptySuggestions(suggestions).map((group, groupIdx) => ({
    ...group,
    values: group.values.map((item, idx) => ({
      ...item,
      props: {
        ...item.props,
        id: item.props?.id ?? `${item.text}-${groupIdx}-${idx}`
      }
    }))
  }));

  // Use keys for logic, translation for display
  const relatedTo: any[] = Object.entries(relatedToEnum).map(([key, value]) => ({
    value,
    text: t(`Filter.${key === "Organisation" ? "School" : key}`),
    data: { key }
  }));

  const handleSearchChangeForSection = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearchChange({
      t,
      e,
      categoryId: getAllRegistrationIds(selectedCategories),
      fromDate: selectedDateRange?.fromDate,
      toDate: selectedDateRange?.toDate,
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading,
      setShowErrorBanner,
      documentRelatedTo: relatedToEnum[localSelectedRelatedTo?.data?.data?.key as keyof typeof relatedToEnum],
      setResetFilterSearch: undefined
    });
  }, [localSelectedRelatedTo, selectedCategories, selectedDateRange, t]);


  const handleRemoveTagForSection: (e: React.SyntheticEvent<Element, Event>, text: string, closeObj: any) => void = (
    e: React.SyntheticEvent<Element, Event>,
    text: string,
    closeObj: any
  ) => {
    handleRemoveTag(
      e,
      text,
      closeObj,
      setLocalTagListArray,
      setReferenceExternalIds,
      setIsDropdownOpen,
      localTagListArray
    );
  };

  const handleDateChangeForSection: (
    setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>,
    setDateError: React.Dispatch<React.SetStateAction<string>>,
    day: string,
    month: string,
    year: string,
    otherDate: { day: string; month: string; year: string },
    isFrom: boolean
  ) => void = (
    setDate: React.Dispatch<React.SetStateAction<{ day: string; month: string; year: string }>>,
    setDateError: React.Dispatch<React.SetStateAction<string>>,
    day: string,
    month: string,
    year: string,
    otherDate: { day: string; month: string; year: string },
    isFrom: boolean
  ) => {
      handleDateChange({
        setDate,
        setError: setDateError,
        day,
        month,
        year,
        otherDate,
        isFrom,
        setIsDateError,
        setSelectedDateRange,
        t,
        setFromDateError,
        setToDateError
      });
    };

  return (
    <Dialog
      className="dms-filter-dialog"
      isOpen={isOpen}
      dataTestId={dataTestId}
      onClose={() => {
        handleDialogClose(
          setRelatedToSelected,
          setRelatedToError,
          setSearchSelectionError,
          setSuggestions,
          onClose,
          setShowErrorBanner,
          setShowSearchError
        );
      }}
      title={isLoading ? "" : title}
      escapeExits
    >
      {shouldShowWarningNotification(categoryError, relatedToSelected, localSelectedRelatedTo) && (
        <Notification
          className="dms-filter-notification"
          dataTestId={`${dataTestId}-notification`}
          status={NotificationStatus.WARNING}
          title={t("Filter.filterInfoHeading")}
          message={t("Filter.filterInfoMessage")}
        />
      )}

      {isLoading ? (
        <div className="filter-dialog-loader">
          <Loader loaderType={LoaderType.Circular} loaderText="Please Wait" />
        </div>
      ) : (
        <>
          <FilterRelatedToDropdown
            t={t}
            dataTestId={dataTestId}
            relatedTo={relatedTo}
            localSelectedRelatedTo={localSelectedRelatedTo}
            setLocalSelectedRelatedTo={setLocalSelectedRelatedTo}
            setRelatedToError={setRelatedToError}
            setRefId={setRefId}
            setSchoolData={setSchoolData}
            setRelatedToSelected={setRelatedToSelected}
            setSuggestions={setSuggestions}
            setLocalTagListArray={setLocalTagListArray}
            setReferenceExternalIds={setReferenceExternalIds}
            setSearchTerm={setSearchTerm}
            setShowSearchError={setShowSearchError}
            setIsDropdownOpen={setIsDropdownOpen}
            setSearchSelectionError={setSearchSelectionError}
            setLocalSelectedCategories={setLocalSelectedCategories}
            setToDateError={setToDateError}
            setFromDateError={setFromDateError}
            setFromDate={setFromDate}
            setToDate={setToDate}
            setSelectedDateRange={setSelectedDateRange}
            setSearchKey={setSearchKey}
            relatedToError={relatedToError}
            onRelatedToChange={(key: string) => {
              setSelectedKey(key);
              setLocalSelectedPrivacyFilter("");  
            }}
          />

          {["Pupil", "Staff"].includes(selectedDisplayKey) && (
            <SearchSection
              key={localTagListArray.length + searchKey + (localSelectedRelatedTo?.value?.toString() ?? "")}
              dataTestId={dataTestId}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              suggestions={suggestions}
              isSearchLoading={isSearchLoading}
              validationText={validationText}
              validationTextLevel={validationTextLevel}
              onItemClick={(item: ISearchItemProp | null) => {
                setSearchTerm(item?.text || "");
                addUniqueTagItem({
                  item,
                  selectedRelatedTo: localSelectedRelatedTo,
                  tagListArray: localTagListArray,
                  setTagListArray: setLocalTagListArray,
                  setReferenceExternalIds,
                  maxLimit: 5,
                  setAlreadyExistingTags
                });
                setIsDropdownOpen(true);
                setSearchSelectionError("");
              }}
             
              
              onRemoveTag={handleRemoveTagForSection}
              selectedDisplayKey={selectedDisplayKey}
              t={t}
              isDropdownOpen={isDropdownOpen}
              localTagListArray={localTagListArray}
              searchKey={searchKey}
              getEntityLabel={getEntityLabel}
              filteredSuggestions={filteredSuggestions}
              showSearchError={showSearchError}
              setSuggestions={setSuggestions}
              handleSearchChange={handleSearchChangeForSection}
            />
          )}

          {refId?.length ? (
            <FilterCategoryDropdown
              t={t}
              dataTestId={dataTestId}
              refId={refId}
              availableCategories={availableCategories}
              localSelectedCategories={localSelectedCategories}
              setLocalSelectedCategories={setLocalSelectedCategories}
              getValidationTextMsg={() => getValidationTextMsg(categoryError, t)}
              getValidationLevelMsg={() => getValidationLevelMsg(categoryError)}
              onSelectMultipleCategories={onSelectMultipleCategories}
            />
          ) : null}

          { (DMSPrivateDocument && (refId?.length || selectedKey === 'Organisation')) ? (
            <FilterRadioButton
              t={t}
              privacyFilter={privacyFilter}
              onPrivacyFilterChange={setLocalSelectedPrivacyFilter}
              selectedValue={localSelectedPrivacyFilter} 
            />
          ) : null}

          <FilterDateSection
            t={t}
            dataTestId={dataTestId}
            fromDate={fromDate}
            toDate={toDate}
            fromDateError={fromDateError}
            toDateError={toDateError}
            setFromDate={setFromDate}
            setToDate={setToDate}
            setFromDateError={setFromDateError}
            setToDateError={setToDateError}
            handleDateChange={handleDateChangeForSection}
            isOpen={isOpen}
            localSelectedDateRange={localSelectedDateRange}
          />
          <div className="dms-filter-dialog-buttons">
            <Button
              dataTestId={`${dataTestId}-clear-btn`}
              onClick={() => {
                clearAll({
                  setFromDate,
                  setToDate,
                  setFromDateError,
                  setToDateError,
                  setIsDateError,
                  setRelatedToError,
                  setSearchTerm,
                  setSuggestions,
                  setShowSearchError,
                  setLocalSelectedCategories,
                  setLocalSelectedDateRange,
                  setLocalTagListArray,
                  setLocalSelectedRelatedTo,
                  setCategoryError,
                  setRelatedToSelected,
                  setSearchSelectionError,
                  setRefId
                });
                setLocalSelectedPrivacyFilter("");  
                setSelectedPrivacyFilter?.("");     
              }}
              color={ButtonColor.Secondary}
              size={ButtonSize.Small}
            >
              {t("Filter.clearFilters")}
            </Button>

            <Button
              dataTestId={`${dataTestId}-apply-btn`}
            onClick={() => {
                handleApplyWrapper({
                  localSelectedRelatedTo,
                  setRelatedToError,
                  t,
                  selectedKey,
                  localTagListArray,
                  setSearchSelectionError,
                  selectedDisplayKey,                  
                  setSelectedDateRange,
                  fromDateError,
                  toDateError,
                  isDateError,
                  setSelectedCategories,
                  localSelectedCategories,
                  localSelectedDateRange,
                  setTagListArray,
                  setSelectedRelatedTo,
                  setDocumentRelatedTo,
                  handleApply,
                  refId,
                  filterEntities,
                  setWasApplied,
                  selectedPrivacyFilter: localSelectedPrivacyFilter,
                });
                setSelectedPrivacyFilter?.(localSelectedPrivacyFilter); 
              }}
              color={ButtonColor.Primary}
              size={ButtonSize.Small}
            >
              {t("Filter.applyFilters")}
            </Button>
          </div>
        </>
      )}
    </Dialog>
  );

};
FilterDialog.defaultProps = {
  dataTestId: "dms-filter-dialog",
  isLoading: false,
  setReferenceExternalIds: () => { },
  selectedPrivacyFilter: "",
  setSelectedPrivacyFilter: () => { }
};

export default FilterDialog;