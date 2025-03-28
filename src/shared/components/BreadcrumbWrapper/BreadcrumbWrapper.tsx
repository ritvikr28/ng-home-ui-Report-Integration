import React from "react";
import { Breadcrumbs } from "@essnextgen/ui-kit";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";

const BreadcrumbWrapper: React.FC = () => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  return (
    <Breadcrumbs
      breadcrumbActions={[
        {
          active: true,
          linkName: t("breadcrumbshome"),
          path: window.location.pathname
        },
        {
          active: false,
          linkName: t("quickLink.headingTitle"),
          path: "#"
        }
      ]}
      className="essui-Breadcrumbs"
      dataTestId="breadcrumb-test-id"
      id="element-id"
      onItemClick={() => {}}
    />
  );
};

export default BreadcrumbWrapper;
