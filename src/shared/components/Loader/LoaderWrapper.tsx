import React from "react";
import { Loader, LoaderType } from "@essnextgen/ui-kit";

interface LoaderWrapperProps {
  loaderText: string;
}

const LoaderWrapper: React.FC<LoaderWrapperProps> = ({ loaderText }) => 
   (
    <>
      <div style={{ height: "110px" }}>
      <Loader
        dataTestId="staff-data-loader"
        className="reg-loader loader-margin loader-size reg-loader-margin"
        loaderText={loaderText ?? "Loading..."}
        loaderType={LoaderType.Circular}
      />
      </div>
    </>
);

export default LoaderWrapper;