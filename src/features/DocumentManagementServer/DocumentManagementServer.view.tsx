import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { Grid, GridItem, Button, ButtonColor, IconColor, ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, ButtonIconPosition, useMediaQuery } from "@essnextgen/ui-kit"
import React,{ useState, useEffect } from "react"
import dayjs from "dayjs"
import DocumentManagementServer, { getTableHeadersData} from "./DocumentManagementServer.logic"
import "./style.scss"
import { tableDataProps } from "./responseModel"
import gtmAnalytics from "../../shared/utils/analytics"
import { homeurl, pageSizeNumber } from "../../../public/Constants"
import { CapitalizeFirstLetter } from "../../shared/utils/commonFunctions"


const DocumentManagementServerView: React.FC = () => {
    const [currentPage, setCurrentPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(1);
    const [totalPage, setTotalPage]: [number, React.Dispatch<React.SetStateAction<number>>] = useState(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const handlePageChange: (event: any, handlepageCount: number) => void = (event: any, handlepageCount: number) => {
        setIsLoading(true);
        setCurrentPage(handlepageCount);
    };

    const { data, error, hasFetched }: { data: any; error: string | null, hasFetched: boolean } = DocumentManagementServer({ pageNumber: currentPage, pageSize: pageSizeNumber });
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

    const [isOpen, setIsOpen]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(!isMobileView);

    const handleButtonClick: () => void = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setIsOpen(!isMobileView);
    }, [!isMobileView]);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            if (tableData) {
                setIsLoading(false);
            }
        }, 1500);
    }, [currentPage]);

    useEffect(() => {
        if (data && data?.totalRecords) {
            const totalPages = Math.ceil(data.totalRecords / pageSizeNumber);
            setTotalPage(totalPages);
        }
    }, [data]);

  const onBreadcrumbClick = (path: string) => {
    window.location.assign(path);
    gtmAnalytics.pushEvent({
      event: "click",
      linkText: "Documents",
      linkUrl: '',
      clickType: "link",
      clickLocation: "breadcrumb"
    });
  };

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

                    {isMobileView &&<Breadcrumbs
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
                       { !isMobileView && <div>
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
                                onItemClick={onBreadcrumbClick}
                            />
                        </div>
                        }
                        {hasFetched && <div className="grid-wrapper">
                            <ControlledList
                                globalNotificationMsgBannerObject={null}
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
                                emptyStateMsg="Documents will appear here once they are uploaded."
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
                                paginationOnChange={handlePageChange}
                                isPagination={true}
                                paginationMinCountToHideNextPreviousBtn={0}
                                primaryButtonTitle=""
                                resultNotFoundMessage=""
                                searchHeadingText="Search by document or related to name"
                                searchPlaceholderText=""
                                searchTerm=""
                                isShowSearch={true}
                                searchValue=""
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
                                tableBodyData={tableData || [] }
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
                                tableHeadersData={tableData.length > 0 ? getTableHeadersData : []}
                                tableLastColumnWidth="10px"
                                templatePropsConfirmation={
                                    {
                                        cancelText: 'Cancel',
                                        contentText: 'You have unsaved changes that will be lost.',
                                        isNotificationanner: false,
                                        notificationStatus: NotificationStatus.SUCCESS,
                                        okText: 'Discard',
                                        onCancel: (): void => {},
                                        onConfirm: (): void => {},
                                        template: DialogTemplate.Confirmation
                                    }
                                }
                                titleConfirmation="Discard changes?"
                                toastNotificationStatus={NotificationStatus.SUCCESS}
                                toastNotificationTitle=""
                                isOpenConfirmationDialog={false}
                                isShowOverflowMenuCol={false}
                                isShowFirstElement={true}
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
    </>)
}
export default DocumentManagementServerView