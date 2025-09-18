import { waitFor } from "@testing-library/react";
import { service } from "../../../utils";
import { FetchStaffTimetableAndRegisterDetails } from "../registerEventsDetails";

const mockTakeRegisterData = [
  {
    externalId: "37fe774b-52cd-4ed8-88ff-7f621f443168",

    narrative: "Tue:1",
    classPeriodExternalId: "8f8ad67d-5a06-4535-89c7-e9f9304c828f",
    eventInstanceExternalId: "102abdde-f55a-4a92-94b7-5eed15fe35c0",

    startDateTime: "2023-10-31T09:15:00",
    endDateTime: "2023-10-31T10:15:00",
    isCompleted: false,

    baseGroup: {
      externalId: "bba26eef-6670-4a9d-8501-e6ccc5c33790",
      code: "9x/Sc31",
      description: "9x/Sc3",
    },
    subject: {
      subjectExternalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      subjectCode: "Sc",
      subjectDescription: "Science",
    },
    room: {
      roomExternalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomDescription: "Science Lab 7",
    },

    isLesson: true,
  },
  {
    externalId: "26c16326-d7c6-4c8e-8283-bd7c0e06dfa3",

    narrative: "Tue:1",
    classPeriodExternalId: "3243ef19-170e-4ac0-8acd-0c70aa850831",
    eventInstanceExternalId: "102abdde-f55a-4a92-94b7-5eed15fe35c0",

    startDateTime: "2023-10-31T09:15:00",
    endDateTime: "2023-10-31T10:15:00",
    isCompleted: false,

    baseGroup: {
      externalId: "aabc2fa6-825c-4581-9341-f5ad0ad3dc69",
      code: "9x/Sc32",
      description: "9x/Sc3",
    },
    subject: {
      subjectExternalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      subjectCode: "Sc",
      subjectDescription: "Science",
    },
    room: {
      roomExternalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomDescription: "Science Lab 7",
    },

    isLesson: true,
  },
  {
    externalId: "c482ab21-e627-4fc2-b708-c6cf2b8f456a",

    narrative: "Tue:1",
    classPeriodExternalId: "1be18e5c-0011-4fd4-be52-fb2406eaacfa",
    eventInstanceExternalId: "102abdde-f55a-4a92-94b7-5eed15fe35c0",

    startDateTime: "2023-10-31T09:15:00",
    endDateTime: "2023-10-31T10:15:00",
    isCompleted: false,

    baseGroup: {
      externalId: "d9476c06-6946-4c01-8fd1-c5bbe3b70cb8",
      code: "9x/Sc33",
      description: "9x/Sc3",
    },
    subject: {
      subjectExternalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      subjectCode: "Sc",
      subjectDescription: "Science",
    },
    room: {
      roomExternalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomDescription: "Science Lab 7",
    },

    isLesson: true,
  },
  {
    externalId: "4b57b778-8cab-4eea-a098-068ac3608b7a",

    narrative: "Tue:2",
    classPeriodExternalId: "aed6f151-fc78-444c-b873-baa6787f3d1a",
    eventInstanceExternalId: "5ea5536a-9e0f-46ee-bb42-6051ded34ce5",

    startDateTime: "2023-10-31T10:15:00",
    endDateTime: "2023-10-31T11:15:00",
    isCompleted: false,

    baseGroup: {
      externalId: "d9476c06-6946-4c01-8fd1-c5bbe3b70cb8",
      code: "9x/Sc34",
      description: "9x/Sc3",
    },
    subject: {
      subjectExternalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      subjectCode: "Sc",
      subjectDescription: "Science",
    },
    room: {
      roomExternalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomDescription: "Science Lab 7",
    },

    isLesson: true,
  },
  {
    externalId: "4fd1b76e-34cc-457d-9174-980229e42495",

    narrative: "Tue:2",
    classPeriodExternalId: "e63bb897-b68c-49c7-84f0-624b8259f613",
    eventInstanceExternalId: "5ea5536a-9e0f-46ee-bb42-6051ded34ce5",

    startDateTime: "2023-10-31T10:15:00",
    endDateTime: "2023-10-31T11:15:00",
    isCompleted: false,

    baseGroup: {
      externalId: "bba26eef-6670-4a9d-8501-e6ccc5c33790",
      code: "9x/Sc3",
      description: "9x/Sc3",
    },
    subject: {
      subjectExternalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      subjectCode: "Sc",
      subjectDescription: "Science",
    },
    room: {
      roomExternalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomDescription: "Science Lab 7",
    },

    isLesson: true,
  },
  {
    externalId: "ad724f9c-9f1a-4da0-b2d8-c4fe0ccb6496",

    narrative: "Tue:2",
    classPeriodExternalId: "86de2ad5-c22a-488e-b8bc-9d52c97b4a48",
    eventInstanceExternalId: "5ea5536a-9e0f-46ee-bb42-6051ded34ce5",

    startDateTime: "2023-10-31T10:15:00",
    endDateTime: "2023-10-31T11:15:00",
    isCompleted: false,

    baseGroup: {
      externalId: "aabc2fa6-825c-4581-9341-f5ad0ad3dc69",
      code: "9x/Sc3",
      description: "9x/Sc3",
    },
    subject: {
      subjectExternalId: "a247cac3-3c7f-4391-860a-f9d3d8e469dd",
      subjectCode: "Sc",
      subjectDescription: "Science",
    },
    room: {
      roomExternalId: "6a91e7ce-37b9-4e32-b784-568fb3c35bb3",
      roomCode: "S7",
      roomDescription: "Science Lab 7",
    },

    isLesson: true
  }
];

describe("RegisterEventDetails test", () => {

  test("fetches register event data successfully when status is 200 and response is not null", async () => {
    jest.spyOn(service, "get").mockImplementation(() => Promise.resolve({
      data: {
        payload: {
          registerDetailResponse: mockTakeRegisterData,
          staffTimetableEventsResponse: null
        },
        errors: null,
        status: 200
      },
      status: 200,
      statusText: "OK",
      config: {},
      headers: {},
    }));
    const response: any = await FetchStaffTimetableAndRegisterDetails();
    await waitFor(() => {
      expect(response).not.toBeNull();
      expect(response.payload?.registerDetailResponse).toBe(mockTakeRegisterData);
    });
  });

  test("should return null when an error occurs", async () => {
    jest.spyOn(service, "get").mockRejectedValue(new Error("Network Error"));
    const result = await FetchStaffTimetableAndRegisterDetails();
    await waitFor(() => {
      expect(result).toBeNull();
    });
  });
});
