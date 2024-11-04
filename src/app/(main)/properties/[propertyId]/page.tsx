import { getAllAmenitiesForProperty } from "@/actions/amenitiesAction";
import { getAllBookingsForProperty } from "@/actions/bookingActions";
import { getListing } from "@/actions/listingActions";
import { getLocationById } from "@/actions/locationActions";
import { getAllImagesbyId, getPropertyById } from "@/actions/propertyActions";
import { getAllReviewsById } from "@/actions/reviewActions";
import { getUserById, getUserByKindeId } from "@/actions/userActions";
import PropertyListingPage from "@/components/property/PropertyPage";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import React from "react";

const page = async ({ params }: { params: { propertyId: string } }) => {
  const property = await getPropertyById(params.propertyId);
  const { getUser } = getKindeServerSession();
  const kindeUser = await getUser();
  const user = await getUserByKindeId(kindeUser.id);
  if (!property || !property.id || !property.locationId || !user?.id) {
    return <>Invalid property Id</>;
  }

  const [amenities, images, location, reviews, host, listing, bookings] =
    await Promise.all([
      await getAllAmenitiesForProperty(property.id),
      await getAllImagesbyId(property.id),
      await getLocationById(property.locationId),
      await getAllReviewsById(property.id),
      await getUserById(property.userId),
      await getListing(property.userId, property.id),
      await getAllBookingsForProperty(property.id),
    ]);
  if (!host || !location || !listing) {
    return <>Sorry couldn't get all details about the property</>;
  }
  return (
    <PropertyListingPage
      property={property}
      amenities={amenities}
      images={images}
      location={location}
      reviews={reviews}
      host={host}
      listing={listing}
      bookings={bookings}
      userId={user.id}
    />
  );
};

export default page;
