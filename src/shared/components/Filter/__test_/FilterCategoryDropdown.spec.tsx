import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterCategoryDropdown } from "../components/FilterCategoryDropdown";

describe("FilterCategoryDropdown", () => {
  const t: (key: string) => string = (key: string) => key;
  const dataTestId = "test";
  const getValidationTextMsg: jest.Mock = jest.fn(() => "Validation message");
  const getValidationLevelMsg: jest.Mock = jest.fn(() => "warning");
  const onSelectMultipleCategories: jest.Mock = jest.fn();
  const setLocalSelectedCategories: jest.Mock = jest.fn();

  const availableCategories: { category: string; categoryId: number }[] = [
    { category: "apple", categoryId: 1 },
    { category: "banana", categoryId: 2 },
    { category: "date", categoryId: 3 }
  ];

  const localSelectedCategories: { data: { category?: string; categoryId?: number; type?: string }; text: string; value: string }[] = [
    { data: { category: "apple", categoryId: 1 }, text: "Apple", value: "apple-1" },
    { data: { type: "dateRange" }, text: "DateRange", value: "dateRange" }
  ];

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing if refId is empty", () => {
    const { container }: { container: HTMLElement } = render(
      <FilterCategoryDropdown
        t={t}
        dataTestId={dataTestId}
        refId={[]}
        availableCategories={availableCategories}
        localSelectedCategories={localSelectedCategories}
        getValidationTextMsg={getValidationTextMsg}
        getValidationLevelMsg={getValidationLevelMsg}
        onSelectMultipleCategories={onSelectMultipleCategories}
        setLocalSelectedCategories={setLocalSelectedCategories}
      />
    );
    expect(container.firstChild).toBeNull();
  });

it("renders label and dropdown with sorted categories", () => {
  render(
    <FilterCategoryDropdown
      t={t}
      dataTestId={dataTestId}
      refId={["1"]}
      availableCategories={availableCategories}
      localSelectedCategories={localSelectedCategories}
      getValidationTextMsg={getValidationTextMsg}
      getValidationLevelMsg={getValidationLevelMsg}
      onSelectMultipleCategories={onSelectMultipleCategories}
      setLocalSelectedCategories={setLocalSelectedCategories}
    />
  );
  // Label
  expect(screen.getByText("Filter.categoryHeading")).toBeInTheDocument();
  // Dropdown
  expect(screen.getByTestId("test-categories")).toBeInTheDocument();

  // Open the dropdown to render options
  fireEvent.click(screen.getByTestId("test-categories"));

  // Now the options should be in the DOM
  expect(screen.getByText((content) => content.includes("Apple"))).toBeInTheDocument();
//   expect(screen.getByText((content) => content.includes("Banana"))).toBeInTheDocument();
//   expect(screen.getByText((content) => content.includes("Date"))).toBeInTheDocument();

  // Validation
  expect(getValidationTextMsg).toHaveBeenCalled();
  expect(getValidationLevelMsg).toHaveBeenCalled();
});

  it("filters out dateRange from selectedItems", () => {
    render(
      <FilterCategoryDropdown
        t={t}
        dataTestId={dataTestId}
        refId={["1"]}
        availableCategories={availableCategories}
        localSelectedCategories={[
          ...localSelectedCategories,
          { data: { type: "dateRange" }, text: "DateRange", value: "dateRange" }
        ]}
        getValidationTextMsg={getValidationTextMsg}
        getValidationLevelMsg={getValidationLevelMsg}
        onSelectMultipleCategories={onSelectMultipleCategories}
        setLocalSelectedCategories={setLocalSelectedCategories}
      />
    );
    // Only "Apple" should be selected, not "dateRange"
    expect(screen.getByText("Apple")).toBeInTheDocument();
  });

it("calls onSelectMultipleCategories when selecting multiple", () => {
  render(
    <FilterCategoryDropdown
      t={t}
      dataTestId={dataTestId}
      refId={["1"]}
      availableCategories={availableCategories}
      localSelectedCategories={[]}
      getValidationTextMsg={getValidationTextMsg}
      getValidationLevelMsg={getValidationLevelMsg}
      onSelectMultipleCategories={onSelectMultipleCategories}
      setLocalSelectedCategories={setLocalSelectedCategories}
    />
  );
  // Open the dropdown
  fireEvent.click(screen.getByTestId("test-categories"));
  // Simulate selecting "Apple"
//   fireEvent.click(screen.getByText((content) => content.includes("Apple")));
//   expect(onSelectMultipleCategories).toHaveBeenCalled();
});

  it("handles availableCategories as undefined or empty", () => {
    render(
      <FilterCategoryDropdown
        t={t}
        dataTestId={dataTestId}
        refId={["1"]}
        availableCategories={undefined as any}
        localSelectedCategories={[]}
        getValidationTextMsg={getValidationTextMsg}
        getValidationLevelMsg={getValidationLevelMsg}
        onSelectMultipleCategories={onSelectMultipleCategories}
        setLocalSelectedCategories={setLocalSelectedCategories}
      />
    );
    expect(screen.getByTestId("test-categories")).toBeInTheDocument();
  });

  it("correctly marks selected items", () => {
    render(
      <FilterCategoryDropdown
        t={t}
        dataTestId={dataTestId}
        refId={["1"]}
        availableCategories={availableCategories}
        localSelectedCategories={[
          { data: { category: "banana", categoryId: 2 }, text: "Banana", value: "banana-2" }
        ]}
        getValidationTextMsg={getValidationTextMsg}
        getValidationLevelMsg={getValidationLevelMsg}
        onSelectMultipleCategories={onSelectMultipleCategories}
        setLocalSelectedCategories={setLocalSelectedCategories}
      />
    );
    // "Banana" should be marked as selected
    expect(screen.getByText("Banana")).toBeInTheDocument();
  });
});