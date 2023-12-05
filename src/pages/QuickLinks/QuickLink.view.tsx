import {  Redirect } from "react-router-dom";

import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Grid, GridItem, Link, Table, TableBody, TableCell, TableHead, TableRow, TableWrapper } from "@essnextgen/ui-kit";

import BreadcrumbWrapper from "../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";
import SIMSupdatesView from "../../features/MainPanel/SIMSUpdates/SIMSupdates.view";
import "./style.scss";
import "../NewHomePage/style.scss";
import { IQuickLinkViewProps } from "./props";


const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage.QuickLink",
    Operation: "View"
  }
];

const QuickLink: ({}: IQuickLinkViewProps) => JSX.Element = ({
  apiQuickLinkData,
  apiError,
  displaystarredicon
}: IQuickLinkViewProps): JSX.Element => {  
 const isPermission =
  authService.isAuthorised(requiredPermissions, MatchPermissions.all) 

  return isPermission ? (
    <div className="teacher-panel-container">
      <BreadcrumbWrapper />
      <Grid className="quicklink">
        <GridItem lg={12} className="quicklink-container nopadding">
          <div className="quicklinkheading">Quick links</div>
          <div className="quicklinktext">
            Easy one-click access. Favouriting items will ensure your top selections are always visible.
          </div>
          <div>
          {!apiError &&  (
              <TableWrapper className="quicklinktable" >
                <Table dataTestId="test-id" id="element-id" className="quicklinktable">
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
                    {apiQuickLinkData &&
                   
                      apiQuickLinkData.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell>
                            
                            <Link data-testid="link" href={link.link} target="_self">
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
          </div>
          <div className="quicklink-divider-container" />
          <div className="simspadding">
            <SIMSupdatesView />
          </div>
        </GridItem>
      </Grid>
    </div>
  ) : (
    <Redirect to="/noAccess" />
  );
};

export default QuickLink;
