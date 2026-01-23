import React from "react";
import { RenderResult, fireEvent, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ActionCard } from "@essnextgen/ui-kit";
import TakeRegisterEventView from "../TakeRegisterEvent.view";

const mockTakeRegisterData: any[] = [
  {
    externalId: "37fe774b-52cd-4ed8-88ff-7f621f443168",
    eventStart: "2023-10-31T09:31:00",
    eventEnd: "2023-10-31T10:15:00",
    eventDescription: "AM",
    eventInstanceExternalId: "102abdde-f55a-4a92-94b7-5eed15fe35c0",
    eventTypeCode: "AttendanceSession",
    classPeriodExternalId: "8f8ad67d-5a06-4535-89c7-e9f9304c828f",
    group: {
      externalId: "bba26eef-6670-4a9d-8501-e6ccc5c33790",
      shortName: "9x/Sc31",
    },
    room: {
      externalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomName: "Science Lab 7",
    },
    subject: {
      externalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      name: "Science",
    },
    isCompleted: false,
  },
  {
    externalId: "26c16326-d7c6-4c8e-8283-bd7c0e06dfa3",
    eventTypeCode: "TTPeriod",
    eventDescription: "Tue:1",
    classPeriodExternalId: "3243ef19-170e-4ac0-8acd-0c70aa850831",
    eventInstanceExternalId: "102abdde-f55a-4a92-94b7-5eed15fe35c0",

    eventStart: "2023-10-31T07:15:00",
    eventEnd: "2023-10-31T9:10:00",
    isCompleted: false,

    group: {
      externalId: "aabc2fa6-825c-4581-9341-f5ad0ad3dc69",
      shortName: "9x/Sc32",
    },
    subject: {
      externalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      name: "Science",
    },
    room: {
      externalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomName: "Science Lab 7",
    },
  },
  {
    externalId: "c482ab21-e627-4fc2-b708-c6cf2b8f456a",
    eventTypeCode: "TTPeriod",
    eventDescription: "Tue:1",
    classPeriodExternalId: "1be18e5c-0011-4fd4-be52-fb2406eaacfa",
    eventInstanceExternalId: "102abdde-f55a-4a92-94b7-5eed15fe35c0",

    eventStart: "2023-10-31T09:15:00",
    eventEnd: "2023-10-31T10:15:00",
    isCompleted: false,

    group: {
      externalId: "d9476c06-6946-4c01-8fd1-c5bbe3b70cb8",
      shortName: "9x/Sc33",
    },

    subject: {
      externalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      name: "Science",
    },
    room: null,
  },
  {
    externalId: "4b57b778-8cab-4eea-a098-068ac3608b7a",
    eventTypeCode: "TTPeriod",
    eventDescription: "Tue:2",
    classPeriodExternalId: "aed6f151-fc78-444c-b873-baa6787f3d1a",
    eventInstanceExternalId: "5ea5536a-9e0f-46ee-bb42-6051ded34ce5",

    eventStart: "2023-10-31T10:15:00",
    eventEnd: "2023-10-31T11:15:00",
    isCompleted: false,

    group: {
      externalId: "d9476c06-6946-4c01-8fd1-c5bbe3b70cb8",
      shortName: "9x/Sc34",
    },
    subject: {
      externalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      name: "Science",
    },
    room: {
      externalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomName: "Science Lab 7",
    },
  },
  {
    externalId: "4fd1b76e-34cc-457d-9174-980229e42495",
    eventTypeCode: "TTPeriod",
    eventDescription: "Tue:2",
    classPeriodExternalId: "e63bb897-b68c-49c7-84f0-624b8259f613",
    eventInstanceExternalId: "5ea5536a-9e0f-46ee-bb42-6051ded34ce5",

    eventStart: "2023-10-31T10:15:00",
    eventEnd: "2023-10-31T11:15:00",
    isCompleted: true,

    group: {
      externalId: "bba26eef-6670-4a9d-8501-e6ccc5c33790",
      shortName: "9x/Sc3",
    },
    subject: {
      externalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      name: "Science",
    },
    room: {
      externalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomName: "Science Lab 7",
    },
  },
  {
    externalId: "ad724f9c-9f1a-4da0-b2d8-c4fe0ccb6496",
    eventTypeCode: "TTPeriod",
    eventDescription: "Tue:2",
    classPeriodExternalId: "86de2ad5-c22a-488e-b8bc-9d52c97b4a48",
    eventInstanceExternalId: "5ea5536a-9e0f-46ee-bb42-6051ded34ce5",
    eventStart: "2023-11-29T13:15:00",
    eventEnd: "2023-11-29T15:15:00",
    isCompleted: false,
    group: {
      externalId: "aabc2fa6-825c-4581-9341-f5ad0ad3dc69",
      shortName: "9x/Sc3",
    },
    subject: {
      externalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      name: "Science",
    },
    room: {
      externalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomName: "Science Lab 7",
    },
  }
];

