import { useEffect } from "react";
import dayjs from "dayjs";
import { getUserOrganisation } from "../../../utils";
import { fetchDocumentCategoryData } from "../../../../features/DocumentManagementServer/logic/DocumentManagementServer.logic";
import { UseFilterDialogLogicProps } from "../useFilterDialogLogicProps";
import { getAllRegistrationIds } from "../../../../features/DocumentManagementServer/logic/DocumentManagementServer.utils";

// export const useFilterDialogLogic = ({
//   isOpen,
//   selectedKey,
//   localTagListArray,
//   schoolData,
//   setRefId,
//   setFilterEntities,
//   refId,
//   setCategoryError,
//   setAvailableCategories,
//   setLocalSelectedCategories,
//   localSelectedCategories,
//   selectedDisplayKey,
//   fetchSchoolData,
//   selectedDateRange,
//   setLocalSelectedDateRange,
//   setLocalTagListArray,
//   setLocalSelectedRelatedTo,
//   selectedRelatedTo,
//   setSelectedKey,
//   setIsDropdownOpen,
//   setSearchTerm,
//   setSuggestions,
//   setShowSearchError,
//   setFromDate,
//   setToDate,
//   setSelectedDateRange,
//   setFromDateError,
//   setToDateError,
//   setIsDateError,
//   isFilterDialogOpen,
//   setWasApplied,
//   onClose,
//   selectedCategories,
//   tagListArray,
//   localSelectedRelatedTo,
//   setSelectedCategories,
//   setTagListArray,
//   searchTerm,
//   handleSearchChange,
//   setIsSearchLoading,
//   wasApplied,
//   t
// }: UseFilterDialogLogicProps & { t: (key: string) => string }) => {

//   /* ======================
//      SIMPLE HELPERS
//   ======================= */

//   const formatDate = (date?: string) =>
//     date ? dayjs(date).format("DD MMM YYYY") : "";

//   const updateDateState = (from?: string, to?: string) => {
//     const fromFormatted = formatDate(from);
//     const toFormatted = formatDate(to);

//     const dateText =
//       from && to
//         ? `${fromFormatted} to ${toFormatted}`
//         : from
//         ? `${fromFormatted} to -`
//         : "";

//     setSelectedCategories(prev => {
//       const filtered = prev.filter(i => i.data?.type !== "dateRange");
//       if (!dateText) return filtered;

//       return [
//         ...filtered,
//         { text: dateText, value: dateText, data: { type: "dateRange" } }
//       ];
//     });

//     setFromDate({
//       day: from ? dayjs(from).date().toString() : "",
//       month: from ? (dayjs(from).month() + 1).toString() : "",
//       year: from ? dayjs(from).year().toString() : ""
//     });

//     setToDate({
//       day: to ? dayjs(to).date().toString() : "",
//       month: to ? (dayjs(to).month() + 1).toString() : "",
//       year: to ? dayjs(to).year().toString() : ""
//     });
//   };

//   /* ======================
//      EFFECTS
//   ======================= */

//   // 1️⃣ Fetch school data
//   useEffect(() => {
//     selectedDisplayKey === "School" && fetchSchoolData();
//   }, [selectedDisplayKey]);

//   // 2️⃣ Sync dialog open state
//   useEffect(() => {
//     if (!isOpen) return;

//     setLocalSelectedCategories(selectedCategories);
//     setLocalSelectedDateRange(selectedDateRange);
//     setLocalTagListArray(tagListArray);
//     setLocalSelectedRelatedTo(selectedRelatedTo);
//   }, [isOpen]);

//   // 3️⃣ Sync selected key
//   useEffect(() => {
//     setSelectedKey(localSelectedRelatedTo?.data?.data?.key || "");
//   }, [localSelectedRelatedTo]);

//   // 4️⃣ Build ref ids (strategy pattern — no nested ifs)
//   useEffect(() => {
//     if (!isOpen) return;

//     const handlers: Record<string, () => { ids: string[]; entities: any[] }> = {
//       Pupil: () => ({
//         ids: localTagListArray
//           .map((i: any) => i.learnerExternalId)
//           .filter(Boolean),
//         entities: localTagListArray
//       }),
//       Staff: () => ({
//         ids: localTagListArray
//           .map((i: any) => i.externalId)
//           .filter(Boolean),
//         entities: localTagListArray
//       }),
//       Organisation: () => {
//         const orgId = getUserOrganisation();
//         return {
//           ids: orgId ? [orgId] : [],
//           entities: orgId
//             ? [{ organisationId: orgId, schoolName: schoolData?.schoolName || "" }]
//             : []
//         };
//       },
//       School: () => {
//         const orgId = getUserOrganisation();
//         return {
//           ids: orgId ? [orgId] : [],
//           entities: orgId
//             ? [{ organisationId: orgId, schoolName: schoolData?.schoolName || "" }]
//             : []
//         };
//       }
//     };

