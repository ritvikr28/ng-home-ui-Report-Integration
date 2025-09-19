import { Loader, LoaderType } from "@essnextgen/ui-kit";
import { useStaffTimetableAndRegisterDetails } from "../../../../../shared/context/StaffTimetableAndRegisterDetailsContext";
import TakeRegisterEventView from "./TakeRegisterEvent.view";
import "./carousalstyle.scss";

/* eslint-disable */
const TakeRegisterEvent: ({ isOpen, setIsOpen }: any) => JSX.Element = ({ isOpen }) => {
  const { data, isLoading, isError } = useStaffTimetableAndRegisterDetails();
  const registerEventData = data?.payload?.registerDetailResponse || null;

  if (isLoading) {
    return (
      <div style={{ marginTop: "20px", height: "120px" }}>
        <Loader
          dataTestId="reg-error-loader"
          className="reg-loader loader-margin loader-reg-size reg-loader-margin reg-size-margin"
          loaderText="Loading..."
          loaderType={LoaderType.Circular}
        />
      </div>
    );
  }
  return (
    <TakeRegisterEventView
      apiRegsiterEventData={registerEventData}
      apiError={isError}
      isOpen={isOpen}
    />
  );
};

export default TakeRegisterEvent;
