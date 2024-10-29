"use server";

import { favouriteSchema, Tfavourite } from "@/lib/definitions";
import { getUserByKindeId, isAuthenticatedUserInDb } from "./userActions";
import prisma from "@/lib/db";

export default async function addfavourite(
  userId: string,
  likedData: Tfavourite
): Promise<Tfavourite | null> {
  try {
    const isAuthenticatedUser = await isAuthenticatedUserInDb(userId);

    if (!isAuthenticatedUser) {
      throw new Error(
        "User not authenticated, please register before proceeding"
      );
    }

    const validatedfavourites = favouriteSchema.parse(likedData);
    const liked = await prisma.favourite.create({
      data: {
        userId: validatedfavourites.userId,
        propertyId: validatedfavourites.propertyId,
      },
    });

    return liked;
  } catch (error) {
    console.log("Error in adding favourites :)", error);
    return null;
  }
}

export async function deletefavourite(
  likedData: Tfavourite
): Promise<Tfavourite | null> {
  try {
    const validatedfavourites = favouriteSchema.parse(likedData);
    const favourite = await prisma.favourite.findUniqueOrThrow({
      where: {
        userId_propertyId: {
          userId: validatedfavourites.userId,
          propertyId: validatedfavourites.propertyId,
        },
      },
    });
    const deletedfavourite = await prisma.favourite.delete({
      where: {
        id: favourite.id,
      },
    });
    if (!deletedfavourite) {
      return null;
    }
    return deletedfavourite;
  } catch (error) {
    console.log("Error While deteting", error);
    return null;
  }
}

export async function getIsfavourite(userId: string, propertyId: string) {
  const favourite = await prisma.favourite.findUnique({
    where: {
      userId_propertyId: {
        userId,
        propertyId,
      },
    },
  });
  console.log("Favoraite:", favourite);
  if (favourite) {
    return favourite;
  } else {
    return null;
  }
}

export async function getAllfavourite(
  KindeId: string | ""
): Promise<Tfavourite[] | null> {
  const user_id = await getUserByKindeId(KindeId);
  if (!user_id) {
    console.error("User not found in the database.");
    return null;
  }
  if (!(await isAuthenticatedUserInDb(user_id?.id || ""))) {
    console.error("User not Authenticated");
    return null;
  }

  const favourites = await prisma.favourite.findMany({
    where: {
      userId: user_id.id,
    },
  });
  // console.log('fav:',favourites)
  if (!favourites) {
    return null;
  }
  return favourites;
}
