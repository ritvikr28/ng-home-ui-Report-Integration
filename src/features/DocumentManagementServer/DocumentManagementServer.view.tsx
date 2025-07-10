import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import {
  Grid,
  GridItem,
  Button,
  ButtonColor,
  IconColor,
  ButtonSize,
  Breadcrumbs,
  ControlledList,
  DialogTemplate,
  NotificationStatus,
  ShowActionAs,
  ButtonIconPosition,
  useMediaQuery,
  Suggestion
} from "@essnextgen/ui-kit"
import React, { useState, useEffect } from "react"
import dayjs from "dayjs"
import DocumentManagementServer, { getTableHeadersData } from "./DocumentManagementServer.logic"
import "./style.scss"
import { tableDataProps } from "./responseModel"
import gtmAnalytics from "../../shared/utils/analytics"
import { homeurl, pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"

const DocumentManagementServerView: React.FC = () => {

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [tableLoading, setTableLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [suggestion, setSuggestion] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const { data, error, hasFetched } = DocumentManagementServer({
    pageNumber: currentPage,
    pageSize: pageSizeNumber,
    searchText: searchTerm
  });

  const tableData: tableDataProps[] = (error || !data?.data?.length) ? [] : data?.data?.map((doc: any) => ({
    id: doc?.fileId,
    Document: doc?.document,
    Relatedto: (doc?.relatedTo && doc?.relatedTo?.length > 0) ? doc.relatedTo : [],
    Category: (doc?.category && CapitalizeFirstLetter(doc?.category)) || "",
    Addedby: doc?.addedBy || "",
    "Date added": doc?.dateAdded && dayjs(doc?.dateAdded).format("DD MMM YYYY") || "",
    Format: doc?.format,
    Size: doc?.size,
  }));

  const isMobileView: boolean = useMediaQuery(
    "(min-width:320px) and (max-width: 1023.9px)"
  );

  const [isOpen, setIsOpen] = useState<boolean>(!isMobileView);

  const handleButtonClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setIsOpen(!isMobileView);
  }, [!isMobileView]);

 useEffect(() => {
  if (data || error) {
    setIsLoading(false);
    setTableLoading(false);
  }
}, [data, error]);

  useEffect(() => {
    if (data && data?.totalRecords) {
      const totalPages = Math.ceil(data.totalRecords / pageSizeNumber);
      setTotalPage(totalPages);
    }
  }, [data]);

  // --- SEARCH HANDLERS ---
  const handleSearchEnter = (event: React.KeyboardEvent<Element>) => {
    if (event.key === "Enter") {
      setTableLoading(true);
      setSearchTerm(searchInput.trim().toLowerCase());
    }
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  const handleSearchClose = () => {
    setSearchInput("");
    setSearchTerm("");
    setTableLoading(true);
  };

  const handleSuggestionClick = (suggestion: any) => {
    if (!suggestion) return;
    setSearchInput(suggestion.value);
    setShowSuggestions(false);
    setTableLoading(true);
    setSearchTerm(suggestion.value.toLowerCase());
  };

  const tableDataToShow: tableDataProps[] = Array.isArray(tableData) ? tableData : [];
  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <>
      <Grid className="dms-layout" style={{ display: "flex" }}>
        <GridItem className={isOpen ? "side-width" : "no-side-width"}>
          {!isOpen && (
            <Button
              className="base-class"
              color={ButtonColor.Utility}
              dataTestId="btn-collapse"
              iconColor={IconColor.Neutral800}
              iconName="open-panel--left--filled"
              onClick={handleButtonClick}
              size={ButtonSize.Small}
            />
          )}
          <LocalisedMenu
            customHeight={100}
            menuHeading="Admin console"
            onCloseSideNavigationPanel={() => setIsOpen(false)}
            isOpenSideNavigation={isOpen}
            defaultSelectedMenu={{
              text: "Documents",
              value: `${window.location.origin}/documents`
            }}
          />

          {isMobileView && <Breadcrumbs
            breadcrumbActions={[
              {
                active: false,
                linkName: 'Home',
                path: window.location.origin
              },
              {
                active: false,
                linkName: 'Admin Console',
                path: homeurl
              },
              {
                active: false,
                linkName: 'Document Management Server',
                path: '#'
              },
              {
                active: false,
                linkName: 'Documents',
                path: ''
              }
            ]}
            className="essui-Breadcrumbs"
            dataTestId="breadcrumb-test-id"
            id="element-id"
            onItemClick={() => { }}
          />}
        </GridItem>
        <GridItem className={isOpen ? "clc-dms-isopen" : "clc-dms-isclose"}>
          <div style={{ marginBottom: 16, width: "100%" }}>
            {!isMobileView && <div>
              <Breadcrumbs
                breadcrumbActions={[
                  {
                    active: false,
                    linkName: 'Home',
                    path: window.location.origin
                  },
                  {
                    active: false,
                    linkName: 'Admin Console',
                    path: homeurl
                  },
                  {
                    active: false,
                    linkName: 'Document Management Server',
                    path: '#'
                  },
                  {
                    active: false,
                    linkName: 'Documents',
                    path: ''
                  }
                ]}
                className="essui-Breadcrumbs"
                dataTestId="breadcrumb-test-id"
                id="element-id"
                onItemClick={() => { }}
              />
            </div>
            }
            {hasFetched && <div className="grid-wrapper">
              <ControlledList
                globalNotificationMsgBannerObject={null}
                isAddEventBtnShow={false}
                isShowEditSelectedBtn={true}
                dataTestId="controlled-list-test-id"
                filterDDLOptions={[
                  { id: "1", text: "All", value: "All" },
                  { id: "2", text: "Active", value: "Active" },
                  { id: "3", text: "Inactive", value: "Inactive" }
                ]}
                editSelectedBtnTitle="Actions"
                editSelectedOptions={[
                  { disabled: false, text: "Make active", value: "Active" },
                  { disabled: false, text: "Make inactive", value: "Inactive" },
                  {
                    disabled: false,
                    isSelected: false,
                    isShowDivider: true,
                    text: "Delete",
                    value: "Delete",
                  }
                ]}
                emptyStateMsg={
                  (!isSearchActive && tableDataToShow.length === 0)
                    ? "Documents will appear here once they are uploaded."
                    : ""
                }
                emptybtnTitle="Add Type"
                isShowEmptyAddBtn={false}
                errorActionListItem={[
                  {
                    action: "Secondary Text",
                    iconName: "home",
                    id: "1",
                    showActionAs: ShowActionAs.Text,
                    title: "Primary Text",
                  },
                  {
                    action: "Secondary Text",
                    iconName: "information",
                    id: "2",
                    title: "Primary Text",
                  },
                  {
                    action: "Secondary Text",
                    iconName: "view",
                    id: "3",
                    showActionAs: ShowActionAs.Link,
                    title: "Primary Text",
                  }
                ]}
                errorPageActionListDescription="Things to try"
                errorPageReasonListDescription="This may be due to one of the reasons below"
                errorPageTitle="Summary of issue"
                errorReasonListItem={[
                  { id: "1", reason: "Wrong link or address." },
                  { id: "2", reason: "The page may have been removed." },
                  { id: "3", reason: "Wrong link or address." }
                ]}
                groupTagsEnabled
                headingText="Documents"
                id="controlled-list"
                isBreadCrumbEnable={false}
                isOnCloseSidepnl
                lastColContentAlign="center"
                lastColHeaderAlign="center"
                isPagination={true}
                paginationCount={totalPage || 0}
                paginationDefaultPage={1}
                paginationPage={currentPage}
                // paginationOnChange={setCurrentPage}
                paginationMinCountToHideNextPreviousBtn={0}
                primaryButtonTitle=""
                resultNotFoundMessage={
                  (searchTerm && tableData)
                    ? `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.`
                    : ""
                }
                dynamictableIconName="information"
                isShowSearch={true}
                searchOnChange={handleSearchChange}
                onSearchKeyDown={handleSearchEnter}
                searchHeadingText="Search by document or related to name"
                searchOnCloseHandle={handleSearchClose}
                searchPlaceholderText="Text"
                searchTerm={searchTerm}
                secondaryButtonTitle="Cancel"
                searchSuggestions={showSuggestions ? suggestion : []}
                onSearchSuggestionItemClick={handleSuggestionClick}
                showConfirmDialog
                sidePanelNotificationMessage="A technical issue at our end has stopped us from [action].
                        Please try again. If the issue persists, please get in touch with our support team.
                        We appreciate your patience and understanding during this time."
                sidePanelNotificationStatus={NotificationStatus.WARNING}
                sidePanelNotificationTitle="Unable to [action]"
                sidePanelSubTitle=""
                sidePanelTitle=""
                subHeadingText=""
                tableBodyData={tableDataToShow}
                filterCustumeElem2={
                  <div className="search-filter-actions-wrapper">
                    <Button
                      className="filter-btn"
                      dataTestId="filter-btn"
                      color={ButtonColor.Utility}
                      size={ButtonSize.Small}
                      iconPosition={ButtonIconPosition.Right}
                      iconName="filter"
                    >
                      Filter
                    </Button>
                  </div>
                }
                tableFirstColumnWidth="10px"
                tableHeadersData={
                  tableData.length > 0 ? getTableHeadersData : []
                }
                tableLastColumnWidth="10px"
                templatePropsConfirmation={{
                  cancelText: "Cancel",
                  contentText: "You have unsaved changes that will be lost.",
                  isNotificationanner: false,
                  notificationStatus: NotificationStatus.SUCCESS,
                  okText: "Discard",
                  onCancel: (): void => { },
                  onConfirm: (): void => { },
                  template: DialogTemplate.Confirmation,
                }}
                titleConfirmation="Discard changes?"
                toastNotificationStatus={NotificationStatus.SUCCESS}
                toastNotificationTitle=""
                isOpenConfirmationDialog={false}
                isShowOverflowMenuCol={false}
                isShowFirstElement={true}
                isSearchShowLoading={isLoading}
                dynamicTableLoader={tableLoading}
                isLoaderForFilterandTable={isLoading}
                loaderFilterText="Please Wait..."
                isShowErrorPage={!!error}
                className="grid_wrapper"
              />
            </div>}
          </div>
        </GridItem>
      </Grid>
    </>
  );
};

