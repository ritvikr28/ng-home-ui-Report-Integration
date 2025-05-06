import { Redirect } from "react-router-dom";

import { MatchPermissions, Permission, authService } from "@essnextgen/auth-ui";
import { Divider,Link, Table, TableBody, TableCell, TableHead, TableRow, TableWrapper } from "@essnextgen/ui-kit";
import { UseTranslationResponse, useTranslation } from "@essnextgen/ui-intl-kit";
import BreadcrumbWrapper from "../../shared/components/BreadcrumbWrapper/BreadcrumbWrapper";

import "./style.scss";
// import "../NewHomePage/style.scss";
import { IQuickLinkViewProps } from "./props";
import gtmAnalytics from "../../shared/utils/analytics";
import SIMSupdatesView from "../../shared/components/SIMSUpdates/SIMSupdates.view";
import { FilledLeftPanelIcon } from "../../shared/components/CommonElement/FilledButton";


const requiredPermissions: Permission[] = [
  {
    Securable: "NG.Homepage",
    Operation: "View"
  }
];

const QuickLink: ({ }: IQuickLinkViewProps) => JSX.Element = ({
  apiQuickLinkData,
  apiError,
  displaystarredicon,
  isOpen,
  togglePanel

}: IQuickLinkViewProps): JSX.Element => {
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  const isPermission: boolean = authService.isAuthorised(requiredPermissions, MatchPermissions.all)
  const filteredQuickLinkData = apiQuickLinkData?.filter(link => link.name !== t("quickLink.classview")) || [];
  
  return isPermission ? (
    <>
      <div className="quicklink-main-container">

        <div className="quicklink-breadcrumb">
          {!isOpen && <div className="quicklink-openclose-btn">
             <button
              type="button"
              className="new-sidepanel-toggle-btn-quicklink"
              onClick={togglePanel}
            >
              <FilledLeftPanelIcon />
            </button>
          </div>
          }
          <BreadcrumbWrapper />
        </div>
        <div className="quicklink-table">
          <>
            <div className="quicklinks-heading">{t("quickLink.headingTitle")}</div>
            <div className="quicklinks-subheading"> {t("quickLink.quicklinkText")}</div>
          </>
          <div className={isOpen ? "quicklinks-table" : ""}>
            {!apiError && (
              <TableWrapper>
                <Table dataTestId="test-id" id="element-id" >
                  <TableHead>
                    <TableRow>
                      <TableCell header className="theader" columnWidth="449px">
                      {t("quickLink.quicklinkTableColumnName")}
                      </TableCell>
                      <TableCell header className="theadercell" columnWidth="700px">
                      {t("quickLink.quicklinkTableColumStarred")}
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {
                      filteredQuickLinkData.map((link) => (
                        <TableRow key={link.id}>
                          <TableCell columnWidth="449px">
                            <Link data-testid="link" href={link.link} target="_self" >
                              <span onClick={() => gtmAnalytics.pushEvent({
                                event: "click",
                                linkText: link.name,
                                linkUrl: link.link,
                                clickType: "link",
                                clickLocation: "body"
                              })}>
                                {link.name}
                              </span>
                            </Link>
                          </TableCell>
                          <TableCell columnWidth="700px">{displaystarredicon(link.favourite, link.id, link.name)}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableWrapper>
            )}
          </div>
          <>
            <div className="quicklinks-divider"><Divider /></div>
            <div className="new-margin-b-container-sims"><SIMSupdatesView isOpen={isOpen} /></div>
            <div style={{padding:"30px 0"}}/>
          </>
        </div>
      </div>
    </>
  ) : (
    <Redirect to="/noAccess" />
  );
};

export default QuickLink;
