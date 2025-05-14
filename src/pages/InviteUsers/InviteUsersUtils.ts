import { service } from "../../shared/utils/api-service";
import {
  IInviteUserData,
  InvitationStatusFilterOptions,
  IPaginationOptions
} from "./InviteUsersProps";

export const getUsersData: (
  props: IPaginationOptions
) => Promise<IInviteUserData> = async (props: IPaginationOptions) => {
  const response: any = await service.get(
    `/InviteUser/Users?PageNumber=${props.pageNumber}&PageSize=${props.pageSize}`
  );
  return response?.data;
};

export const fetchInviteUserDetails = async (props: IPaginationOptions) => {
  const {
    pageSize,
    setTotalPage,
    setShowErrorBanner,
    setshowInvitationConflictBanner
  } = props;
  try {
    const InviteUsersData: any = await getUsersData(props);
    if (setshowInvitationConflictBanner) {
      setshowInvitationConflictBanner(
        InviteUsersData[0]?.payload.some(
          (x: any) => x?.invitationStatus === "Invitation conflict"
        )
      );
    }

    const totalPages = Math.ceil(InviteUsersData[0].total / pageSize);
    if (setTotalPage) {
      setTotalPage(totalPages);
    }

    const tableDataObj: any[] = InviteUsersData[0]?.payload
      ?.filter(
        (item: any) =>
          !(
            (item?.forename === "" &&
            item?.surname === "") &&
            item?.emailId === "Work main email address is missing"
          )
          

      )
      .map((item: any) => ({
        id: item?.externalId,
        name: `${item?.forename} ${item?.surname}`,
        emailId:
          item?.emailId === "Work main email address is missing"
            ? "Primary email unavailable"
            : item?.emailId,
        userType: item?.userType,
        invitationStatus: item?.invitationStatus,
        actions: {
          options: [
            {
              disabled: false,
              isSelected: false,
              text: "Send Invite",
              value: "SendInvite"
            }
          ]
        },
        isShowActionBtn:
          !(
            item?.invitationStatus === InvitationStatusFilterOptions.Accepted ||
            item?.invitationStatus ===
              InvitationStatusFilterOptions.InvitationConflict
          ) && item?.emailId !== "Work main email address is missing"
      }));

    return tableDataObj;
  } catch (error) {
    if (setShowErrorBanner) {
      setShowErrorBanner(true);
    }
    return [];
  }
};
