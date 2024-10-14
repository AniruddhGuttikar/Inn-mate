import prisma from "@/lib/db";
import { amenitySchema, TAmenity } from "@/lib/definitions";
import { z } from "zod";

export async function getAllAmenitiesForProperty(
  propertyId: string
): Promise<TAmenity[] | null> {
  try {
    const amenities = await prisma.amenity.findMany({
      where: {
        propertyId,
      },
    });
    const amenitySchemaArray = z.array(amenitySchema);
    const validatedAmenities = amenitySchemaArray.parse(amenities);
    return validatedAmenities;
  } catch (error) {
    console.error("Error in getting the amenity: ", error);
    return null;
  }
}
