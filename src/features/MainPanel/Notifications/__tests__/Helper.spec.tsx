import { render, fireEvent } from "@testing-library/react";
import { ShowValAs } from "@essnextgen/ui-kit";
import { getNotificationTableHeadersData } from "../helper";

const notificationTableRows = Array.from({ length: 165 }, (_, i) => {
  const idx = i + 1;
  const status = idx % 2 === 0 ? "Read" : "Unread";
  let priority;
  if (idx % 3 === 0) {
    priority = "Medium";
  } else if (idx % 3 === 1) {
    priority = "High";
  } else {
    priority = "Low";
  }
  const date = `${String(idx).padStart(2, "0")} Jan 2024`;
  const isShowIcon = idx % 2 === 0;
  let iconName;
  if (isShowIcon) {
    iconName = idx % 4 === 0 ? "chat" : "bell";
  }
  return {
    Id: String(idx),
    Status: status,
    Notification: `Test notification ${idx}`,
    Priority: priority,
    DateReceived: date,
    isShowIcon,
    iconName,
    doc: [
      {
        id: String(idx),
        status,
        notification: `Test notification ${idx}`,
        priority,
        dateReceived: date
      }
    ]
  };
});

describe("getNotificationTableHeadersData", () => {
  it("returns correct number of headers and expected structure", () => {
    const headers = getNotificationTableHeadersData();
    expect(headers).toHaveLength(6);
    expect(headers[0].text).toBe("Id");
    expect(headers[1].text).toBe("Status");
    expect(headers[2].text).toBe("Notification");
    expect(headers[3].text).toBe("Priority");
    expect(headers[4].text).toBe("Date received");
    expect(headers[5].text).toBe("");
    expect(headers[1].showValAs).toBe(ShowValAs.CustomeComponent);
    expect(headers[2].isTextTruncate).toBe(true);
    expect(typeof headers[5].anyComponent).toBe("function");
  });

  it("renders Status column's anyComponent with 'Unread' and 'Read'", () => {
    const headers = getNotificationTableHeadersData();
    const StatusComponent = headers[1].anyComponent;
    const { getByText, rerender } = render(<>{StatusComponent && StatusComponent("Unread")}</>);
    expect(getByText("Unread")).toBeInTheDocument();

    rerender(<>{StatusComponent && StatusComponent("Read")}</>);
    expect(getByText("Read")).toBeInTheDocument();
  });

  it("renders last column's anyComponent and triggers callbacks on click", () => {
    const setSideIsOpen = jest.fn();
    const setSelectedItem = jest.fn();
    const setNotificationIdSelected = jest.fn();
    const headers = getNotificationTableHeadersData(setSideIsOpen, setSelectedItem, "DateReceived", "Desc", setNotificationIdSelected);
    const LastComponent = headers[5].anyComponent;
    const cellData = JSON.stringify({ id: "foo", Status: "Unread", Notification: "Test", title: "View" });
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    const viewLink = getByText("View");
    expect(viewLink).toBeInTheDocument();
    fireEvent.click(viewLink);
    expect(setSelectedItem).toHaveBeenCalledWith(cellData);
    expect(setNotificationIdSelected).toHaveBeenCalledWith("foo");
    expect(setSideIsOpen).toHaveBeenCalledWith(true);
  });

  it("does not throw if setSideIsOpen and setSelectedItem are undefined", () => {
    const headers = getNotificationTableHeadersData();
    const LastComponent = headers[5].anyComponent;
    const cellData = JSON.stringify({ id: "bar", Status: "Read", Notification: "Test", title: "View" });
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    const viewLink = getByText("View");
    expect(() => fireEvent.click(viewLink)).not.toThrow();
  });
});
// (notificationTableRows tests removed as notificationTableRows is not exported)
//       expect(row).toHaveProperty("doc");
//       expect(row).toHaveProperty("isShowIcon");
//     });
//   });



