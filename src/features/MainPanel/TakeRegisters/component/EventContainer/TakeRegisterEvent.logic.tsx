import { Loader, LoaderType } from "@essnextgen/ui-kit";
import { useStaffTimetableAndRegisterDetails } from "../../../../../shared/context/StaffTimetableAndRegisterDetailsContext";
import TakeRegisterEventView from "./TakeRegisterEvent.view";
import "./carousalstyle.scss";

/* eslint-disable */
const TakeRegisterEvent: ({ isOpen, setIsOpen }: any) => JSX.Element = ({ isOpen }) => {
  const { data, isLoading, isError } = useStaffTimetableAndRegisterDetails();

  const now = new Date();

const isSameLocalDate = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const registerEventData = (data?.payload?.registerDetailResponse || [])
  .filter(event => {
    const eventStart = new Date(event.eventStart);
    const eventEnd = new Date(event.eventEnd);
    return isSameLocalDate(eventStart, now) && eventEnd >= now;
  })
  .sort((a, b) => new Date(a.eventStart).getTime() - new Date(b.eventStart).getTime());

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
