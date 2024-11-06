"use server";
import prisma from "@/lib/db";
import { bookingSchema, checkInCheckOutSchema, TBooking, TCheckInCheckOut } from "@/lib/definitions";
import { z } from "zod";
import { getUserByKindeId, isAuthenticatedUserInDb } from "./userActions";



export default async function getBookingDetailsByPropertyId(
  propertyId: string
): Promise<TBooking[] | null> {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        propertyId: propertyId,
        status: {
          in: ["ACTIVE", "CONFIRMED"], // Use 'in' for multiple status values
        },
      },
      include:{
        property: true,
        checkInOut: true
      }
    });
    
    return bookings.length > 0 ? bookings : null; // Return null if no bookings found
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return null;
  }
}



export async function createBooking(
  booking: TBooking
): Promise<TBooking | null> {
  try {
    const validatedBooking = bookingSchema.parse(booking);

    const newBooking = await prisma.booking.create({
      data: {
        ...validatedBooking,
        checkInOut: {
          create: validatedBooking.checkInOut ? {
            checkInDate: validatedBooking.checkInOut.checkInDate ,
            checkOutDate: validatedBooking.checkInOut.checkOutDate,
          } : undefined,
        },
      },
      include: {
        checkInOut: true,
      },
    });

    if (!newBooking || !newBooking.id) {
      throw new Error("Couldn't create the booking");
    }

    return newBooking;
  } catch (error) {
    console.error("Error in creating the booking", error);
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


export async function DeleteBookingsbyIds(bookingIds: string[] | undefined) {
  try {
    if(!bookingIds){
      return null
    }
    const result = await prisma.booking.deleteMany({
      where: {
        id: { in: bookingIds },
      },
    });
    return result || null;
  } catch (error) {
    
    console.error('Error deleting bookings:', error);
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
        checkInOut: true,
      },
    });
    return bookings;
  } catch (error) {
    console.error("Error in getting all the bookings: ", error);
    return null;
  }
}
