import {
  Dialog,
  DialogContent,
  DialogFooter,
  Button,
  ButtonColor,
  FormLabel,
  Dropdown,
  DropdownItem,
  ISelectedItem,
  DateInput,
  ButtonSize
} from "@essnextgen/ui-kit";
import { useTranslation } from "@essnextgen/ui-intl-kit";
import { useState } from "react";
import "./style.scss";
import { Category } from "../../../features/DocumentManagementServer/responseModel";

interface DMSFilterDialogProps {
  dataTestId?: string;
  title: string;
  isOpen: boolean;
  availableCategories: Category[];
  availableFormats: string[];
  onClose: () => void;
  onApplyFilter: (filters: { categories: string[]; formats: string[] }) => void;
}

const DMSFilterDialog = ({
  dataTestId = "dms-filter-dialog",
  title,
  isOpen,
  availableCategories,
  availableFormats,
  onClose,
  onApplyFilter
}: DMSFilterDialogProps) => {
  const { t } = useTranslation();
  const [selectedCategories, setSelectedCategories] = useState<ISelectedItem[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<ISelectedItem[]>([]);

  const handleApply = () => {
    onApplyFilter({
      categories: selectedCategories.map((item) => item.data),
      formats: selectedFormats.map((item) => item.data)
    });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      dataTestId={dataTestId}
      escapeExits
      onClose={onClose}
      title={title}
    >
        <FormLabel>
          {t("Category")}
        </FormLabel>
        <Dropdown
          dataTestId={`${dataTestId}-categories`}
          multiSelect
          onSelectMultiple={(_, items) =>
            setSelectedCategories(
              items.map(item => ({
                ...item,
                text: item.text || (typeof item.data === "string"
                  ? item.data.charAt(0).toUpperCase() + item.data.slice(1)
                  : "")
              }))
            )
          }
          selectedItems={selectedCategories}
        >
      {availableCategories.map((category) => (
        <DropdownItem
          key={category.registrationId}
          data={category}
          id={category.application}
          text={category.application.charAt(0).toUpperCase() + category.application.slice(1)}
          value={category.application}
          isSelected={selectedCategories.some((item) => item.data === category.application)}
        >
          {category.application.charAt(0).toUpperCase() + category.application.slice(1)}
        </DropdownItem>
      ))}
  </Dropdown>
      
      <div className="dms-filter-dialog-date">
        <FormLabel>
          {t("Date Added")}
        </FormLabel>
        <div className="dms-filter-dialog-date-inputs">
          <DateInput
            dataTestId={`${dataTestId}-date-added`}
            helpText="From"
            showDatePicker
          />

          <DateInput
            dataTestId={`${dataTestId}-date-added`}
            helpText="To"
            showDatePicker
          />
        </div>
      </div>
          
        <div className="dms-filter-dialog-buttons">
          <Button
            dataTestId={`${dataTestId}-clear-btn`}
            onClick={() => {
              setSelectedCategories([]);
              setSelectedFormats([]);
          }}
          color={ButtonColor.Secondary}
          size={ButtonSize.Small}
        >
          {t("Clear All")}
        </Button>
        <Button
          dataTestId={`${dataTestId}-apply-btn`}
          onClick={handleApply}
          color={ButtonColor.Primary}
          size={ButtonSize.Small}
        >
          {t("Apply Filters")}
        </Button>
        </div>
    </Dialog>
  );
};

export default DMSFilterDialog;