export default DocumentManagementServerView;



// import {
//   Grid,
//   GridItem,
//   Button,
//   ButtonColor,
//   IconColor,
//   ButtonSize,
//   Breadcrumbs,
//   ControlledList,
//   DialogTemplate,
//   Suggestion,
//   NotificationStatus,
//   ShowActionAs,
//   ButtonIconPosition,
//   useMediaQuery
// } from "@essnextgen/ui-kit";
// import React, { useState, useEffect } from "react";
// import dayjs from "dayjs";
// import DocumentManagementServer, {
//   getTableHeadersData
// } from "./DocumentManagementServer.logic";
// import type { ISearchItemProp } from "@essnextgen/ui-kit";
// import "./style.scss";
// import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"
// import { tableDataProps } from "./responseModel";
// // Import or define gtmAnalytics
// // import gtmAnalytics from "../../shared/utils/gtmAnalytics";

// const DocumentManagementServerView: React.FC = () => {
 
//   // Define the page size for pagination
//   const pageSizeNumber = 10; // You can adjust this value as needed

//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [searchInput, setSearchInput] = useState<string>("");
//   const [searchTerm, setSearchTerm] = useState<string>("");
// //   const [isSearchTriggered, setIsSearchTriggered] = useState<boolean>(false);
// //   const [filteredDocs, setFilteredDocs] = useState<tableDataProps[]>([]);
// const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
//   const [searchError, setSearchError] = useState<boolean>(false);
//   const [tableLoading, setTableLoading] = useState(false);
// const [suggestion, setSuggestion] = useState<Suggestion[]>([]);
// const [showSuggestions, setShowSuggestions] = useState(false);
//    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(1);
//   const [totalPage, setTotalPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);

