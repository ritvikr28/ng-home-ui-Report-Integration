import { render, screen } from "@testing-library/react";
import * as helper from "./TakeRegisterEventHelper";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";

describe("TakeRegisterEventHelper", () => {
  it("renderNoRegisterMessage renders correct message", () => {
    const t = (key: string) => key;
    render(helper.renderNoRegisterMessage(t));
    expect(screen.getByText("takeregister.noregistertoday")).toBeInTheDocument();
  });

  it("generateRegisterUrl returns correct url for AttendanceSession", () => {
    const item = {
      eventTypeCode: "AttendanceSession",
      eventDescription: "desc",
      group: { externalId: "gid" },
      eventInstanceExternalId: "eid"
    } as unknown as IRegistersDetails;
    const url = helper.generateRegisterUrl(item);
    expect(url).toContain("/take-register/desc/gid/eid");
  });

  it("generateRegisterUrl returns correct url for other eventTypeCode", () => {
    const item = {
      eventTypeCode: "Other",
      classPeriodExternalId: "cpid",
      group: { externalId: "gid" },
      eventInstanceExternalId: "eid"
    } as unknown as IRegistersDetails;
    const url = helper.generateRegisterUrl(item);
    expect(url).toContain("/take-register/cpid/gid/eid");
  });

  it("getPrimaryText returns truncated text for medium screen", () => {
    const item = {
      group: { shortName: "VeryLongGroupName" },
      room: { roomName: "RoomName" }
    } as unknown as IRegistersDetails;
    const text = helper.getPrimaryText(item, true);
    expect(text.endsWith("..."))
      .toBe(true);
  });

  it("getPrimaryText returns group and room name for non-medium screen", () => {
    const item = {
      group: { shortName: "7E/Gg" },
      room: { roomName: "Humanities Room 4" }
    } as unknown as IRegistersDetails;
    const text = helper.getPrimaryText(item, false);
    expect(text).toBe("7E/Gg | Humanities Room 4");
  });

  it("getPrimaryText returns only group name when room is null", () => {
    const item = {
      group: { shortName: "7C/Ggb" },
      room: null
    } as unknown as IRegistersDetails;
    const text = helper.getPrimaryText(item, false);
    expect(text).toBe("7C/Ggb");
  });

  it("getSecondaryText returns eventDescription with time format", () => {
    const item = {
      eventDescription: "2Tue:7",
      eventStart: "2025-10-07T11:45:00",
      eventEnd: "2025-10-07T12:15:00"
    } as unknown as IRegistersDetails;
    const text = helper.getSecondaryText(item);
    expect(text).toBe("2Tue:7 | 11:45 - 12:15");
  });

  it("getSecondaryText returns only eventDescription when time data is missing", () => {
    const item = {
      eventDescription: "AM",
      eventStart: "",
      eventEnd: ""
    } as unknown as IRegistersDetails;
    const text = helper.getSecondaryText(item);
    expect(text).toBe("AM");
  });

  it("isButtonDisabled returns true if no data", () => {
    expect(helper.isButtonDisabled("next", null, 0)).toBe(true);
    expect(helper.isButtonDisabled("previous", null, 0)).toBe(true);
  });

  it("calculateNextSlide and calculatePreviousSlide work as expected", () => {
    // Mock getSlidesToShow
    jest.spyOn(helper, "getSlidesToShow").mockReturnValue(2);
    expect(helper.calculateNextSlide(1, 5)).toBe(3);
    expect(helper.calculatePreviousSlide(3)).toBe(1);
    jest.restoreAllMocks();
  });

  it("findCurrentIndex returns correct index for upcoming event", () => {
    const now = new Date();
    const future = new Date(now.getTime() + 100000).toISOString();
    const arr = [{ eventStart: future, eventEnd: future }] as unknown as IRegistersDetails[];
    expect(helper.findCurrentIndex(arr)).toBe(0);
  });

  describe("filterAndSortRegisterData", () => {
    it("filters out items with missing eventDescription", () => {
      const data = [
        { eventDescription: "AM", eventStart: "2024-01-01T09:00:00Z", eventEnd: "2024-01-01T10:00:00Z" },
        { eventDescription: "", eventStart: "2024-01-01T11:00:00Z", eventEnd: "2024-01-01T12:00:00Z" },
        { eventDescription: "PM", eventStart: "2024-01-01T13:00:00Z", eventEnd: "2024-01-01T14:00:00Z" }
      ] as unknown as IRegistersDetails[];
      
      const result = helper.filterAndSortRegisterData(data);
      expect(result).toHaveLength(2);
      expect(result[0].eventDescription).toBe("AM");
      expect(result[1].eventDescription).toBe("PM");
    });

    it("filters out items with missing eventStart or eventEnd", () => {
      const data = [
        { eventDescription: "AM", eventStart: "2024-01-01T09:00:00Z", eventEnd: "" },
        { eventDescription: "PM", eventStart: "", eventEnd: "2024-01-01T14:00:00Z" },
        { eventDescription: "1Fri:9", eventStart: "2024-01-01T08:00:00Z", eventEnd: "2024-01-01T09:00:00Z" }
      ] as unknown as IRegistersDetails[];
      
      const result = helper.filterAndSortRegisterData(data);
      expect(result).toHaveLength(1);
      expect(result[0].eventDescription).toBe("1Fri:9");
    });

    it("sorts items by startDate in ascending order", () => {
      const data = [
        { eventDescription: "PM", eventStart: "2024-01-01T13:00:00Z", eventEnd: "2024-01-01T14:00:00Z" },
        { eventDescription: "AM", eventStart: "2024-01-01T09:00:00Z", eventEnd: "2024-01-01T10:00:00Z" },
        { eventDescription: "1Fri:9", eventStart: "2024-01-01T08:00:00Z", eventEnd: "2024-01-01T09:00:00Z" }
      ] as unknown as IRegistersDetails[];
      
      const result = helper.filterAndSortRegisterData(data);
      expect(result).toHaveLength(3);
      expect(result[0].eventDescription).toBe("1Fri:9");
      expect(result[1].eventDescription).toBe("AM");
      expect(result[2].eventDescription).toBe("PM");
    });

    it("returns empty array for invalid input", () => {
      expect(helper.filterAndSortRegisterData(null as any)).toEqual([]);
      expect(helper.filterAndSortRegisterData(undefined as any)).toEqual([]);
      expect(helper.filterAndSortRegisterData([])).toEqual([]);
    });
  });
});
