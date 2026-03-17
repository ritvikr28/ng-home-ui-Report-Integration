import { ButtonSize, FormLabel, ReactionButton, ReactionButtonGroup } from "@essnextgen/ui-kit";
import React, { useEffect, useState, useCallback } from "react";
import { PrivacyFilterDetails } from "../../../../features/DocumentManagementServer/responseModel";

interface FilterRadioButtonProps {
  t: (key: string) => string;
  privacyFilter: PrivacyFilterDetails[];
}

function formatLabel(label: string) {
  if (!label) return "";
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

export const FilterRadioButton: React.FC<FilterRadioButtonProps> = ({ t, privacyFilter }) => {
  const [selectedValue, setSelectedValue] = useState<string>("all");


  const handleSelect = (value: string) => {
    setSelectedValue(value);
  };

  return (
    <div className="filter-radio-button">
      <FormLabel>
        {t("DocumentManagementServer.privacyFilterLabel")}
      </FormLabel>
      <div className="radio-button-group">
        <ReactionButtonGroup name="filter-options" size={ButtonSize.Small}>
          <>
            <ReactionButton
              key="all"
              label={formatLabel(t("DocumentManagementServer.privacyFilterAll"))}
              value="all"
              isToggle={true}
              isSelected={selectedValue === "all"}
              onClick={() => handleSelect("all")}
            />
              {privacyFilter
              .filter(option => option.ngStatus?.toUpperCase() !== "PRIVATE")
              .map(option => (
                <ReactionButton
                  key={option.documentStatusId}
                  label={formatLabel(option.ngStatus) ?? ""}
                  value={option.documentStatusId}
                  isToggle={true}
                  isSelected={selectedValue === String(option.documentStatusId)}
                  onClick={() => handleSelect(String(option.documentStatusId))}
                />
              ))}
          </>
        </ReactionButtonGroup>
      </div>
    </div>
  );
};