//   const handlePageChange: (event: any, handlepageCount: number) => void = (event: any, handlepageCount: number) => {
//       setIsLoading(true);
//       setCurrentPage(handlepageCount);
//   };


//   const {
//     data,
//     error,
//     hasFetched,
//   }: { data: any; error: string | null; hasFetched: boolean } =
//     DocumentManagementServer({ pageNumber: currentPage,  pageSize: pageSizeNumber, searchText: searchTerm });

// const tableData: tableDataProps[] = (error || !data?.data?.length) ? [] : data?.data?.map((doc: any) => ({
//       id: doc?.fileId,
//       Document: doc?.document,
//       Relatedto: (doc?.relatedTo && doc?.relatedTo?.length > 0) ? doc.relatedTo : [],
//       Category: (doc?.category && CapitalizeFirstLetter(doc?.category)) || "",
//       Addedby: doc?.addedBy || "",
//       "Date added": doc?.dateAdded && dayjs(doc?.dateAdded).format("DD MMM YYYY") || "",
//       Format: doc?.format,
//       Size: doc?.size,
//   }));
//   const isMobileView: boolean = useMediaQuery(
//       "(min-width:320px) and (max-width: 1023.9px)"
//   );

//   const [isOpen, setIsOpen]: [
//     boolean,
//     React.Dispatch<React.SetStateAction<boolean>>
//   ] = useState<boolean>(!isMobileView);

