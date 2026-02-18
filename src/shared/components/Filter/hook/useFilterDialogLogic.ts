import { useEffect } from "react";
import dayjs from "dayjs";
import { getUserOrganisation } from "../../../utils";
import { fetchDocumentCategoryData } from "../../../../features/DocumentManagementServer/logic/DocumentManagementServer.logic";
// import { UseFilterDialogLogicProps } from "../useFilterDialogLogicProps";
import { getAllRegistrationIds } from "../../../../features/DocumentManagementServer/logic/DocumentManagementServer.utils";
import { ISchoolNameDataResponse } from "../../../model/SchoolDomain/responsemodels";


export const useFetchSchoolEffect: any = (
  selectedDisplayKey: string,
  setSchoolData: React.Dispatch<React.SetStateAction<ISchoolNameDataResponse | null>>,
  fetchSchoolData: (setSchoolData: React.Dispatch<React.SetStateAction<ISchoolNameDataResponse | null>>) => void
) => {
  useEffect(() => {
      if (selectedDisplayKey === "School") {
        if (typeof fetchSchoolData === "function") {
          fetchSchoolData(setSchoolData);
        }
      }
    }, [selectedDisplayKey, fetchSchoolData]);
};

export const useSyncDialogStateEffect: any = ({
  isOpen,
  selectedCategories,
  selectedDateRange,
  tagListArray,
  selectedRelatedTo,
  setLocalSelectedCategories,
  setLocalSelectedDateRange,
  setLocalTagListArray,
  setLocalSelectedRelatedTo
}: any) => {
  useEffect(() => {
    if (!isOpen) return;

    setLocalSelectedCategories(selectedCategories);
    setLocalSelectedDateRange(selectedDateRange);
    setLocalTagListArray(tagListArray);
    setLocalSelectedRelatedTo(selectedRelatedTo);
  }, [isOpen]);
};

export const useSyncSelectedKeyEffect: any = (
  localSelectedRelatedTo: any,
  setSelectedKey: (val: string) => void
) => {
  useEffect(() => {
    setSelectedKey(localSelectedRelatedTo?.data?.data?.key || "");
  }, [localSelectedRelatedTo]);
};


export const useFetchCategoriesEffect: any = ({
  isOpen,
  refId,
  selectedKey,
  localSelectedRelatedTo,
  setCategoryError,
  setAvailableCategories,
  setLocalSelectedCategories,
  localSelectedCategories
}: any) => {
  useEffect(() => {
    const canFetch =
      isOpen &&
      refId?.length > 0 &&
      (
        selectedKey === "Organisation" ||
        selectedKey === "School" ||
        localSelectedRelatedTo?.text
      );

    if (!canFetch) return;

    fetchDocumentCategoryData({
      payload: { CategoryRequest: { ReferenceExternalId: refId } },
      setCategoryError,
      setAvailableCategories,
      setLocalSelectedCategories,
      localSelectedCategories
    });

  }, [isOpen, refId, localSelectedRelatedTo?.text]);
};

export const useResetCategoryErrorEffect: any = (
  refId: string[],
  setCategoryError: (val: boolean) => void
) => {
  useEffect(() => {
    if (!refId.length) {
      setCategoryError(false);
    }
  }, [refId]);
};


export const useDateSyncEffect: any = (
  selectedDateRange: any,
  updateDateState: (from?: string, to?: string) => void
) => {
  useEffect(() => {
    updateDateState(
      selectedDateRange?.fromDate,
      selectedDateRange?.toDate
    );
  }, [selectedDateRange?.fromDate, selectedDateRange?.toDate]);
};

export const useDropdownSyncEffect: any = ({
  isFilterDialogOpen,
  tagListArray,
  setTagListArray,
  setIsDropdownOpen
}: any) => {
  useEffect(() => {
    if (!isFilterDialogOpen) return;

    setTagListArray(tagListArray);

    if (tagListArray.length > 0) {
      setIsDropdownOpen(true);
    }
  }, [isFilterDialogOpen]);
};

export const useResetOnCloseEffect: any = ({
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
}: any) => {
  useEffect(() => {
    if (isOpen) return;

    if (!wasApplied) {
      setFromDate({ day: "", month: "", year: "" });
      setToDate({ day: "", month: "", year: "" });
      setSelectedDateRange({ fromDate: "", toDate: "" });
      setFromDateError("");
      setToDateError("");
      setIsDateError(false);
    }

    setWasApplied(false);
    setSearchTerm("");
    setSuggestions([]);
    setCategoryError(false);

  }, [isOpen]);
};

export const useEscapeKeyEffect: any = (
  isOpen: boolean,
  onClose: () => void,
  setCategoryError: (val: boolean) => void
) => {
  useEffect(() => {
    if (!isOpen) return;

    const handler: (e: KeyboardEvent) => void = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCategoryError(false);
        onClose();
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);

  }, [isOpen, onClose]);
};


export const useSearchEffect: any = ({
  searchTerm,
  selectedCategories,
  selectedDateRange,
  handleSearchChange,
  setSearchTerm,
  setSuggestions,
  setShowSearchError,
  setIsSearchLoading,
  localSelectedRelatedTo,
  t
}: any) => {
  useEffect(() => {
    if (!searchTerm || searchTerm.length <= 1) return;

    handleSearchChange(
      t,
      searchTerm,
      getAllRegistrationIds(selectedCategories),
      selectedDateRange?.fromDate,
      selectedDateRange?.toDate,
      setSearchTerm,
      setSuggestions,
      setShowSearchError,
      setIsSearchLoading,
      setShowSearchError,
      localSelectedRelatedTo?.value
        ? Number(localSelectedRelatedTo.value)
        : undefined
    );

  }, [searchTerm, selectedCategories, selectedDateRange]);
};


export const useBuildRefIdsEffect: any = (
  selectedKey: string,
  localTagListArray: any[],
  schoolData: any,
  isOpen: boolean,
  setRefId: (ids: string[]) => void,
  setFilterEntities: (entities: any[]) => void
): void => {
  /* istanbul ignore next */
  useEffect(() => {
    if (isOpen) {
      let ids: string[] = [];
      let entities: any[] = localTagListArray || [];
      if (selectedKey === "Pupil") {
        ids = localTagListArray.map(item => (item as any).learnerExternalId).filter(Boolean);
      } else if (selectedKey === "Staff") {
        ids = localTagListArray.map(item => (item as any).externalId).filter(Boolean);
      } else if ((selectedKey === "Organisation" || selectedKey === "School") && schoolData) {
        const orgId: string | undefined = getUserOrganisation();
        ids = orgId ? [orgId] : [];
        const orgSchoolEntity: any = {
          organisationId: orgId,
          schoolName: schoolData?.schoolName || ""
        };
        entities = orgSchoolEntity ? [orgSchoolEntity] : [];
      }

      setRefId(ids);
      setFilterEntities(entities);
    }
  }, [selectedKey, localTagListArray, schoolData, isOpen]);
};