import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { BookingService } from "../services/booking.service";
import { InMemoryBookingRepository } from "../repositories/booking.repository";

const router = Router();

const bookingRepository = new InMemoryBookingRepository();
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingController(bookingService);

router.get("/", bookingController.getAllBookings);
router.post("/", bookingController.createBooking);
router.post("/:id/timesheet", bookingController.updateTimesheetStatus);

export { router as bookingRoutes };