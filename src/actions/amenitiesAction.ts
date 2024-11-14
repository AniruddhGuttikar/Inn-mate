import prisma from "@/lib/db";
import { amenitySchema, TAmenity } from "@/lib/definitions";
import { z } from "zod";

export async function getAllAmenitiesForProperty(
  propertyId: string
): Promise<TAmenity[] | null> {
  try {
    console.log("Ame Prop:",propertyId)
    const amenities = await prisma.$queryRaw`
      SELECT * FROM amenity as a WHERE a.propertyId=${propertyId}
    
    `
    console.log("AmenitiesBackend: ",amenities)
    const amenitySchemaArray = z.array(amenitySchema);
    const validatedAmenities = amenitySchemaArray.parse(amenities);
    return validatedAmenities;
  } catch (error) {
    console.error("Error in getting the amenity: ", error);
    return null;
  }
}