//     const result = handlers[selectedKey]?.() || {
//       ids: [],
//       entities: localTagListArray || []
//     };

//     setRefId(result.ids);
//     setFilterEntities(result.entities);

//   }, [selectedKey, localTagListArray, schoolData, isOpen]);

//   // 5️⃣ Fetch categories
//   useEffect(() => {
//     const canFetch =
//       isOpen &&
//       refId?.length > 0 &&
//       (
//         selectedKey === "Organisation" ||
//         selectedKey === "School" ||
//         localSelectedRelatedTo?.text
//       );

//     if (!canFetch) return;

//     fetchDocumentCategoryData({
//       payload: { CategoryRequest: { ReferenceExternalId: refId } },
//       setCategoryError,
//       setAvailableCategories,
//       setLocalSelectedCategories,
//       localSelectedCategories
//     });

//   }, [isOpen, refId, localSelectedRelatedTo?.text]);

//   // 6️⃣ Reset category error
//   useEffect(() => {
//     !refId.length && setCategoryError(false);
//   }, [refId]);

//   // 7️⃣ Date sync
//   useEffect(() => {
//     updateDateState(
//       selectedDateRange?.fromDate,
//       selectedDateRange?.toDate
//     );
//   }, [selectedDateRange?.fromDate, selectedDateRange?.toDate]);

//   // 8️⃣ Dropdown open state
//   useEffect(() => {
//     if (!isFilterDialogOpen) return;

//     setTagListArray(tagListArray);
//     tagListArray.length > 0 && setIsDropdownOpen(true);
//   }, [isFilterDialogOpen]);

//   // 9️⃣ Reset on close
//   useEffect(() => {
//     if (isOpen) return;

//     if (!wasApplied) {
//       setFromDate({ day: "", month: "", year: "" });
//       setToDate({ day: "", month: "", year: "" });
//       setSelectedDateRange({ fromDate: "", toDate: "" });
//       setFromDateError("");
//       setToDateError("");
//       setIsDateError(false);
//     }

//     setWasApplied(false);
//     setSearchTerm("");
//     setSuggestions([]);
//     setCategoryError(false);

//   }, [isOpen]);

//   // 🔟 Escape key
//   useEffect(() => {
//     if (!isOpen) return;

//     const handler = (e: KeyboardEvent) => {
//       if (e.key === "Escape") {
//         setCategoryError(false);
//         onClose();
//       }
//     };

//     window.addEventListener("keydown", handler);
//     return () => window.removeEventListener("keydown", handler);

//   }, [isOpen, onClose]);

//   // 1️⃣1️⃣ Search effect
//   useEffect(() => {
//     if (!searchTerm || searchTerm.length <= 1) return;

//     handleSearchChange(
//       t,
//       { target: { value: searchTerm } } as React.ChangeEvent<HTMLInputElement>,
//       getAllRegistrationIds(selectedCategories),
//       selectedDateRange?.fromDate,
//       selectedDateRange?.toDate,
//       setSearchTerm,
//       setSuggestions,
//       setShowSearchError,
//       setIsSearchLoading,
//       setShowSearchError,
//       localSelectedRelatedTo?.value
//         ? Number(localSelectedRelatedTo.value)
//         : undefined
//     );
//   }, [searchTerm, selectedCategories, selectedDateRange]);
// };


export const useFetchSchoolEffect: any = (
  selectedDisplayKey: string,
  fetchSchoolData: () => void
) => {
  useEffect(() => {
    if (selectedDisplayKey === "School") {
      fetchSchoolData();
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


export const useBuildRefIdsEffect = (
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
        const orgId = getUserOrganisation();
        ids = orgId ? [orgId] : [];
        const orgSchoolEntity = {
          organisationId: orgId,
          schoolName: schoolData?.schoolName || "",
        };
        entities = orgSchoolEntity ? [orgSchoolEntity] : [];
      }

      setRefId(ids);
      setFilterEntities(entities);
    }
  }, [selectedKey, localTagListArray, schoolData, isOpen]);
};