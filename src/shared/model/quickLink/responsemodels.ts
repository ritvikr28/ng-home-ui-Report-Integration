
export interface IQuickLinkApiResponse {
    linkName: string;
    linkUrl: string;
    starred: boolean;
    
  }
  
export const mockQuickLinks: IQuickLinkApiResponse[] = [
    { linkName: "Take Register", linkUrl: "https://dev.takeregister.sims.co.uk" , starred: false },
    { linkName: "Pupil Profile", linkUrl: "https://dev.takeregister.sims.co.uk" , starred: true },
    { linkName: "Staff Profile", linkUrl: "https://dev.takeregister.sims.co.uk", starred: false },
    { linkName: "Seating Plans", linkUrl: "https://dev.takeregister.sims.co.uk", starred: true },
    { linkName: "Staff Timetable", linkUrl: "https://dev.takeregister.sims.co.uk", starred: false },
    { linkName: "My Markbook", linkUrl: "https://dev.takeregister.sims.co.uk", starred: true },
    { linkName: "Fire Registers", linkUrl: "https://dev.takeregister.sims.co.uk", starred: true },
    { linkName: "Attendance Reporting", linkUrl: "https://dev.takeregister.sims.co.uk", starred: true },
    { linkName: "Exclusions and Suspensions", linkUrl: "https://dev.takeregister.sims.co.uk", starred: false },
    { linkName: " Online Marksheets", linkUrl: "https://dev.takeregister.sims.co.uk", starred: false }
    
   
  ];