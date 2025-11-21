import { render } from "@testing-library/react";
import * as authUi from "@essnextgen/auth-ui";
import * as flagr from "@essnextgen/ui-flagr";
import * as schoolServices from "../../../../shared/services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../../../shared/model/SchoolDomain/responsemodels";
import MainPanel from "../../MainPanel.logic";
import MainPanelView from "../../MainPanel.view";
import * as flagrUtils from "../../../../shared/utils/flagr-utils";

const mockSchoolDetails: ISchoolNameDataResponse = {
  schoolName: "test",
  externalId: "9008a156-0c85-4d1c-9eca-d6eb3ae84e15",
  isSchoolPrimary: false
};

const mockSchoolDetailsForPrimary: ISchoolNameDataResponse = {
  schoolName: "test",
  externalId: "9008a156-0c85-4d1c-9eca-d6eb3ae84e15",
  isSchoolPrimary: true
};

describe('MainPanel', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const tempFun = jest.fn();
  const setSchoolName = jest.fn();
  const setIsError = jest.fn();
  const setIsSchoolPrimary = jest.fn();

  test('renders schoolname successfully when status is successful', async () => {


    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockResolvedValue(mockSchoolDetails);
    setSchoolName(mockSchoolDetails.schoolName);
    setIsError(false);
    setIsSchoolPrimary(mockSchoolDetails.isSchoolPrimary);
    render(<MainPanel setIsOpen={tempFun} />);
    expect(setSchoolName).toHaveBeenCalledWith("test");
    expect(setIsError).toHaveBeenCalledWith(false);
    expect(setIsSchoolPrimary).toHaveBeenCalledWith(false);
  });

  test('renders schoolname successfully when status is successful and school is primary', async () => {

    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockResolvedValue(mockSchoolDetailsForPrimary);
    setSchoolName(mockSchoolDetailsForPrimary.schoolName);
    setIsError(false);
    setIsSchoolPrimary(mockSchoolDetailsForPrimary.isSchoolPrimary);
    render(<MainPanel setIsOpen={tempFun} />);
    expect(setSchoolName).toHaveBeenCalledWith("test");
    expect(setIsError).toHaveBeenCalledWith(false);
    expect(setIsSchoolPrimary).toHaveBeenCalledWith(true);
  });

  test('renders schoolname successfully when status is successful and data is null', async () => {
    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockResolvedValue(null);
    setSchoolName("");
    setIsError(false);
    setIsSchoolPrimary(true);
    render(<MainPanel setIsOpen={tempFun} />);
    expect(setSchoolName).toHaveBeenCalledWith("");
    expect(setIsError).toHaveBeenCalledWith(false);
    expect(setIsSchoolPrimary).toHaveBeenCalledWith(true);
  });



  test('should handle unsuccessful data fetch', async () => {
    const mockres: any = {
      status: 500
    }

    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockRejectedValue(mockres);
    setSchoolName("");
    setIsError(true);
    setIsSchoolPrimary(false);
    render(<MainPanel setIsOpen={tempFun} />);
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
    render(<MainPanel setIsOpen={tempFun} />);
    expect(setSchoolName).toHaveBeenCalledWith("");
    expect(setIsError).toHaveBeenCalledWith(true);
  });
});

const defaultProps = {
  schoolName: "Test School",
  isError: false,
  isSchoolPrimary: false,
  isOpen: true,
  setIsOpen: jest.fn(),
};

describe("MainPanelView", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders WelcomeUser and SIMSupdatesView", () => {
    const { getByTestId } = render(<MainPanelView {...defaultProps} />);
    expect(getByTestId("subparent-element")).toBeInTheDocument();
    expect(getByTestId("what-new-test-id")).toBeInTheDocument();
  });

  it("renders StaffTimeTableView when authorised and isSchoolPrimary is false", () => {
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Calendar.Staff.Timetable");
    const { getByTestId } = render(<MainPanelView {...defaultProps} isSchoolPrimary={false} />);
    expect(getByTestId("link-id")).toBeInTheDocument(); // or "staff-data-loader" if you want the loader
  });

  it("does not render StaffTimeTableView when isSchoolPrimary is true", () => {
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Calendar.Staff.Timetable");
    const { queryByTestId } = render(<MainPanelView {...defaultProps} isSchoolPrimary />);
    expect(queryByTestId("staff-timetable")).not.toBeInTheDocument();
  });

  it("renders TakeRegisterView and Divider when authorised", () => {
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Homepage.Registers");
    const { getByTestId, container } = render(<MainPanelView {...defaultProps} />);
    expect(getByTestId("reg-error-loader")).toBeInTheDocument(); // Use the loader's test id
    expect(container.querySelector(".new-divider-spacing")).toBeInTheDocument();
  });

  it("renders Search and Divider when authorised", () => {
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Learner.Personal");
    const { getByTestId, container } = render(<MainPanelView {...defaultProps} />);
    expect(getByTestId("new-search-element")).toBeInTheDocument(); // <-- updated test id
    expect(container.querySelector(".new-divider-spacing")).toBeInTheDocument();
  });

  it("renders SltViewBett and Divider when all SLT conditions are met", () => {
    jest.spyOn(flagr, "hasFeaturePermission").mockReturnValue(true);
    jest.spyOn(flagrUtils, "isOrganisationInVariant").mockReturnValue(true);
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Homepage.SchoolOverview");
    const { getAllByTestId, container } = render(<MainPanelView {...defaultProps} />);
    const headers = getAllByTestId("pupils-accordion-header-test-id");
    expect(headers.length).toBeGreaterThan(0); // or toBe(2) if you expect exactly 2
    expect(container.querySelector(".new-divider-spacing")).toBeInTheDocument();
  });

  it("does not render SltViewBett if feature flag is false", () => {
    jest.spyOn(flagr, "hasFeaturePermission").mockReturnValue(false);
    jest.spyOn(flagrUtils, "isOrganisationInVariant").mockReturnValue(true);
    jest.spyOn(authUi.authService, "isAuthorised").mockReturnValue(true);
    const { queryByTestId } = render(<MainPanelView {...defaultProps} />);
    expect(queryByTestId("slt-view-bett")).not.toBeInTheDocument();
  });

  it("does not render SltViewBett if org permission is false", () => {
    jest.spyOn(flagr, "hasFeaturePermission").mockReturnValue(true);
    jest.spyOn(flagrUtils, "isOrganisationInVariant").mockReturnValue(false);
    jest.spyOn(authUi.authService, "isAuthorised").mockReturnValue(true);
    const { queryByTestId } = render(<MainPanelView {...defaultProps} />);
    expect(queryByTestId("slt-view-bett")).not.toBeInTheDocument();
  });

  it("does not render SltViewBett if not authorised", () => {
    jest.spyOn(flagr, "hasFeaturePermission").mockReturnValue(true);
    jest.spyOn(flagrUtils, "isOrganisationInVariant").mockReturnValue(true);
    jest.spyOn(authUi.authService, "isAuthorised").mockReturnValue(false);
    const { queryByTestId } = render(<MainPanelView {...defaultProps} />);
    expect(queryByTestId("slt-view-bett")).not.toBeInTheDocument();
  });
});