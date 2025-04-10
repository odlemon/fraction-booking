import { Booking } from "../models/booking.model";

export interface IBookingRepository {
  findAll(): Booking[];
  findById(id: string): Booking | undefined;
  create(booking: Booking): Booking;
  update(id: string, booking: Booking): Booking | undefined;
}

export class InMemoryBookingRepository implements IBookingRepository {
  private bookings: Booking[] = [];
  private nextId = 1;

  findAll(): Booking[] {
    return [...this.bookings];
  }

  findById(id: string): Booking | undefined {
    return this.bookings.find(booking => booking.id === id);
  }

  create(booking: Booking): Booking {
    const newBooking = {
      ...booking,
      id: (this.nextId++).toString()
    };
    
    this.bookings.push(newBooking);
    return newBooking;
  }

  update(id: string, updatedBooking: Booking): Booking | undefined {
    const index = this.bookings.findIndex(booking => booking.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    this.bookings[index] = updatedBooking;
    return updatedBooking;
  }
}