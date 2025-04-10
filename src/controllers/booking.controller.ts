import type { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import type { CreateBookingDto, UpdateTimesheetDto } from "../types/dtos";
import { ApiError } from "../types/error.types";
import { TimesheetAction } from "../types/booking.types";

export class BookingController {
  private bookingService = new BookingService();

  public getAllBookings = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const bookings = this.bookingService.getAllBookings();
      res.status(200).json(bookings);
    } catch (error) {
      next(error);
    }
  };

  public createBooking = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const bookingData: CreateBookingDto = req.body;
      const newBooking = this.bookingService.createBooking(bookingData);
      res.status(201).json(newBooking);
    } catch (error) {
      next(error);
    }
  };

  public updateTimesheetStatus = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const { action } = req.body;
      
      if (!action || (action !== TimesheetAction.Approve && action !== TimesheetAction.Reject)) {
        throw new ApiError(400, 'Action must be either "approve" or "reject"');
      }
      
      const updatedBooking = this.bookingService.updateTimesheetStatus(id, action);
      res.status(200).json(updatedBooking);
    } catch (error) {
      next(error);
    }
  };
}