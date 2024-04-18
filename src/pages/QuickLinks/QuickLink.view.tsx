import {  Redirect } from "react-router-dom";

import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Grid, GridItem, Link, Table, TableBody, TableCell, TableHead, TableRow, TableWrapper } from "@essnextgen/ui-kit";

import BreadcrumbWrapper from "../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";

import "./style.scss";
import "../NewHomePage/style.scss";
import { IQuickLinkViewProps } from "./props";
import SIMSupdatesView from "../SIMSUpdates/SIMSupdates.view";
import gtmAnalytics from "../../shared/utils/analytics";



const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.QuickLink",
    Operation: "View"
  }
];

const QuickLink: ({}: IQuickLinkViewProps) => JSX.Element = ({
  apiQuickLinkData,
  apiError,
  displaystarredicon,
  isOpen
  
}: IQuickLinkViewProps): JSX.Element => {  
 const isPermission: boolean = authService.isAuthorised(requiredPermissions, MatchPermissions.all) 

  return isPermission ? (
  
      <Grid className="quicklink-dertfsg11463f">
      <GridItem className="teacher-panel-container-dertfsg11463f quicklink-nomargin121">
      <GridItem className={isOpen? "breadcrumbs-open" : 'breadcrumbs'}> <BreadcrumbWrapper/></GridItem>
        <GridItem className={isOpen? "quicklink-container-dertfsg11463f open-quicklink-dertfsg11463f nopadding-dertfsg11463f quicklink-padding-dertfsg11463f":  "nopadding-dertfsg11463f quicklink-container-closed-dertfsg11463f "}>
          <GridItem className="quicklinkheading-dertfsg11463f">Quick links</GridItem>
          <GridItem className="quicklinktext-dertfsg11463f">
            Easy one-click access. Favouriting items will ensure your top selections are always visible.
          </GridItem>
          <GridItem>
          {!apiError &&  (
              <TableWrapper  className={isOpen ? "quicklinktable-dertfsg11463f quick-link-table-res-dertfsg11463f" : "quicklinktable-close-dertfsg11463f quick-link-table-res-dertfsg11463f"} >
                <Table dataTestId="test-id" id="element-id" >
                  <TableHead>
                    <TableRow>
                      <TableCell header className="theader">
                        Name
                      </TableCell>
                      <TableCell header className="theadercell">
                        Starred
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                  { 
                    apiQuickLinkData &&
                      apiQuickLinkData.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>                            
                            <Link data-testid="link" href={link.link} target="_self" >
                              <span onClick={() =>  gtmAnalytics.pushEvent({
                                        event: "click",
                                        linkText: link.name,
                                        linkUrl: link.link,
                                        clickType: "link",
                                        clickLocation:"body"
                                })}>
                                {link.name}
                              </span>
                            </Link>   
                          </TableCell>
                          <TableCell>{displaystarredicon(link.favourite, link.id , link.name)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            )}
          </GridItem>
          <GridItem>
          <div className={isOpen? "quicklink-divider-container-dertfsg11463f": "quicklink-divider-container-dertfsg11463f quicklink-divider-container-closed-dertfsg11463f"} />
          <div className="simspadding-dertfsg11463f">
            <SIMSupdatesView isOpen={isOpen}/>
          </div>
          </GridItem>
        </GridItem>
        </GridItem>
      </Grid>
  ) : (
    <Redirect to="/noAccess" />
  );
};

export default QuickLink;
