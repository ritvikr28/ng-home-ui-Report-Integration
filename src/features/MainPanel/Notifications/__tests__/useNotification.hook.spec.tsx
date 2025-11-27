import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
import { useNotification } from "../useNotification";

function buildNotifications() {
  return [
  { id: "alpha-id", Status: "Unread", Notification: "Alpha notice", Priority: "High", DateReceived: "01 Jan 2024" },
  { Id: "beta-id", Status: "Read", Notification: "Beta notice", Priority: "Low", DateReceived: "02 Jan 2024" },
  { Id: "gamma-id", Status: "Unread", Notification: "Gamma notice", Priority: "Medium", DateReceived: "03 Jan 2024" }
  ];
}

const deterministicNotifications = buildNotifications();

const notificationIds = deterministicNotifications.map((item) => item.id ?? item.Id);

jest.mock("../helper", () => ({
  notificationTableRows: buildNotifications()
}));

describe("useNotification hook", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it("initializes state and clamps pagination", () => {
    const { result } = renderHook(() => useNotification());
    expect(result.current.currentPage).toBe(1);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.totalNotifications).toBe(deterministicNotifications.length);
    expect(result.current.paginatedNotifications).toHaveLength(deterministicNotifications.length);
    expect(result.current.filterBtnClicked).toBe(false);
    act(() => {
      result.current.setFilterBtnClicked(true);
    });
    expect(result.current.filterBtnClicked).toBe(true);
    act(() => {
      result.current.handlePageChange(null, 5);
    });
    expect(result.current.currentPage).toBe(1);
  });

  it("handles list checkbox toggling and auto clear", () => {
    const { result } = renderHook(() => useNotification());
    act(() => {
      result.current.handleListCheckboxChange(0, "");
    });
    expect(result.current.selectedNotificationIds).toEqual([]);
    act(() => {
      result.current.handleListCheckboxChange(0, notificationIds[0]);
    });
    expect(result.current.selectedNotificationIds).toEqual([notificationIds[0]]);
    expect(result.current.isClearSelectedCheckbox).toBe(false);
    act(() => {
      result.current.handleListCheckboxChange(0, notificationIds[0]);
    });
    expect(result.current.selectedNotificationIds).toEqual([]);
    expect(result.current.isClearSelectedCheckbox).toBe(true);
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(false);
  });

  it("handles select all scenarios", () => {
    const { result } = renderHook(() => useNotification());
    act(() => {
      result.current.handleListCheckboxChange(0, notificationIds[0]);
    });
    act(() => {
      result.current.handleSelectAllChange(null, []);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(true);
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(false);
    act(() => {
      result.current.handleSelectAllChange({ target: { checked: true } } as any, notificationIds.slice(0, 2));
    });
    expect([...result.current.selectedNotificationIds].sort()).toEqual([...notificationIds.slice(0, 2)].sort());
    act(() => {
      result.current.handleSelectAllChange({ target: { checked: false } } as any, [notificationIds[0]]);
    });
    expect(result.current.selectedNotificationIds).toEqual([notificationIds[1]]);
  });

  it("sets selected ids directly and validates input", () => {
    const { result } = renderHook(() => useNotification());
    act(() => {
      result.current.handleSelectedCheckboxIds("invalid" as any);
    });
    expect(result.current.selectedNotificationIds).toEqual([]);
    act(() => {
      result.current.handleSelectedCheckboxIds(notificationIds);
    });
    expect([...result.current.selectedNotificationIds].sort()).toEqual([...notificationIds].sort());
    expect(result.current.isClearSelectedCheckbox).toBe(false);
    act(() => {
      result.current.handleSelectedCheckboxIds([]);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(true);
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current.isClearSelectedCheckbox).toBe(false);
  });
});

