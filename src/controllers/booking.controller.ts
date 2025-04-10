import type { Request, Response, NextFunction } from "express";
import type { IBookingService } from "../services/booking.service";
import { ApiError } from "../types/error.types";
import { TimesheetAction } from "../types/booking.types";

export class BookingController {
  constructor(private bookingService: IBookingService) {}

  public getAllBookings = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = this.bookingService.getAllBookings(page, limit);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  public createBooking = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const bookingData = req.body;
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