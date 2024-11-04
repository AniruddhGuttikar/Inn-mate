"use server";

import prisma from "@/lib/db";
import { bookingSchema, TBooking, TCheckInCheckOut } from "@/lib/definitions";
import { z } from "zod";
import { getUserByKindeId, isAuthenticatedUserInDb } from "./userActions";

export async function createBooking(
  booking: TBooking
): Promise<TBooking | null> {
  try {
    const validatedBooking = bookingSchema.parse(booking);
    const newBooking = await prisma.booking.create({
      data: {
        ...validatedBooking,
        checkInOut: {
          create: {
            checkInDate: validatedBooking.startDate,
            checkOutDate: validatedBooking.endDate,
          },
        },
      },
    });
    if (!newBooking || !newBooking.id) {
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

export async function getAllBookedProperties(
  kindeId?: string
): Promise<TBooking[] | null> {
  try {
    if (!kindeId) {
      throw new Error("userId doesn't exist");
    }
    const user = await getUserByKindeId(kindeId);
    if (!user) {
      throw new Error("user doesn't exist");
    }
    const bookings = await prisma.booking.findMany({
      where: {
        userId: user.id,
      },
      include: {
        property: true,
      },
    });
    return bookings;
  } catch (error) {
    console.error("Error in getting all the bookings: ", error);
    return null;
  }
}
