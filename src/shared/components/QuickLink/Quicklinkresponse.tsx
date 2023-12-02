import { Permission } from '@essnextgen/auth-ui';
import { FetchQuickLinkData } from "../../services/quickLinkDomain/quickLinkService";
import { getQuickLinkSecurablesList } from '../../utils';
import { IQuickLinkApiResponse } from '../../model/quickLink/responsemodels';

 /* eslint-disable */
   export const fetchQuickLinkDetails: () => Promise<{
    response: IQuickLinkApiResponse[];
    status: boolean;
} | null | undefined> = async () => {      
      try {
       const responsesecurable : Permission [] = getQuickLinkSecurablesList();
       const teachersecurable: Permission [] = responsesecurable.filter( x=> x.Securable === "NG.Homepage.QuickLink.Teacher");
      const permission: string=  teachersecurable.length > 0 ? teachersecurable[0].Securable.split(".")[3] : "" ;
        const quickLinkDetails = await FetchQuickLinkData(permission);        
      
        if (quickLinkDetails.status === 200 || quickLinkDetails.status === 204) {          
          const response:IQuickLinkApiResponse[] = quickLinkDetails.response;
           /* eslint-enable */
          const status:boolean = false ;         
          return  {response,status};          
        } 

      } catch (error) {
        return null;
          
      }
    };

    

