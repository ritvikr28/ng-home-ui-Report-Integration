import React, { useState } from "react";
import {
  Button,
  ButtonColor,
  ButtonSize,
  Icon,
  IconColor,
  Tooltip,
  TooltipAlign,
  TooltipPosition
} from "@essnextgen/ui-kit";
import "./style.scss";
import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { SidePanelProps } from "./SidePanelProps";
import { fetchQuickLinkDetails } from "../../shared/components/QuickLink/Quicklinkresponse";
import { FetchQuickLinkpost } from "../../shared/services/quickLinkDomain/quickLinkService";
import { IFetchQuickLinkDetailsFunctionResponse} from "../../shared/model/quickLink/responsemodels";

const userFullname: string | null = authService.getUsername();


const requiredPermissionsforquicklink: Permission[] = [
  {
    Securable: "NG.Homepage.QuickLink",
    Operation: "View"
  }
];


const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  togglePanel,
  closePanel,
  showQuickLinkView,
  quicklinkData,
  setQuickLinkData
}) => {   
  
   const [isError, setIsError]:[boolean,React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
   const isPermissionquicklink : boolean = authService.isAuthorised(requiredPermissionsforquicklink, MatchPermissions.all)  
  
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
    <>
  <div
    className={`side-view ${isOpen ? "open open-panel" : "side-view-closed"}`}
  >
  
    {isOpen ? (
      <div>
        <div className="quick-lint-display">
      
        {userFullname && userFullname.length > 24 ? (
  <Tooltip
    align={TooltipAlign.Center}
    position={TooltipPosition.Bottom}
    content={<span>{userFullname}</span>}
  >
    <span className="quick-link-username" style={{ maxWidth: "230px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
      <strong>{userFullname}</strong>
    </span>
  </Tooltip>
) : (
  <span className="quick-link-username">
    <strong>{userFullname}</strong>
  </span>
)}

		     <span className="icon-close">
            {" "}
            <Icon
              color={IconColor.Primary500}
              dataTestId="btn-90"
              id="variable-2"
              name="close"
              onClick={closePanel}
              size={24}
            />
          </span>
        </div>
    { isPermissionquicklink && 
        <div>
          <div className="quick-link">Quick links</div>
          <div className="quick-link-padding">
          {/*
  eslint-disable
*/}
          {!isError && quicklinkData && quicklinkData.slice(0, 6).map((sidelink) => (
  <div
    className="quick-panel-cont"
    key={sidelink.id}
    onClick={() => window.location.href = sidelink.link}
    style={{ cursor: 'pointer' }}
  >
    {sidelink.name}
    <Icon
      color={sidelink.favourite ? IconColor.Primary500 : IconColor.Neutral800}
      className="icon-margin"
      dataTestId="btn-90"
      id="variable-2"
      name={sidelink.favourite ? 'star--filled' : 'star'}
      size={16}
      onClick={(e) => {
        e.stopPropagation(); // Prevent the div click event from being triggered
        handleStarClick(sidelink.id, !sidelink.favourite);
      }}
        /* eslint-enable */
    />
  </div>
))}


            
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
      }
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
  </>
  )
};

export default SidePanel;
