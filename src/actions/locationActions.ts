"use server";

import prisma from "@/lib/db";
import { locationSchema, TLocation } from "@/lib/definitions";

export async function getLocationById(
  locationId: string | undefined
): Promise<TLocation | null> {
  try {
    if (!locationId) {
      throw new Error("Couldn't get the locationId");
    }
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