//   const handleButtonClick: () => void = () => {
//     setIsOpen(!isOpen);
//   };

//   useEffect(() => {
//     setIsOpen(!isMobileView);
//   }, [!isMobileView]);


//   useEffect(() => {
//     setIsLoading(true);
//     setTimeout(() => {
//       if (tableData) {
//         setIsLoading(false);
//       }
//     }, 1500);
//   }, [currentPage]);

//   useEffect(() => {
//   // Set loading to false when data or error arrives
//   if (data || error) {
//     setIsLoading(false);
//     setTableLoading(false);
//   }
// }, [data, error]);


//     useEffect(() => {
//     if (data && data?.totalRecords) {
//       const totalPages = Math.ceil(data.totalRecords / pageSizeNumber);
//       setTotalPage(totalPages);
//     }
//   }, [data]);

// // const onBreadcrumbClick = (path: string) => {
// //     window.location.assign(path);
// //     gtmAnalytics.pushEvent({
// //       event: "click",
// //       linkText: "Documents",
// //       linkUrl: '',
// //       clickType: "link",
// //       clickLocation: "breadcrumb"
// //     });
// //   };


//   const handleSearchEnter = (event: React.KeyboardEvent<Element>) => {
//   if (event.key === "Enter") {
//     const keyword = searchInput.trim().toLowerCase();
//     setTableLoading(true);
//     setSearchError(false);
//     // setIsSearchTriggered(true);
//     setSearchTerm(keyword); // This triggers the API call via your effect/hook
//   }
// };

// const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//   const value = event.target.value;
//   setSearchInput(value);
//   setSearchError(false);
//   setSearchTerm(value.trim().toLowerCase());

//   if (value.trim().length > 0) {
//     const filtered = tableData
//       .filter(doc =>
//         doc.Document &&
//         doc.Document.toLowerCase().includes(value.trim().toLowerCase())
//       )
//       .slice(0, 5);

//     const mappedSuggestions: Suggestion[] = [
//       {
//         name: "Documents",
//         values: filtered.map(doc => ({
//           id: doc.id,
//           text: doc.Document,
//           value: <span>{doc.Document}</span>,
//         }))
//       }
//     ];

//     setSuggestion(mappedSuggestions);
//     setShowSuggestions(true);
//   } else {
//     setSuggestion([]);
//     setShowSuggestions(false);
//   }
// };



//  const handleSearchClose = () => {
//   setTableLoading(true);
//   setSearchInput("");
//   setSearchTerm(""); // This triggers the API to fetch all data
//   setSearchError(false);
// //   setIsSearchTriggered(false);
// };



