import {
  createStore,
  applyMiddleware,
  compose,
  StoreEnhancer,
  Store,
  EmptyObject
} from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./rootReducer";

import {
  AppPermissionState,
  AppPermissionAction
} from "../types/AppPermission";

export default function configureStore(): Store<
  EmptyObject & {
    appPermission: AppPermissionState;
  },
  AppPermissionAction
> {
  const enhancers: StoreEnhancer[] = [applyMiddleware(thunk)];
  let composedEnhancers: StoreEnhancer;
  if (process.env.NODE_ENV === "development") {
    composedEnhancers = composeWithDevTools(...enhancers);
  } else {
    composedEnhancers = compose(...enhancers);
  }

  return createStore(rootReducer, composedEnhancers);
}
