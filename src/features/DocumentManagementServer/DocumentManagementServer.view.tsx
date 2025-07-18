import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { Grid, GridItem, Button, ButtonColor, IconColor, ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, ButtonIconPosition, useMediaQuery, Suggestion, ValidationTextLevel, ResponseCode, TableRowType } from "@essnextgen/ui-kit"
import React, { useState, useEffect } from "react"
import dayjs from "dayjs"
import { getTableHeadersData, handlePageChange, handleSearchChange, handleSuggestionClick, onBreadcrumbClick } from "./DocumentManagementServer.logic"
import "./style.scss"
import { tableDataProps } from "./responseModel"
import { homeurl, pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"
import { fetchDocumentDetails } from "./ApiService"


export const breadcrumbActionsList = [
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
]

const DocumentManagementServerView: React.FC = () => {
    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(1);
    const [totalPage, setTotalPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [searchInput, setSearchInput] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const [isSearchLoading, setIsSearchLoading] = useState<boolean>(false);
    const [showSearchError, setShowSearchError] = useState<boolean>(false);
    const [docData, setDocData] = useState<any>(null);
    const [isSearchTriggered, setIsSearchTriggered] = useState<boolean>(false);
    const [hasFetched, setHasFetched] = useState(false);
    const [searchText, setSearchText] = useState<string>("");
    const [issearchDataLoading, setIsSearchDataLoading] = useState<boolean>(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [showErrorBanner, setShowErrorBanner] = useState<boolean>(false);
    const [visibleBreadcrumbs, setVisibleBreadcrumbs] =
        useState(breadcrumbActionsList);
    const [isSearchTrue, setIsSearchTrue] = useState(false); 
    const [isShowAutoSuggest, setIsShowAutoSuggest] = useState(true);   

    const onPageChange = (event: any, page: number) =>
        handlePageChange(event, page, setCurrentPage, setIsSearchDataLoading);

    const tableData: tableDataProps[] = (showSearchError || !docData?.data?.length) ? [] : docData?.data?.map((doc: any) => ({
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

    const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);

    useEffect(() => {
        document.body.classList.add("no-scroll");
    }, []);

    const handleButtonClick: () => void = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(!isMobileView);
    }, [!isMobileView]);


    useEffect(() => {
        if (docData && docData?.totalRecords) {
            const totalPages = Math.ceil(docData.totalRecords / pageSizeNumber);
            setTotalPage(totalPages);
        }
    }, [docData]);

    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true);
            const minLoaderTime = new Promise((resolve) => setTimeout(resolve, 1000));
            const dataFetch = fetchGetDocumentDetails(searchText, currentPage);
            await Promise.all([minLoaderTime, dataFetch]);
            setIsLoading(false);
            setIsInitialLoad(false);
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (!isInitialLoad) {
            fetchGetDocumentDetails(searchText, currentPage);
        }
        setIsSearchTriggered(false)
    }, [currentPage, searchText]);


    const hasItems: boolean = suggestions?.some(
        ({ values }: Suggestion) => values?.length > 0
    );


    const fetchGetDocumentDetails = async (searchTexts: string, page: number) => {
        setIsSearchDataLoading(true);
        try {
            const result = await fetchDocumentDetails({
                pageNumber: page,
                pageSize: pageSizeNumber,
                searchText: searchTexts,
                isSearchTextExactMatch: isSearchTrue
            });
            if (result && result?.statusCode === 200) {
                setDocData(result);
                setCurrentPage(page);
                setTotalPage(Math.ceil(result?.totalRecords / pageSizeNumber));
                setShowSearchError(false);
            } else if (result && result?.status === 400) {
                setShowErrorBanner(true);
            }
            else {
                setShowSearchError(true);
            }
            setHasFetched(true);
        } catch (err) {
            console.error("Error fetching document details:", err);
            setShowSearchError(true);
        }
        // finally {
        setIsSearchLoading(false);
        setIsSearchDataLoading(false);
        // }
    }

    const getEmptyStateMsg = () => {
        if (searchText !== "") return undefined;
        if (!isSearchTriggered && showSearchError) return "Information unavailable.";
        return "Documents will appear here once they are uploaded.";
    };

    const getTableHeaders = () => {
        if (tableData?.length > 0 || showErrorBanner) {
            return getTableHeadersData;
        }
        if (isSearchTriggered || searchText || docData) {
            return getTableHeadersData;
        }
        return [];
    };


    const handleSearchClose = () => {
        setSearchInput("");
        setSearchTerm("");
        setIsSearchTriggered(true);
        setCurrentPage(1);
        setShowSearchError(false);
        setIsSearchLoading(false);
        setSearchText("");
    };

    const handleSearchEnter = (event: React.KeyboardEvent<Element>) => {
        if (event.key === "Enter") {
            const keyword = searchTerm?.trim()?.toLowerCase();
            if(keyword !== searchText) {
            setSearchTerm(keyword);
            setSearchText(keyword);
            setIsSearchTriggered(true);
            setIsSearchDataLoading(true);
            setIsSearchTrue(false);
        }
        setIsSearchLoading(false);
        setIsShowAutoSuggest(false); 
        // setSuggestions([]);
    }
    }
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                // md and below
                if (breadcrumbActionsList.length > 1) {
                    setVisibleBreadcrumbs(breadcrumbActionsList.slice(-2, -1));
                } else {
                    setVisibleBreadcrumbs(breadcrumbActionsList);
                }
            } else {
                setVisibleBreadcrumbs(breadcrumbActionsList);
            }
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [breadcrumbActionsList]);



    const NotificationMsgBannerObject = [
        {
            isShow: showErrorBanner,
            variant: "warning",
            title: "Information unavailable",
            message:
                "A technical issue at our end has stopped us from displaying all information. Please try again later. If the issue persists, please get in touch with our support team.",
            autoclose: true
        }
    ]

    let resultNotFoundMSG: string | undefined;
    if (searchText && !docData.data?.length) {
        resultNotFoundMSG = `Your search - ${searchTerm} - did not match any results. Make sure that all words are spelled correctly.`;
    } else if (showErrorBanner) {
        resultNotFoundMSG = "Information unavailable";
    } else {
        resultNotFoundMSG = undefined;
    }


    return (<>
        <>
            <Grid className="dms-layout" style={{ display: 'flex' }}>
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
                    {/* <LocalisedMenu
                        customHeight={100}
                        menuHeading="Admin console"
                        onCloseSideNavigationPanel={() => setIsOpen(false)}
                        isOpenSideNavigation={isOpen}
                        defaultSelectedMenu={{
                            text: "Documents",
                            value: `${window.location.origin}/documents`
                        }}
                    />  */}
                    <LocalisedMenu
                        customHeight={100}
                        menuHeading="Admin Console"
                        onCloseSideNavigationPanel={() => setIsOpen(false)}
                        isOpenSideNavigation={isOpen}
                        defaultSelectedMenu={{
                            text: "Invite Users",
                            value: window.location.href,
                        }}
                    />

                    {isMobileView && <Breadcrumbs
                        breadcrumbActions={visibleBreadcrumbs}
                        className="essui-Breadcrumbs"
                        dataTestId="breadcrumb-test-id"
                        id="element-id"
                        onItemClick={onBreadcrumbClick}
                    />}
                </GridItem>
                <GridItem className={isOpen ? "clc-dms-isopen" : "clc-dms-isclose"}>
                    <div
                        style={{
                            marginBottom: 16,
                            width: "100%"
                        }}

                    >
                        {!isMobileView && <div>
                            <Breadcrumbs
                                breadcrumbActions={visibleBreadcrumbs}
                                className="essui-Breadcrumbs"
                                dataTestId="breadcrumb-test-id"
                                id="element-id"
                                onItemClick={onBreadcrumbClick}
                            />
                        </div>
                        }
                        {hasFetched && <div className="grid-wrapper">
                            <ControlledList
                                isMobileViewBreadcrumb
                                globalNotificationMsgBannerObject={NotificationMsgBannerObject}
                                isShowHeading={true}
                                isShowSubHeading={false}
                                isAddEventBtnShow={false}
                                dataTestId="controlled-list-test-id"
                                filterDDLOptions={[
                                    {
                                        id: "1",
                                        text: "All",
                                        value: "All"
                                    },
                                    {
                                        id: "2",
                                        text: "Active",
                                        value: "Active"
                                    }
                                    , {
                                        id: "3",
                                        text: "Inactive",
                                        value: "Inactive"
                                    }
                                ]}
                                editSelectedBtnTitle="Actions"
                                editSelectedOptions={[
                                    {
                                        disabled: false,
                                        text: 'Make active',
                                        value: 'Active'
                                    },
                                    {
                                        disabled: false,
                                        text: 'Make inactive',
                                        value: 'Inactive'
                                    },
                                    {
                                        disabled: false,
                                        isSelected: false,
                                        isShowDivider: true,
                                        text: 'Delete',
                                        value: 'Delete'
                                    }
                                ]}
                                emptyStateMsg={getEmptyStateMsg()}
                                emptybtnTitle="Add Type"
                                isShowEmptyAddBtn={false}
                                errorActionListItem={[
                                    {
                                        action: 'Secondary Text',
                                        iconName: 'home',
                                        id: '1',
                                        showActionAs: ShowActionAs.Text,
                                        title: 'Primary Text'
                                    },
                                    {
                                        action: 'Secondary Text',
                                        iconName: 'information',
                                        id: '2',
                                        title: 'Primary Text'
                                    },
                                    {
                                        action: 'Secondary Text',
                                        iconName: 'view',
                                        id: '3',
                                        showActionAs: ShowActionAs.Link,
                                        title: 'Primary Text'
                                    }
                                ]}
                                errorPageActionListDescription="Things to try"
                                errorPageReasonListDescription="This may be due to one of the reasons below"
                                errorPageTitle="Summary of issue"
                                errorReasonListItem={[
                                    {
                                        id: '1',
                                        reason: 'Wrong link or address.'
                                    },
                                    {
                                        id: '2',
                                        reason: 'The page may have been removed.'
                                    },
                                    {
                                        id: '3',
                                        reason: 'Wrong link or address.'
                                    }
                                ]}
                                groupTagsEnabled
                                headingText="Documents"
                                id="controlled-list"
                                isBreadCrumbEnable={false}
                                isOnCloseSidepnl
                                lastColContentAlign="center"
                                lastColHeaderAlign="center"
                                paginationCount={totalPage || 0}
                                paginationDefaultPage={1}
                                paginationPage={currentPage}
                                paginationOnChange={onPageChange}
                                isPagination={true}
                                paginationMinCountToHideNextPreviousBtn={0}
                                primaryButtonTitle=""
                                emptyRowType={showErrorBanner ? TableRowType.Error : TableRowType.Info}
                                emptyRowResponseCode={showErrorBanner ? ResponseCode.Error : ResponseCode.Info}
                                emptyRowResponseMessage={resultNotFoundMSG}
                                isShowdynamictableNoMsg={Boolean((searchText && !docData?.data?.length) || showErrorBanner)}
                                isMessageCenterAligned={false}
                                dynamictableIconName={showSearchError && docData?.data?.length === 0 && searchText ? "warning--alt" : "information"}
                                searchHeadingText="Search by document or related to name"
                                searchTerm={searchInput}
                                isShowSearch
                                searchPlaceholderText=" "
                                searchValue={searchTerm}
                                searchIsLoader={isSearchLoading}
                                isSearchHideClearIcon={searchTerm.length === 0}
                                onKeyUpLenght={2}
                                searchDebouncerTreshold={1000}
                                searchSuggestions={hasItems ? suggestions : []}
                                onSearchSuggestionItemClick={(item) =>{
                                    setIsSearchTrue(true);
                                    handleSuggestionClick(item, setSearchTerm, setSearchText)
                                }}
                                searchOnChange={(e: any) => handleSearchChange(e, setSearchTerm, setSuggestions, setShowSearchError, setIsSearchLoading)}
                                searchValidationText={
                                    showSearchError ? "Search unavailable. Please try again later." : undefined
                                }
                                searchValidationTextLevel={
                                    showSearchError ? ValidationTextLevel.Warning : undefined
                                }


                                onSearchKeyDown={handleSearchEnter}
                                searchOnCloseHandle={handleSearchClose}
                                secondaryButtonTitle="Cancel"
                                showConfirmDialog
                                sidePanelNotificationMessage="A technical issue at our end has stopped us from [action].
                            Please try again. If the issue persists, please get in touch with our support team.
                            We appreciate your patience and understanding during this time."
                                sidePanelNotificationStatus={NotificationStatus.WARNING}
                                sidePanelNotificationTitle="Unable to [action]"
                                sidePanelSubTitle=""
                                sidePanelTitle=""
                                subHeadingText=""
                                tableBodyData={tableData?.length > 0 ? tableData : []}
                                filterCustumeElem2={<Button
                                    className="filter-btn"
                                    dataTestId="filter-btn"
                                    color={ButtonColor.Utility}
                                    size={ButtonSize.Small}
                                    iconPosition={ButtonIconPosition.Right}
                                    iconName="filter"
                                > Filter</Button>
                                }
                                tableFirstColumnWidth="10px"
                                tableHeadersData={getTableHeaders()}
                                templatePropsConfirmation={
                                    {
                                        cancelText: 'Cancel',
                                        contentText: 'You have unsaved changes that will be lost.',
                                        isNotificationanner: false,
                                        notificationStatus: NotificationStatus.SUCCESS,
                                        okText: 'Discard',
                                        onCancel: (): void => { },
                                        onConfirm: (): void => { },
                                        template: DialogTemplate.Confirmation
                                    }
                                }
                                titleConfirmation="Discard changes?"
                                toastNotificationStatus={NotificationStatus.SUCCESS}
                                toastNotificationTitle=""
                                isOpenConfirmationDialog={false}
                                isShowOverflowMenuCol={false}
                                isShowFirstElement={true}
                                isShowAutoSuggest={isShowAutoSuggest}
                                isLoaderForFilterandTable={isLoading}
                                loaderFilterText="Please Wait..."
                                isShowErrorPage={!!showSearchError}
                                isSearchShowLoading={isLoading}
                                dynamicTableLoader={issearchDataLoading}
                                className="grid_wrapper"
                            />
                        </div>}
                    </div>
                </GridItem>
            </Grid>
        </>
    </>)
}
export default DocumentManagementServerView