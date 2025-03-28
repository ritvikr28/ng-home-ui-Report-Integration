import { waitFor } from "@testing-library/react";
import { AxiosResponse } from "axios";
import { service } from "../../../utils";
import {
  FetchGroupMemberDetailsData,
  FetchStaffTimeTableEventsData,
  useFetchSchoolNameData
} from "../schoolServices";
import { ISchoolName } from "../../../../features/MainPanel/WelcomeUser/model";
import {
  IGroupMemberDetailsResponse,
  IStaffTimeTableEventsResponse
} from "../../../model/SchoolDomain/responsemodels";

const mockApiResponse: ISchoolName = {
  externalId: "822cd4b0-a50b-4e58-bf67-262835cfb4b5",
  schoolName: "test"
};
const axiosResponse: AxiosResponse = {
  data: mockApiResponse,
  status: 200,
  statusText: "OK",
  config: {},
  headers: {}
};

const mockListofGroupExternalId: IGroupMemberDetailsResponse[] = [
  {
    membershipId: "20be3c01-76c0-4cbe-ba1a-59d91ede62fe",
    pupilExternalId: "f77d8422-c3c4-4cfc-b64b-dffd3e38a9c1",
    startDate: "2023-09-04T00:00:00",
    endDate: "2024-07-19T00:00:00",
    yearGroup: {
      externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      name: "Year  7"
    },
    regGroup: {
      externalId: "d846ee5e-3486-4727-b0a1-bc9389b4c3ac",
      name: "7A"
    },
    personalInfo: {
      preferredForename: "Borris",
      preferredSurname: "Becker",
      preferredName: "Borris Becker",
      legalForename: "Borris",
      legalSurname: "Becker",
      legalName: "Borris Becker"
    },
    personImage: null
  },
  {
    membershipId: "7607fe8b-7063-423f-a5c2-26fff7c36c2d",
    pupilExternalId: "a0818c4a-cb7c-442d-9329-346505160794",
    startDate: "2023-09-04T00:00:00",
    endDate: "2024-07-19T00:00:00",
    yearGroup: {
      externalId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      name: "Year  7"
    },
    regGroup: {
      externalId: "ab4d38b5-ad43-488e-8977-7edf527db780",
      name: "7C"
    },
    personalInfo: {
      preferredForename: "Harvey",
      preferredSurname: "Anderson",
      preferredName: "Harvey Anderson",
      legalForename: "Harvey",
      legalSurname: "Anderson",
      legalName: "Harvey Anderson"
    },
    personImage: null
  }
];

const data: any = {
  data: mockListofGroupExternalId
};

const mockGroupResponse: AxiosResponse = {
  data,
  status: 200,
  statusText: "OK",
  config: {},
  headers: {}
};

