import type { TimesheetStatus } from "../types/booking.types";

export interface Booking {
  id: string;
  jobRole: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
  timesheetStatus: TimesheetStatus;
}