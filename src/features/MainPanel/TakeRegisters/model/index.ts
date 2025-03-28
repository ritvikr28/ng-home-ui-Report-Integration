export interface IRegistersDetails  {
    externalId?: string;
    type?: string;
    narrative?: string;
    classPeriodExternalId?: string;
    eventInstanceExternalId?: string;
    startDateTime?: string;
    endDateTime?: string;
    isCompleted?: boolean;
    
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
    isLesson?: boolean;
    
  };