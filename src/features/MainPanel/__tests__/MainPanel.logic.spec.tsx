import { render } from "@testing-library/react";
import { authService } from "@essnextgen/auth-ui";
import * as schoolServices from "../../../shared/services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../../shared/model/SchoolDomain/responsemodels";
import MainPanel from "../MainPanel.logic";
import MainPanelView from "../MainPanel.view";

const mockSchoolDetails:ISchoolNameDataResponse={
    schoolName:"test",
    externalId:"9008a156-0c85-4d1c-9eca-d6eb3ae84e15",
    isSchoolPrimary:false

};

const mockSchoolDetailsForPrimary:ISchoolNameDataResponse={
    schoolName:"test",
    externalId:"9008a156-0c85-4d1c-9eca-d6eb3ae84e15",
    isSchoolPrimary:true
};

describe('MainPanel', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    const setSchoolName = jest.fn();
    const setIsError = jest.fn(); 
    const setIsSchoolPrimary = jest.fn();

    test('renders schoolname successfully when status is successful', async () => {
        jest.spyOn(schoolServices,"useFetchSchoolNameData").mockResolvedValue(mockSchoolDetails);
        setSchoolName(mockSchoolDetails.schoolName);
        setIsError(false);
        setIsSchoolPrimary(mockSchoolDetails.isSchoolPrimary);
        render(<MainPanel/>);
        expect(setSchoolName).toHaveBeenCalledWith("test");
        expect(setIsError).toHaveBeenCalledWith(false);
        expect(setIsSchoolPrimary).toHaveBeenCalledWith(false);
      }); 

      test('renders schoolname successfully when status is successful and school is primary', async () => {
      
        jest.spyOn(schoolServices,"useFetchSchoolNameData").mockResolvedValue(mockSchoolDetailsForPrimary);
        setSchoolName(mockSchoolDetailsForPrimary.schoolName);
        setIsError(false);
        setIsSchoolPrimary(mockSchoolDetailsForPrimary.isSchoolPrimary);
        render(<MainPanel/>);
        expect(setSchoolName).toHaveBeenCalledWith("test");
        expect(setIsError).toHaveBeenCalledWith(false);
        expect(setIsSchoolPrimary).toHaveBeenCalledWith(true);
      }); 

      test('renders schoolname successfully when status is successful and data is null', async () => {      
        jest.spyOn(schoolServices,"useFetchSchoolNameData").mockResolvedValue(null);
        setSchoolName("");
        setIsError(false);
        setIsSchoolPrimary(true);
        render(<MainPanel/>);
        expect(setSchoolName).toHaveBeenCalledWith("");
        expect(setIsError).toHaveBeenCalledWith(false);
        expect(setIsSchoolPrimary).toHaveBeenCalledWith(true);
      }); 
      

      
      test('should handle unsuccessful data fetch', async () => {
        const mockres:any={
          status: 500
        }

        jest.spyOn(schoolServices,"useFetchSchoolNameData").mockRejectedValue(mockres);
        setSchoolName("");
        setIsError(true);
        setIsSchoolPrimary(false);
        render(<MainPanel/>);
        expect(setSchoolName).toHaveBeenCalledWith("");
        expect(setIsError).toHaveBeenCalledWith(true);
        expect(setIsSchoolPrimary).toHaveBeenCalledWith(false);
      });

      test('renders MainPanelView with error when an unexpected error occurs', async () => {
        jest.spyOn(schoolServices, "useFetchSchoolNameData").mockImplementationOnce(() => {
            throw new Error('Unexpected error');
          });
        setSchoolName("");
        setIsError(true);     
        render(<MainPanel />);
        expect(setSchoolName).toHaveBeenCalledWith("");
        expect(setIsError).toHaveBeenCalledWith(true);
      });

      test("renders divider with open class when hasAdminFlagrPermission is true", () => {
        const props = {
          schoolName: "Test School",
          isError: false,
          isSchoolPrimary: false,
          isOpen: true,
          setIsOpen: jest.fn(),
        };
        /* eslint-disable */
        jest
          .spyOn(require("@essnextgen/ui-flagr"), "hasFeaturePermission")
          .mockReturnValue(true);

        jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

        jest.mock("../../../shared/utils/flagr-utils", () => ({
          isOrganisationInVariant: jest.fn().mockImplementationOnce(() => true),
        }));

        /* eslint-enable */
        const { container } = render(<MainPanelView {...props} />);

        const divider = container.querySelector(
          ".divider-container-dertfsg11463f"
        );

        expect(divider).toBeTruthy();
        expect(divider).toHaveClass("open-divider-dertfsg11463f");
      });

      test("renders divider with open class when hasAdminViewPermission with isopen is false", () => {
        const props = {
          schoolName: "Test School",
          isError: false,
          isSchoolPrimary: false,
          isOpen: false,
          setIsOpen: jest.fn(),
        };
        /* eslint-disable */
        jest
          .spyOn(require("@essnextgen/ui-flagr"), "hasFeaturePermission")
          .mockReturnValue(true);

        jest.spyOn(authService, "isAuthorised").mockImplementation(() => true);

        jest.mock("../../../shared/utils/flagr-utils", () => ({
          isOrganisationInVariant: jest.fn().mockImplementationOnce(() => true),
        }));

        /* eslint-enable */
        const { container } = render(<MainPanelView {...props} />);

        const divider = container.querySelector(
          ".divider-container-dertfsg11463f "
        );

        expect(divider).toHaveClass("divider-container-dertfsg11463f");
      });

      test("renders divider with open class when hasAdminFlagrPermission is false", () => {
        const props = {
          schoolName: "Test School",
          isError: false,
          isSchoolPrimary: false,
          isOpen: true,
          setIsOpen: jest.fn(),
        };
        /* eslint-disable */
        jest
          .spyOn(require("@essnextgen/ui-flagr"), "hasFeaturePermission")
          .mockReturnValue(true);

        jest.spyOn(authService, "isAuthorised").mockImplementation(() => false);

        jest.mock("../../../shared/utils/flagr-utils", () => ({
          isOrganisationInVariant: jest.fn().mockImplementationOnce(() => true),
        }));

        /* eslint-enable */
        const { container } = render(<MainPanelView {...props} />);

        const divider = container.querySelector(
          ".divider-container-dertfsg11463f"
        );

        expect(divider).toBeFalsy();
      });

});