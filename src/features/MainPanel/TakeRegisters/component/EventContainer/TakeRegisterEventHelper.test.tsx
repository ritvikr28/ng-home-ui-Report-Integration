import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import * as helper from "./TakeRegisterEventHelper";
import { IRegistersDetails } from "../../../../../shared/model/RegisterDomain/responsemodels";


jest.mock("react-multi-carousel", () => ({
  
    __esModule: true,
    default: React.forwardRef((props: any, ref: any) => {
      const localRef = ref
      if (localRef && typeof localRef === "object") {
        localRef.current = localRef.current || {
          next: jest.fn(),
          previous: jest.fn(),
          goToSlide: jest.fn()
        };
      }
      return <div data-testid="carousel">{props.children}</div>;
    })

}));

jest.mock("@essnextgen/ui-kit", () => ({
  __esModule: true,
  // Render a simple button-like component that exposes texts and click
  ActionCard: ({ dataTestId, primaryText, secondaryText, tagText, onClickActionCard }: any) => (
    <button type="button" data-testid={dataTestId} onClick={onClickActionCard}>
      <span>{primaryText}</span>
      {secondaryText && <span>{secondaryText}</span>}
      {tagText && <span>{tagText}</span>}
    </button>
  ),
  TagColor: { Success: "success", Outstanding: "outstanding" }
}));

jest.mock("../../../../../shared/utils", () => ({
  __esModule: true,
  envConfig: { REGISTER_BASE_URL: "https://base" },
  getUser: () => "user-123",
  getUserOrganisation: () => "org-456"
}));

const pushEventMock = jest.fn();
jest.mock("../../../../../shared/utils/analytics", () => ({
  __esModule: true,
  default: { pushEvent: (...args: any[]) => pushEventMock(...args) }
}));

