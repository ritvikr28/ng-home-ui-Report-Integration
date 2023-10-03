import { Dispatch } from "redux";
import * as actionTypes from "../redux/actionTypes";
import { IAppModule, AppPermissionAction } from "../types/AppPermission";

export const saveAppPermission: (
  payload: Array<IAppModule>
) => (dispatch: Dispatch) => { type: string; payload: IAppModule[] } =
  (payload: Array<IAppModule>) => (dispatch: Dispatch) => {
    try {
      return dispatch({
        type: actionTypes.SAVE_APP_MODULES,
        payload
      });
    } catch (e) {
      return dispatch({
        type: actionTypes.APP_MODULES_FAILURE,
        payload: []
      });
    }
  };

export const clearAppPermission: () => (
  dispatch: Dispatch
) => AppPermissionAction =
  () =>
  (dispatch: Dispatch): AppPermissionAction => {
    try {
      return dispatch({
        type: actionTypes.REMOVE_APP_MODULES,
        payload: []
      });
    } catch (e) {
      return dispatch({
        type: actionTypes.APP_MODULES_FAILURE,
        payload: []
      });
    }
  };

export const startRequest: () => (dispatch: Dispatch) => AppPermissionAction =
  () =>
  (dispatch: Dispatch): AppPermissionAction => {
    try {
      return dispatch({
        type: actionTypes.APP_MODULES_REQUEST,
        payload: []
      });
    } catch (e) {
      return dispatch({
        type: actionTypes.APP_MODULES_FAILURE,
        payload: []
      });
    }
  };
