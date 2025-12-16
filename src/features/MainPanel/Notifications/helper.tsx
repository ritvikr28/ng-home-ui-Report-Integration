/* eslint-disable @typescript-eslint/no-unused-vars */
// eslint-enable jsx-a11y/anchor-is-valid
import { Link, ShowValAs, Tag, TagColor, TagSize } from "@essnextgen/ui-kit";

export const getNotificationTableHeadersData = (
  setSideIsOpen?: (isOpen: boolean) => void,
  setSelectedItem?: (item: any) => void,
  sortBy: string = "DateReceived",
  sortDirection: string = "Desc"
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
  isColumnSortAscFirst?: boolean | undefined;
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
      ...(sortBy === "Status" && {
        isColumnSortByDefault: true,
        isColumnSortAscFirst: sortDirection === "Asc"
      }),
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
      ...(sortBy === "Priority" && {
        isColumnSortByDefault: true,
        isColumnSortAscFirst: sortDirection === "Asc"
      }),
      columnWidth: "274px"
    },
    {
      text: "Date received",
      isShow: true,
      showValAs: ShowValAs.Text,
      isHeaderTextTruncate: true,
      headerTxtTrunctLength: 20,
      isColumnSorting: true,
      ...(sortBy === "DateReceived" && {
        isColumnSortByDefault: true,
        isColumnSortAscFirst: sortDirection === "Asc"
      }),
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

const generateId = (index: number): string =>
  `notif-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

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
  doc?: { id: string; status: string; notification: string; priority: string; dateReceived: string; }[];
}[] => {
  const notifications: {
    Id: string;
    Status: string;
    Notification: string;
    Priority: string;
    DateReceived: string;
    isShowIcon: boolean;
    iconName?: string;
    doc?: { id: string; status: string; notification: string; priority: string; dateReceived: string; }[];
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
    { text: "Staff training on new assessment tools", priority: "Medium" },
    { text: "Math tutoring sessions available after school", priority: "Low" },
    { text: "Drama club auditions scheduled for next week", priority: "Medium" },
    { text: "School website maintenance scheduled tonight", priority: "Low" },
    { text: "New science lab equipment installation complete", priority: "Medium" },
    { text: "Student ID card replacement process updated", priority: "Low" },
    { text: "After-school homework club registration open", priority: "Medium" },
    { text: "School uniform policy changes effective next term", priority: "High" },
    { text: "Music department recital scheduled for Friday", priority: "Low" },
    { text: "Parent volunteer sign-up sheet available", priority: "Medium" },
    { text: "School WiFi password updated - check email", priority: "High" },
    { text: "Debate team competition next Saturday", priority: "Low" },
    { text: "New reading program launched this month", priority: "Medium" },
    { text: "School calendar updated with new events", priority: "Low" },
    { text: "Chemistry lab safety training mandatory", priority: "High" },
    { text: "Chess club meeting moved to Thursday", priority: "Low" },
    { text: "Student parking permit applications due", priority: "Medium" },
    { text: "School fundraising event planning meeting", priority: "Low" },
    { text: "New online learning platform training session", priority: "High" },
    { text: "Garden club planting day this weekend", priority: "Low" },
    { text: "Student handbook updated - please review", priority: "Medium" },
    { text: "Robotics team competition registration open", priority: "Low" },
    { text: "School email system migration scheduled", priority: "High" },
    { text: "History department field trip approved", priority: "Medium" },
    { text: "New vending machine installed in cafeteria", priority: "Low" },
    { text: "Student council budget proposal review", priority: "Medium" },
    { text: "School app update available for download", priority: "Low" },
    { text: "Mandatory staff meeting rescheduled to next week", priority: "High" },
    { text: "Yearbook photo sessions begin Monday", priority: "Low" },
    { text: "New language learning software available", priority: "Medium" },
    { text: "School supply drive starting next week", priority: "Low" },
    { text: "Student achievement awards ceremony planned", priority: "Medium" },
    { text: "Emergency evacuation route updated", priority: "High" },
    { text: "New study hall location announced", priority: "Low" },
    { text: "School board meeting agenda published", priority: "Medium" },
    { text: "New sports equipment arrived in gym", priority: "Low" },
    { text: "Student mentoring program applications open", priority: "Medium" },
    { text: "School closure due to weather - check updates", priority: "High" },
    { text: "New art supplies available in studio", priority: "Low" },
    { text: "Parent-teacher conference scheduling open", priority: "Medium" },
    { text: "School bus GPS tracking system activated", priority: "Low" },
    { text: "New scholarship opportunities announced", priority: "High" },
    { text: "School choir concert tickets on sale", priority: "Low" },
    { text: "Student health screening scheduled", priority: "Medium" },
    { text: "New computer lab hours posted", priority: "Low" },
    { text: "School spirit week activities planned", priority: "Medium" },
    { text: "Library late return policy updated", priority: "Low" },
    { text: "New student orientation session scheduled", priority: "High" },
    { text: "School newspaper submissions deadline", priority: "Low" },
    { text: "New extracurricular activity sign-ups open", priority: "Medium" },
    { text: "School parking lot repainting scheduled", priority: "Low" },
    { text: "Student leadership workshop next month", priority: "Medium" },
    { text: "New digital textbooks available online", priority: "High" },
    { text: "School talent show auditions begin", priority: "Low" },
    { text: "Parent association meeting next Tuesday", priority: "Medium" },
    { text: "New recycling program launched", priority: "Low" },
    { text: "Student safety protocol training required", priority: "High" },
    { text: "School mascot costume design contest", priority: "Low" },
    { text: "New tutoring center hours announced", priority: "Medium" },
    { text: "School social media policy updated", priority: "Low" },
    { text: "Student exchange program applications due", priority: "High" },
    { text: "New playground equipment installation", priority: "Low" },
    { text: "School fundraising goal reached", priority: "Medium" },
    { text: "New student support services available", priority: "Low" },
    { text: "School accreditation review scheduled", priority: "High" },
    { text: "New after-school program registration", priority: "Low" },
    { text: "Student wellness program launched", priority: "Medium" },
    { text: "School building renovation update", priority: "Low" },
    { text: "New student ambassador program announced", priority: "Medium" },
    { text: "School technology upgrade completed", priority: "High" },
    { text: "New community service opportunities", priority: "Low" },
    { text: "Student feedback survey now available", priority: "Medium" },
    { text: "School holiday schedule published", priority: "Low" },
    { text: "New student council initiatives announced", priority: "Medium" },
    { text: "School emergency contact system updated", priority: "High" },
    { text: "New student mentorship opportunities", priority: "Low" },
    { text: "School performance review scheduled", priority: "Medium" },
    { text: "New student achievement tracking system", priority: "Low" },
    { text: "School community garden project started", priority: "Medium" },
    { text: "New student wellness resources available", priority: "Low" },
    { text: "School partnership program expanded", priority: "Medium" },
    { text: "New student recognition program launched", priority: "High" },
    { text: "School improvement plan published", priority: "Low" },
    { text: "New student engagement initiatives", priority: "Medium" },
    { text: "School sustainability program update", priority: "Low" },
    ...Array(41).fill({ text: "Staff training on new assessment tools", priority: "Medium" })
  ];

  const statuses = ["Read", "Unread"];
  const priorities = ["Low", "Medium", "High"];

  for (let i = 0; i < 165; i += 1) {
    const template = notificationTemplates[i % notificationTemplates.length];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = template.priority || priorities[Math.floor(Math.random() * priorities.length)];
    const daysAgo = Math.floor(Math.random() * 180);
    const hasIcon = Math.random() > 0.5;
    const generateIdVal = generateId(i)

    notifications.push({
      Id: generateIdVal,
      Status: status,
      Notification: `${template.text}${i > 0 ? ` (${i + 1})` : ""}`,
      Priority: priority,
      DateReceived: formatDate(daysAgo),
      doc: [
        {
          id: generateIdVal,
          status,
          notification: `${template.text}${i > 0 ? ` (${i + 1})` : ""}`,
          priority,
          dateReceived: formatDate(daysAgo),
        }
      ],
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