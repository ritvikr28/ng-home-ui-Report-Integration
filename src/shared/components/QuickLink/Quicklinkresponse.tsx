import React, {  useEffect } from 'react';
import { Permission } from '@essnextgen/auth-ui';
import { IQuickLinkApiResponse } from "../../model/quickLink/responsemodels";
import { FetchQuickLinkData } from "../../services/quickLinkDomain/quickLinkService";
import { getQuickLinkSecurablesList } from '../../utils';


interface QuicklinkComponentProps {
  setQuickLinkData: React.Dispatch<React.SetStateAction<IQuickLinkApiResponse[] | null>>;
  setIsError: React.Dispatch<React.SetStateAction<boolean>>;
}

// const QuickLinkResponseComponent: React.FC<QuicklinkComponentProps> = ({ setQuickLinkData, setIsError }) => {
//   useEffect(() => {
//     const fetchQuickLinkDetails = async () => {
//       setIsError(false);
//       try {
//        const responsesecurable : Permission [] = getQuickLinkSecurablesList();
//        const teachersecurable = responsesecurable.filter( x=> x.Securable === "NG.Homepage.QuickLink.Teacher");
//       const permission=  teachersecurable.length > 0 ? teachersecurable[0].Securable.split(".")[3] : "" ;
//         const quickLinkDetails = await FetchQuickLinkData(permission);
      
//         if (quickLinkDetails.status === 200 || quickLinkDetails.status === 204) {
//           setQuickLinkData(quickLinkDetails.response);
//           setIsError(false);
//         } else {
//           setIsError(true);
//           setQuickLinkData(null); 
//         }

//       } catch (error) {
        
//         setIsError(true);
//         setQuickLinkData(null); 
//       }
//     };

//     fetchQuickLinkDetails();
//   }, [setQuickLinkData, setIsError]);

//   return null;
// };


   export const fetchQuickLinkDetails = async () => {
      
      try {
       const responsesecurable : Permission [] = getQuickLinkSecurablesList();
       const teachersecurable = responsesecurable.filter( x=> x.Securable === "NG.Homepage.QuickLink.Teacher");
      const permission=  teachersecurable.length > 0 ? teachersecurable[0].Securable.split(".")[3] : "" ;
        const quickLinkDetails = await FetchQuickLinkData(permission);
         
      
        if (quickLinkDetails.status === 200 || quickLinkDetails.status === 204) {
          const response = quickLinkDetails.response;
          const status = false ;
          console.log(response);
          return  {response,status};
          
        } 

      } catch (error) {
        return null;
          
      }
    };

    

