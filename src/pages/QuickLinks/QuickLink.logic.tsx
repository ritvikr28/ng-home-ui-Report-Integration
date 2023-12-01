import React, { useEffect, useState } from 'react';
import { Icon, IconColor } from "@essnextgen/ui-kit";
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";
import QuickLink from "./QuickLink.view";
import { FetchQuickLinkData, FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import QuickLinkResponseComponent from "../../shared/components/QuickLink/Quicklinkresponse";


const QuickLinkLogic: () => JSX.Element = () => {
  const [quickLinkData, setQuickLinkData]: [IQuickLinkApiResponse[] | null, React.Dispatch<React.SetStateAction<IQuickLinkApiResponse[] | null>>] = useState<IQuickLinkApiResponse[] | null>(null);
  
    const [isError, setIsError] = useState<boolean>(false);
     
        const fetchQuickLinkDetails = async () => {
          setIsError(true);
          setQuickLinkData(null);
          try {
            const quickLinkDetails = await FetchQuickLinkData("Teacher");
            console.log(quickLinkDetails);
            if(quickLinkDetails.status !==200 &&  quickLinkDetails.status !==204)
            {
                setIsError(true);
                setQuickLinkData(null);
            }
            else {
                setQuickLinkData(quickLinkDetails.response);
                setIsError(false);
            }
           
          } catch (error) {
            console.error("Error while fetching data:", error);
            setIsError(true);
          }
        };
        useEffect(() => {
        fetchQuickLinkDetails();
      }, []);

      const handleStarClick = async (id: number, favorite: boolean) => {
        console.log(`Clicked${  id}`);
        try {
          const { status, response } = await FetchQuickLinkpost(id, favorite);
          console.log(status, response);
          fetchQuickLinkDetails();
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
        <QuickLinkResponseComponent
          setQuickLinkData={setQuickLinkData}
          setIsError={setIsError}
        />
        <QuickLink
       apiQuickLinkData={quickLinkData}
        apiError={isError}
        displaystarredicon = {displaystarredicon}
      />
      </>
    );
   
  };
  export default QuickLinkLogic;