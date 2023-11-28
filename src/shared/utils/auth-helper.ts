import jwtDecode from "jwt-decode";
import { Permission, authService } from "@essnextgen/auth-ui";

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
  const permissionToken:string =  window.sessionStorage.getItem('PERMISSIONS') || '';
  if(permissionToken!=='')
  {
    const allowedPermissions: Permission[] = JSON.parse(
      atob(permissionToken)
    ) 
    
    const quickLinksPermissions:Permission[] =
    allowedPermissions.filter((x: Permission)=> (x.Securable==="NG.Homepage.QuickLink.Teacher"|| 
     x.Securable==="NG.Homepage.QuickLink.SLT" || x.Securable==="NG.Homepage.QuickLink.Admin")
  )
    return quickLinksPermissions;
  } 

  return [];
};