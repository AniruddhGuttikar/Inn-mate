import { getAllAmenitiesForProperty } from "@/actions/amenitiesAction";
import { getLocationById } from "@/actions/locationActions";
import { getAllImagesbyId, getPropertyById } from "@/actions/propertyActions";
import { getAllReviewsById } from "@/actions/reviewActions";
import { getUserById, getUserByKindeId } from "@/actions/userActions";
import ListProperty from "@/components/property/ListProperty";
import React from "react";

const page = async ({
  params,
}: {
  params: { propertyId: string; userId: string };
}) => {
  const property = await getPropertyById(params.propertyId);
  if (!property || !property.id || !property.locationId) {
    return <>Invalid property Id</>;
  }

  const [amenities, images, location, reviews, user] = await Promise.all([
    await getAllAmenitiesForProperty(property.id),
    await getAllImagesbyId(property.id),
    await getLocationById(property.locationId),
    await getAllReviewsById(property.id),
    await getUserById(property.userId),
  ]);
  if (!user || !location) {
    return <>Sorry couldn't get all details about the propery</>;
  }
  if (!property || !user || !location) {
    return <>Sorry, you're probably looking for something else?</>;
  }
  return (
    <ListProperty
      property={property}
      user={user}
      location={location}
      images={images}
    />
  );
};

export default page;
