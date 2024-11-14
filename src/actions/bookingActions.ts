"use server";
import prisma from "@/lib/db";
import { bookingSchema, TBooking, TProperty } from "@/lib/definitions";
import { getUserByKindeId} from "./userActions";
import cuid from "cuid";


//=================================================================================================================================
export default async function getBookingDetailsByPropertyId(
  propertyId: string
): Promise<TBooking[] | null> {
  try {


// ! This code is for getting Booked property details {SQL FUNCTION}
const bookings: any = await prisma.$queryRaw`
  SELECT * FROM get_active_bookings(${propertyId});
`;
// !

    const formattedBookings : TBooking[]= bookings.map((rawBooking: any) => ({ 
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
      return formattedBookings.length > 0 ? formattedBookings : null;
      } catch (error) {
      console.error("Error fetching bookings:", error);
      return null;
}
}
//=================================================================================================================================
export async function createBooking(
  booking: TBooking & {isShared:boolean}
): Promise<TBooking | null> {
  try {
    const validatedBooking = bookingSchema.parse(booking);
    const bookingid = validatedBooking.id || cuid();
    console.log("InBooking",validatedBooking)
//! procedure CALL for Inserting Booking and Payment {PROCEDURE}
/*
  await prisma.$executeRawUnsafe(
    `CALL InsertBookingAndPayment(?, ?, ?, ?, ?);`,
    bookingid,
    validatedBooking.totalPrice,
    validatedBooking.userId,
    validatedBooking.propertyId,
    validatedBooking.status,
    validatedBooking.Adult,
    validatedBooking.Child
  );
  */
  await prisma.$queryRaw`
    CALL InsertBookingAndPayment(
      '${bookingid}', 
      ${validatedBooking.totalPrice}, 
      '${validatedBooking.userId}', 
      '${validatedBooking.propertyId}', 
      '${validatedBooking.status}', 
      ${validatedBooking.Adult}, 
      ${validatedBooking.Child},
      ${booking.isShared}
    );
  `
  

//! A TRIGGER IS EXECUTED IN MYSQL TO DECREASE THE NUMBER OF ROOMS IF PROPERTY TYPE IS HOTEL


//! INSERTING CHECK IN CHECKOUT {PROCEDURE}
  const fullBookingData: any = await prisma.$queryRaw`
    CALL InsertCheckInCheckOutAndFetchBooking(
      ${bookingid},
      ${validatedBooking.totalPrice},
      ${validatedBooking.userId},
      ${validatedBooking.propertyId},
      ${validatedBooking.status},
      ${validatedBooking.checkInOut?.checkInDate || null},
      ${validatedBooking.checkInOut?.checkOutDate || null},
      ${validatedBooking.Adult},
      ${validatedBooking.Child}
    );
  `;

// ! IMPORTANT NOTE:
/*
prisma.$queryRaw
  Safe Query Execution: This is the preferred method to run raw SQL queries in Prisma because it automatically sanitizes inputs and prevents SQL injection attacks.
  Parameterized Queries: You can safely interpolate variables into the query by passing them as parameters. Prisma handles escaping and preparing the query.
  Type Safety: When you use $queryRaw, Prisma provides better type safety. For example, you can define the expected return type and Prisma will ensure that the result matches i



prisma.$queryRawUnsafe
  No Safety Checks: prisma.$queryRawUnsafe bypasses Prisma's built-in SQL sanitization and escapes checks. This means you are responsible for manually ensuring that the input values are safe to prevent SQL injection.
  When to Use: This method should only be used in very specific situations where the query cannot be written as a parameterized query or if you need to do complex operations that require direct string manipulation of SQL (e.g., dynamic SQL).

*/
//!
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

    //! Get All bookings for properties
    const bookings = await prisma.$queryRaw`
      SELECT b.* , c.checkInDate , c.checkOutDate  FROM booking as b JOIN 
        checkincheckout as c ON b.id=c.bookingId
        WHERE b.propertyId = ${propertyId}
    `
    //@ts-expect-error
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
    const bookingIdsString = bookingIds.map(id => `'${id}'`).join(',');

    const result = await prisma.$queryRaw`
      DELETE FROM booking
      WHERE id IN (
        SELECT id 
        FROM booking 
        WHERE id IN (${bookingIdsString})
        AND propertyId IN (
          SELECT id 
          FROM property 
          WHERE isDeleted = false
        )
      );
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

    //! getAllBooked properties  {nested Querry}
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
      AND p.id IN (SELECT propertyId FROM booking WHERE status IN ('ACTIVE', 'CONFIRMED'))
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
      return formattedBookings.length > 0 ? formattedBookings : null;
      } catch (error) {
      console.error("Error fetching bookings:", error);
      return null;
}
}
//=================================================================================================================================
