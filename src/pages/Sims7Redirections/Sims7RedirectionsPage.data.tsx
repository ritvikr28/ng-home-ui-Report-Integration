import { ShowValAs, TagColor, Link, Tooltip } from "@essnextgen/ui-kit";

export const sims7RedirectionsTableHeaders = [
    {
        text: "ID",
        isShow: false,
        showValAs: ShowValAs.Text,
        isTextTruncate: false,
    },
    {
        text: "Category",
        isShow: true,
        showValAs: ShowValAs.Text,
        isTextTruncate: false,
    },

    {
        text: "Next Gen module",
        isShow: true,
        showValAs: ShowValAs.CustomeComponent,
        anyComponent: (value: string) => {
            if (!value) return null;
            const isTruncated = value.length > 19;
            const displayText = isTruncated ? `${value.slice(0, 19)}…` : value;
            if (isTruncated) {
                return (
                    <Tooltip content={<span>{value}</span>}>
                        <span>
                            <Link
                                href={`https://example.com/module/${encodeURIComponent(value)}`}
                                target="_blank"
                                className="truncated-link"
                            >
                                {displayText}
                            </Link>
                        </span>
                    </Tooltip>
                );
            }
            return (
                <Link
                    href={`https://example.com/module/${encodeURIComponent(value)}`}
                    target="_blank"
                >
                    {displayText}
                </Link>
            );
        }
    },
    {
        text: "SIMS 7 module",
        isShow: true,
        showValAs: ShowValAs.TextWithTag,
        isTextTruncate: true,
        alignSpecific: true,
        columnWidth: "250px",
        tagColor: TagColor.Highlight
    },
    {
        text: "Modified by",
        isShow: true,
        showValAs: ShowValAs.Text,
        isTextTruncate: false,
    },
    {
        text: "Effective date",
        isShow: true,
        showValAs: ShowValAs.Text,
        isTextTruncate: false,
    },
    {
        text: "Status",
        isShow: true,
        showValAs: ShowValAs.Tag,
        statusColors: {
            Migrated: TagColor.Success,
            Permanent: TagColor.Success,
            "Not migrated": TagColor.Neutral,
            Planned: TagColor.Outstanding,
            Reversing: TagColor.Outstanding
        },
        isTextTruncate: false,
        isColumnSorting: true,
        isColumnSortByDefault: true,
    },
    {
        text: "Reason for changes",
        isShow: false,
        showValAs: ShowValAs.Text
    }
];

