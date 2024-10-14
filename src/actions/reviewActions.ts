"use server";

import prisma from "@/lib/db";
import { reviewSchema, TReview } from "@/lib/definitions";
import { z } from "zod";

export async function getAllReviewsById(
  propertyId: string
): Promise<TReview[] | null> {
  try {
    const reviews = await prisma.review.findMany({
      where: {
        propertyId,
      },
    });

    const reviewSchemaArray = z.array(reviewSchema);

    const validatedReviewSchema = reviewSchemaArray.parse(reviews);
    return validatedReviewSchema;
  } catch (error) {
    console.error("Error in getting the reviewById: ", error);
    return null;
  }
}