jest.mock(
  "../../../../../../shared/services/registersDomain/registerEventsDetails",
  () => ({
    FetchRegisterEventData: jest.fn(),
  })
);

test("should render the Action Card", () => {
  const { getByTestId }: RenderResult = render(
    <ActionCard
      dataTestId="test-id"
      primaryText="PrimaryText"
      secondaryText="SecondaryText"
      onClickActionCard={() => { }}
    />
  );
  expect(getByTestId("test-id")).toBeInTheDocument();
});

test("renders without errors", () => {
  const { container }: RenderResult = render(
    <TakeRegisterEventView
      apiError={false}
      apiRegsiterEventData={mockTakeRegisterData}
      isOpen
    />
  );
  expect(container).toBeTruthy();
});

test("render tile on basis of time", () => {
  jest.useFakeTimers().setSystemTime(new Date("2023-11-29:13:58.00"));
  const setCurrentSlide: jest.Mock = jest.fn();
  const useStateMock: any = (init: any) => [init, setCurrentSlide];

  jest.spyOn(React, "useState").mockImplementation(useStateMock);

  const { container }: RenderResult = render(
    <TakeRegisterEventView
      apiError={false}
      apiRegsiterEventData={mockTakeRegisterData}
      isOpen
    />
  );
  expect(container).toBeTruthy();
  expect(setCurrentSlide).toHaveBeenCalled();
  expect(setCurrentSlide).toHaveBeenCalledWith(5);
});

test("render second tile as first", () => {
  jest.useFakeTimers().setSystemTime(new Date("2023-10-31:9:30.00"));
  const setCurrentSlide: jest.Mock = jest.fn();
  const useStateMock: any = (init: any) => [init, setCurrentSlide];

  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  const { container }: RenderResult = render(
    <TakeRegisterEventView
      apiError={false}
      apiRegsiterEventData={mockTakeRegisterData}
      isOpen
    />
  );
  expect(container).toBeTruthy();
  expect(setCurrentSlide).toHaveBeenCalled();
});

test.skip("renders No registers today", () => {
  const { getByText, getByTestId }: any = render(
    <TakeRegisterEventView apiError={false} apiRegsiterEventData={null} isOpen />
  );
  fireEvent.click(getByTestId("no-test-id"));
  expect(getByText("No registers today")).toBeInTheDocument();

});

test.skip("click the previous button should render previous tile", () => {
  jest.useFakeTimers().setSystemTime(new Date("2023-11-29:13:58.00"));
  const setCurrentSlide: any = jest.fn();
  const useStateMock: any = () => [5, setCurrentSlide];

  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  const { getByTestId }: any = render(
    <TakeRegisterEventView
      apiError={false}
      apiRegsiterEventData={mockTakeRegisterData}
      isOpen={false}
    />
  );
  expect(getByTestId("btn-previous")).not.toBeDisabled();
  userEvent.click(getByTestId("btn-previous"));
  jest.runAllTimers();
  expect(setCurrentSlide).toHaveBeenCalledTimes(1);
});

test.skip("click the next button should render next tile", () => {
  jest.useFakeTimers().setSystemTime(new Date("2023-10-31:9:30.00"));
  const setCurrentSlide: any = jest.fn();
  const useStateMock: any = () => [1, setCurrentSlide];

  jest.spyOn(React, "useState").mockImplementation(useStateMock);
  const { getByTestId }: RenderResult = render(
    <TakeRegisterEventView
      apiError={false}
      apiRegsiterEventData={mockTakeRegisterData}
      isOpen
    />
  );
  expect(getByTestId("btn-next")).not.toBeDisabled();
  userEvent.click(getByTestId("btn-next"));
  jest.runAllTimers();
  expect(setCurrentSlide).toHaveBeenCalledTimes(1);
});

test("disables the previous button when api returns null", () => {
  const { getByTestId }: any = render(
    <TakeRegisterEventView apiError={false} apiRegsiterEventData={null} isOpen />
  );
  const previousButton: HTMLElement = getByTestId("btn-previous");

  expect(previousButton).toBeDisabled();
});

test("disables the next button when api returns null", () => {
  const { getByTestId }: any = render(
    <TakeRegisterEventView apiError={false} apiRegsiterEventData={null} isOpen />
  );
  const nextButton: HTMLElement = getByTestId("btn-next");

  expect(nextButton).toBeDisabled();
});
