import React, { useEffect, useState } from 'react';
import { Icon, IconColor } from "@essnextgen/ui-kit";
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";
import QuickLink from "./QuickLink.view";
import { FetchQuickLinkData, FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import  { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { IQuickLinkProps, IQuickLinkViewProps } from './props';


const QuickLinkLogic: ({apiQuickLinkData} :IQuickLinkProps ) => JSX.Element = ({apiQuickLinkData} :IQuickLinkProps  ) => {
  
  //  const [quickLinkData, setQuickLinkData]: any = useState<IQuickLinkApiResponse[] | null>(quickLinkData);
  //    const [isError, setIsError] = useState<boolean>(false);
   
  

     
      const handleStarClick = async (id: number, favorite: boolean) => {
        console.log(`Clicked${  id}`);
        try {
          const { status, response } = await FetchQuickLinkpost(id, favorite);
          
         const responseapidata =  await fetchQuickLinkDetails();
         if(responseapidata !=null)
         {
          apiQuickLinkData = responseapidata?.response ;
         }
         console.log("fetchQuickLinkDetails",responseapidata?.response);
         console.log("FetchQuickLinkpost",status, response);
        // setQuickLinkData(apiQuickLinkData);
       
        } catch (error) {
          console.error("Error making the POST request:", error);
        }
      };

      const displaystarredicon = (favorites: boolean, id: number) => (
          <Icon
            color={favorites ? IconColor.Primary500 : IconColor.Neutral800}
            dataTestId="btn-90"
            id="variable-2"
            name={favorites ? 'star--filled' : 'star'}
            size={16}
            onClick={() => handleStarClick(id, !favorites)}
          />
        );
  
    return (
      <>
        {" "}
        
        <QuickLink
       apiQuickLinkData={apiQuickLinkData}
        //apiError={isError}
        displaystarredicon = {displaystarredicon}
      />
      </>
    );
   
  };
  export default QuickLinkLogic;