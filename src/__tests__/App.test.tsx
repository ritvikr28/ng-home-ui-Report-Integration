import { createBrowserHistory } from "history";
import { render, waitFor, queryByAttribute } from "@testing-library/react";
import { Router } from "react-router-dom";
import { Provider } from "react-redux";
import { authService } from "@essnextgen/auth-ui";
import * as redux from "react-redux";
import configureStore from "../redux/store";
import App from "../App";
import { AppPermissionState } from "../types/AppPermission";
import { service } from "../shared/utils";

describe("Testing App Component", () => {
  describe("Testing the routes", () => {
    const history: any = createBrowserHistory();
    const getById: any = queryByAttribute.bind(null, "id");

    beforeEach(() => {
      jest.spyOn(authService, "isAuthenticated").mockImplementation(() => true);
      jest
        .spyOn(authService, "getAuthTokens")
        .mockImplementation(() => "dummy token");
      jest
        .spyOn(authService, "getAuthTokens")
        .mockReturnValue(
          "eyJhbGciOiJSUzI1NiIsImtpZCI6IkFBNDhENDA2QThCNDVFOUYyQTY4RjZGM0M2MzgwM0Y5N0M0NzU4NDFSUzI1NiIsIng1dCI6InFralVCcWkwWHA4cWFQYnp4amdELVh4SFdFRSIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2NvcmUtZGV2LnNpbXMuY28udWsiLCJuYmYiOjE2OTA4MDQ5MTUsImlhdCI6MTY5MDgwNDkxNSwiZXhwIjoxNjkwODA4NTE1LCJhdWQiOlsib2RhdGFhcGkiLCJodHRwczovL2NvcmUtZGV2LnNpbXMuY28udWsvcmVzb3VyY2VzIl0sInNjb3BlIjpbIkFjdGl2ZUNsaWVudCIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJjdXN0b20iXSwiY2xpZW50X2lkIjoiSW50ZXJuYWxBY3RpdmVDbGllbnQiLCJzdWIiOiIxNDk3Njh8MzM0NURBMDktRDA5Ni00RjRCLTg1RkMtMzlEMkNFMkE0NTg4fEluaXRpYWwuQWRtaW42ODdAaWRlbnRpdHlmb3Iuc2ltc2lkLnBsYWNlaG9sZGVyLmNvLnVrfFNJTVMgSUR8ODYyZDZkZTktYzY1Yi00NmVkLTg2YjItMDYxNzVhNzJkNzYwIiwiYXV0aF90aW1lIjoxNjkwODA0OTE1LCJpZHAiOiJsb2NhbCIsIm5hbWUiOiIxNDk3Njh8MzM0NURBMDktRDA5Ni00RjRCLTg1RkMtMzlEMkNFMkE0NTg4fEluaXRpYWwuQWRtaW42ODdAaWRlbnRpdHlmb3Iuc2ltc2lkLnBsYWNlaG9sZGVyLmNvLnVrfFNJTVMgSUR8ODYyZDZkZTktYzY1Yi00NmVkLTg2YjItMDYxNzVhNzJkNzYwIiwiU0lNU0lEL2lzc3Vlcm5hbWUiOiJFbnRlcnByaXNlIiwidmVuZG9yaWQiOiIyODYxQTAwMC03OTM0LTQ0QkYtOUY2RS05NkE5MjIyNjZGMzkiLCJhcHBsaWNhdGlvbmlkIjoiQ0E5MUMwMjEtRjA0RC00RkU1LUE0NUMtRTFCQTlCRUVFNDFBIiwiYXBwbGljYXRpb25uYW1lIjoiRVNTLVNhdGVsbGl0ZXMtRGV2ZWxvcG1lbnQtU0lNUyBOZXh0IEdlbiIsIlNJTVNDWC9VU0QiOiJUcnVlIiwiU0lNU0NYL0RvbWFpbiI6IjAwMDAwMDAwLTAwMDAtMDAwMC0wMDAwLTAwMDAwMDAwMDAwMCIsIlNJTVNDWC9SZWdpb25JZGVudGlmaWVyIjoiIiwiU0lNU0NYL1ZhcmlhbnRDb2RlIjoiIiwiU0lNU0NYL0ludGVudHMiOiIiLCJTSU1TQ1gvT3JnYW5pc2F0aW9uSUQiOiI2NmY0ZjVkMC1iNmFhLTQ5NTktYjlkMy1mYTZlNjliZjI1MGEiLCJTSU1TQ1gvUm9sZSI6ImFkbWluQDY2ZjRmNWQwLWI2YWEtNDk1OS1iOWQzLWZhNmU2OWJmMjUwYSIsIlNJTVNDWC9UZW5hbnRJRCI6IjQxMiIsIlNJTVNDWC9FeHRlcm5hbElEIjoiZjRhY2I2ZjAtOGVkMC00NmJkLTg0ZGItMDMxZTQ1OWE4ZjE1IiwiU0lNU0NYL1VzZXJUeXBlIjoiU3RhZmYiLCJqdGkiOiJBOTgxNjIxRDQ4QjZFRjgyNTUzMDFFNTAwQkJFRTMwRiJ9.XaLsTcNLh1ZYum1vAOT213TfGulMJ1ETzS4UX7mve2lXChsPXiATlCYYeM9K6KXYeq96h5Jhq9_yhlQCodfsVRKDU0IXmBasZbtLKnELaWmiSXbgzjCsxPXCSO9UVyH4hjhAaFPOKrTET-dn-cv44u6FCS2UTEwWr9yr-crgWqZuHt7972ZtkuqUjzv1jVDkjFeQ_6awlmjd-22DXK5jmN9AydwNUfZm6_GJ7aQD2pL3Npzu7CFWgQhBnjwwZdBzH8ujvn6xbO5r6eipBEqM4T0N0bj-sYlxT0VzEQs5Qbn_zJv2cAPZthutcCQHlAQtKpQgkg4Rx1orJiPS44c-Ju8u7b-N652us1MCDSaBd2ybBAlyhaXwWTRmT7xiGBTEzWDUxme-1PQ9uvYpAhcYAoE3-Q0UvxLzFieSsML7svG4TgDJuPSPxMRnrvcnblztdj2GqJGyNCOSY7bocJVGa4epeI_68M1xskf4ivxuPwHRc5iq38fIIp3Bo2fLz5A17W3VqQVeWrIrERG1xu5ULUlM0yBRJhmzK0Q2WkUWNLcnbn-EKmQOdhc4BId5hmmBpo6SACYP-cDO0ew1OcX3qobBho9wwB5DndQY2MhT5dGGbEzhXC3F25PsppTszXugKDTJ0y9BnLStRJByrepXiM7E7f1pbNsez4w3omNjFcA"
        );
    });

    afterEach(() => {
      jest.restoreAllMocks();
      jest.clearAllMocks();
    });

    test.skip("should render pagenotfound page on invalid route", async () => {
      history.push("/not-found");
      const RenderedDom = renderWithHistory(history);

      await waitFor(() => {
        const container: any = getById(
          RenderedDom.container,
          "page-not-found-wrapper"
        );
        expect(container).toBeInTheDocument();
      });
    });
    it("getFetaureFlag to return undefined when is not Authenticated ", async () => {
      const appPermissions: AppPermissionState = {
        modules: [],
        isLoaded: true
      };      
      const useSelector = jest.spyOn(redux, "useSelector");
      useSelector.mockReturnValue(appPermissions);
      const spy:any =jest
      .spyOn(service, "get")
      jest.spyOn(authService, "isAuthenticated").mockImplementationOnce(() => false);     
      history.push("/");
      renderWithHistory(history);
     
      await waitFor(() => {
        expect(spy).not.toHaveBeenCalled();
      });
    });    
  });

  function renderWithHistory(history: any) {
    return render(
      <Provider store={configureStore()}>
        <Router history={history}>
          <App isStandaloneApp baseRouteName="" />
        </Router>
      </Provider>
    );
  }
});
