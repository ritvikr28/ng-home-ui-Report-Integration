import {
  saveAppPermission,
  clearAppPermission,
  startRequest
} from "../storeActions";
import * as actionTypes from "../../redux/actionTypes";
import { IAppModule } from "../../types/AppPermission";

describe("appPermissionActions", () => {
  let dispatch: any;
  const payload: Array<IAppModule> = [
    {
      code: "1",
      title: "Module 1",
      description: "Module desc 1",
      appUrl: ""
    },
    {
      code: "2",
      title: "Module 2",
      description: "Module desc 2",
      appUrl: ""
    }
  ];

  beforeEach(() => {
    dispatch = jest.fn();
  });

  describe("saveAppPermission", () => {
    it("dispatches the correct action and payload", () => {
      const expectedAction = { type: actionTypes.SAVE_APP_MODULES, payload };

      saveAppPermission(payload)(dispatch);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it("dispatches the fail saveAppPermission action", () => {
      try {
        saveAppPermission([])(dispatch);
      } catch (error) {
        expect(dispatch).toHaveBeenCalledWith({
          type: actionTypes.APP_MODULES_FAILURE,
          payload: []
        });
      }
    });

    it("should return a function that dispatches a REMOVE_APP_MODULES action", () => {
      const expectedAction = {
        type: actionTypes.REMOVE_APP_MODULES,
        payload: []
      };
      clearAppPermission()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it("dispatches the fail clearAppPermission action on an REMOVE_APP_MODULES action", () => {
      try {
        clearAppPermission()(dispatch);
      } catch (error) {
        expect(dispatch).toHaveBeenCalledWith({
          type: actionTypes.APP_MODULES_FAILURE,
          payload: []
        });
      }
    });

    it("should return a function that dispatches a REMOVE_APP_MODULES action", () => {
      const expectedAction = {
        type: actionTypes.APP_MODULES_REQUEST,
        payload: []
      };
      startRequest()(dispatch);

      expect(dispatch).toHaveBeenCalledWith(expectedAction);
    });

    it("dispatches the fail startRequest action on an REMOVE_APP_MODULES action", () => {
      try {
        startRequest()(dispatch);
      } catch (error) {
        expect(dispatch).toHaveBeenCalledWith({
          type: actionTypes.APP_MODULES_FAILURE,
          payload: []
        });
      }
    });
  });
});