// const handleSuggestionClick = (suggestion: ISearchItemProp | null) => {
//   if (!suggestion) return;

//   setSearchInput(suggestion.value);
//   setShowSuggestions(false);
//   setTableLoading(true);
//   setSearchError(false);
//   setSearchTerm(suggestion.value.toLowerCase());
// };
// // let tableDataToShow: tableDataProps[] = [];
// // if (isSearchTriggered) {
// //   tableDataToShow = Array.isArray(filteredDocs) ? filteredDocs : [];
// // } else {
// //   tableDataToShow = Array.isArray(tableData) ? tableData : [];
// // }

// const tableDataToShow: tableDataProps[] = Array.isArray(tableData) ? tableData : [];
// const isSearchActive = searchTerm.trim().length > 0;
// const isNoResults = isSearchActive && tableDataToShow.length === 0;


//   return (
//     <>
//       <Grid className="dms-layout" style={{ display: "flex" }}>
//         <GridItem className={isOpen ? "side-width" : "no-side-width"}>
//           {!isOpen && (
//             <Button
//               className="base-class"
//               color={ButtonColor.Utility}
//               dataTestId="btn-collapse"
//               iconColor={IconColor.Neutral800}
//               iconName="open-panel--left--filled"
//               onClick={handleButtonClick}
//               size={ButtonSize.Small}
//             />
//           )}
//           <LocalisedMenu
//             customHeight={100}
//             menuHeading="Admin console"
//             onCloseSideNavigationPanel={() => setIsOpen(false)}
//             isOpenSideNavigation={isOpen}
//             defaultSelectedMenu={{
//               text: "Documents",
//               value: `${window.location.origin}/documents`,
//             }}
//           />
//         </GridItem>
//         <GridItem className={isOpen ? "clc-dms-isopen" : "clc-dms-isclose"}>
//           <div style={{ marginBottom: 16, width: "100%" }}>
//             <div>
//               <Breadcrumbs
//                 breadcrumbActions={[
//                   {
//                     active: false,
//                     linkName: "Home",
//                     path: window.location.origin,
//                   },
//                   { active: false, linkName: "Admin console", path: "#" },
//                   {
//                     active: false,
//                     linkName: "Document Management Server",
//                     path: "#",
//                   },
//                   { active: false, linkName: "Documents", path: "" }
//                 ]}
//                 className="essui-Breadcrumbs"
//                 dataTestId="breadcrumb-test-id"
//                 id="element-id"
//                 onItemClick={() => {}}
//               />
//             </div>
//             {hasFetched && <div className="grid-wrapper">
//               <ControlledList
//                 globalNotificationMsgBannerObject={
//                   searchError ? { title: "Information unavailable" } : null
//                 }
//                 isAddEventBtnShow={false}
//                 isShowEditSelectedBtn={true}
//                 dataTestId="controlled-list-test-id"
//                 filterDDLOptions={[
//                   { id: "1", text: "All", value: "All" },
//                   { id: "2", text: "Active", value: "Active" },
//                   { id: "3", text: "Inactive", value: "Inactive" }
//                 ]}
//                 editSelectedBtnTitle="Actions"
//                 editSelectedOptions={[
//                   { disabled: false, text: "Make active", value: "Active" },
//                   { disabled: false, text: "Make inactive", value: "Inactive" },
//                   {
//                     disabled: false,
//                     isSelected: false,
//                     isShowDivider: true,
//                     text: "Delete",
//                     value: "Delete",
//                   }
//                 ]}
//                 emptyStateMsg= " they are uploaded."
                
