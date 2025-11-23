/* eslint-disable @typescript-eslint/no-unused-vars */
import { ShowValAs, Tag, TagColor, TagSize } from "@essnextgen/ui-kit";

export const getNotificationTableHeadersData = (
  setSideIsOpen?: (isOpen: boolean) => void
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
      anyComponent: (cellData: any) => (
        <button
          type="button"
          onClick={() => {
            if (setSideIsOpen) setSideIsOpen(true);
          }}
          style={{
            color: "#2177C2",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textDecoration: "underline"
          }}
          className="view-text-style"
        >
          {cellData}
        </button>
      )
    }
  ];

const generateId = (index: number): string => {
  return `notif-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

const formatDate = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate().toString().padStart(2, "0")} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

export const generateNotificationData = (): {
  Id: string;
  Status: string;
  Notification: string;
  Priority: string;
  DateReceived: string;
  isShowIcon: boolean;
  iconName?: string;
  doc?: string;
}[] => {
  const notifications: {
    Id: string;
    Status: string;
    Notification: string;
    Priority: string;
    DateReceived: string;
    isShowIcon: boolean;
    iconName?: string;
    doc?: string;
  }[] = [];

  const notificationTemplates = [
    { text: "All teachers must update attendance records", priority: "Low" },
    { text: "New health and safety guidelines will be discussed in today's briefing", priority: "Medium" },
    { text: "Reminder: Midterm exam schedules to be finalized by end of week", priority: "High" },
    { text: "Please submit weekly lesson plans for review", priority: "Low" },
    { text: "Please review the updated student disciplinary policy in your email", priority: "Medium" },
    { text: "Updated role in Staff Settings", priority: "Low" },
    { text: "Cover assigned for your classes next week", priority: "Medium" },
    { text: "Medical emergency protocol updated - please review", priority: "High" },
    { text: "Parent-teacher meeting scheduled for next month", priority: "Medium" },
    { text: "New curriculum guidelines available for download", priority: "Low" },
    { text: "Fire drill scheduled for next Tuesday at 10 AM", priority: "High" },
    { text: "Student enrollment deadline approaching", priority: "Medium" },
    { text: "Library resources updated - new books available", priority: "Low" },
    { text: "IT maintenance scheduled for this weekend", priority: "Medium" },
    { text: "Sports day event planning meeting on Friday", priority: "Low" },
    { text: "Grade submission deadline extended to next week", priority: "Medium" },
    { text: "New student information system training session", priority: "High" },
    { text: "Cafeteria menu updated for next month", priority: "Low" },
    { text: "School bus route changes effective Monday", priority: "Medium" },
    { text: "Annual school inspection scheduled for next month", priority: "High" },
    { text: "Science fair registration now open", priority: "Low" },
    { text: "Staff parking lot maintenance this weekend", priority: "Medium" },
    { text: "Emergency contact information update required", priority: "High" },
    { text: "New teaching resources available in shared drive", priority: "Low" },
    { text: "Student council election nominations open", priority: "Medium" },
    { text: "Weather alert: School closure procedures reminder", priority: "High" },
    { text: "Photography club meeting rescheduled", priority: "Low" },
    { text: "Parent portal password reset instructions", priority: "Medium" },
    { text: "Field trip permission slips due by Friday", priority: "High" },
    { text: "School newsletter published - please review", priority: "Low" },
    { text: "Staff appreciation lunch next Wednesday", priority: "Medium" },
    { text: "Critical: System security update required", priority: "High" },
    { text: "Art exhibition opening next week", priority: "Low" },
    { text: "Student progress reports available for review", priority: "Medium" },
    { text: "Lockdown drill scheduled for next week", priority: "High" },
    { text: "New printer setup in staff room", priority: "Low" },
    { text: "Graduation ceremony planning committee meeting", priority: "Medium" },
    { text: "Important: Student data privacy policy update", priority: "High" },
    { text: "Book fair starting next Monday", priority: "Low" },
    { text: "Staff training on new assessment tools", priority: "Medium" }
  ];

  const statuses = ["Read", "Unread"];
  const priorities = ["Low", "Medium", "High"];

  for (let i = 0; i < 0; i++) {
    const template = notificationTemplates[i % notificationTemplates.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = template.priority || priorities[Math.floor(Math.random() * priorities.length)];
    const daysAgo = Math.floor(Math.random() * 60);
    const hasIcon = Math.random() > 0.5;
    
    notifications.push({
      Id: generateId(i),
      Status: status,
      Notification: `${template.text}${i > 0 ? ` (${i + 1})` : ""}`,
      Priority: priority,
      DateReceived: formatDate(daysAgo),
      doc: "View",
      isShowIcon: hasIcon,
      iconName: hasIcon ? "chat" : undefined
    });
  }
  
  notifications.sort((a, b) => {
    const dateA = new Date(a.DateReceived);
    const dateB = new Date(b.DateReceived);
    return dateB.getTime() - dateA.getTime();
  });

  return notifications;
};

export const notificationTableRows = generateNotificationData();