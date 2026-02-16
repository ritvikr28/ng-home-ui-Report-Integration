import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterDialog, { FilterDialogProps } from "../Filter";

/* =========================
   MOCK UI KIT
========================= */
jest.mock("@essnextgen/ui-kit", () => ({
  Dialog: ({ children, ...props }: any) => (
    <div data-testid="dialog" {...props}>
      {children}
    </div>
  ),
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
  Notification: ({ title, message }: any) => (
    <div data-testid="notification">
      {title} - {message}
    </div>
  ),
  Loader: () => <div data-testid="loader" />,
  LoaderType: { Circular: "Circular" },
  ButtonColor: { Primary: "Primary", Secondary: "Secondary" },
  ButtonSize: { Small: "Small" },
  NotificationStatus: { WARNING: "WARNING" }
}));

/* =========================
   MOCK TRANSLATION
========================= */
jest.mock("@essnextgen/ui-intl-kit", () => ({
  useTranslation: () => ({
    t: (key: string) => key
  })
}));

/* =========================
   MOCK ALL UTILS
========================= */
jest.mock("../FilterDialog.utils", () => ({
  fetchSchoolData: jest.fn(),
  clearAll: jest.fn(),
  handleDialogClose: jest.fn(),
  handleRemoveTag: jest.fn(),
  getValidationLevelMsg: jest.fn(() => null),
  getValidationTextMsg: jest.fn(() => ""),
  shouldShowWarningNotification: jest.fn(() => true),
  resetDateState: jest.fn(),
  handleDateChange: jest.fn(),
  handleApplyWrapper: jest.fn(),
  onSelectMultipleCategories: jest.fn(),
  getEntityLabel: jest.fn()
}));

jest.mock("@essnextgen/ui-kit", () => ({
  Dialog: ({ children, ...props }: any) => (
    <div data-testid="dialog" {...props}>
      {children}
    </div>
  ),

  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),

  Notification: ({ title, message }: any) => (
    <div data-testid="notification">
      {title} - {message}
    </div>
  ),

  Loader: () => <div data-testid="loader" />,

  LoaderType: {
    Circular: "Circular"
  },

  ButtonColor: {
    Primary: "Primary",
    Secondary: "Secondary"
  },

  ButtonSize: {
    Small: "Small"
  },

  NotificationStatus: {
    WARNING: "WARNING",
    SUCCESS: "SUCCESS",
    ERROR: "ERROR"
  },

  isEmpty: jest.fn(() => false)
}));


jest.mock("../../../../features/DocumentManagementServer/logic/DocumentManagementServer.utils", () => ({
  addUniqueTagItem: jest.fn(),
  getValidationState: jest.fn(() => ({
    validationText: "",
    validationTextLevel: null
  })),
  getAllRegistrationIds: jest.fn(() => ["1"]),
  filterNonEmptySuggestions: jest.fn(() => [])
}));

jest.mock("../../../../features/DocumentManagementServer/logic/DocumentManagementServer.handler", () => ({
  handleSearchChange: jest.fn()
}));

/* =========================
   MOCK CUSTOM HOOKS
========================= */
jest.mock("../hook/useFilterDialogLogic", () => ({
  useFetchSchoolEffect: jest.fn(),
  useSyncDialogStateEffect: jest.fn(),
  useSyncSelectedKeyEffect: jest.fn(),
  useFetchCategoriesEffect: jest.fn(),
  useResetCategoryErrorEffect: jest.fn(),
  useDateSyncEffect: jest.fn(),
  useDropdownSyncEffect: jest.fn(),
  useResetOnCloseEffect: jest.fn(),
  useEscapeKeyEffect: jest.fn(),
  useSearchEffect: jest.fn(),
  useBuildRefIdsEffect: jest.fn()
}));

/* =========================
   MOCK CHILD COMPONENTS
========================= */
jest.mock("../components/FilterRelatedToDropdown", () => ({
  FilterRelatedToDropdown: () => (
    <div data-testid="related-to-dropdown" />
  )
}));

