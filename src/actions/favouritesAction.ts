'use server'
import { favouriteSchema, TFavourite } from "@/lib/definitions";
import { getUserByKindeId, isAuthenticatedUserInDb } from "./userActions";
import prisma from "@/lib/db";
import cuid from "cuid";

export default async function addliked(
  user_id: string,
  likedData: TFavourite
): Promise<TFavourite | null> {
  try {
    const isAuthenticatedUser = await isAuthenticatedUserInDb(user_id);
    if (!isAuthenticatedUser) {
      throw new Error("User not authenticated, please register before proceeding");
    }
    const validatedFavorites = favouriteSchema.parse(likedData);

    // Insert the favorite using raw SQL
// Insert query
const id = cuid();  // or use Prisma's cuid() if it's available
await prisma.$queryRaw`
  INSERT INTO favourite (id, userId, propertyId)
  VALUES (${id}, ${validatedFavorites.userId}, ${validatedFavorites.propertyId});
`;

// Select the inserted record using a separate query
const result: TFavourite= await prisma.$queryRaw`
  SELECT * FROM favourite
  WHERE userId = ${validatedFavorites.userId} AND propertyId = ${validatedFavorites.propertyId}
  ORDER BY id DESC LIMIT 1;
`;

console.log(result); // This will return the inserted record

  

    // Fetch the newly added favorite using raw SQL
    // const result = await prisma.$queryRaw<TFavourite[]>`
    //   SELECT * FROM favourite
    //   WHERE userId = ${validatedFavorites.userId} AND propertyId = ${validatedFavorites.propertyId};
    // `;

    return result ? result : null;
  } catch (error) {
    console.log('Error in adding favorites :)', error);
    return null;
  }
}



export async function deleteLiked(likedData: TFavourite) {
  try {
    const validatedFavorites = favouriteSchema.parse(likedData);

    // Check if the favorite exists using raw SQL
    const favorite = await prisma.$queryRaw<TFavourite[]>`
      SELECT * FROM favourite
      WHERE userId = ${validatedFavorites.userId}
        AND propertyId = ${validatedFavorites.propertyId};
    `;

    if (favorite.length === 0) {
      return null; // No favorite found to delete
    }

    // Delete the favorite using raw SQL
    await prisma.$queryRaw`
      DELETE FROM favourite
      WHERE userId = ${validatedFavorites.userId} AND propertyId = ${validatedFavorites.propertyId};
    `;

    return { id: favorite[0].id }; // Return the ID of the deleted favorite
  } catch (error) {
    console.log('Error While deleting', error);
    return null;
  }
}




export async function getIsFavorite(userId: string, propertyId: string | undefined) {
  const favorite = await prisma.$queryRaw<TFavourite[]>`
    SELECT * FROM favourite
    WHERE userId = ${userId} AND propertyId = ${propertyId};`;

  if (favorite.length > 0) {
    return favorite;
  } else {
    return null;
  }
}

export async function getIsfavourite(userId: string, propertyId: string) {
  const favourite = await prisma.$queryRaw<TFavourite[]>`
    SELECT * FROM favourite
    WHERE userId = ${userId} AND propertyId = ${propertyId}
    LIMIT 1;`;

  if (favourite.length > 0) {
    return favourite[0];
  } else {
    return null;
  }
}

export async function getAllfavourite(KindeId: string | ""): Promise<TFavourite[] | null> {
  const user_id = await getUserByKindeId(KindeId);
  if (!user_id) {
    console.error("User not found in the database.");
    return null;
  }

  if (!(await isAuthenticatedUserInDb(user_id?.id || ""))) {
    console.error("User not Authenticated");
    return null;
  }

  // Raw SQL query to get all favorites for a user
  const favourites = await prisma.$queryRaw<TFavourite[]>`
    SELECT * FROM favourite
    WHERE userId = ${user_id.id};`;

  if (!favourites) {
    return null;
  }
  return favourites;
}
