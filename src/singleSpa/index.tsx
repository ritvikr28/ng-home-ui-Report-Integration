import React, { lazy, Suspense, useEffect } from "react";
import ReactDOM from "react-dom";
import singleSpaReact, { ReactAppOrParcel } from "single-spa-react";
import singleSpaLeakedGlobals from "single-spa-leaked-globals";
import { Provider } from "react-redux";
import { fetchConfigData, SetupEnvConfig } from "./ConfigHelper";
import packageJson from "../../package.json";
import { ILayoutProps } from "../Layout";
import configureStore from "../redux/store";

// SetupEnvConfig();
const initializeVariable:()=>void=async()=>{
  const data:any =await fetchConfigData();  
  await SetupEnvConfig(data); 
};

const App: React.LazyExoticComponent<React.ComponentClass<ILayoutProps, any>> = lazy(() => import("../App"));

const appVersions: {
    uiKit: string;
    uiApplicationKit: string;
    authUi: string;
} = {
  uiKit: packageJson.dependencies["@essnextgen/ui-kit"],
  uiApplicationKit: packageJson.dependencies["@essnextgen/ui-application-kit"],
  authUi: packageJson.dependencies["@essnextgen/auth-ui"]
};

const Root: (props: any) => JSX.Element = ({ baseRouteName }: any) => {
  const [globarvar, setglobarvar]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = React.useState<boolean>(false);
  useEffect(() => {
    console.log('UI-Application kit (Home):^1.2.0');
    console.log('UI-kit(Home):"^0.24.9');

    console.log('App Versions:', appVersions);
    (async () => {
      try {          
        await initializeVariable(); 
        setglobarvar(true);
      } catch (error) { 
        console.log(error);       
      }      
    })();
  }, [globarvar]);
  return (
    <Suspense fallback={<></>}>
      <>
        {globarvar && <Provider store={configureStore()}>
          <App isStandaloneApp={false} baseRouteName={baseRouteName} />
        </Provider>}
      </>
    </Suspense>
  )
};

console.log('UI-Application kit (Home):^1.2.0');
console.log('UI-kit(Home):^0.24.9');
console.log('App Versions:', appVersions);

const leakedGlobalsLifecycles: any = singleSpaLeakedGlobals({
  globalVariableNames: [
    "REACT_API_URL",
    "AppInsightsConnectionString",
    "REACT_GA_TRACKING_ID",
    "APPLICATION"
  ]
});

const lifecycles: ReactAppOrParcel<any> = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  renderType: "render",
  errorBoundary() {
    // params (err, info, props)
    return <div>Error</div>;
  }
});

export const bootstrap: any[] = [
  leakedGlobalsLifecycles.bootstrap,
  lifecycles.bootstrap
];
export const mount: any[] = [leakedGlobalsLifecycles.mount, lifecycles.mount];
export const unmount: any[] = [leakedGlobalsLifecycles.unmount, lifecycles.unmount];
