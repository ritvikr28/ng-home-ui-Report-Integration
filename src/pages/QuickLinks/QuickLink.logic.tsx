import  { useEffect, useState } from 'react';
import { Icon, IconColor } from "@essnextgen/ui-kit";
import QuickLink from "./QuickLink.view";
import { FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import  { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { QuicklinkComponentProps } from './props';


const QuickLinkLogic: ({ setQuickLinkData ,apiQuickLinkData}:QuicklinkComponentProps ) => JSX.Element = ({ setQuickLinkData,apiQuickLinkData }:QuicklinkComponentProps ) => {
  
  
      const [isError, setIsError] = useState<boolean>(false);
  useEffect(() => {
    (async () => {
      try {          
        const responseapidata  = await fetchQuickLinkDetails(); 
       if( responseapidata !=null )
       {         
        setIsError(responseapidata.status);
       }
       
      } catch (error) { 
        console.log(error);       
      }      
    })();
  }, []);  

     
      const handleStarClick = async (id: number, favorite: boolean) => {        
        try {
          const { status } = await FetchQuickLinkpost(id, favorite);
          if(status===200)
          {
            const responseapidata =  await fetchQuickLinkDetails();
            if(responseapidata !=null)
            {
             setQuickLinkData(responseapidata?.response) ;             
            }
          }
        else{
          setIsError(true);
        }
       
        } catch (error) {
          console.error(error);
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
        apiError={isError}
        displaystarredicon = {displaystarredicon}
      />
      </>
    );
   
  };
  export default QuickLinkLogic;