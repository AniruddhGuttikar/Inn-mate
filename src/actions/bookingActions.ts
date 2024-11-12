"use server";
import prisma from "@/lib/db";
import { bookingSchema, checkInCheckOutSchema, TBooking, TCheckInCheckOut, TProperty } from "@/lib/definitions";
import { z } from "zod";
import { getUserByKindeId, isAuthenticatedUserInDb } from "./userActions";
import cuid from "cuid";
import { Prisma } from "@prisma/client";


//=================================================================================================================================
export default async function getBookingDetailsByPropertyId(
  propertyId: string
): Promise<TBooking[] | null> {
  try {
    const bookings : any = await prisma.$queryRaw`
      SELECT 
        b.*, 
        p.name, p.description, p.Pricepernight, p.maxGuests, 
        p.propertytype, p.isHotel, p.isDeleted, p.RoomType, 
        p.locationId, 
        c.checkInDate, c.checkOutDate,
        b.totalPrice, b.userId
      FROM booking AS b
      JOIN property AS p ON b.propertyId = p.id
      JOIN checkIncheckOut AS c ON b.id = c.bookingId
      WHERE b.status IN ('ACTIVE', 'CONFIRMED') 
      AND b.propertyId = ${propertyId}
    `;
    // console.log("Bookings: ",bookings)
    // Map the raw query result to the desired structure


    const formattedBookings : TBooking[]= bookings.map((rawBooking: any) => ({ 
       status: rawBooking.status as "ACTIVE" | "CONFIRMED" | "COMPLETED",
          totalPrice: rawBooking.totalPrice ?? 0, // Default to 0 if null
          userId: rawBooking.userId ?? "", // Default to empty string if null
          propertyId: rawBooking.propertyId,

          checkInOut: rawBooking.checkInDate && rawBooking.checkOutDate
            ? {
                checkInDate: rawBooking.checkInDate,
                checkOutDate: rawBooking.checkOutDate,
              }
              : null, // Handle checkInOut as null if dates are missing
              id: rawBooking.id, // Include the id if available
              
        }));
        // console.log(formattedBookings)
        
        // console.log("Formatted Bookings: ",formattedBookings)
      // If there are any bookings, return them in the desired structure
      return formattedBookings.length > 0 ? formattedBookings : null;
      } catch (error) {
      console.error("Error fetching bookings:", error);
      return null;
}
}

//=================================================================================================================================
export async function createBooking(
  booking: TBooking
): Promise<TBooking | null> {
  try {
    // Validate the booking data
    const validatedBooking = bookingSchema.parse(booking);
    const bookingid = validatedBooking.id || cuid();

    // Create the booking in the database
    await prisma.$queryRaw`
    INSERT INTO booking (id, totalPrice, createdAt, updatedAt, userId, propertyId, status)
    VALUES (
      ${bookingid}, 
      ${validatedBooking.totalPrice}, 
      ${new Date()}, 
      ${new Date()}, 
      ${validatedBooking.userId}, 
      ${validatedBooking.propertyId}, 
      ${validatedBooking.status}
    )
  `;
  

    // Create the check-in/check-out if provided
    if (validatedBooking.checkInOut) {
      await prisma.$queryRaw`
        INSERT INTO checkIncheckOut (id, checkInDate, checkOutDate, bookingId)
        VALUES (${cuid()}, ${validatedBooking.checkInOut.checkInDate}, ${validatedBooking.checkInOut.checkOutDate}, ${bookingid});
      `;
    }

    // Fetch and return the full booking data with checkInOut included
    const fullBookingData = await prisma.$queryRaw<TBooking[]>`
      SELECT b.*, c.checkInDate, c.checkOutDate 
      FROM booking AS b
      LEFT JOIN checkIncheckOut AS c ON b.id = c.bookingId
      WHERE b.id = ${bookingid};
    `;

    const formattedBookings: TBooking[] = fullBookingData.map((rawBooking: any) => ({
      status: rawBooking.status as "ACTIVE" | "CONFIRMED" | "COMPLETED",
      totalPrice: rawBooking.totalPrice ?? 0,
      userId: rawBooking.userId ?? "",
      propertyId: rawBooking.propertyId,
      checkInOut: rawBooking.checkInDate && rawBooking.checkOutDate
        ? {
            checkInDate: rawBooking.checkInDate,
            checkOutDate: rawBooking.checkOutDate,
          }
        : null,
      id: rawBooking.id,
    }));

    // Return the first booking or null if empty
    return formattedBookings.length > 0 ? formattedBookings[0] : null;
  } catch (error) {
    console.error("Error in creating the booking", error);
    return null;
  }
}



