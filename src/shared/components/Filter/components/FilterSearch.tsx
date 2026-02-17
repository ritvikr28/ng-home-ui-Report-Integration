import React from "react";
import {
  Search,
  Suggestion,
  TextInputSize,
  ValidationTextLevel
} from "@essnextgen/ui-kit";

interface Props {
  visible: boolean;
  dataTestId: string;
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  suggestions: any[];
  isSearchLoading: boolean;
  validationText?: string;
  validationTextLevel?: ValidationTextLevel | null;
  tagList: any[];
  onItemClick: (item: any) => void;
  onChange: (e: any) => void;
  onRemoveTag: any;
  title: string;
  placeholder: string;
  selectedDisplayKey: string;
  t: (key: string, options?: any) => string;
  isDropdownOpen: boolean;
  localTagListArray: any[];
  setTagListArray: (v: any[]) => void;
  setReferenceExternalIds?: (v: any[]) => void;
  setAlreadyExistingTags?: (v: boolean) => void;
  searchKey: number;
  getEntityLabel: (key: string) => string;
  filteredSuggestions: any[];
  showSearchError: boolean;
  selectedCategories: any[];
  selectedDateRange: { fromDate: string; toDate: string };
  setSuggestions: (v: Suggestion[]) => void;
  handleSearchChange: (e: any) => void;
  getAllRegistrationIds: (categories: any[]) => any[];
  setShowSearchError: (v: boolean) => void;
  setIsSearchLoading: (v: boolean) => void;
}

export const SearchSection: React.FC<Props> = ({
  dataTestId,
  searchTerm,
  setSearchTerm,
  suggestions,
  isSearchLoading,
  validationText,
  validationTextLevel,
  onItemClick,
  selectedDisplayKey,
  t,
  isDropdownOpen,
  localTagListArray,
  searchKey,
  getEntityLabel,
  filteredSuggestions,
  showSearchError,
  setSuggestions,
  handleSearchChange,
  onRemoveTag
}) => {
  // Only show for Pupil/Staff
  if (!["Pupil", "Staff"].includes(selectedDisplayKey)) {
    return null;
  }
  return (
    <Search
      key={localTagListArray.length + searchKey}
      className="dms-related-to-search"
      dataTestId={`${dataTestId}-search`}
      placeholderText={t(`Filter.${selectedDisplayKey.toLowerCase()}Name`)}
      titleText={t(`Filter.${selectedDisplayKey}`)}
      isFixedMultiSelect
      isSearchWithId
      size={TextInputSize.Large}
      value={searchTerm}
      searchTerm={searchTerm}
      debouncerTreshold={1000}
      setSearchTerm={setSearchTerm}
      existingValues={[searchTerm]}
      keyUpHandler={() => {}}
      onKeyUpLenght={3}
      isShowListBox={isDropdownOpen && (localTagListArray.length > 0)}
      headingText={`${t("Filter.selectEntity")} ${getEntityLabel(selectedDisplayKey)}`}
      onCloseHandle={() => {
        setSearchTerm("");
      }}
      isListBox
      isCommaSeparted
      getSelectedItems={() => [searchTerm].filter(Boolean).map((text) => ({ text, value: text }))}
      onItemClick={onItemClick}
      suggestions={filteredSuggestions}
      isLoader={isSearchLoading}
      onChange={handleSearchChange}
      onFocus={() => setSuggestions(suggestions)}
      isNotificationShow={false}
      validationTextForTagList={t("Filter.entityAlreadyAdded", { entity: t(`Filter.${selectedDisplayKey}`) })}
      validationTextForLimit={t("Filter.entityListLimitReached", { entity: t(`Filter.${selectedDisplayKey}`) })}
      validationTextLevelForTagList={ValidationTextLevel.Warning}
      validationText={validationText}
      validationTextLevel={validationTextLevel ?? undefined}
      addLimit={5}
      allowSearchIfError={!showSearchError}
      isCustomInputForAdded
      tagListValueArray={localTagListArray}
      tagListBoxLabelText={t("Filter.Added")}
      onRemoveTag={onRemoveTag}
    />
  );
};