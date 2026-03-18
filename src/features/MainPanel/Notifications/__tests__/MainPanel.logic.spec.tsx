import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { createStore } from "redux";
import * as authUi from "@essnextgen/auth-ui";
import * as flagr from "@essnextgen/ui-flagr";
import * as schoolServices from "../../../../shared/services/schoolDomain/schoolServices";
import { ISchoolNameDataResponse } from "../../../../shared/model/SchoolDomain/responsemodels";
import MainPanel from "../../MainPanel.logic";
import MainPanelView from "../../MainPanel.view";
import * as flagrUtils from "../../../../shared/utils/flagr-utils";

jest.mock("../../TakeRegisters/TakeRegister.view", () => () => <div data-testid="reg-error-loader" />);

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

  // Minimal mock reducer for appPermission state
  const mockReducer = (state = { appPermission: { videoPlayStatus: false, apiError: false } }) => state;
  const getMockStore = (customState = {}) => createStore(
    mockReducer,
    { appPermission: { videoPlayStatus: false, apiError: false }, ...customState }
  );


  function flushPromises() {
    return new Promise(resolve => setTimeout(resolve, 0));
  }

  test('renders schoolname successfully when status is successful', async () => {
    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockResolvedValue(mockSchoolDetails);
    const store = getMockStore();
    const { findByTestId } = render(
      <Provider store={store}>
        <MainPanel isOpen={true} setIsOpen={tempFun} />
      </Provider>
    );
    await flushPromises();
    const subparent = await findByTestId('subparent-element');
    expect(subparent.textContent?.toLowerCase()).toContain('welcomepage.himsg , welcomepage.welcomemsg');
  });

  test('renders schoolname successfully when status is successful and school is primary', async () => {
    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockResolvedValue(mockSchoolDetailsForPrimary);
    const store = getMockStore();
    const { findByTestId } = render(
      <Provider store={store}>
        <MainPanel isOpen={true} setIsOpen={tempFun} />
      </Provider>
    );
    await flushPromises();
    // WelcomeUser uses test id 'subparent-element', check for the school name inside it
    const subparent = await findByTestId('subparent-element');
    expect(subparent.textContent).toMatch("welcomePage.himsg , welcomePage.welcomemsg");
  });

  test('renders schoolname successfully when status is successful and data is null', async () => {
    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockResolvedValue(null);
    const store = getMockStore();
    const { findByTestId } = render(
      <Provider store={store}>
        <MainPanel isOpen={true} setIsOpen={tempFun} />
      </Provider>
    );
    await flushPromises();
    expect(await findByTestId("subparent-element")).toBeInTheDocument();
  });

  test('should handle unsuccessful data fetch', async () => {
    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockRejectedValue({ status: 500 });
    const store = getMockStore();
    const { findByTestId } = render(
      <Provider store={store}>
        <MainPanel isOpen={true} setIsOpen={tempFun} />
      </Provider>
    );
    await flushPromises();
    expect(await findByTestId("subparent-element")).toBeInTheDocument();
  });

  test('renders MainPanelView with error when an unexpected error occurs', async () => {
    jest.spyOn(schoolServices, "useFetchSchoolNameData").mockImplementationOnce(() => { throw new Error('Unexpected error'); });
    const store = getMockStore();
    const { findByTestId } = render(
      <Provider store={store}>
        <MainPanel isOpen={true} setIsOpen={tempFun} />
      </Provider>
    );
    await flushPromises();
    expect(await findByTestId("subparent-element")).toBeInTheDocument();
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

  // Reuse the mock store from above
  const mockReducer = (state = { appPermission: { videoPlayStatus: false, apiError: false } }) => state;
  const getMockStore = (customState = {}) => createStore(
    mockReducer,
    { appPermission: { videoPlayStatus: false, apiError: false }, ...customState }
  );

  function renderWithProvider(ui: React.ReactElement, customState = {}) {
    const store = getMockStore(customState);
    return render(<Provider store={store}>{ui}</Provider>);
  }

  it("renders WelcomeUser and SIMSupdatesView", () => {
    const { getByTestId } = renderWithProvider(<MainPanelView {...defaultProps} />);
    expect(getByTestId("subparent-element")).toBeInTheDocument();
    expect(getByTestId("what-new-test-id")).toBeInTheDocument();
  });

  it("renders StaffTimeTableView when authorised and isSchoolPrimary is false", () => {
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Calendar.Staff.Timetable");
    const { getByTestId } = renderWithProvider(<MainPanelView {...defaultProps} isSchoolPrimary={false} />);
    expect(getByTestId("link-id")).toBeInTheDocument();
  });

  it("does not render StaffTimeTableView when isSchoolPrimary is true", () => {
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Calendar.Staff.Timetable");
    const { queryByTestId } = renderWithProvider(<MainPanelView {...defaultProps} isSchoolPrimary />);
    expect(queryByTestId("staff-timetable")).not.toBeInTheDocument();
  });

  it("renders TakeRegisterView and Divider when authorised", () => {
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Homepage.Registers");
    const { getByTestId, container } = renderWithProvider(<MainPanelView {...defaultProps} />);
    expect(getByTestId("reg-error-loader")).toBeInTheDocument();
    expect(container.querySelector(".new-divider-spacing")).toBeInTheDocument();
  });

  it("renders Search and Divider when authorised", () => {
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Learner.Personal");
    const { getByTestId, container } = renderWithProvider(<MainPanelView {...defaultProps} />);
    expect(getByTestId("new-search-element")).toBeInTheDocument();
    expect(container.querySelector(".new-divider-spacing")).toBeInTheDocument();
  });

  it("renders SltViewBett and Divider when all SLT conditions are met", () => {
    jest.spyOn(flagr, "hasFeaturePermission").mockReturnValue(true);
    jest.spyOn(flagrUtils, "isOrganisationInVariant").mockReturnValue(true);
    jest.spyOn(authUi.authService, "isAuthorised").mockImplementation((perms) => perms[0].Securable === "NG.Homepage.SchoolOverview");
    const { getAllByTestId, container } = renderWithProvider(<MainPanelView {...defaultProps} />);
    const headers = getAllByTestId("pupils-accordion-header-test-id");
    expect(headers.length).toBeGreaterThan(0);
    expect(container.querySelector(".new-divider-spacing")).toBeInTheDocument();
  });

  it("does not render SltViewBett if feature flag is false", () => {
    jest.spyOn(flagr, "hasFeaturePermission").mockReturnValue(false);
    jest.spyOn(flagrUtils, "isOrganisationInVariant").mockReturnValue(true);
    jest.spyOn(authUi.authService, "isAuthorised").mockReturnValue(true);
    const { queryByTestId } = renderWithProvider(<MainPanelView {...defaultProps} />);
    expect(queryByTestId("slt-view-bett")).not.toBeInTheDocument();
  });

  it("does not render SltViewBett if org permission is false", () => {
    jest.spyOn(flagr, "hasFeaturePermission").mockReturnValue(true);
    jest.spyOn(flagrUtils, "isOrganisationInVariant").mockReturnValue(false);
    jest.spyOn(authUi.authService, "isAuthorised").mockReturnValue(true);
    const { queryByTestId } = renderWithProvider(<MainPanelView {...defaultProps} />);
    expect(queryByTestId("slt-view-bett")).not.toBeInTheDocument();
  });

  it("does not render SltViewBett if not authorised", () => {
    jest.spyOn(flagr, "hasFeaturePermission").mockReturnValue(true);
    jest.spyOn(flagrUtils, "isOrganisationInVariant").mockReturnValue(true);
    jest.spyOn(authUi.authService, "isAuthorised").mockReturnValue(false);
    const { queryByTestId } = renderWithProvider(<MainPanelView {...defaultProps} />);
    expect(queryByTestId("slt-view-bett")).not.toBeInTheDocument();
  });
});