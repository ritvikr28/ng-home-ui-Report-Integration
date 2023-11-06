export interface IRegistersDetails  {
    externalId?: string;
    type?: string;
    narrative?: string;
    startDateTime?: string;
    endDateTime?: string;
    baseGroup: {
      externalId?: string;
      code?: string;
      description?: string;
    };
    subject: {
      subjectExternalId?: string;
      subjectCode?: string;
      subjectDescription?: string;
    };
    room: {
      roomExternalId?: string;
      roomCode?: string;
      roomDescription?: string;
    };

    isCompleted?: boolean;
    isLesson?: boolean;
    classPeriodExternalId?: string;
    eventInstanceExternalId?: string;
  };