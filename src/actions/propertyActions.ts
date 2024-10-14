"use server";

import {
  imageSchema,
  propertySchema,
  TAddPropertySchema,
  TImage,
  TProperty,
} from "@/lib/definitions";
import { getUserByKindeId, isAuthenticatedUserInDb } from "./userActions";
import prisma from "@/lib/db";
import { z } from "zod";

export async function getAllPropertiesByUserId(
  userId: string
): Promise<TProperty[] | null> {
  try {
    const isUser = await isAuthenticatedUserInDb(userId);
    // if (!isUser) {
    //   return null;
    // }

    const properties = await prisma.property.findMany({
      where: { userId },
      //include: {amenities: true, }
    });
    const propertiesSchemaArray = z.array(propertySchema);
    const validatedProperties = propertiesSchemaArray.parse(properties);
    return validatedProperties;
  } catch (error) {
    console.error("Error in getting properties: ", error);
    return null;
  }
}

export async function getAllImagesbyId(
  propertyId: string
): Promise<TImage[] | null> {
  try {
    const images = await prisma.image.findMany({
      where: {
        propertyId,
      },
    });
    const imagesSchemaArray = z.array(imageSchema);
    const validatedImages = imagesSchemaArray.parse(images);
    return validatedImages;
  } catch (error) {
    console.error("Error in getting images: ", error);
    return null;
  }
}

export async function addProperty(
  kindeId: string,
  propertyData: TAddPropertySchema
): Promise<boolean> {
  try {
    const user = await getUserByKindeId(kindeId);
    if (!user) {
      throw new Error(`couldn't find the user with ${kindeId}`);
    }

    const validatedProperty = propertySchema.parse;

    const property = await prisma.property.create({
      data: { ...propertyData },
    });
  } catch (error) {
    console.error("Error in adding the property: ", error);
    return false;
  }
}
