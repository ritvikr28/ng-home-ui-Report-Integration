import React, { useEffect, useState } from "react";
import { authService, MatchPermissions, Permission } from "@essnextgen/auth-ui";
import { hasFeaturePermission } from "@essnextgen/ui-flagr";
import { useMediaQuery } from "@essnextgen/ui-kit";
import MainPanelView from "./MainPanel.view";
import { ISchoolNameDataResponse } from "../../shared/model/SchoolDomain/responsemodels";
import { useFetchSchoolNameData } from "../../shared/services/schoolDomain/schoolServices";

import { IMainPanelProps } from "./MainPanelProps";
import { envConfig } from "../../shared/utils";
import { isOrganisationInVariant } from "../../shared/utils/flagr-utils";

const MainPanel: React.FC<IMainPanelProps> = ({ isOpen, setIsOpen }) => {

  const [schoolName, setSchoolName]: [string, React.Dispatch<React.SetStateAction<string>>] = useState<string>("");
  const [isError, setIsError]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  const [isSchoolPrimary, setIsSchoolPrimary]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  useEffect(() => {
    const fetchSchoolNames: () => Promise<void> = async () => {
      setIsError(false);
      try {
        const schoolData: ISchoolNameDataResponse | null = await useFetchSchoolNameData();

        const schoolNames: string = (schoolData == null) ? "" : schoolData.schoolName;
        const isSchoolsPrimary: boolean = (schoolData == null) ? true : schoolData.isSchoolPrimary;

        setSchoolName(schoolNames);
        setIsError(false);
        setIsSchoolPrimary(isSchoolsPrimary);

      } catch (error) {
        setSchoolName("");
        setIsError(true);
      }
    };

    fetchSchoolNames();
  }, [setSchoolName, setIsError, setIsSchoolPrimary]);

  const requiredSLTviewPermissions: Permission[] = [
    {
      Securable: "NG.Homepage.SLT",

      Operation: "View"
    }
  ];
  const SLTviewBETT: boolean = hasFeaturePermission(
    `${envConfig.APPLICATION}`,
    "SLTviewBETT"
  );

  const isClosedSidePanel: boolean = useMediaQuery(
    "(max-width: 1023.9px)"
  );
  const hasSLTviewOrgPermission: boolean =
    isOrganisationInVariant("SLTviewBETTORG");
  const isSLTView = SLTviewBETT &&
    hasSLTviewOrgPermission &&
    authService.isAuthorised(
      requiredSLTviewPermissions,
      MatchPermissions.all
    )
  const setHeight = () => {
    const element = document.querySelector('.side-view-dertfsg11463f') as HTMLElement;
    if (isSLTView === true) {
      element.style.height = isClosedSidePanel === true || isOpen === false ? `` : `205vh`
    }
  }

  useEffect(() => {
    setHeight()
  }, [isSLTView, isClosedSidePanel, isOpen]);

  return (
    <>
      <MainPanelView
        schoolName={schoolName}
        isError={isError}
        isSchoolPrimary={isSchoolPrimary}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default MainPanel;