import { LocalisedMenu } from "@essnextgen/ui-application-kit"
import { Grid, GridItem, Button, ButtonColor, IconColor, ButtonSize, Breadcrumbs, ControlledList, DialogTemplate, NotificationStatus, ShowActionAs, ButtonIconPosition, useMediaQuery } from "@essnextgen/ui-kit"
import React,{ useState, useEffect } from "react"
import DocumentManagementServer, { getTableHeadersData, tableBodyData } from "./DocumentManagementServer.logic"
import "./style.scss"
import dayjs from "dayjs"
import { tableDataProps } from "./responseModel"

const DocumentManagementServerView: React.FC = () => {

    const { data, loading, error }: { data: any; loading: boolean; error: string | null } = DocumentManagementServer({ pageNumber: 1, pageSize: 10 });

    const tableData: tableDataProps[] = (!data?.data?.length || loading || error) ? [] :  data?.data?.map((doc: any) => ({
        id: doc?.fileId,
        Document: doc?.document,
        Relatedto: doc?.relatedTo || [],
        Category: doc?.category || "",
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
                </GridItem>
                <GridItem className={isOpen ? "clc-dms-isopen" : "clc-dms-isclose"}>
                    <div
                        style={{
                            marginBottom: 16,
                            width: "100%"
                        }}

                    >
                        <div>
                            <Breadcrumbs
                                breadcrumbActions={[
                                    {
                                        active: false,
                                        linkName: 'Home',
                                        path: window.location.origin
                                    },
                                    {
                                        active: false,
                                        linkName: 'Admin console',
                                        path: '#'
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
                            emptyStateMsg="No Severity levels"
                            emptybtnTitle="Add Type"
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
                            paginationCount={4}
                            paginationMinCountToHideNextPreviousBtn={0}
                            primaryButtonTitle=""
                            resultNotFoundMessage=""
                            searchHeadingText="Search by document or related to name"
                            searchPlaceholderText="Text"
                            searchTerm=""
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
                            tableHeadersData={getTableHeadersData}
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
                            isShowFirstElement= {false}
                        />
                    </div>
                </GridItem>
            </Grid>
        </>
    </>)
}
export default DocumentManagementServerView