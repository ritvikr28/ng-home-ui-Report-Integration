import React from "react";
import { Breadcrumbs } from "@essnextgen/ui-kit";

const BreadcrumbWrapper: React.FC = () => (
<Breadcrumbs
      breadcrumbActions={[
        {
          active: true,
          linkName: "Home",
          path: window.location.pathname
        },
        {
          active: false,
          linkName: "Quick Links",
          path: "#"
        }
      ]}
      className="essui-Breadcrumbs"
      dataTestId="breadcrumb-test-id"
      id="element-id"
      onItemClick={() => {}}
    />
  
);

export default BreadcrumbWrapper;