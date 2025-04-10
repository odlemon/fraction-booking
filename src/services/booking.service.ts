import type { Booking } from "../models/booking.model";
import type { CreateBookingDto } from "../types/dtos";
import { TimesheetAction, TimesheetStatus } from "../types/booking.types";
import { ApiError } from "../types/error.types";
import { IBookingRepository } from "../repositories/booking.repository";

export interface IBookingService {
  getAllBookings(page?: number, limit?: number): { data: Booking[], meta: { total: number, page: number, limit: number, pages: number } };
  findBookingById(id: string): Booking | undefined;
  createBooking(bookingData: CreateBookingDto): Booking;
  updateTimesheetStatus(id: string, action: TimesheetAction): Booking;
}

export class BookingService implements IBookingService {
  constructor(private bookingRepository: IBookingRepository) {}

  public getAllBookings(page = 1, limit = 10): { data: Booking[], meta: { total: number, page: number, limit: number, pages: number } } {
    const allBookings = this.bookingRepository.findAll();
    const total = allBookings.length;
    const pages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;
    const data = allBookings.slice(skip, skip + limit);
    
    return {
      data,
      meta: {
        total,
        page,
        limit,
        pages
      }
    };
  }

  public findBookingById(id: string): Booking | undefined {
    return this.bookingRepository.findById(id);
  }

  public createBooking(bookingData: CreateBookingDto): Booking {
    this.validateBookingData(bookingData);
    
    const newBooking: Booking = {
      id: "", // Will be set by repository
      ...bookingData,
      timesheetStatus: TimesheetStatus.Pending
    };

    return this.bookingRepository.create(newBooking);
  }

  public updateTimesheetStatus(id: string, action: TimesheetAction): Booking {
    const booking = this.bookingRepository.findById(id);

    if (!booking) {
      throw new ApiError(404, `Booking with ID ${id} not found`);
    }

    const updatedBooking = { ...booking };

    if (action === TimesheetAction.Approve) {
      updatedBooking.timesheetStatus = TimesheetStatus.Approved;
    } else if (action === TimesheetAction.Reject) {
      updatedBooking.timesheetStatus = TimesheetStatus.Rejected;
    }

    const result = this.bookingRepository.update(id, updatedBooking);
    
    if (!result) {
      throw new ApiError(500, "Failed to update booking");
    }
    
    return result;
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