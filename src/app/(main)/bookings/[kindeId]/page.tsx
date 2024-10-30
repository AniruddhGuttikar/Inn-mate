import { getAllAmenitiesForProperty } from "@/actions/amenitiesAction";
import { getAllBookedProperties } from "@/actions/bookingActions";
import { getLocationById } from "@/actions/locationActions";
import { getAllImagesbyId } from "@/actions/propertyActions";
import { getAllReviewsById } from "@/actions/reviewActions";
import { getUserById } from "@/actions/userActions";
import PropertyCard from "@/components/property/Property";
import { TBooking, TProperty } from "@/lib/definitions";
import React from "react";

const Bookings = async ({ params }: { params: { kindeId: string } }) => {
  const kindeId = params.kindeId;
  const bookings = (await getAllBookedProperties(kindeId)) as (TBooking & {
    property: TProperty;
  })[];
  // console.log(bookings);
  const propertyCards = await Promise.all(
    bookings.map(async (booking) => {
      if (!booking.property.id || !booking.property.locationId) {
        return null;
      }
      const reviews = await getAllReviewsById(booking.property.id);
      const amenities = await getAllAmenitiesForProperty(booking.property.id);
      const images = await getAllImagesbyId(booking.property.id);
      const location = await getLocationById(booking.property.locationId);
      const user = await getUserById(booking.property.userId);

      if (!amenities || !location || !user) {
        console.error(
          "couldn't get all the props for property: ",
          booking.property
        );
        return null;
      }
      return (
        <PropertyCard
          key={booking.property.id}
          property={booking.property}
          location={location}
          reviews={reviews}
          amenities={amenities}
          images={images}
          type="view"
          hostName={user.name}
          hostKindeId={booking.property.userId}
        />
      );
    })
  );
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {propertyCards.filter(Boolean)}
      </div>
    </>
  );
};

export default Bookings;
