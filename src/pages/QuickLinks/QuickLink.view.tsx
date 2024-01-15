import {  Redirect } from "react-router-dom";

import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Grid, GridItem, Link, Table, TableBody, TableCell, TableHead, TableRow, TableWrapper } from "@essnextgen/ui-kit";

import BreadcrumbWrapper from "../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";

import "./style.scss";
import "../NewHomePage/style.scss";
import { IQuickLinkViewProps } from "./props";
import SIMSupdatesView from "../SIMSUpdates/SIMSupdates.view";



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
  
      <Grid className="quicklink">
      <GridItem className="teacher-panel-container">
      <GridItem className={isOpen? "" : 'breadcrumbs'}> <BreadcrumbWrapper/></GridItem>
        <GridItem lg={12} className="quicklink-container nopadding">
          <GridItem className="quicklinkheading">Quick links</GridItem>
          <GridItem className="quicklinktext">
            Easy one-click access. Favouriting items will ensure your top selections are always visible.
          </GridItem>
          <GridItem>
          {!apiError &&  (
              <TableWrapper  className={isOpen ? "quicklinktable" : "quicklinktable-close"} >
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
                                {link.name}
                            </Link>
                          </TableCell>
                          <TableCell>{displaystarredicon(link.favourite, link.id)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            )}
          </GridItem>
          <GridItem>
          <div className="quicklink-divider-container" />
          <div className="simspadding">
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
