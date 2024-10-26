"use server";

import {
  imageSchema,
  locationSchema,
  propertySchema,
  TAddPropertyFormvaluesSchema,
  TImage,
  TProperty,
} from "@/lib/definitions";
import { getUserByKindeId, isAuthenticatedUserInDb } from "./userActions";
import prisma from "@/lib/db";
import { z } from "zod";
import { getLocationById } from "./locationActions";
import { revalidatePath } from "next/cache";

const UPLOADCARE_PUBLIC_KEY = 'ecc593f3433cbf4e6114'; // Replace with your Uploadcare public key
const UPLOADCARE_SECRET_KEY = process.env.NEXT_PUBLIC_UPLOADCARE_SECRET_KEY!
import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';


const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: UPLOADCARE_PUBLIC_KEY,
  secretKey :UPLOADCARE_SECRET_KEY,

});


export async function getAllProperties(): Promise<TProperty[] | null> {
  try {
    const properties = await prisma.property.findMany({
      take: 12,
    });
    const propertiesSchemaArray = z.array(propertySchema);
    const validatedProperties = propertiesSchemaArray.parse(properties);
    return validatedProperties;
  } catch (error) {
    console.error("Error in getting properties: ", error);
    return null;
  }
}

export async function getAllPropertiesByUserId(
  userId: string
): Promise<TProperty[] | null> {
  try {
    // const isUser = await isAuthenticatedUserInDb(userId);
    // if (!isUser) {
    //   return null;
    // }

    const properties = await prisma.property.findMany({
      where: { userId },
      include: {
        // amenities: true,
        // bookings: true,
        // favorites: true,
        // images: true,
        // listings: true,
        // location: true,
        // reviews: true,
        // rooms: true,
        // user: true,
      },
    });
    const propertiesSchemaArray = z.array(propertySchema);
    const validatedProperties = propertiesSchemaArray.parse(properties);
    return validatedProperties;
  } catch (error) {
    console.error("Error in getting properties: ", error);
    return null;
  }
}

export async function getPropertyById(
  propertyId: string
): Promise<TProperty | null> {
  try {
    const property = await prisma.property.findUnique({
      where: {
        id: propertyId,
      },
    });
    const validatedProperty = propertySchema.parse(property);
    return validatedProperty;
  } catch (error) {
    console.error("Error in getting properties: ", error);
    return null;
  }
}

export async function addProperty(
  kindeId: string,
  propertyData: TAddPropertyFormvaluesSchema
): Promise<TProperty | null> {
  try {
    const user = await getUserByKindeId(kindeId);
    if (!user || !user.id) {
      throw new Error(`couldn't find the user with kindeID ${kindeId}`);
    }
    const isAuthenticatedUser = await isAuthenticatedUserInDb(user.id);
    if (!isAuthenticatedUser) {
      throw new Error(
        "User not authenticated, please register before proceeding"
      );
    }
    const imagesSchemaArray = z.array(imageSchema);

    const validatedLocation = locationSchema.parse(propertyData);
    const validatedProperty = propertySchema.parse(propertyData);
    const validatedImages = imagesSchemaArray.parse(propertyData.images);

    // check if the location already exists

    let location = await prisma.location.findFirst({
      where: {
        city: validatedLocation.city,
        country: validatedLocation.country,
        state: validatedLocation.state,
      },
    });
    if (!location) {
      location = await prisma.location.create({
        data: {
          ...validatedLocation,
        },
      });
    }

    const isHotel = validatedProperty.propertyType === "Hotel";
    console.log("propertyImage",propertyData.images)

    const property = await prisma.property.create({
      
      data: {
        ...validatedProperty,
        isHotel,
        userId: user.id,
        locationId: location.id,
        images: validatedImages?.length > 0
          ? {
              create: validatedImages.map((image) => ({
                link: image.link,
              })),
            }
          : undefined,
      },
    });
    

    revalidatePath(`/user/${kindeId}/properties`);
    revalidatePath("/");
    return property;
  } catch (error) {
    console.error("Error in adding the property: ", error);
    return null;
  }
}


export async function Delete_UploadCare(urlToDelete : string){
  try {
    // Delete the image from Uploadcare
    const result = await deleteFile(
      {
        uuid: urlToDelete,
      },
      { authSchema: uploadcareSimpleAuthSchema }
    )
    if(result.metadata){
      return 200
    }
    else{
      return 400
    }
    
}
catch (error) {
    console.error('Error deleting image from Uploadcare:', error);
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