export const sims7RedirectionsTableData = [
    {
        id: "1",
        category: "Student",
        nextGenModule: "Pupil Data",
        sims7Module: "Pupil Data1",
        modifiedBy: "John Doe",
        effectiveDate: "01 Dec 2025",
        status: "Migrated",
        tooltipMessage: "Chat with our customer care representative",
        cellStatus: "success",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "2",
        category: "Calendar",
        nextGenModule: "Attendance with very long name",
        sims7Module: "Attendance",
        modifiedBy: "Jane Smith",
        effectiveDate: "05 Jan 2026",
        status: "Permanent",
        tooltipMessage: "Attendance migrated",
        cellStatus: "success",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "3",
        category: "Assessment",
        nextGenModule: "Assessment",
        sims7Module: "Assessment",
        modifiedBy: "Alex Brown",
        effectiveDate: "10 Feb 2026",
        status: "Planned",
        tooltipMessage: "Assessment planned",
        cellStatus: "neutral",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "4",
        category: "Behaviour",
        nextGenModule: "Behaviour",
        sims7Module: "Behaviour",
        modifiedBy: "Chris Green",
        effectiveDate: "15 Mar 2026",
        status: "Reversing",
        reasonForChanges: "System update",
        tooltipMessage: "Behaviour reversing",
        cellStatus: "neutral",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "5",
        category: "Dinner money",
        nextGenModule: "Dinner Money",
        sims7Module: "Dinner Money",
        modifiedBy: "Morgan Lee",
        effectiveDate: "20 Apr 2026",
        status: "Not migrated",
        reasonForChanges: "Budget constraints",
        tooltipMessage: "Not migrated yet",
        cellStatus: "warning",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "6",
        category: "Personnel",
        nextGenModule: "Personnel",
        sims7Module: "Personnel",
        modifiedBy: "Sam Patel",
        effectiveDate: "25 May 2026",
        status: "Migrated",
        tooltipMessage: "Personnel migrated",
        cellStatus: "success",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "7",
        category: "Timetable",
        nextGenModule: "Timetable",
        sims7Module: "Timetable",
        modifiedBy: "Priya Singh",
        effectiveDate: "30 Jun 2026",
        status: "Permanent",
        tooltipMessage: "Timetable permanent",
        cellStatus: "success",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "8",
        category: "Cover",
        nextGenModule: "Cover",
        sims7Module: "Cover",
        modifiedBy: "Liam White",
        effectiveDate: "05 Jul 2026",   
        status: "Planned",
        tooltipMessage: "Cover planned",
        cellStatus: "neutral",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "9",
        category: "Examinations",
        nextGenModule: "Examinations",
        sims7Module: "Examinations",
        modifiedBy: "Olivia Black",
        effectiveDate: "10 Aug 2026",
        status: "Reversing",
        tooltipMessage: "Exams reversing",
        cellStatus: "neutral",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "10",
        category: "Options",
        nextGenModule: "Options",
        sims7Module: "Options",
        modifiedBy: "-",
        effectiveDate: "-",
        status: "Not migrated",
        tooltipMessage: "Options not migrated",
        cellStatus: "warning",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "11",
        category: "Profiles",
        nextGenModule: "Profiles",
        sims7Module: "Profiles",
        modifiedBy: "Emma Blue",
        effectiveDate: "20 Oct 2026",
        status: "Migrated",
        tooltipMessage: "Profiles migrated",
        cellStatus: "success",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "12",
        category: "Reporting",
        nextGenModule: "Reporting",
        sims7Module: "Reporting",
        modifiedBy: "Lucas Red",
        effectiveDate: "25 Nov 2026",
        status: "Permanent",
        tooltipMessage: "Reporting permanent",
        cellStatus: "success",
       actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "13",
        category: "SEN",
        nextGenModule: "SEN",
        sims7Module: "SEN",
        modifiedBy: "Mia Violet",
        effectiveDate: "30 Dec 2026",
        status: "Planned",
        tooltipMessage: "SEN planned",
        cellStatus: "neutral",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "14",
        category: "Student",
        nextGenModule: "Student Details",
        sims7Module: "Student Details",
        modifiedBy: "Ella Indigo",
        effectiveDate: "04 Jan 2027",
        status: "Reversing",
        reasonForChanges: "System update",
        tooltipMessage: "Student details reversing",
        cellStatus: "neutral",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "15",
        category: "Medical",
        nextGenModule: "Medical",
        sims7Module: "Medical",
        modifiedBy: "Ava Orange",
        effectiveDate: "09 Feb 2027",
        status: "Not migrated",
        tooltipMessage: "Medical not migrated",
        cellStatus: "warning",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "16",
        category: "Consent",
        nextGenModule: "Parental Consent",
        sims7Module: "Parental Consent",
        modifiedBy: "Sophia Pink",
        effectiveDate: "14 Mar 2027",
        status: "Migrated",
        tooltipMessage: "Consent migrated",
        cellStatus: "success",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "17",
        category: "User",
        nextGenModule: "User Management",
        sims7Module: "User Management",
        modifiedBy: "William Gold",
        effectiveDate: "19 Apr 2027",
        status: "Permanent",
        tooltipMessage: "User management permanent",
        cellStatus: "success",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    },
    {
        id: "18",
        category: "School",
        nextGenModule: "School Details",
        sims7Module: "School Details,wit sims,module,djfni,ijfiejf",
        modifiedBy: "James Silver",
        effectiveDate: "24 May 2027",
        status: "Planned",
        tooltipMessage: "School details planned",
        cellStatus: "neutral",
        actions: {
            options: [
                { disabled: false, isSelected: false, text: " View", value: "View" },
                { disabled: false, isSelected: false, text: "Edit", value: "Edit" }
            ]
        }
    }
];
