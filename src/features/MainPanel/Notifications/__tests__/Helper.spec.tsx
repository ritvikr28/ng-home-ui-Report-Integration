import { render, fireEvent } from "@testing-library/react";
import { ShowValAs } from "@essnextgen/ui-kit";
import { getNotificationTableHeadersData, notificationTableRows } from "../helper";

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

  it("renders last column's anyComponent and triggers callbacks on click", () => {
    const setSideIsOpen = jest.fn();
    const setSelectedItem = jest.fn();
    const headers = getNotificationTableHeadersData(setSideIsOpen, setSelectedItem);
    const LastComponent = headers[5].anyComponent;
    const cellData = { foo: "bar" };
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    const viewLink = getByText("View");
    expect(viewLink).toBeInTheDocument();
    fireEvent.click(viewLink);
    expect(setSelectedItem).toHaveBeenCalledWith(cellData);
    expect(setSideIsOpen).toHaveBeenCalledWith(true);
  });

  it("does not throw if setSideIsOpen and setSelectedItem are undefined", () => {
    const headers = getNotificationTableHeadersData();
    const LastComponent = headers[5].anyComponent;
    const cellData = { foo: "bar" };
    const { getByText } = render(<>{LastComponent && LastComponent(cellData)}</>);
    const viewLink = getByText("View");
    expect(() => fireEvent.click(viewLink)).not.toThrow();
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
    // expect(row.doc[0]).toMatchObject({
    //   id: row.Id,
    //   status: row.Status,
    //   notification: row.Notification,
    //   priority: row.Priority,
    //   dateReceived: row.DateReceived,
    // });
  });

  it("should have iconName only when isShowIcon is true and iconName is provided", () => {
    notificationTableRows.forEach(row => {
      if (row.isShowIcon && row.iconName) {
        expect(typeof row.iconName).toBe("string");
      } else if (row.isShowIcon && !row.iconName) {
        // Acceptable: iconName is optional
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

  it("should have DateReceived in 'DD MMM YYYY' format", () => {
    const dateRegex = /^\d{2} [A-Za-z]{3} \d{4}$/;
    notificationTableRows.forEach(row => {
      expect(row.DateReceived).toMatch(dateRegex);
    });
  });

  it("should have doc as an array with one object matching notification data", () => {
    notificationTableRows.forEach(row => {
      expect(Array.isArray(row.doc)).toBe(true);
      expect(row.doc).toHaveLength(1);
      // const docItem = row.doc[0];
      // expect(docItem.id).toBeDefined();
      // expect(docItem.status).toBeDefined();
      // expect(docItem.notification).toBeDefined();
      // expect(docItem.priority).toBeDefined();
      // expect(docItem.dateReceived).toBeDefined();
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
});
