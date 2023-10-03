import { combineReducers } from "redux";
import ModulesReducer from "./modulesReducer";

const allReducers = {
  appPermission: ModulesReducer
};

const rootReducer = combineReducers(allReducers);

export default rootReducer;
