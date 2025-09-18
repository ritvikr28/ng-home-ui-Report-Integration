import React from "react";
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

  it("getPrimaryText returns full text for non-medium screen", () => {
    const item = {
      group: { shortName: "Group" },
      room: { roomName: "Room" }
    } as unknown as IRegistersDetails;
    const text = helper.getPrimaryText(item, false);
    expect(text).toBe("Group  | Room");
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
});
