import {
  AppPermissionAction,
  AppPermissionState
} from "../types/AppPermission";
import * as actionTypes from "./actionTypes";

const initialState: AppPermissionState = {
  modules: [],
  isLoaded: false
};

const ModulesReducer: (
  state: AppPermissionState | undefined,
  action: AppPermissionAction
) => AppPermissionState = (
  state: AppPermissionState = initialState,
  action: AppPermissionAction
): AppPermissionState => {
  switch (action.type) {
    case actionTypes.SAVE_APP_MODULES: {
      return {
        ...state,
        modules: action.payload,
        isLoaded: true
      };
    }
    case actionTypes.REMOVE_APP_MODULES: {
      return {
        ...state,
        modules: initialState.modules,
        isLoaded: true
      };
    }
    case actionTypes.APP_MODULES_REQUEST: {
      return {
        ...state,
        modules: initialState.modules,
        isLoaded: false
      };
    }
    default:
      return state;
  }
};

export default ModulesReducer;
