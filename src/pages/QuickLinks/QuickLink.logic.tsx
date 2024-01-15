import  React,{  useState } from 'react';
import { Icon, IconColor } from "@essnextgen/ui-kit";
import QuickLink from "./QuickLink.view";
import { FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import  { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { QuicklinkComponentProps } from './props';
import { IFetchQuickLinkDetailsFunctionResponse } from '../../shared/model/quickLink/responsemodels';


const QuickLinkLogic: React.FC<
  QuicklinkComponentProps & { isOpen: boolean }
> = ({
  setQuickLinkData,
  apiQuickLinkData,
  isOpen
}: QuicklinkComponentProps & { isOpen: boolean }) => {
  const [isError, setIsError]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

 
  const handleStarClick: (
    id: number,
    favorite: boolean
  ) => Promise<void> = async (id: number, favorite: boolean) => {
     
      try {
      const { status }: { status: number } = await FetchQuickLinkpost(
        id,
        favorite
      );
      if (status === 200) {
        const responseapidata:
          | IFetchQuickLinkDetailsFunctionResponse
          | null
          | undefined = await fetchQuickLinkDetails();
        if (responseapidata != null) {
          setQuickLinkData(responseapidata.response);
          
        }
      } 
    } catch (error) {
       /* istanbul ignore next */
      setIsError(true);
      
    }
  };

  const displaystarredicon: (favorites: boolean, id: number) => JSX.Element = (
    favorites: boolean,
    id: number
  ) => (
    <div className="icon-quicklinkwidth">
    <Icon
      color={favorites ? IconColor.Primary500 : IconColor.Neutral800}
      dataTestId={`btn-star${id}`}
      id="variable-2"
      name={favorites ? "star--filled" : "star"}
      size={16}
      onClick={() => handleStarClick(id, !favorites)}
    />
    </div>
    );

  return (
    
      <QuickLink
        apiQuickLinkData={apiQuickLinkData}
        apiError={isError}
        displaystarredicon={displaystarredicon}
        isOpen ={isOpen}
        
      />
    
  );
};
export default QuickLinkLogic;
