import React from "react";
import { FormLabel, Dropdown, DropdownItem, ISelectedItem } from "@essnextgen/ui-kit";

interface FilterCategoryDropdownProps {
  t: (key: string) => string;
  dataTestId: string;
  refId: string[];
  availableCategories: any[];
  localSelectedCategories: ISelectedItem[];
  getValidationTextMsg: () => string | undefined;
  getValidationLevelMsg: () => string | undefined;
  onSelectMultipleCategories: (setLocalSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>, selectedItems: ISelectedItem[]) => void;
  setLocalSelectedCategories: React.Dispatch<React.SetStateAction<ISelectedItem[]>>;
}

export const FilterCategoryDropdown: React.FC<FilterCategoryDropdownProps> = ({
  t,
  dataTestId,
  refId,
  availableCategories,
  localSelectedCategories,
  getValidationTextMsg,
  getValidationLevelMsg,
  onSelectMultipleCategories,
  setLocalSelectedCategories
}) => {
  if (!refId?.length) return null;

  return (
    <>
      <FormLabel>{t("Filter.categoryHeading")}</FormLabel>
      <Dropdown
        dataTestId={`${dataTestId}-categories`}
        isFixedMultiSelect
        multiSelect
        isScrollbarVisible
        placeholderText={t("Filter.selectOption")}
        validationText={getValidationTextMsg()}
        validationTextLevel={getValidationLevelMsg() as any}
        selectedItems={localSelectedCategories.filter((item) => item.data?.type !== "dateRange") || []}
        onSelectMultiple={(_e, selectedItems) =>
          onSelectMultipleCategories(setLocalSelectedCategories, selectedItems)
        }
      >
        {availableCategories && Array.from(availableCategories ?? [])
          .slice()
          .sort((a, b) => a.category.localeCompare(b.category))
          .map((category) => (
            <DropdownItem
              key={`${category.category}-${category.categoryId ?? ""}`}
              data={category}
              id={`${category.category}-${category.categoryId ?? ""}`}
              text={category.category.charAt(0).toUpperCase() + category.category.slice(1)}
              value={`${category.category}-${category.categoryId ?? ""}`}
              isSelected={localSelectedCategories.some(
                (item) =>
                  (item.data?.category || item.data) === category.category &&
                  (item.data?.categoryId || item.data?.id) === (category.categoryId ?? category.categoryId)
              )}
            >
              {category.category.charAt(0).toUpperCase() + category.category.slice(1)}
            </DropdownItem>
          ))}
      </Dropdown>
    </>
  );
};