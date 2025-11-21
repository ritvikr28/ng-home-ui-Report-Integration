/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-enable jsx-a11y/anchor-is-valid
import { Link, ShowValAs, Tag, TagColor, TagSize } from "@essnextgen/ui-kit";

export const getNotificationTableHeadersData = (
  setSideIsOpen?: (isOpen: boolean) => void,
  setSelectedItem?: (item: any) => void
): {
  text: string;
  isShow: boolean;
  showValAs: ShowValAs;
  isTextTruncate?: boolean;
  columnWidth: string;
  isHeaderTextTruncate?: boolean;
  headerTxtTrunctLength?: number;
  isSimpleText?: boolean;
  txtTrunctLength?: number;
  isColumnSorting?: boolean;
  isColumnSortByDefault?: boolean;
  anyComponent?: (cellData: any, rowData?: any) => JSX.Element;
}[] => [
    {
      text: "Id",
      isShow: false,
      showValAs: ShowValAs.Text,
      isTextTruncate: false,
      columnWidth: "16px"
    },
    {
      text: "Status",
      isShow: true,
      showValAs: ShowValAs.CustomeComponent,
      isTextTruncate: false,
      isHeaderTextTruncate: true,
      columnWidth: "129px",
      isColumnSorting: true,
      anyComponent: (cellData: any) => (
        <div>
          {cellData === "Unread" ? (
            <Tag color={TagColor.Outstanding} size={TagSize.Small} id="unread" text={cellData} />
          ) : (
            <Tag color={TagColor.Success} size={TagSize.Small} id="read" text={cellData} />
          )}
        </div>
      )
    },
    {
      text: "Notification",
      isShow: true,
      showValAs: ShowValAs.Text,
      isTextTruncate: true,
      isHeaderTextTruncate: false,
      headerTxtTrunctLength: 17,
      columnWidth: "274px",
      txtTrunctLength: 35,
      isColumnSorting: false
    },
    {
      text: "Priority",
      isShow: true,
      showValAs: ShowValAs.Text,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 20,

      isColumnSorting: true,
      columnWidth: "274px"
    },
    {
      text: "Date received",
      isShow: true,
      showValAs: ShowValAs.Text,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 20,
      isColumnSorting: true,
      columnWidth: "274px"
    },
    {
      text: "",
      isShow: true,
      showValAs: ShowValAs.CustomeComponent,
      columnWidth: "129px",
      anyComponent: (e: any) => (
        <>
          {/* eslint-disable jsx-a11y/anchor-is-valid */}
          <Link
            dataTestId="test-id"
            id="element-id"
            onClick={() => {
              if (setSelectedItem) setSelectedItem(e);
              if (setSideIsOpen) setSideIsOpen(true);
            }}
            target="_self"
          >
            View
          </Link>
        </>
      )
    }
  ];



export const notificationTableRows: {
  Id: string;
  Status: string;
  Notification: string;
  Priority: string;
  DateReceived: string;
  isShowIcon: boolean;
  iconName?: string;
  doc?: any;
}[] = [
    {
      Id: "72ff5e2f-f2ed-4f56-8a3b-8277a41b8c87",
      Status: "Unread",
      Notification: "All teachers must update attendance records",
      Priority: "Low",
      DateReceived: "01 Jan 2025",
      doc: [{
        id: "72ff5e2f-f2ed-4f56-8a3b-8277a41b8c87",
        status: "Unread",
        notification: "All teachers must update attendance records",
        priority: "Low",
        dateReceived: "01 Jan 2025",
      }],
      isShowIcon: true,
      iconName: "chat",
    },
    {
      Id: "62ff5e2f-f2ed-4f56-8a3b-8277a41b8sdc87",
      Status: "Read",
      Notification: "New health and safety guidelines will be discussed in today’s briefing",
      Priority: "Medium",
      DateReceived: "01 Jan 2025",
      doc: [{
        id: "62ff5e2f-f2ed-4f56-8a3b-8277a41b8sdc87",
        status: "Read",
        notification: "New health and safety guidelines will be discussed in today’s briefing",
        priority: "Medium",
        dateReceived: "01 Jan 2025",
      }],
      isShowIcon: true

    },
    {
      Id: "82ff5e2f-f2ed-4f56-8a3b-8277a41b8c87",
      Status: "Unread",
      Notification: "Reminder: Midterm exam schedules to be finalized by",
      Priority: "High",
      DateReceived: "01 Jan 2025",
      doc: [{
        id: "82ff5e2f-f2ed-4f56-8a3b-8277a41b8sdc87",
        status: "Unread",
        notification: "Reminder: Midterm exam schedules to be finalized by",
        priority: "High",
        dateReceived: "01 Jan 2025",
      }],
      isShowIcon: true,
      iconName: "chat",
    },
    {
      Id: "92ff5e2f-f2ed-4f56-8a3b-8277a41b8c87",
      Status: "Unread",
      Notification: "Please submit weekly lesson plans",
      Priority: "Low",
      DateReceived: "01 Jan 2025",
      doc: [{
        id: "92ff5e2f-f2ed-4f56-8a3b-8277a41b8sdc87",
        status: "Unread",
        notification: "Please submit weekly lesson plans",
        priority: "Low",
        dateReceived: "01 Jan 2025",
      }],
      isShowIcon: true,
      iconName: "chat",
    },
    {
      Id: "102ff5e2f-f2ed-4f56-8a3b-8277a41b8c87",
      Status: "Read",
      Notification: "Please review the updated student disciplinary policy in your email",
      Priority: "Medium",
      DateReceived: "01 Jan 2025",
      doc: [{
        id: "102ff5e2f-f2ed-4f56-8a3b-8277a41b8sdc87",
        status: "Read",
        notification: "Please review the updated student disciplinary policy in your email",
        priority: "Medium",
        dateReceived: "01 Jan 2025",
      }],
      isShowIcon: true,
      iconName: "chat",
    }
  ];