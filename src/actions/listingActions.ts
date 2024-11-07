"use server";

import { listingSchema, TListing } from "@/lib/definitions";
import { isAuthenticatedUserInDb } from "./userActions";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import  cuid  from "cuid";  // Import cuid for generating unique IDs

export async function createListing(
  listingValues: TListing
): Promise<TListing | null> {
  try {
    console.log("listing values: ", listingValues);
    const validatedListing = listingSchema.parse(listingValues);

    // Check if user exists
    const user = await isAuthenticatedUserInDb(validatedListing.userId);
    if (!user) {
      throw new Error("couldn't get the user");
    }

    // Generate a unique 'id' using cuid
    const newListingId = cuid(); 

    // Raw SQL query to insert a new listing, including the generated 'id'
    const newListing = await prisma.$queryRaw<TListing[]>`
      INSERT INTO listing (id, availabilityStart, availabilityEnd, userId, propertyId)
      VALUES (${newListingId}, ${validatedListing.availabilityStart}, ${validatedListing.availabilityEnd}, ${validatedListing.userId}, ${validatedListing.propertyId})
      RETURNING *;`;

    if (!newListing || newListing.length === 0) {
      throw new Error("couldn't create the listing");
    }

    // Revalidate path after insertion
    revalidatePath(`/user/${user.kindeId}/properties`);
    
    return newListing[0]; // Return the newly created listing
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

    // Raw SQL query to find the listing by userId and propertyId
    const listing = await prisma.$queryRaw<TListing[]>`
      SELECT * FROM listing
      WHERE userId = ${userId} AND propertyId = ${propertyId};`;

    if (listing.length === 0) {
      return null; // Return null if listing not found
    }

    console.log("Listing in getListing: ", listing);

    const validatedListing = listingSchema.parse(listing[0]);

    // Revalidate path after fetching the listing
    revalidatePath("/");

    return validatedListing;
  } catch (error) {
    console.error("Error in finding the listing: ", error);
    return null;
  }
}
