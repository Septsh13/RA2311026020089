export interface Notification {
  id: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
}

export const mockNotifications: Notification[] = [
  {
    id: "mock-001",
    Type: "Placement",
    Message: "Infosys campus hiring registration is open for eligible students.",
    Timestamp: "2026-05-02 09:30:00"
  },
  {
    id: "mock-002",
    Type: "Result",
    Message: "Semester 5 revaluation results have been published.",
    Timestamp: "2026-05-01 17:45:00"
  },
  {
    id: "mock-003",
    Type: "Event",
    Message: "Technical symposium registration closes tonight at 11:59 PM.",
    Timestamp: "2026-05-01 14:10:00"
  },
  {
    id: "mock-004",
    Type: "Placement",
    Message: "TCS digital interview slots are available for shortlisted students.",
    Timestamp: "2026-04-30 11:20:00"
  },
  {
    id: "mock-005",
    Type: "Result",
    Message: "Internal assessment marks for Software Engineering are updated.",
    Timestamp: "2026-04-29 16:05:00"
  },
  {
    id: "mock-006",
    Type: "Event",
    Message: "Cloud computing workshop starts tomorrow in the main seminar hall.",
    Timestamp: "2026-04-28 10:00:00"
  },
  {
    id: "mock-007",
    Type: "Placement",
    Message: "Amazon coding assessment guidelines have been shared with applicants.",
    Timestamp: "2026-04-27 18:30:00"
  },
  {
    id: "mock-008",
    Type: "Result",
    Message: "Lab examination scores for Database Management Systems are available.",
    Timestamp: "2026-04-26 13:25:00"
  },
  {
    id: "mock-009",
    Type: "Event",
    Message: "Department hackathon team formation window is now open.",
    Timestamp: "2026-04-25 09:15:00"
  },
  {
    id: "mock-010",
    Type: "Placement",
    Message: "Wipro pre-placement talk begins at 2:00 PM in auditorium A.",
    Timestamp: "2026-04-24 08:40:00"
  }
];
