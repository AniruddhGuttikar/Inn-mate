"use server";

import prisma from "@/lib/db";
import { locationSchema, TLocation } from "@/lib/definitions";

export async function getLocationById(
  locationId: string
): Promise<TLocation | null> {
  try {
    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
      },
    });

    const validatedLocation = locationSchema.parse(location);
    return validatedLocation;
  } catch (error) {
    console.error("Error in getting the locationById: ", error);
    return null;
  }
}
