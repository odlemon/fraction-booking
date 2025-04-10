import express from "express";
import cors from "cors";
import { bookingRoutes } from "./routes/booking.routes";
import { errorHandler } from "./middleware/error.middleware";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/bookings", bookingRoutes);

app.use((req, res) => {
  res.status(404).json({ 
    status: "error",
    statusCode: 404,
    message: "Route not found" 
  });
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;