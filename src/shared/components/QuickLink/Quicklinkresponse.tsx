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
       console.log(responsesecurable)
       const teachersecurable: string [] =[]; 
       if(responsesecurable.length>0){
        responsesecurable.map((x)=>{
          const role: string = x.Securable.split(".")[3];
          teachersecurable.push(role);
        })
       }
      const permission: string=  teachersecurable.toString();
        const quickLinkDetails:{
          status: number;
          response: IQuickLinkApiResponse[];
      } = await FetchQuickLinkData(permission);        
      
        if (quickLinkDetails.status === 200 || quickLinkDetails.status === 204) {          
          const response:IQuickLinkApiResponse[] = quickLinkDetails.response;
           /* eslint-enable */
          const status = false ;         
          return  {response,status};          
        } 

      } catch (error) {
        return null;
          
      }
    };

    

