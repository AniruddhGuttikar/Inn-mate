"use server";

import {
  amenitySchema,
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
const UPLOADCARE_SECRET_KEY = process.env.UPLOADCARE_SECRET_KEY!
import {
  deleteFile,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';


const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
  publicKey: UPLOADCARE_PUBLIC_KEY,
  secretKey :UPLOADCARE_SECRET_KEY,

});


export async function getAllListedProperties(): Promise<TProperty[] | null> {
  try {
    const listings = await prisma.listing.findMany({
      take: 20,
      include: {
        property: true,
      },
    });

    const propertiesSchemaArray = z.array(propertySchema);
    const validatedProperties = propertiesSchemaArray.parse(
      listings.map((listing) => listing.property)
    );
    return validatedProperties;
  } catch (error) {
    console.error("Error in getting properties: ", error);
    return null;
  }
}

export async function getFilteredListings(
  destination?: string,
  checkIn?: string,
  checkOut?: string
): Promise<TProperty[] | null> {
  try {
    const filteredListings = await prisma.listing.findMany({
      take: 20,
      where: {
        OR: destination
          ? [
              {
                property: {
                  name: {
                    contains: destination?.toLowerCase(),
                    // mode: "insensitive",
                  },
                },
              },
              {
                property: {
                  description: {
                    contains: destination?.toLowerCase(),
                    // mode: "insensitive",
                  },
                },
              },
              {
                property: {
                  location: {
                    city: {
                      contains: destination?.toLowerCase(),
                      // mode: "insensitive",
                    },
                  },
                },
              },
              {
                property: {
                  location: {
                    state: {
                      contains: destination?.toLowerCase(),
                      // mode: "insensitive",
                    },
                  },
                },
              },
              {
                property: {
                  location: {
                    country: {
                      contains: destination?.toLowerCase(),
                      // mode: "insensitive",
                    },
                  },
                },
              },
            ]
          : undefined,
        ...(checkIn && checkOut
          ? {
              AND: [
                {
                  availabilityStart: {
                    lte: new Date(checkIn),
                  },
                },
                {
                  availabilityEnd: {
                    gte: new Date(checkOut),
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        property: true,
      },
    });

    const propertiesSchemaArray = z.array(propertySchema);
    const validatedProperties = propertiesSchemaArray.parse(
      filteredListings.map((listing) => listing.property)
    );
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
        // favourites: true,
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
    console.log("PropData: ",propertyData)
    const imagesSchemaArray = z.array(imageSchema);
    const amenitiesSchemaArray = z.array(amenitySchema);
    console.log("Here")
    const normalizedPropertyData = {
      ...propertyData,
      country: propertyData.country?.toLowerCase(),
      state: propertyData.state?.toLowerCase(),
      city: propertyData.city?.toLowerCase(),
      images: propertyData.images || [],      // Default to empty array if undefined
      amenities: propertyData.amenities || []  // Default to empty array if undefined
    };
    
    // Validate data
    const validatedLocation = locationSchema.parse(normalizedPropertyData);
    const validatedProperty = propertySchema.parse(normalizedPropertyData);
    const validatedImages = imagesSchemaArray.parse(normalizedPropertyData.images);
    const validatedAmenities = amenitiesSchemaArray.parse(normalizedPropertyData.amenities);
    

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
    console.log("propertyImage",validatedProperty.images)

    const property = await prisma.property.create({
      
      data: {
        ...validatedProperty,
        isHotel,
        userId: user.id,
        locationId: location.id,
        images: validatedImages?.length > 0
          ? {
              create: validatedImages.map((images) => ({
                link: images.link,
              })),
            }
          : undefined,
        ...(validatedAmenities.length > 0 && {
          amenities: {
            create: validatedAmenities.map((amenity) => ({
              name: amenity.name,
            })),
          },
        }),
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


export async function updateProperty(
  kindeId: string,
  propertyId: string,
  propertyData: TAddPropertyFormvaluesSchema
): Promise<TProperty | null> {
  try {
    const user = await getUserByKindeId(kindeId);
    if (!user || !user.id) {
      throw new Error(`Couldn't find the user with kindeID ${kindeId}`);
    }

    const isAuthenticatedUser = await isAuthenticatedUserInDb(user.id);
    if (!isAuthenticatedUser) {
      throw new Error(
        "User not authenticated, please register before proceeding"
      );
    }
    console.log("PropData: ",propertyData)
    const imagesSchemaArray = z.array(imageSchema);
    const validatedLocation = locationSchema.parse(propertyData);
    const validatedProperty = propertySchema.parse(propertyData);
    const validatedImages = imagesSchemaArray.parse(propertyData.image);

    // Check if the property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!existingProperty) {
      throw new Error(`Property with ID ${propertyId} not found`);
    }

    // Check if the location already exists
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

    // Update the property in the database'5
    console.log("Validated images: ",validatedImages)
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: {
        ...validatedProperty,
        isHotel,
        locationId: location.id,
        images: {
          deleteMany: {}, // Optionally delete old images if necessary
          create: validatedImages.map((image) => ({
            link: image.link,
          })),
        },
      },
    });

    return property;
  } catch (error) {
    console.error("Error in updating the property: ", error);
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
  propertyId: string | undefined
): Promise<TImage[] | null> {
  try {
    if (!propertyId) {
      throw new Error("couldn't get the property");
    }
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


export async function DeletePropertyByIdAdmin(propertyId : string){
  const result= await prisma.property.delete({
    where:{
      id:propertyId,
    },
  })
  if (result){
    return result;
  }
  else{
    return null;
  }
}


export async function updatePropertyDelete(
  kindeId: string,
  propertyId: string,
  isDelete: boolean
): Promise<TProperty | null> {
  try {
    const user = await getUserByKindeId(kindeId);
    if (!user || !user.id) {
      throw new Error(`Couldn't find the user with kindeID ${kindeId}`);
    }

    const isAuthenticatedUser = await isAuthenticatedUserInDb(user.id);
    if (!isAuthenticatedUser) {
      throw new Error(
        "User not authenticated, please register before proceeding"
      );
    }

    // Check if the property exists
    const existingProperty = await prisma.property.findUnique({
      where: { id: propertyId },
    });
    if (!existingProperty) {
      throw new Error(`Property with ID ${propertyId} not found`);
    }

    // Update only the isDeleted field
    const property = await prisma.property.update({
      where: {
        id: propertyId,
      },
      data: {
        isDeleted: isDelete,
      },
    });

    return property;
  } catch (error) {
    console.error("Error in updating the property: ", error);
    return null;
  }
}
