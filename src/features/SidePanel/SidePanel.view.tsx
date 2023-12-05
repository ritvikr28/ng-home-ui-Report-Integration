import React, { useState } from "react";
import {
  Button,
  ButtonColor,
  ButtonSize,
  Icon,
  IconColor,
  Link
} from "@essnextgen/ui-kit";
import "./style.scss";
import { authService } from "@essnextgen/auth-ui";
import { SidePanelProps } from "./SidePanelProps";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import { IFetchQuickLinkDetailsFunctionResponse} from "../../shared/model/quickLink/responsemodels";

const userFullname: string | null = authService.getUsername();


const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  togglePanel,
  closePanel,
  showQuickLinkView,
  quicklinkData,
  setQuickLinkData
}) => {   
  
   const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);  
  
  const handleStarClick: (id: number, favorite: boolean) => Promise<void> = async (id: number, favorite: boolean) => {    
    try {
      const { status }:{ status:number } = await FetchQuickLinkpost(id, favorite);
      if(status===200)
      {
        const responseapidata : IFetchQuickLinkDetailsFunctionResponse | null | undefined=  await fetchQuickLinkDetails();
        if(responseapidata !=null)
        {
         setQuickLinkData(responseapidata?.response) ;
       
        }           
      }
     else{
      setIsError(true);
     }
   
    } catch (error) {
      console.error( error);
    }
  };

  
  return (
  <div
    className={`side-view ${isOpen ? "open open-panel" : "side-view-closed"}`}
  >
  
    {isOpen ? (
      <div>
        <div
          className="quick-lint-display"
          style={{ display: "flex", marginBottom: "24px" }}
        >
          <span className="quick-link-username">
            <strong>{userFullname}</strong>
          </span>
          <span>
            {" "}
            <Icon
              color={IconColor.Primary500}
              dataTestId="btn-90"
              id="variable-2"
              name="close"
              className="close-icon"
              onClick={closePanel}
              size={24}
            />
          </span>
        </div>
        <div>
          <div className="quick-link">Quick links</div>
          <div className="quick-link-padding">
          
            {!isError && quicklinkData && quicklinkData.slice(0,6).map((sidelink) => (<div  className="quick-panel-cont">
            <Link key={sidelink.id}  data-testid="link" href={sidelink.link} target="_self">
                              {sidelink.name}
                            </Link>
              <Icon
                color={sidelink.favourite ? IconColor.Primary500 : IconColor.Neutral800 } 
                className="icon-margin"
                dataTestId="btn-90"
                id="variable-2"
                name={sidelink.favourite ? 'star--filled' : 'star'}
                size={16}
                onClick={() => handleStarClick(sidelink.id, !sidelink.favourite)}
              />
            </div>))}
            
            {/*
  eslint-disable jsx-a11y/anchor-is-valid,
  no-script-url
*/}
            <a
              href="javascript:void(0)"
              className="see-all"
              onClick={showQuickLinkView}
            >
              See all
            </a>
            {/*
  eslint-enable jsx-a11y/anchor-is-valid,
  no-script-url
*/}
          </div>
        </div>
      </div>
    ) : (
      <div
        className="open-panel essui-open-panel-filled"
        data-testId="close-panel"
      >
        <Button
          className="base-class"
          color={ButtonColor.Utility}
          dataTestId="btn-collapse"
          iconColor={IconColor.Neutral800}
          iconName="open-panel--left--filled"
          onClick={togglePanel}
          size={ButtonSize.Small}
        />
      </div>
    )}
    <div />
  </div>
  )
};

export default SidePanel;