//=================================================================================================================================
export async function getAllBookingsForProperty(
  propertyId?: string
): Promise<TBooking[] | null> {
  try {

    if (!propertyId) {
      throw new Error("propertyId doesn't exist");
    }
    const bookings = await prisma.$queryRaw`
      SELECT b.* , c.checkInDate , c.checkOutDate  FROM booking as b JOIN 
        checkincheckout as c ON b.id=c.bookingId
        WHERE b.propertyId = ${propertyId}
    `
    console.log("bookings" , bookings)
    // const bookingSchemaArray = z.array(bookingSchema);
    // const validatedBookings = bookingSchemaArray.parse(bookings);
    // @ts-ignore
    return bookings;
  } catch (error) {
    console.error("Error in getting all the bookings: ", error);
    return null;
  }
}
//=================================================================================================================================

export async function DeleteBookingsbyIds(bookingIds: string[] | undefined) {
  try {
    if (!bookingIds || bookingIds.length === 0) {
      return null;
    }

    // Safely interpolate booking IDs into the raw query using Prisma's built-in parameterization
    const result = await prisma.$queryRaw`
      DELETE FROM booking
      WHERE id IN (${Prisma.join(bookingIds)})
    `;

    return result || null;
  } catch (error) {
    console.error('Error deleting bookings:', error);
    return null;
  }
}

//=================================================================================================================================
export async function getAllBookedProperties(
  kindeId?: string
): Promise<(TBooking & {property: TProperty} | null)[]  | null> {
  try {
    if (!kindeId) {
      throw new Error("userId doesn't exist");
    }
    const user = await getUserByKindeId(kindeId);
    if (!user) {
      throw new Error("user doesn't exist");
    }
    const bookings: any = await prisma.$queryRaw`
    SELECT 
          b.*, p.userId AS propUser,
          p.name, p.description, p.Pricepernight, p.maxGuests, 
          p.propertytype, p.isHotel, p.isDeleted, p.RoomType, 
          p.locationId, 
          c.checkInDate, c.checkOutDate,
          b.totalPrice, b.userId
        FROM booking AS b
      JOIN property AS p ON b.propertyId = p.id
      JOIN checkIncheckOut AS c ON b.id = c.bookingId
      WHERE b.status IN ('ACTIVE', 'CONFIRMED') 
      AND b.userId = ${user.id}
  `;
      const formattedBookings : (TBooking & {property: TProperty} )[] = bookings.map((rawBooking: any) => ({ 
        status: rawBooking.status as "ACTIVE" | "CONFIRMED" | "COMPLETED",
          totalPrice: rawBooking.totalPrice ?? 0, // Default to 0 if null
          userId: rawBooking.userId ?? "", // Default to empty string if null
          propertyId: rawBooking.propertyId,

          checkInOut: rawBooking.checkInDate && rawBooking.checkOutDate
            ? {
                checkInDate: rawBooking.checkInDate,
                checkOutDate: rawBooking.checkOutDate,
              }
              : null, // Handle checkInOut as null if dates are missing
              id: rawBooking.id, // Include the id if available
          property: {
            id: rawBooking.propertyId,
            name: rawBooking.name,
            description: rawBooking.description,
            pricePerNight: rawBooking.Pricepernight, 
            maxGuests: rawBooking.maxGuests, 
            propertytype : rawBooking.propertytype,
            isHotel : rawBooking.isHotel, 
            isDeleted: rawBooking.isDeleted, 
            RoomType :rawBooking.RoomType, 
            locationId: rawBooking.locationId,
            userId: rawBooking.propUser 

          }
              
        }));
        // console.log(formattedBookings)
        
        // console.log("Formatted Bookings: ",formattedBookings)
      // If there are any bookings, return them in the desired structure
      return formattedBookings.length > 0 ? formattedBookings : null;
      } catch (error) {
      console.error("Error fetching bookings:", error);
      return null;
}
}
//=================================================================================================================================
