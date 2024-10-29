"use server";

import prisma from "@/lib/db";
import { bookingSchema, TBooking } from "@/lib/definitions";
import { z } from "zod";

export async function createBooking(
  booking: TBooking
): Promise<TBooking | null> {
  try {
    const validatedBooking = bookingSchema.parse(booking);
    const newBooking = prisma.booking.create({
      data: {
        ...validatedBooking,
      },
    });
    if (!newBooking) {
      throw new Error("couldn't create the booking");
    }
    return newBooking;
  } catch (error) {
    console.error("Error in creating the booking ", error);
    return null;
  }
}

export async function getAllBookingsForProperty(
  propertyId?: string
): Promise<TBooking[] | null> {
  try {
    if (!propertyId) {
      throw new Error("propertyId doesn't exist");
    }
    const bookings = await prisma.booking.findMany({
      where: {
        propertyId,
      },
    });
    const bookingSchemaArray = z.array(bookingSchema);
    const validatedBookings = bookingSchemaArray.parse(bookings);
    return validatedBookings;
  } catch (error) {
    console.error("Error in getting all the bookings: ", error);
    return null;
  }
}
