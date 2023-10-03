export interface IModulePermission {
  code: string;
  canView?: boolean;
}

export interface IAppModule extends IModulePermission {
  title: string;
  description: string;
  appUrl?: string;
  link?: string;
  linkText?: string;
}

export type AppPermissionState = {
  modules: Array<IAppModule>;
  isLoaded: boolean;
};

export type AppPermissionAction = {
  type: string;
  payload: Array<IAppModule>;
};

export type DispatchType = (args: AppPermissionAction) => AppPermissionAction;