const loggerInfoMock = jest.fn();
jest.mock("../../../../../shared/components/AppInsights", () => ({
  __esModule: true,
  logger: { info: (...args: any[]) => loggerInfoMock(...args) }
}));

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

  describe("setDefaultAndCurrentSlide", () => {
    it("sets last slide when index < 0", () => {
      const spy = jest.spyOn(helper, "findCurrentIndex").mockReturnValue(-1);
      const ref: any = { current: { goToSlide: jest.fn() } };
      const setCurrentSlide = jest.fn();
      const data = new Array(5).fill(null) as unknown as IRegistersDetails[];
      helper.setDefaultAndCurrentSlide(ref, data, setCurrentSlide);
      expect(ref.current.goToSlide).toHaveBeenCalledWith(5);
      expect(setCurrentSlide).toHaveBeenCalledWith(4);
      spy.mockRestore();
    });

    it("sets to last when in last few slides", () => {
      const spy = jest.spyOn(helper, "findCurrentIndex").mockReturnValue(3); // len 5 -> last few
      const ref: any = { current: { goToSlide: jest.fn() } };
      const setCurrentSlide = jest.fn();
      const data = new Array(5).fill(null) as unknown as IRegistersDetails[];
      helper.setDefaultAndCurrentSlide(ref, data, setCurrentSlide);
      expect(ref.current.goToSlide).toHaveBeenCalledWith(3);
      expect(setCurrentSlide).toHaveBeenCalledWith(4);
      spy.mockRestore();
    });

    it("sets to found index otherwise", () => {
      const spy = jest.spyOn(helper, "findCurrentIndex").mockReturnValue(1);
      const ref: any = { current: { goToSlide: jest.fn() } };
      const setCurrentSlide = jest.fn();
      const data = new Array(5).fill(null) as unknown as IRegistersDetails[];
      helper.setDefaultAndCurrentSlide(ref, data, setCurrentSlide);
      expect(ref.current.goToSlide).toHaveBeenCalledWith(1);
      expect(setCurrentSlide).toHaveBeenCalledWith(1);
      spy.mockRestore();
    });
  });

  describe("navigation helpers", () => {
    it("nextSlide advances and updates state via moveRight", () => {
      jest.spyOn(helper, "getSlidesToShow").mockReturnValue(2);
      const ref: any = { current: { next: jest.fn() } };
      const data = new Array(5).fill(null) as unknown as IRegistersDetails[];
      let current = 1;
      const setCurrent = (updater: any) => { current = updater(current); };
      helper.nextSlide(ref, data, setCurrent as any);
      expect(ref.current.next).toHaveBeenCalled();
      expect(current).toBe(3);
      jest.restoreAllMocks();
    });

    it("previousSlide goes back when currentSlide > 0 and updates state", () => {
      jest.spyOn(helper, "getSlidesToShow").mockReturnValue(2);
      const ref: any = { current: { previous: jest.fn() } };
      let current = 3;
      const setCurrent = (updater: any) => { current = updater(current); };
      helper.previousSlide(ref, current, setCurrent as any);
      expect(ref.current.previous).toHaveBeenCalled();
      expect(current).toBe(1);
      jest.restoreAllMocks();
    });

    it("previousSlide does nothing when currentSlide is 0", () => {
      const ref: any = { current: { previous: jest.fn() } };
      const setCurrent = jest.fn();
      helper.previousSlide(ref, 0, setCurrent);
      expect(ref.current.previous).not.toHaveBeenCalled();
      expect(setCurrent).not.toHaveBeenCalled();
    });
  });

  describe("isButtonDisabled and getSlidesToShow", () => {
    it("disables previous at start and next at end based on slidesToShow", () => {
      const data = new Array(5).fill(null) as unknown as IRegistersDetails[];
      jest.spyOn(helper, "getSlidesToShow").mockReturnValue(2);
      expect(helper.isButtonDisabled("previous", data, 0)).toBe(true);
      expect(helper.isButtonDisabled("next", data, 3)).toBe(true); // 3+2 >= 5
      expect(helper.isButtonDisabled("next", data, 2)).toBe(false); // 2+2 < 5
      jest.restoreAllMocks();
    });

    it("getSlidesToShow returns 1/2/3 across breakpoints", () => {
      Object.defineProperty(window, "innerWidth", { value: 500, writable: true });
      expect(helper.getSlidesToShow()).toBe(1);
      Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
      expect(helper.getSlidesToShow()).toBe(2);
      Object.defineProperty(window, "innerWidth", { value: 1600, writable: true });
      expect(helper.getSlidesToShow()).toBe(3);
    });
  });

  describe("renderCarousel", () => {
    it("renders items, tags and handles click", () => {
      const items = [
        { eventDescription: "AM", group: { shortName: "7A" }, room: { roomName: "R1" }, isCompleted: true } as unknown as IRegistersDetails,
        { eventDescription: "PM", group: { shortName: "7B" }, room: { roomName: "R2" }, isCompleted: false } as unknown as IRegistersDetails
      ];
      const t = (k: string) => k;
      const ref: any = { current: { goToSlide: jest.fn(), next: jest.fn(), previous: jest.fn() } };
      const onClick = jest.fn();
      const el = helper.renderCarousel(items, false, ref, {} as any, onClick, t);
      render(el);

      // Two action cards + one no-more card
      expect(screen.getByText("takeregister.completed")).toBeInTheDocument();
      expect(screen.getByText("takeregister.ready")).toBeInTheDocument();
      expect(screen.getByText("takeregister.nomoreregister")).toBeInTheDocument();

      // Click first item
      fireEvent.click(screen.getByTestId("test-id0"));
      expect(onClick).toHaveBeenCalledWith(items[0]);

      // Primary/secondary text rendered
      expect(screen.getByText("7A | R1")).toBeInTheDocument();
      expect(screen.getByText("AM")).toBeInTheDocument();
    });
  });

  describe("handleRegisterClick", () => {
    it("logs, pushes analytics and builds correct url", () => {
      const item = {
        eventTypeCode: "AttendanceSession",
        eventDescription: "Maths",
        group: { externalId: "G1" },
        eventInstanceExternalId: "E1"
      } as unknown as IRegistersDetails;

      helper.handleRegisterClick(item);

      const expectedUrl = "https://base/take-register/Maths/G1/E1";
      expect(loggerInfoMock).toHaveBeenCalled();
      const logArg = (loggerInfoMock.mock.calls[0] || [""])[0] as string;
      expect(logArg).toContain(expectedUrl);
      expect(logArg).toContain("org-456");
      expect(logArg).toContain("user-123");

      expect(pushEventMock).toHaveBeenCalledWith(expect.objectContaining({ linkUrl: expectedUrl }));
    });
  });
});
