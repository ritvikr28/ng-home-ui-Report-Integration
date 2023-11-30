import { Link, Redirect } from "react-router-dom";
import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Grid, GridItem, Icon, IconColor, Table, TableBody, TableCell, TableHead, TableRow, TableWrapper } from "@essnextgen/ui-kit";
import { envConfig } from "../../shared/utils";
import BreadcrumbWrapper from "../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";

import { mockQuickLinks } from "../../shared/model/quickLink/responsemodels";
import SIMSupdatesView from "../../features/MainPanel/SIMSUpdates/SIMSupdates.view";
import "./style.scss";
import "../NewHomePage/style.scss";

const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",

    Operation: "View",
  }
];

const displaystarredicon = (favorites: boolean) => {
  if (favorites) {
    return (
      <Icon
        color={IconColor.Primary500}
        dataTestId="btn-90"
        id="variable-2"
        name="star--filled"
        size={16}
      />
    );
  }

  return (
    <Icon
      color={IconColor.Neutral800}
      dataTestId="btn-90"
      id="variable-2"
      name="star"
      size={16}
    />
  );
};

const QuickLink = () => {

  const isPermission =
  authService.isAuthorised(requiredPermissions, MatchPermissions.all) &&
  envConfig.IS_NEWHOMEPAGE_ACCESSIBLE === "True";
  
  return isPermission ? (
    <div className="teacher-panel-container ">
       <BreadcrumbWrapper  />
       <Grid className="quicklink">
       <GridItem
            lg={12}
            md={2}
            sm={2}
            className="quicklink-container nopadding"
          >
            <div className="quicklinkheading">Quick links</div>
            <div className="quicklinktext">
              Easy one-click access. Favouriting items will ensure your top
              selections are always visible.
            </div>
             <div > 
            <TableWrapper>
              <Table
                dataTestId="test-id"
                id="element-id"
                className="quicklinktable"
              >
                <TableHead>
                  <TableRow>
                    <TableCell header className="theader">
                      Name
                    </TableCell>
                    <TableCell  header className="theadercell"  >Starred</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
          {mockQuickLinks.map((link, index) => (
            <TableRow key={index}>
                 
              <TableCell><Link
                data-testid="link"
                href={link.linkUrl}
                target="_self" to={undefined}                     
                      >
                        {link.linkName}
                      </Link></TableCell>
              <TableCell> {displaystarredicon(link.starred)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
              </Table>
            </TableWrapper>
             </div> 
            <div className="quicklink-divider-container "/>
            <div className="simspadding"> 
            <SIMSupdatesView/>
            </div>
            </GridItem>
            </Grid>
    </div>
  
    ): (
      <Redirect to="/noAccess" />
    );
}

export default QuickLink;