const mockStaffTimeTableEventsResponseWithSixRecords: IStaffTimeTableEventsResponse[] =
  [
    {
      externalId: "90ec7084-d8fa-4802-9021-1813ce1c48e9",
      eventStart: "2023-11-02T08:45:00",
      eventEnd: "2023-11-02T09:15:00",
      eventDescription: "1Thu:1",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Science"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
      yearGroupExternalId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      staff: {
        externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
        forename: "Lynn",
        surname: "Chase",
        preferredForename: null,
        preferredSurname: null
      },
      roomCover: null
    },
    {
      externalId: "c011c7c7-619e-4372-a384-d7a3e69b1651",
      eventStart: "2023-11-02T09:15:00",
      eventEnd: "2023-11-02T09:45:00",
      eventDescription: "1Thu:2",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Marathi"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
      yearGroupExternalId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      staff: {
        externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
        forename: "Lynn",
        surname: "Chase",
        preferredForename: null,
        preferredSurname: null
      },
      roomCover: null
    },
    {
      externalId: "d048c644-e390-4070-b695-24300adcb8c3",
      eventStart: "2023-11-02T09:45:00",
      eventEnd: "2023-11-02T10:15:00",
      eventDescription: "1Thu:3",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Hindi"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
      yearGroupExternalId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      staff: {
        externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
        forename: "Lynn",
        surname: "Chase",
        preferredForename: null,
        preferredSurname: null
      },
      roomCover: null
    },
    {
      externalId: "b31fb65e-2a69-4c22-b71f-736ae14f9dac",
      eventStart: "2023-11-02T10:15:00",
      eventEnd: "2023-11-02T10:45:00",
      eventDescription: "1Thu:4",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      group: {
        externalId: "6d6ce6d4-8652-47e5-92d5-7cd0bc877517",
        shortName: "10x/Sc2"
      },
      room: {
        externalId: "0fc24a31-779f-416e-87ba-e7d34d1dd9a5",
        roomCode: "S3",
        roomName: "Science Lab 3"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Sanskrit"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
      yearGroupExternalId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      staff: {
        externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
        forename: "Lynn",
        surname: "Chase",
        preferredForename: null,
        preferredSurname: null
      },
      roomCover: null
    },
    {
      externalId: "384d3e59-9e79-4604-a24d-ee3c14ecb41b",
      eventStart: "2023-11-02T11:00:00",
      eventEnd: "2023-11-02T11:30:00",
      eventDescription: "AM",
      levelCode: null,
      eventTypeCode: "AttendanceSession",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      group: {
        externalId: "335eb87a-6ce9-4fff-b10d-203ca2a632ef",
        shortName: "7B/Sc"
      },
      room: {
        externalId: "9242dd90-4787-415a-b161-846b8ab223bb",
        roomCode: "S5",
        roomName: "Science Lab 5"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Algebra"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
      yearGroupExternalId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      staff: {
        externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
        forename: "Lynn",
        surname: "Chase",
        preferredForename: null,
        preferredSurname: null
      },
      roomCover: null
    },
    {
      externalId: "9631c9c7-6c64-495c-ae25-eca00d351f8c",
      eventStart: "2023-11-02T11:30:00",
      eventEnd: "2023-11-02T12:00:00",
      eventDescription: "1Thu:6",
      levelCode: null,
      eventTypeCode: "TTPeriod",
      subjectColor: "primary",
      yearGroupColor: "SUPPORTING-OUTSTANDING",
      userPreference: "yeargroup",
      yearGroupId: "2b459f51-407d-4a52-ab4a-341f89259fb1",
      group: {
        externalId: "335eb87a-6ce9-4fff-b10d-203ca2a632ef",
        shortName: "7B/Sc"
      },
      room: {
        externalId: "9242dd90-4787-415a-b161-846b8ab223bb",
        roomCode: "S5",
        roomName: "Science Lab 5"
      },
      subject: {
        externalId: "cac55de6-6878-456c-bde4-096fa3af0c48",
        name: "Geometry"
      },
      supervisors: [
        {
          externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
          forename: "Lynn",
          surname: "Chase",
          preferredForename: null,
          preferredSurname: null
        }
      ],
      isCovered: null,
      isCovering: null,
      originalStaffExternalID: null,
      coveringStaffExternalID: null,
      eventInstanceExternalId: "62e2f4e9-453a-4a53-a940-139a492f5f96",
      classPeriodExternalId: "9b9fa124-fcda-4db0-ad71-0f73e7c09ea7",
      yearGroupExternalId: "d1c94243-c70e-4c9f-870a-a2a61a7e838d",
      staff: {
        externalId: "93fbd183-c32b-40a6-93d0-ab5187a2aa08",
        forename: "Lynn",
        surname: "Chase",
        preferredForename: null,
        preferredSurname: null
      },
      roomCover: null
    }
  ];

const mockStaffResponse: AxiosResponse = {
  data: mockStaffTimeTableEventsResponseWithSixRecords,
  status: 200,
  statusText: "OK",
  config: {},
  headers: {}
};

describe("School Service tests", () => {
  test("should return school Name", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(axiosResponse));
    const schoolData: any = await useFetchSchoolNameData();

    await waitFor(() => {
      expect(schoolData.schoolName).toBe("test");
    });
  });

  test("should return null when an error occurs", async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const result = await useFetchSchoolNameData();

    expect(result).toBeNull();
  });
});

describe("Fetch group member details tests", () => {
  test("should return group member details", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(mockGroupResponse));
    const groupDataResponse: any = await FetchGroupMemberDetailsData(
      "822cd4b0-a50b-4e58-bf67-262835cfb4b5",
      Date.UTC.toString(),
      Date.UTC.toString()
    );

    await waitFor(() => {
      expect(groupDataResponse.length).toBe(2);
    });
  });

  test("should return null when an error occurs", async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const result = await FetchGroupMemberDetailsData(
      "822cd4b0-a50b-4e58-bf67-262835cfb4b5",
      Date.UTC.toString(),
      Date.UTC.toString()
    );

    expect(result).toBeNull();
  });
});

describe("Fetch staff time table event details tests", () => {
  test("should return staff time table event details", async () => {
    jest
      .spyOn(service, "get")
      .mockImplementation(() => Promise.resolve(mockStaffResponse));
    const staffDataResponse: any = await FetchStaffTimeTableEventsData();
    await waitFor(() => {
      expect(staffDataResponse.status).toBe(200);
      expect(staffDataResponse.responseData).toBe(
        mockStaffTimeTableEventsResponseWithSixRecords
      );
    });
  });

  test("should return null when an error occurs", async () => {
    (service.get as jest.Mock).mockRejectedValue(new Error("Network Error"));

    const result = await FetchStaffTimeTableEventsData();

    expect(result).toBeNull();
  });
});
