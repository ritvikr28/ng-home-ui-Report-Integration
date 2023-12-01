import React, { useState } from 'react';
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";
import QuickLink from "./QuickLink.view";
import QuickLinkResponseComponent from "../../shared/components/QuickLink/Quicklinkresponse";


const QuickLinkLogic: () => JSX.Element = () => {
  const [quickLinkData, setQuickLinkData]: [IQuickLinkApiResponse[] | null, React.Dispatch<React.SetStateAction<IQuickLinkApiResponse[] | null>>] = useState<IQuickLinkApiResponse[] | null>(null);
  
   const [isError, setIsError] = useState<boolean>(false);

    return (
      <>
        {" "}
        <QuickLinkResponseComponent
          setQuickLinkData={setQuickLinkData}
          setIsError={setIsError}
        />
        <QuickLink
       apiQuickLinkData={quickLinkData}
        apiError={isError}
      />
      </>
    );
   
  };
  export default QuickLinkLogic;