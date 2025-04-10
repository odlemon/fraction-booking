import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";

const router = Router();
const bookingController = new BookingController();

router.get("/", bookingController.getAllBookings);
router.post("/", bookingController.createBooking);
router.post("/:id/timesheet", bookingController.updateTimesheetStatus);

export { router as bookingRoutes };