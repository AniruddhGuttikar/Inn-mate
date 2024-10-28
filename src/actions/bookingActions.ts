import prisma from "@/lib/db";
import { bookingSchema, TBooking } from "@/lib/definitions";

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
    });

    return bookings.length > 0 ? bookings : null; // Return null if no bookings found
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return null;
  }
}


export async function DeleteBookingsbyIds(bookingIds: string[]) {
  try {
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

