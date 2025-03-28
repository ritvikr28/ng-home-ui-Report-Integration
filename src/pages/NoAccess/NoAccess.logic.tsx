import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { authService } from "@essnextgen/auth-ui";
import NoAccessView from "./NoAccess.view";

const NoAccess: React.FC = (): JSX.Element => {
  const [isAuthzAdmin, setAuthzAdmin]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);
  const decodedAuthzToken: any = (token: string) => jwtDecode(token);

  const isAuthzUserAdmin: () => void = (): void => {
    const accessToken: string | null = authService.getAuthTokens();

    if (!accessToken) {
      setAuthzAdmin(false);
    } else {
      const decodedToken: any = decodedAuthzToken(accessToken);
      if (decodedToken != null) {
        const role =
          (decodedToken["SIMSCX/Role"] as string)
            ?.split("@")[0]
            ?.toLowerCase() || "";

        if (role === "") {
          setAuthzAdmin(false);
        } else {
          setAuthzAdmin(role.includes("admin"));
        }
      }
    }
  };

  useEffect(() => {
    isAuthzUserAdmin();
  }, []);

  return <NoAccessView IsAuthzAdmin={isAuthzAdmin} />;
};

export default NoAccess;