jest.mock("../components/FilterCategoryDropdown", () => ({
  FilterCategoryDropdown: () => (
    <div data-testid="category-dropdown" />
  )
}));

jest.mock("../components/FilterDateSection", () => ({
  FilterDateSection: () => (
    <div data-testid="date-section" />
  )
}));

jest.mock("../components/FilterSearch", () => ({
  SearchSection: () => (
    <div data-testid="search-section" />
  )
}));

jest.mock("@essnextgen/auth-ui", () => ({
  Permission: jest.fn(),
  authService: {
    init: jest.fn(),
    getToken: jest.fn(() => "mock-token"),
    login: jest.fn(),
    logout: jest.fn()
  }
}));


jest.mock("jwt-decode", () => jest.fn(() => ({})));

jest.mock("@essnextgen/ui-kit", () => ({
  isEmpty: jest.fn(() => false)
}));

/* =========================
   BASE PROPS
========================= */
const baseProps: FilterDialogProps = {
  title: "Test Title",
  isOpen: true,
  onClose: jest.fn(),
  setSelectedCategories: jest.fn(),
  selectedCategories: [],
  handleApply: jest.fn(),
  isFilterDialogOpen: true,
  setIsDateError: jest.fn(),
  isDateError: false,
  setSelectedDateRange: jest.fn(),
  selectedDateRange: { fromDate: "", toDate: "" },
  setDocumentRelatedTo: jest.fn(),
  selectedRelatedTo: undefined,
  setSelectedRelatedTo: jest.fn(),
  tagListArray: [],
  setTagListArray: jest.fn(),
  setIsSearchTriggered: jest.fn()
};

/* =========================================================
   TESTS
========================================================= */

describe("FilterDialog", () => {
  it("renders dialog", () => {
    render(<FilterDialog {...baseProps} />);
    expect(screen.getByTestId("dialog")).toBeInTheDocument();
  });

  it("renders loader when isLoading true", () => {
    render(<FilterDialog {...baseProps} isLoading />);
    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders notification when warning condition true", () => {
    render(<FilterDialog {...baseProps} />);
    expect(screen.getByTestId("notification")).toBeInTheDocument();
  });

  it("renders related to dropdown", () => {
    render(<FilterDialog {...baseProps} />);
    expect(screen.getByTestId("related-to-dropdown")).toBeInTheDocument();
  });

  it("renders category dropdown when refId exists", () => {
    render(<FilterDialog {...baseProps} />);
    expect(screen.getByTestId("category-dropdown")).toBeInTheDocument();
  });

  it("renders date section", () => {
    render(<FilterDialog {...baseProps} />);
    expect(screen.getByTestId("date-section")).toBeInTheDocument();
  });

  it("click clear button triggers clearAll", () => {
    const { clearAll } = require("../FilterDialog.utils");
    render(<FilterDialog {...baseProps} />);
    fireEvent.click(screen.getByText("Filter.clearFilters"));
    expect(clearAll).toHaveBeenCalled();
  });

  it("click apply button triggers handleApplyWrapper", () => {
    const { handleApplyWrapper } = require("../FilterDialog.utils");
    render(<FilterDialog {...baseProps} />);
    fireEvent.click(screen.getByText("Filter.applyFilters"));
    expect(handleApplyWrapper).toHaveBeenCalled();
  });

  it("calls handleDialogClose on dialog close", () => {
    const { handleDialogClose } = require("../FilterDialog.utils");
    render(<FilterDialog {...baseProps} />);
    fireEvent.click(screen.getByTestId("dialog"));
    expect(handleDialogClose).toHaveBeenCalled();
  });

  it("does not render notification when condition false", () => {
    const { shouldShowWarningNotification } = require("../FilterDialog.utils");
    shouldShowWarningNotification.mockReturnValue(false);

    render(<FilterDialog {...baseProps} />);
    expect(screen.queryByTestId("notification")).not.toBeInTheDocument();
  });
});
