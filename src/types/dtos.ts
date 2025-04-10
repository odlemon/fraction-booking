import type { TimesheetAction } from "./booking.types";

export interface CreateBookingDto {
  jobRole: string;
  location: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateTimesheetDto {
  action: TimesheetAction;
}