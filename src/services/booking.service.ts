import type { Booking } from "../models/booking.model";
import type { CreateBookingDto } from "../types/dtos";
import { TimesheetAction, TimesheetStatus } from "../types/booking.types";
import { ApiError } from "../types/error.types";

export class BookingService {
  private bookings: Booking[] = [];
  private nextId = 1;

  public getAllBookings(): Booking[] {
    return this.bookings;
  }

  public findBookingById(id: string): Booking | undefined {
    return this.bookings.find((booking) => booking.id === id);
  }

  public createBooking(bookingData: CreateBookingDto): Booking {
    this.validateBookingData(bookingData);
    
    const newBooking: Booking = {
      id: (this.nextId++).toString(),
      ...bookingData,
      timesheetStatus: TimesheetStatus.Pending
    };

    this.bookings.push(newBooking);
    return newBooking;
  }

  public updateTimesheetStatus(id: string, action: TimesheetAction): Booking {
    const bookingIndex = this.bookings.findIndex((booking) => booking.id === id);

    if (bookingIndex === -1) {
      throw new ApiError(404, `Booking with ID ${id} not found`);
    }

    const booking = this.bookings[bookingIndex];

    if (action === TimesheetAction.Approve) {
      booking.timesheetStatus = TimesheetStatus.Approved;
    } else if (action === TimesheetAction.Reject) {
      booking.timesheetStatus = TimesheetStatus.Rejected;
    }

    this.bookings[bookingIndex] = booking;
    return booking;
  }

  private validateBookingData(data: CreateBookingDto): void {
    const { jobRole, location, date, startTime, endTime } = data;
    
    if (!jobRole || !location || !date || !startTime || !endTime) {
      throw new ApiError(400, "All fields are required: jobRole, location, date, startTime, endTime");
    }
    
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new ApiError(400, "Date must be in YYYY-MM-DD format");
    }
    
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      throw new ApiError(400, "Time must be in HH:MM format (24-hour)");
    }
    
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);
    
    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new ApiError(400, "Invalid date or time format");
    }
    
    if (endDateTime <= startDateTime) {
      throw new ApiError(400, "End time must be after start time");
    }
  }
}