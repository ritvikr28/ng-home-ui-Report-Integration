import  React,{  useState } from 'react';
import { Icon, IconColor } from "@essnextgen/ui-kit";
import QuickLink from "./QuickLink.view";
import { FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import  { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { QuicklinkComponentProps } from './props';
import { IFetchQuickLinkDetailsFunctionResponse } from '../../shared/model/quickLink/responsemodels';
import gtmAnalytics from "../../shared/utils/analytics";
 
 
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
   
  const [isStarClickable, setIsStarClickable]:any = useState(true);
  const handleStarClick: (
    id: number,
    favorite: boolean,
    name: string
  ) => Promise<void> = async (id: number, favorite: boolean,  name: string) => {
 
      try {
        /* istanbul ignore next */
        if (!isStarClickable) {         
          return;
        }
        setIsStarClickable(false);
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
      
      type ElementType = "empty_star" | "filled_star";
      const elementType: ElementType = favorite ? "empty_star" : "filled_star";
     
      gtmAnalytics.pushEvent({
        event: "interact_click",
        elementType,
        elementTextOrLabel: name,
        elementLocation: "body"
      });
      
    } catch (error) {
       /* istanbul ignore next */
      setIsError(true);
     
    }
    finally {
      /* istanbul ignore next */
      setTimeout(() => {
        setIsStarClickable(true);
      }, 1000);
    }
  };
 
  const displaystarredicon: (favorites: boolean, id: number,name: string) => JSX.Element = (
    favorites: boolean,
    id: number,
    name: string
  ) => (
    <div className="icon-quicklinkwidth">      
      <Icon
        color={favorites ? IconColor.Primary500 : IconColor.Neutral800}
        dataTestId={`btn-star${id}`}
        id="variable-2"
        name={favorites ? "star--filled" : "star"}
        size={16}
        onClick={() => {
          handleStarClick(id, !favorites, name);
        }}
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