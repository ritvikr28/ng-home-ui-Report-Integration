import { ButtonSize, FormLabel, ReactionButton, ReactionButtonGroup } from "@essnextgen/ui-kit";
import React, { useEffect, useState, useCallback } from "react";
import { fetchPrivacyFilter } from "../../../../features/DocumentManagementServer/api/ApiService";
import { PrivacyFilterDetails } from "../../../../features/DocumentManagementServer/responseModel";

interface FilterRadioButtonProps {
  t: (key: string) => string;
  referenceExternalIds: string[];
}

function formatLabel(label: string) {
  return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
}

export const FilterRadioButton: React.FC<FilterRadioButtonProps> = ({ t, referenceExternalIds }) => {
  const [privacyFilter, setPrivacyFilter] = useState<PrivacyFilterDetails[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("all");

  const fetchData = useCallback(async () => {
    if (!referenceExternalIds || referenceExternalIds.length === 0) {
      setPrivacyFilter([]);
      return;
    }
    try {
      const data = await fetchPrivacyFilter(referenceExternalIds);
      setPrivacyFilter(Array.isArray(data) ? data : []);
    } catch {
      setPrivacyFilter([]);
    }
  }, [referenceExternalIds]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
            {privacyFilter.map(option => (
              <ReactionButton
                key={option.documentStatusId}
                label={formatLabel(option.documentStatus)}
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