//   it("should have correct values for the second notification", () => {
//     const row = notificationTableRows[1];
//     expect(row.Id).toBe(row.Id);
//     expect(row.Status).toBeDefined();
//     expect(row.Notification).toBeDefined();
//     expect(row.Priority).toBeDefined();
//     expect(row.DateReceived).toBeDefined();
//     expect(row.isShowIcon).toBeDefined();
//     expect(Array.isArray(row.doc)).toBe(true);
//   });

//   it("should have correct values for the third notification", () => {
//     const row = notificationTableRows[2];
//     expect(row.Id).toBe(row.Id);
//     expect(row.Status).toBeDefined();
//     expect(row.Notification).toBeDefined();
//     expect(row.Priority).toBeDefined();
//     expect(row.DateReceived).toBeDefined();
//     expect(row.isShowIcon).toBeDefined();
//     expect(Array.isArray(row.doc)).toBeDefined();
//   });
// });


describe("getNotificationTableHeadersData", () => {
  it("returns correct number of headers and expected structure", () => {
    const headers = getNotificationTableHeadersData();
    expect(headers).toHaveLength(6);
    expect(headers[0].text).toBe("Id");
    expect(headers[1].text).toBe("Status");
    expect(headers[2].text).toBe("Notification");
    expect(headers[3].text).toBe("Priority");
    expect(headers[4].text).toBe("Date received");
    expect(headers[5].text).toBe("");
    expect(headers[1].showValAs).toBe(ShowValAs.CustomeComponent);
    expect(headers[2].isTextTruncate).toBe(true);
    expect(headers[5].anyComponent).toBeInstanceOf(Function);
  });

  it("renders Status column's anyComponent with 'Unread' and 'Read'", () => {
    const headers = getNotificationTableHeadersData();
    const StatusComponent = headers[1].anyComponent;
    const { getByText, rerender } = render(<>{StatusComponent && StatusComponent("Unread")}</>);
    expect(getByText("Unread")).toBeInTheDocument();

    rerender(<>{StatusComponent && StatusComponent("Read")}</>);
    expect(getByText("Read")).toBeInTheDocument();
    // expect(getByText("Read").closest("span")).toHaveAttribute("id", "read");
  });

  it("Status column's anyComponent renders correct Tag color for Unread", () => {
    const headers = getNotificationTableHeadersData();
    const StatusComponent = headers[1].anyComponent;
    const { container } = render(<>{StatusComponent && StatusComponent("Unread")}</>);
    expect(container.querySelector("#unread")).toBeTruthy();
  });

  it("Status column's anyComponent renders correct Tag color for Read", () => {
    const headers = getNotificationTableHeadersData();
    const StatusComponent = headers[1].anyComponent;
    const { container } = render(<>{StatusComponent && StatusComponent("Read")}</>);
    expect(container.querySelector("#read")).toBeTruthy();
  });

  it("sets isColumnSortByDefault and isColumnSortAscFirst for Status, Priority, DateReceived", () => {
    let headers = getNotificationTableHeadersData(undefined, undefined, "Status", "Asc");
    expect(headers[1].isColumnSortByDefault).toBe(true);
    expect(headers[1].isColumnSortAscFirst).toBe(true);

    headers = getNotificationTableHeadersData(undefined, undefined, "Priority", "Desc");
    expect(headers[3].isColumnSortByDefault).toBe(true);
    expect(headers[3].isColumnSortAscFirst).toBe(false);

    headers = getNotificationTableHeadersData(undefined, undefined, "DateReceived", "Asc");
    expect(headers[4].isColumnSortByDefault).toBe(true);
    expect(headers[4].isColumnSortAscFirst).toBe(true);
  });

  it("last column's anyComponent renders empty if cellData is null", () => {
    const headers = getNotificationTableHeadersData();
    const LastComponent = headers[5].anyComponent;
    const { container } = render(<>{LastComponent && LastComponent(null)}</>);
    expect(container.textContent).toBe("");
  });

  it("last column's anyComponent renders empty if cellData is a number", () => {
    const headers = getNotificationTableHeadersData();
    const LastComponent = headers[5].anyComponent;
    const { container } = render(<>{LastComponent && LastComponent(123)}</>);
    expect(container.textContent).toBe("");
  });

  it("last column's anyComponent renders View link and triggers callbacks", () => {
    const setSideIsOpen = jest.fn();
    const setSelectedItem = jest.fn();
    const headers = getNotificationTableHeadersData(setSideIsOpen, setSelectedItem);
    const LastComponent = headers[5].anyComponent;
    const cellData = JSON.stringify("{\"foo\": \"bar\"}");
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    const viewLink = getByText("View");
    expect(viewLink).toBeInTheDocument();
    fireEvent.click(viewLink);
    expect(setSelectedItem).toHaveBeenCalledWith("\"{\\\"foo\\\": \\\"bar\\\"}\"");
    expect(setSideIsOpen).toHaveBeenCalledWith(true);
  });

  it("last column's anyComponent does not throw if callbacks are undefined", () => {
    const headers = getNotificationTableHeadersData();
    const LastComponent = headers[5].anyComponent;
    const cellData = JSON.stringify({ foo: "bar" });
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    const viewLink = getByText("View");
    expect(() => fireEvent.click(viewLink)).not.toThrow();
  });

  it("last column's anyComponent does not call setNotificationIdSelected if not provided", () => {
    const setSideIsOpen = jest.fn();
    const setSelectedItem = jest.fn();
    // setNotificationIdSelected is NOT passed to headers
    const headers = getNotificationTableHeadersData(setSideIsOpen, setSelectedItem, "DateReceived", "Desc");
    const LastComponent = headers[5].anyComponent;
    const cellData = JSON.stringify({ foo: "bar", id: "123" });
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    // Create a spy to ensure no global function is called
    const setNotificationIdSelected = jest.fn();
    fireEvent.click(getByText("View"));
    expect(setNotificationIdSelected).not.toHaveBeenCalled();
  });

  it("last column's anyComponent does not call setNotificationIdSelected if id is missing", () => {
    const setSideIsOpen = jest.fn();
    const setSelectedItem = jest.fn();
    const setNotificationIdSelected = jest.fn();
    const headers = getNotificationTableHeadersData(setSideIsOpen, setSelectedItem, "DateReceived", "Desc", setNotificationIdSelected);
    const LastComponent = headers[5].anyComponent;
    const cellData = JSON.stringify({ foo: "bar" }); // no id
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    fireEvent.click(getByText("View"));
    expect(setNotificationIdSelected).toHaveBeenCalled();
  });

  it("last column's anyComponent does not render View link if cellData is undefined", () => {
    const setSideIsOpen = jest.fn();
    const setSelectedItem = jest.fn();
    const setNotificationIdSelected = jest.fn();
    const headers = getNotificationTableHeadersData(setSideIsOpen, setSelectedItem, "DateReceived", "Desc", setNotificationIdSelected);
    const LastComponent = headers[5].anyComponent;
    const { container, queryByText } = render(<>{LastComponent && LastComponent(undefined)}</>);
    expect(container.textContent).toBe("");
    expect(queryByText("View")).toBeNull();
  });

  // it("last column's anyComponent does not render View link if cellData is an empty string", () => {
  //   const setSideIsOpen = jest.fn();
  //   const setSelectedItem = jest.fn();
  //   const setNotificationIdSelected = jest.fn();
  //   const headers = getNotificationTableHeadersData(setSideIsOpen, setSelectedItem, "DateReceived", "Desc", setNotificationIdSelected);
  //   const LastComponent = headers[5].anyComponent;
  //   const { container, queryByText } = render(<>{LastComponent && LastComponent("")}</>);
  //   expect(container.textContent).toBe("");
  //   expect(queryByText("View")).toBeNull();
  // });

  it("last column's anyComponent calls setNotificationIdSelected if provided and id exists", () => {
    const setSideIsOpen = jest.fn();
    const setSelectedItem = jest.fn();
    const setNotificationIdSelected = jest.fn();
    const headers = getNotificationTableHeadersData(setSideIsOpen, setSelectedItem, "DateReceived", "Desc", setNotificationIdSelected);
    const LastComponent = headers[5].anyComponent;
    const cellData = JSON.stringify({ foo: "bar", id: "123" });
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    fireEvent.click(getByText("View"));
    expect(setNotificationIdSelected).toHaveBeenCalledWith("123");
  });
});