//                 emptybtnTitle="Add Type"
//                 isShowEmptyAddBtn={false}
//                 errorActionListItem={[
//                   {
//                     action: "Secondary Text",
//                     iconName: "home",
//                     id: "1",
//                     showActionAs: ShowActionAs.Text,
//                     title: "Primary Text",
//                   },
//                   {
//                     action: "Secondary Text",
//                     iconName: "information",
//                     id: "2",
//                     title: "Primary Text",
//                   },
//                   {
//                     action: "Secondary Text",
//                     iconName: "view",
//                     id: "3",
//                     showActionAs: ShowActionAs.Link,
//                     title: "Primary Text",
//                   }
//                 ]}
//                 errorPageActionListDescription="Things to try"
//                 errorPageReasonListDescription="This may be due to one of the reasons below"
//                 errorPageTitle="Summary of issue"
//                 errorReasonListItem={[
//                   { id: "1", reason: "Wrong link or address." },
//                   { id: "2", reason: "The page may have been removed." },
//                   { id: "3", reason: "Wrong link or address." }
//                 ]}
//                 groupTagsEnabled
//                 headingText="Documents"
//                 id="controlled-list"
//                 isBreadCrumbEnable={false}
//                 isOnCloseSidepnl
//                 lastColContentAlign="center"
//                 lastColHeaderAlign="center"
//                 isPagination={true}
//                 paginationCount={4}
//                 paginationMinCountToHideNextPreviousBtn={0}
//                 primaryButtonTitle=""
//                 resultNotFoundMessage={
//                   searchError
//                     ? "Information unavailable"
//                     : `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.`
//                 }
//                 dynamictableIconName={searchError ? "warning--alt" : "information"}
//                 isShowSearch={true}
//                 searchOnChange={handleSearchChange}
//                 onSearchKeyDown={handleSearchEnter}
//                 searchHeadingText="Search by document or related to name"
//                 searchOnCloseHandle={handleSearchClose}
//                 searchPlaceholderText="Text"
//                 searchTerm={searchTerm}
//                 secondaryButtonTitle="Cancel"
//                 searchSuggestions={showSuggestions ? suggestion : []}
//                 onSearchSuggestionItemClick={handleSuggestionClick}
//                 showConfirmDialog
//                 sidePanelNotificationMessage="A technical issue at our end has stopped us from [action].
//                         Please try again. If the issue persists, please get in touch with our support team.
//                         We appreciate your patience and understanding during this time."
//                 sidePanelNotificationStatus={NotificationStatus.WARNING}
//                 sidePanelNotificationTitle="Unable to [action]"
//                 sidePanelSubTitle=""
//                 sidePanelTitle=""
//                 subHeadingText=""
//                 tableBodyData={tableData}
//                 filterCustumeElem2={
//                   <div className="search-filter-actions-wrapper">
//                     <Button
//                       className="filter-btn"
//                       dataTestId="filter-btn"
//                       color={ButtonColor.Utility}
//                       size={ButtonSize.Small}
//                       iconPosition={ButtonIconPosition.Right}
//                       iconName="filter"
//                     >
//                       Filter
//                     </Button>
//                   </div>
//                 }
//                 tableFirstColumnWidth="10px"
//                 tableHeadersData={
//                   tableData.length > 0 ? getTableHeadersData : []
//                 }
//                 tableLastColumnWidth="10px"
//                 templatePropsConfirmation={{
//                   cancelText: "Cancel",
//                   contentText: "You have unsaved changes that will be lost.",
//                   isNotificationanner: false,
//                   notificationStatus: NotificationStatus.SUCCESS,
//                   okText: "Discard",
//                   onCancel: (): void => {},
//                   onConfirm: (): void => {},
//                   template: DialogTemplate.Confirmation,
//                 }}
//                 titleConfirmation="Discard changes?"
//                 toastNotificationStatus={NotificationStatus.SUCCESS}
//                 toastNotificationTitle=""
//                 isOpenConfirmationDialog={false}
//                 isShowOverflowMenuCol={false}
//                 isShowFirstElement={true}
//                 isSearchShowLoading={isLoading}
//                 dynamicTableLoader={tableLoading}
//                 isLoaderForFilterandTable={isLoading}
//                 loaderFilterText="Please Wait..."
//                 isShowErrorPage={!!error}
//               />
//             </div>}
            
//           </div>
//         </GridItem>
//       </Grid>
//     </>
//   );
// };
// export default DocumentManagementServerView;
