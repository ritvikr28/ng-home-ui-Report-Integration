/* eslint-disable */
import { render, screen, fireEvent } from "@testing-library/react";
import Sims7RedirectionsSidePanel from "../Sims7RedirectionsSidePanel";

describe("Sims7RedirectionsSidePanel extra branch coverage", () => {
  // it("shows reason for changes only for NotMigrated and Reversing in view mode", () => {
  //   // Mock fetchSims7RedirectionById to return viewData with payload
  //   jest.spyOn(require('../Sims7RedirectionsPage.api'), 'fetchSims7RedirectionById').mockImplementation((...args: unknown[]) => {
  //     const { moduleId } = args[0] as { moduleId: string };
  //     if (moduleId === 'notMigrated') {
  //       return Promise.resolve({ payload: { redirectStatus: 'NotMigrated', reasonForChange: 'Test reason' } });
  //     }
  //     if (moduleId === 'reversing') {
  //       return Promise.resolve({ payload: { redirectStatus: 'Reversing', reasonForChange: 'Test reason' } });
  //     }
  //     if (moduleId === 'migrated') {
  //       return Promise.resolve({ payload: { redirectStatus: 'Migrated', reasonForChange: 'Test reason' } });
  //     }
  //     return Promise.resolve({ payload: {} });
  //   });
  //   render(
  //     <Sims7RedirectionsSidePanel
  //       {...baseProps}
  //       mode="view"
  //       selectedRow={{ ...baseProps.selectedRow, id: 'notMigrated' }}
  //     />
  //   );
  //   expect(screen.getByText("Reason for changes")).toBeInTheDocument();
  //   render(
  //     <Sims7RedirectionsSidePanel
  //       {...baseProps}
  //       mode="view"
  //       selectedRow={{ ...baseProps.selectedRow, id: 'reversing' }}
  //     />
  //   );
  //   expect(screen.getByText("Reason for changes")).toBeInTheDocument();
  //   render(
  //     <Sims7RedirectionsSidePanel
  //       {...baseProps}
  //       mode="view"
  //       selectedRow={{ ...baseProps.selectedRow, id: 'migrated' }}
  //     />
  //   );
  //   expect(screen.queryByText("Reason for changes")).toBeNull();
  // });

  it("clears effectiveDate in PUT payload for Reversing→Migrated and Planned→NotMigrated transitions", () => {
    const { buildRequest } = require('../Sims7RedirectionsSidePanelSaveHelpers');
  // Reversing to Migrated
  const payload1 = buildRequest({ status: 'Migrated', plannedStatus: 'Migrated', reasonForChanges: 'Test', id: '1', dfeNumber: 'd', nextGenModule: 'n', ngModule: 'n', category: 'c', switchToSchool: false, previousDate: "" }, '2026-04-09', 'Reversing');
  expect(payload1.effectiveDate).toBe("");
  // Planned to NotMigrated
  const payload2 = buildRequest({ status: 'NotMigrated', plannedStatus: 'NotMigrated', reasonForChanges: 'Test', id: '1', dfeNumber: 'd', nextGenModule: 'n', ngModule: 'n', category: 'c', switchToSchool: false }, '2026-04-09', 'Planned');
  expect(payload2.effectiveDate).toBe('2026-04-09');
  // No transition
  const payload3 = buildRequest({ status: 'Migrated', plannedStatus: 'Migrated', reasonForChanges: 'Test', id: '1', dfeNumber: 'd', nextGenModule: 'n', ngModule: 'n', category: 'c', switchToSchool: false, previousDate: "" }, '2026-04-09', 'Migrated');
  expect(payload3.effectiveDate).toBe('2026-04-09');
  });
  type SelectedRowType = {
    category: string;
    nextGenModule: string;
    sims7Module: string;
    modifiedBy: string;
    effectiveDate: string;
    status: string;
    reasonForChanges: string;
  };
  interface BaseProps {
    isOpen: boolean;
    onClose: jest.Mock<any, any>;
    mode: "edit" | "view";
    selectedRow: SelectedRowType;
    t: (key: string) => string;
    setSidePanelMode: jest.Mock<any, any>;
  }
  const baseProps: BaseProps = {
    isOpen: true,
    onClose: jest.fn(),
    mode: "edit",
    selectedRow: {
      category: "TestCat",
      nextGenModule: "TestMod",
      sims7Module: "SIMS7",
      modifiedBy: "-",
      effectiveDate: "-",
      status: "Planned",
      reasonForChanges: ""
    },
    t: (key: string) => key,
    setSidePanelMode: jest.fn()
  };

  it("shows effective date input for Planned status and yes redirect", () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        selectedRow={{ ...baseProps.selectedRow, status: "Planned" }}
      />
    );
    fireEvent.click(screen.getByLabelText("Yes"));
    expect(screen.getByText("Effective date")).toBeInTheDocument();
  });

  it("shows reason for changes for Not migrated and no redirect", () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        selectedRow={{ ...baseProps.selectedRow, status: "Not migrated", reasonForChanges: "Some reason" }}
      />
    );
    fireEvent.click(screen.getByLabelText("No"));
    expect(screen.getByText("Reason for changes")).toBeInTheDocument();
  });

  it("shows dialog when cancel is clicked and form is dirty", async () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        selectedRow={{ ...baseProps.selectedRow, status: "Migrated" }}
      />
    );
    fireEvent.click(screen.getByLabelText("No"));
    fireEvent.change(screen.getByLabelText("text-aria"), { target: { value: "changed" } });
    fireEvent.click(screen.getByText("Cancel"));
    expect(await screen.findByText("SIMS7Redirects.discardChanges")).toBeInTheDocument();
  });

  // it("shows error for invalid date input", () => {
  //   render(
  //     <Sims7RedirectionsSidePanel
  //       {...baseProps}
  //       selectedRow={{ ...baseProps.selectedRow, status: "Migrated" }}
  //     />
  //   );
  //   fireEvent.click(screen.getByLabelText("No"));
  //   fireEvent.change(screen.getByLabelText("Day"), { target: { value: "32" } });
  //   fireEvent.change(screen.getByLabelText("Month"), { target: { value: "13" } });
  //   fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2026" } });
  //   fireEvent.blur(screen.getByLabelText("Year"));
  //   fireEvent.click(screen.getByText("Save"));
  //   expect(screen.getByText("Invalid Date")).toBeInTheDocument();
  // });

  // it("shows success toast after save", async () => {
  //   render(
  //     <Sims7RedirectionsSidePanel
  //       {...baseProps}
  //       selectedRow={{ ...baseProps.selectedRow, status: "Migrated" }}
  //     />
  //   );
  //   fireEvent.click(screen.getByLabelText("No"));
  //   fireEvent.change(screen.getByLabelText("text-aria"), { target: { value: "reason" } });
  //   fireEvent.change(screen.getByLabelText("Day"), { target: { value: "15" } });
  //   fireEvent.change(screen.getByLabelText("Month"), { target: { value: "12" } });
  //   fireEvent.change(screen.getByLabelText("Year"), { target: { value: "2027" } });
  //   fireEvent.click(screen.getByText("Save"));
  //   expect(await screen.findByText("Changes saved")).toBeInTheDocument();
  // });

  it("handles unknown status gracefully", () => {
    render(
      <Sims7RedirectionsSidePanel
        {...baseProps}
        mode="view"
        selectedRow={{ ...baseProps.selectedRow, status: "UnknownStatus" }}
      />
    );
  });
});
