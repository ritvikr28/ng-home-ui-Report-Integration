import { PrivacyFilterDetails } from '../src/features/DocumentManagementServer/responseModel';
import {envConfig} from '../src/shared/utils/constants';

export const pageSizeNumber = 40;
export const homeurl = `${envConfig.HOME_UI_BASEURL}/adminconsole`;
export const WelcomeBannerUrl = `https://help.parentpaygroup.com/csm?id=csm_kb_article_view&sysparm_article=KB0014744`;
export const relatedToEnum = {
    "Pupil": 1,
    "Staff": 3,
    "Organisation": 2
};
export enum PrivacyFilterStatus {
  STANDARD = "STANDARD",
  CONFIDENTIAL = "CONFIDENTIAL"
}

export const DEFAULT_PRIVACY_FILTER: PrivacyFilterDetails[] = [
  { documentStatusId: 1, status: "PUBLIC", ngStatus: "STANDARD" },
  { documentStatusId: 3, status: "CONFIDENTIAL", ngStatus: "CONFIDENTIAL" }
];