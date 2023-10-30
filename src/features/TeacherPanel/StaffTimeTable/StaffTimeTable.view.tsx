import "./style.scss";
import StaffTimeTableLinkview from "./component/StaffTimeTableLink/StaffTimeTableLink.view";
import EventContainerView from "./component/EventContainer/EventContainer.view";

export const StaffTimeTableView: () => JSX.Element = () => (
  <div className="upcoming-schedule-conatiner">
    <StaffTimeTableLinkview />
    <EventContainerView />
  </div>
);

export default StaffTimeTableView;
