"use server";

import { listingSchema, TListing } from "@/lib/definitions";
import { isAuthenticatedUserInDb } from "./userActions";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function createListing(
  listingValues: TListing
): Promise<TListing | null> {
  try {
    console.log("listing values: ", listingValues);
    const validatedListing = listingSchema.parse(listingValues);
    const user = await isAuthenticatedUserInDb(validatedListing.userId);
    if (!user) {
      throw new Error("couldn't get the user");
    }
    const newListing = await prisma.listing.create({
      data: {
        availabilityStart: validatedListing.availabilityStart,
        availabilityEnd: validatedListing.availabilityEnd,
        userId: validatedListing.userId,
        propertyId: validatedListing.propertyId,
      },
    });
    if (!newListing) {
      throw new Error("couldn't create the listing");
    }
    revalidatePath(`/user/${user.kindeId}/properties`);
    return newListing;
  } catch (error) {
    console.error("Error in creating the listing: ", error);
    return null;
  }
}

export async function getListing(
  userId?: string,
  propertyId?: string
): Promise<TListing | null> {
  try {
    if (!propertyId || !userId) {
      throw new Error("couldn't get the user or property");
    }
    console.log("property, userId:", propertyId, userId);
    const listing = await prisma.listing.findUnique({
      where: {
        userId_propertyId: {
          userId,
          propertyId,
        },
      },
    });
    console.log("Listing in getListing: ", listing);

    const validatedListing = listingSchema.parse(listing);

    revalidatePath("/");
    return validatedListing;
  } catch (error) {
    console.error("Error in finding the listing: ", error);
    return null;
  }
}
