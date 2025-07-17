
import {
  getClassNameToHandleOverFlowPostion
} from "../SystemStatusAlerts/SystemStatusAlerts.view";


// --- 1. Unit test for overflow class helper ---
describe("getClassNameToHandleOverFlowPostion", () => {
  it("returns top class when index is last", () => {
    expect(getClassNameToHandleOverFlowPostion(2, 3)).toBe("template-menu-popover overflow-menu-top");
  });

  it("returns default class when index is not last", () => {
    expect(getClassNameToHandleOverFlowPostion(1, 3)).toBe("template-menu-popover");
  });
});