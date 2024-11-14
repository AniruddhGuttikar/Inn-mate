import { getAllAmenitiesForProperty } from "@/actions/amenitiesAction";
import { getLocationById } from "@/actions/locationActions";
import {
  getAllImagesbyId,
  getAllListedProperties,
  getFilteredListings,
} from "@/actions/propertyActions";
import { getAllReviewsById } from "@/actions/reviewActions";
import { getUserById} from "@/actions/userActions";
import PropertyCard from "@/components/property/Property";
import { TKindeUser } from "@/lib/definitions";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import PropTypesSelect from "@/components/propertyTypes/propTypes";
import Footer from "@/components/footer/footer";
import AboutUs from "@/components/contents/Aboutus";
import NoPropertyAvailable from "@/components/property/noProps";

export default async function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const { getUser} = getKindeServerSession();
  const kindeUser = (await getUser()) as TKindeUser;
  console.log(kindeUser);

  const destination = searchParams.dest;
  const checkIn = searchParams.ci;
  const checkOut = searchParams.co;
  const type = searchParams.type === 'Any' ? undefined : searchParams.type;

  console.log(destination, checkIn, checkOut);

  const properties =
    destination || checkIn || checkOut || type
      ? await getFilteredListings(destination, checkIn, checkOut, type)
      : await getAllListedProperties();
  console.log("Properties: ",properties)

  if (destination || checkIn || checkOut) {
    console.log("Called getFilteredListings with:", {
      destination,
      checkIn,
      checkOut,
      properties,
    });
  } else {
    // console.log("Called getAllListedProperties, properties:", properties);
    console.log("Called getAllListedProperties")
  }
  console.log(properties)
  // Check if properties is null or undefined before proceeding
  if (!properties) {
    return (
      <NoPropertyAvailable/>


    );
  }

  const propertyCards = await Promise.all(
    properties?.map(async (property) => {
      if (!property?.id || !property?.locationId) {
        console.log("could'nt get props")
        return null;
      }
      const reviews = await getAllReviewsById(property.id);
      const amenities = await getAllAmenitiesForProperty(property.id);
      const images = await getAllImagesbyId(property.id);
      const location = await getLocationById(property.locationId);
      const user = await getUserById(property.userId);
      console.log("Amenities",amenities)
      if (!amenities || !location || !user) {
        console.error("couldn't get all the props for property: ", property);
        return null;
      }
      console.log(property)
      return (
        <PropertyCard
          key={property.id}
          property={property}
          location={location}
          reviews={reviews}
          amenities={amenities}
          images={images}
          type="book"
          hostName={user.name}
          hostKindeId={property.userId}
          favorites=""
          status={null}
        />
      );
    })
  );

  return (
    <>
      <PropTypesSelect />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {propertyCards.length > 0 ? (
          propertyCards.filter(Boolean)
        ) : (
          <div className="text-red-600 text-center font-semibold text-lg w-full mt-8">
            No property available
          </div>
        )}
      </div>
      {/* <h1 className="text-2xl font-bold mt-12">Previous Bookings</h1>
      <p className="text-gray-600 mt-4 mb-8">Here we will show your previous bookings if available.</p> */}
      <AboutUs />
      <Footer />
    </>
  );
}
