import { getAllAmenitiesForProperty } from "@/actions/amenitiesAction";
import { getLocationById } from "@/actions/locationActions";
import { getAllImagesbyId, getPropertyById } from "@/actions/propertyActions";
import { getAllReviewsById } from "@/actions/reviewActions";
import { getUserById } from "@/actions/userActions";
import PropertyListingPage from "@/components/property/PropertyPage";
import React from "react";

const page = async ({ params }: { params: { propertyId: string } }) => {
  const property = await getPropertyById(params.propertyId);
  if (!property || !property.id || !property.locationId) {
    return <>Invalid property Id</>;
  }

  const [amenities, image, location, reviews, user] = await Promise.all([
    await getAllAmenitiesForProperty(property.id),
    await getAllImagesbyId(property.id),
    await getLocationById(property.locationId),
    await getAllReviewsById(property.id),
    await getUserById(property.userId),
  ]);
  if (!user || !location) {
    return <>Sorry couldn't get all details about the propery</>;
  }
  return (
    <PropertyListingPage
      property={property}
      amenities={amenities}
      image={image}
      location={location}
      reviews={reviews}
      host={user}
    />
  );
};

export default page;
