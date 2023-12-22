import jwtDecode from "jwt-decode";
import { Permission, authService } from "@essnextgen/auth-ui";
import { isEmpty } from "@essnextgen/ui-kit";
import { decodedTokenProps } from "../../types/auth";


const decodeToken: (token: string) => decodedTokenProps = (
  token: string
): decodedTokenProps => jwtDecode(token);

export const isUserAdmin: () => boolean = () => {
  const idToken: string | null = authService.getIdToken();

  if (idToken) {
    const decodedToken: decodedTokenProps = decodeToken(idToken);
    if (Array.isArray(decodedToken.role)) {
      return decodedToken.role.some((e) => e.toLowerCase().includes("admin"));
    }
    return decodedToken.role?.toLowerCase().includes("admin");
  }

  return false;
};
export const getQuickLinkSecurablesList: () => Permission[] = () => {
  const permissionToken =  window.sessionStorage.getItem('PERMISSIONS') || '';
  if(permissionToken!=='')
  {
    const allowedPermissions: Permission[] = JSON.parse(
      atob(permissionToken)
    ) 
    
    const quickLinksPermissions:Permission[] =
    allowedPermissions.filter((x: Permission)=> ((x.Securable==="NG.Homepage.QuickLink.Teacher" && x.Operation==="View")|| 
     (x.Securable==="NG.Homepage.QuickLink.SLT" && x.Operation==="View") || (x.Securable==="NG.Homepage.QuickLink.Admin" &&  x.Operation==="View"))
  )
    return quickLinksPermissions;
  } 

  return [];
};
export const getUserOrganisation: () => string = () => {
  const idToken: string | null = authService.getAuthTokens();

  if (idToken) {
    const decodedToken: any = decodeToken(idToken);
    return isEmpty(decodedToken) ? '' : decodedToken['SIMSCX/OrganisationID'];
  }

  return '';
};
 /* istanbul ignore next */
export const getUser: () => string = () => {
  const authToken: string | null = authService.getAuthTokens();
 /* istanbul ignore next */
  if (authToken) {
    const decodedToken: any = decodeToken(authToken);
     /* eslint-disable */
    return decodedToken["SIMSCX/ExternalID"] === undefined &&
      decodedToken.userorganisationidentifier === undefined
      ? ""
      : decodedToken["SIMSCX/ExternalID"] !== undefined
      ? decodedToken["SIMSCX/ExternalID"]
      : decodedToken.userorganisationidentifier.split("|")[0];
       /* eslint-enable */
  }
  return "";
};