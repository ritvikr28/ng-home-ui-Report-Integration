import React from "react";
import { render } from "@testing-library/react";
import { ValidationTextLevel } from "@essnextgen/ui-kit";
import { SearchSection } from "../components/FilterSearch";

// Mock the Search component to expose props for assertions
jest.mock("@essnextgen/ui-kit", () => {
  const original: any = jest.requireActual("@essnextgen/ui-kit");
  return {
    ...original,
    Search: React.forwardRef((props: any, ref) => {
      const handleRef = (node: any) => {
        if (node) {
          Object.defineProperty(node, "propsRef", {
            value: props,
            writable: true,
            configurable: true,
          });
          if (typeof ref === "function") {
            ref(node);
          } else if (ref && typeof ref === "object") {
            Object.assign(ref, { current: node });
          }
        }
      };
      return (
        <div
          data-testid={props.dataTestId}
          ref={handleRef}
        >
          {props.titleText}
          <input placeholder={props.placeholderText} />
          <div>{props.headingText}</div>
        </div>
      );
    })
  };
});
describe("SearchSection", () => {
  const baseProps: any = {
    visible: true,
    dataTestId: "filter",
    searchTerm: "Alfie",
    setSearchTerm: jest.fn(),
    suggestions: [{ text: "Alfie", value: "Alfie" }],
    isSearchLoading: false,
    validationText: "Validation error",
    validationTextLevel: ValidationTextLevel.Warning,
    tagList: [],
    onItemClick: jest.fn(),
    onChange: jest.fn(),
    onRemoveTag: jest.fn(),
    title: "Title",
    placeholder: "Placeholder",
    selectedDisplayKey: "Pupil",
    t: (key: string, opts?: any) => (opts ? `${key}:${opts.entity || opts.entityListLimitReached}` : key),
    isDropdownOpen: true,
    localTagListArray: [],
    setTagListArray: jest.fn(),
    setReferenceExternalIds: jest.fn(),
    setAlreadyExistingTags: jest.fn(),
    searchKey: 1,
    getEntityLabel: (key: string) => key,
    filteredSuggestions: [{ text: "Alfie", value: "Alfie" }],
    showSearchError: false,
    selectedCategories: [],
    selectedDateRange: { fromDate: "", toDate: "" },
    setSuggestions: jest.fn(),
    handleSearchChange: jest.fn(),
    getAllRegistrationIds: jest.fn(),
    setShowSearchError: jest.fn(),
    setIsSearchLoading: jest.fn()
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders null for non-Pupil/Staff selectedDisplayKey", () => {
    const { container }: { container: HTMLElement } = render(
      <SearchSection {...baseProps} selectedDisplayKey="Organisation" />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders for Pupil and passes correct props to Search", () => {
    const { getByTestId, getByPlaceholderText, getByText }: { getByTestId: any; getByPlaceholderText: any; getByText: any } = render(
      <SearchSection {...baseProps} selectedDisplayKey="Pupil" />
    );
    expect(getByTestId("filter-search")).toBeInTheDocument();
    expect(getByPlaceholderText("Filter.pupilName")).toBeInTheDocument();
    expect(getByText("Filter.Pupil")).toBeInTheDocument();
    expect(getByText("Filter.selectEntity Pupil")).toBeInTheDocument();
  });

  it("renders for Staff and passes correct props to Search", () => {
    const { getByTestId, getByPlaceholderText, getByText }: { getByTestId: any; getByPlaceholderText: any; getByText: any } = render(
      <SearchSection {...baseProps} selectedDisplayKey="Staff" />
    );
    expect(getByTestId("filter-search")).toBeInTheDocument();
    expect(getByPlaceholderText("Filter.staffName")).toBeInTheDocument();
    expect(getByText("Filter.Staff")).toBeInTheDocument();
    expect(getByText("Filter.selectEntity Staff")).toBeInTheDocument();
  });

  it("calls setSearchTerm on close handle", () => {
    const setSearchTerm: jest.Mock = jest.fn();
    render(<SearchSection {...baseProps} setSearchTerm={setSearchTerm} />);
    const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
    const props: any = (el as any).propsRef;
    props.onCloseHandle();
    expect(setSearchTerm).toHaveBeenCalledWith("");
  });

  it("calls onItemClick when suggestion is clicked", () => {
    const onItemClick: jest.Mock = jest.fn();
    render(<SearchSection {...baseProps} onItemClick={onItemClick} />);
    const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
    const props: any = (el as any).propsRef;
    props.onItemClick({ text: "Alfie", value: "Alfie" });
    expect(onItemClick).toHaveBeenCalledWith({ text: "Alfie", value: "Alfie" });
  });

  it("calls handleSearchChange on input change", () => {
    const handleSearchChange: jest.Mock = jest.fn();
    render(<SearchSection {...baseProps} handleSearchChange={handleSearchChange} />);
    const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
    const props: any = (el as any).propsRef;
    props.onChange({ target: { value: "Jane" } });
    expect(handleSearchChange).toHaveBeenCalled();
  });

  it("calls setSuggestions on focus", () => {
    const setSuggestions: jest.Mock = jest.fn();
    render(<SearchSection {...baseProps} setSuggestions={setSuggestions} />);
    const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
    const props: any = (el as any).propsRef;
    props.onFocus();
    expect(setSuggestions).toHaveBeenCalled();
  });

  it("calls onRemoveTag", () => {
    const onRemoveTag: jest.Mock = jest.fn();
    render(<SearchSection {...baseProps} onRemoveTag={onRemoveTag} />);
    const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
    const props: any = (el as any).propsRef;
    props.onRemoveTag({}, "Alfie", { text: "Alfie", value: "Alfie" });
    expect(onRemoveTag).toHaveBeenCalled();
  });

  it("passes validationText and validationTextLevel", () => {
    render(
      <SearchSection
        {...baseProps}
        validationText="Validation error"
        validationTextLevel={ValidationTextLevel.Warning}
      />
    );
    const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
    const props: any = (el as any).propsRef;
    expect(props.validationText).toBe("Validation error");
    expect(props.validationTextLevel).toBe(ValidationTextLevel.Warning);
  });

  it("passes tagListValueArray and tagListBoxLabelText", () => {
    render(
      <SearchSection {...baseProps} localTagListArray={[{ text: "Alfie", value: "Alfie" }]} />
    );
    const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
    const props: any = (el as any).propsRef;
    expect(props.tagListValueArray).toEqual([{ text: "Alfie", value: "Alfie" }]);
    expect(props.tagListBoxLabelText).toBe("Filter.Added");
  });

  it("passes addLimit and allowSearchIfError", () => {
    render(
      <SearchSection {...baseProps} showSearchError={false} />
    );
    const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
    const props: any = (el as any).propsRef;
    expect(props.addLimit).toBe(5);
    expect(props.allowSearchIfError).toBe(true);
  });
  it("getSelectedItems returns correct selected items", () => {
  render(<SearchSection {...baseProps} searchTerm="Alfie" />);
  const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
  const props: any = (el as any).propsRef;
  const result: any[] = props.getSelectedItems();
  expect(result).toEqual([{ text: "Alfie", value: "Alfie" }]);
});

it("getSelectedItems returns empty array when searchTerm is empty", () => {
  render(<SearchSection {...baseProps} searchTerm="" />);
  const el = document.querySelector('[data-testid="filter-search"]') as HTMLElement;
  const props: any = (el as any).propsRef;
  const result: any[] = props.getSelectedItems();
  expect(result).toEqual([]);
});
});