export interface IAttendanceInsights {
  attendanceCurrentYear: number | null;
  attendancePreviousYear: number | null;
  attendanceNationalAverage: number;
  persistentAbsenteeCurrentYear: number | null;
  persistentAbsenteePreviousYear: number | null;
  persistentAbsenteesNationalAverage: number;
  authorisedAbsentCurrentYear: number | null;
  authorisedAbsentPreviousYear: number | null;
  authorisedAbsentNationalAverage: number;
  unauthorisedAbsentCurrentYear: number | null;
  unauthorisedAbsentPreviousYear: number | null;
  unauthorisedAbsentNationalAverage: number;
}

export interface IPayload {
  pupilOnRoll: number;
  pupilPremiumPercentage: number;
  totalPupilPremium: number;
  fsmePercentage: number;
  totalPupilFsme: number;
  attendanceInsights: IAttendanceInsights;
}

export interface ISchoolInsightsResponse {
  errors: string | null;
  payload: IPayload;
  status: number;
}
