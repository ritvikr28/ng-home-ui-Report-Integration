import { ButtonSize, FormLabel, ReactionButton, ReactionButtonGroup } from "@essnextgen/ui-kit";
import React, { useState } from "react";
import { PrivacyFilterDetails } from "../../../../features/DocumentManagementServer/responseModel";
import { formatLabel } from "../FilterDialog.utils";

interface FilterRadioButtonProps {
  t: (key: string) => string;
  privacyFilter: PrivacyFilterDetails[];
  onPrivacyFilterChange?: (value: string) => void;
}

export const FilterRadioButton: React.FC<FilterRadioButtonProps> = ({ t, privacyFilter, onPrivacyFilterChange }) => {
  const [selectedValue, setSelectedValue] = useState<string>("all");

  const handleChange = (e: React.SyntheticEvent, value: string | number) => {
    e.preventDefault();
    const strValue = String(value);
    setSelectedValue(strValue);
    onPrivacyFilterChange?.(strValue);
  };

  const allOptions = [
    { value: "all", label: formatLabel(t("DocumentManagementServer.privacyFilterAll")) },
    ...privacyFilter
      .filter(option => option.ngStatus?.toUpperCase() !== "PRIVATE")
      .map(option => ({
        value: String(option.documentStatusId),
        label: formatLabel(option.ngStatus) ?? ""
      }))
  ];

  return (
    <div className="filter-radio-button">
      <FormLabel>
        {t("DocumentManagementServer.privacyFilterLabel")}
      </FormLabel>
      <div className="radio-button-group">
        <ReactionButtonGroup
          name="filter-options"
          size={ButtonSize.Small}
          selectedValue={selectedValue}
          onChange={handleChange}
        >
          {allOptions.map(option => (
            <ReactionButton
              key={option.value}
              label={option.label}
              value={option.value}
              isToggle={true}
              isSelected={selectedValue === option.value}
            />
          ))}
        </ReactionButtonGroup>
      </div>
    </div>
  );
};