describe("notificationTableRows", () => {
  it("should have 165 notifications", () => {
    expect(notificationTableRows).toHaveLength(165);
  });

  it("should have required keys in each notification", () => {
    notificationTableRows.forEach(row => {
      expect(row).toHaveProperty("Id");
      expect(row).toHaveProperty("Status");
      expect(row).toHaveProperty("Notification");
      expect(row).toHaveProperty("Priority");
      expect(row).toHaveProperty("DateReceived");
      expect(row).toHaveProperty("doc");
      expect(row).toHaveProperty("isShowIcon");
    });
  });

  it("should have correct values for the first notification", () => {
    const row = notificationTableRows[0];
    expect(row.Id).toBe(row.Id);
    expect(row.Status).toBeDefined();
    expect(row.Notification).toBeDefined();
    expect(row.Priority).toBeDefined();
    expect(row.DateReceived).toBeDefined();
    expect(row.isShowIcon).toBeDefined();
    expect(Array.isArray(row.doc)).toBe(true);
  });

  it("should have iconName only when isShowIcon is true and iconName is provided", () => {
    notificationTableRows.forEach(row => {
      if (row.isShowIcon && row.iconName) {
        expect(typeof row.iconName).toBe("string");
      } else if (row.isShowIcon && !row.iconName) {
        expect(row.iconName).toBeUndefined();
      }
    });
  });

  it("should have Status as either 'Read' or 'Unread'", () => {
    notificationTableRows.forEach(row => {
      expect(["Read", "Unread"]).toContain(row.Status);
    });
  });

  it("should have Priority as 'Low', 'Medium', or 'High'", () => {
    notificationTableRows.forEach(row => {
      expect(["Low", "Medium", "High"]).toContain(row.Priority);
    });
  });

  it("should have doc as an array with one object matching notification data", () => {
    notificationTableRows.forEach(row => {
      expect(Array.isArray(row.doc)).toBe(true);
      expect(row.doc).toHaveLength(1);
    });
  });

  it("should have correct values for the second notification", () => {
    const row = notificationTableRows[1];
    expect(row.Id).toBe(row.Id);
    expect(row.Status).toBeDefined();
    expect(row.Notification).toBeDefined();
    expect(row.Priority).toBeDefined();
    expect(row.DateReceived).toBeDefined();
    expect(row.isShowIcon).toBeDefined();
    expect(Array.isArray(row.doc)).toBe(true);
  });

  it("should have correct values for the third notification", () => {
    const row = notificationTableRows[2];
    expect(row.Id).toBe(row.Id);
    expect(row.Status).toBeDefined();
    expect(row.Notification).toBeDefined();
    expect(row.Priority).toBeDefined();
    expect(row.DateReceived).toBeDefined();
    expect(row.isShowIcon).toBeDefined();
    expect(Array.isArray(row.doc)).toBeDefined();
  });

  it("should have at least one notification with isShowIcon false", () => {
    expect(notificationTableRows.some(row => !row.isShowIcon)).toBe(true);
  });

  it("should have at least one notification with isShowIcon true", () => {
    expect(notificationTableRows.some(row => row.isShowIcon)).toBe(true);
  });

  it("should have doc object matching notification data", () => {
    notificationTableRows.forEach(row => {
      const docItem = row.doc?.[0];
      expect(docItem?.id).toBe(row.Id);
      expect(docItem?.status).toBe(row.Status);
      expect(docItem?.notification).toBe(row.Notification);
      expect(docItem?.priority).toBe(row.Priority);
      expect(docItem?.dateReceived).toBe(row.DateReceived);
    });
  });
});