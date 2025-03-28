import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { authService } from "@essnextgen/auth-ui";
import { envConfig } from "./constants";

type ServiceType = {
  instance: AxiosInstance;
  init: () => void;
  config: (baseURL: string, headers: any) => void;
  setInterceptor: () => void;
  get: (
    path: string,
    externalUrl?: string,
    headers?: any
  ) => Promise<AxiosResponse<any>>;
  post: (
    path: string,
    data: Object,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any>>;
  put: (
    path: string,
    data: Object,
    config?: AxiosRequestConfig
  ) => Promise<AxiosResponse<any>>;
  delete: (path: string) => Promise<AxiosResponse<any>>;
};

const getErrorMessage = (error: any) => {
  const messages: string[] = Object.values(error.response.data.reason);
  return messages.map((message) => message[0]);
};

export const service: ServiceType = {
  instance: {} as AxiosInstance,
  init() {
    let headerConfig={};
    if(sessionStorage.getItem("OrganizationId")!==null && sessionStorage.getItem("OrganizationId") as string!=="" && sessionStorage.getItem("OrganizationId") as string!==undefined)
      {
        headerConfig={ 'Authorization': `Bearer ${authService.getAuthTokens()}`,
        'Organisation-Id': sessionStorage.getItem("OrganizationId") as string }
      }
      else{
        headerConfig={ 'Authorization': `Bearer ${authService.getAuthTokens()}`}
      }
    
    this.instance = axios.create({
      baseURL: envConfig.BASE_URL,
      headers:headerConfig
    });    
    this.setInterceptor();
  },
  config(baseURL: string, headers: any) {
    this.instance = axios.create({ baseURL, headers });
    this.setInterceptor();
  },
  setInterceptor() {
    this.instance.interceptors.response.use(
      (response) => response,
      (error) => {
        let message: string[] = [];
        if (error.response?.status === 401) {
          window.sessionStorage.removeItem("auth");
        } else if (error.response?.data?.code === "validation_error") {
          message = getErrorMessage(error);
        }
        const customError: Error = new Error();
        return Promise.reject(
          Object.assign(customError, { ...error, message })
        );
      }
    );
  },
  get(path: string, externalUrl?: string, headers?: any) {
    const url = externalUrl || envConfig.BASE_URL;
    let headerConfig={};
    if(sessionStorage.getItem("OrganizationId")!==null && sessionStorage.getItem("OrganizationId") as string!=="" && sessionStorage.getItem("OrganizationId") as string!==undefined)
      {
        headerConfig={ 'Authorization': `Bearer ${authService.getAuthTokens()}`,
        'Organisation-Id': sessionStorage.getItem("OrganizationId") as string 
      }
      }
      else{
        headerConfig={ 'Authorization': `Bearer ${authService.getAuthTokens()}`        
      }
      }
    const header = headers || headerConfig;
    service.config(url, header);
    return this.instance.get(path);
  },
  post(path: string, data: Object, config: AxiosRequestConfig = {}) {
    service.init();
    return this.instance.post(path, data, config);
  },
  put(path: string, data: Object, config: AxiosRequestConfig = {}) {
    service.init();
    return this.instance.put(path, data, config);
  },
  delete(path: string) {
    service.init();
    return this.instance.delete(path);
  }
};
