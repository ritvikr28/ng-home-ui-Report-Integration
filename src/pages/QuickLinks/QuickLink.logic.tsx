import { useEffect, useState } from "react";
import { IQuickLinkApiResponse } from "../../shared/model/quickLink/responsemodels";
import QuickLink from "./QuickLink.view";
import { FetchQuickLinkData } from "../../shared/services/quickLinkDomain/quickLinkService";


const QuickLinkLogic: () => JSX.Element = () => {
    const [quickLinkData
      , setQuickLinkData] = useState<
      IQuickLinkApiResponse[] | null
    >(null);
  
    const [isError, setIsError] = useState<boolean>(false);
     
  
    useEffect(() => {
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
    
        fetchQuickLinkDetails();
      }, []);
  
    return (
      <QuickLink
       apiQuickLinkData={quickLinkData}
        apiError={isError}
      />
    );
  };
  export default QuickLinkLogic;